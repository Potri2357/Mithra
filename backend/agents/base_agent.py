"""
Base Agent class shared by all specialized BIS agents.
Handles: RAG retrieval → Multi-LLM generation (Groq fast primary + Gemini fallback) → citation validation → abstention
"""

import os
import json
import logging
import re
from typing import Optional
from dotenv import load_dotenv
load_dotenv()

from groq import AsyncGroq
from google import genai
from google.genai import types as genai_types
from circuit_breaker import groq_breaker, gemini_breaker, retrieval_cache

logger = logging.getLogger(__name__)

BIS_ABSTENTION_MSG = (
    "I don't have enough verified information in the official BIS database to answer this specific query with complete certainty. "
    "Please visit the official BIS portal at https://www.bis.gov.in or contact the national helpline at 1800-11-4000 for authoritative guidance."
)

GENERATION_SYSTEM = """You are Mithraa, the authoritative AI compliance and standards intelligence assistant for the Bureau of Indian Standards (BIS), Government of India.

You help MSMEs, domestic and foreign manufacturers, startups, testing laboratories, and Indian consumers understand:
- Indian Standards (IS numbers) and their exact technical scopes
- BIS certification schemes: ISI Mark (Scheme I), CRS (Scheme II), FMCS (Foreign Manufacturers), Hallmarking (Scheme IV)
- Mandatory Quality Control Orders (QCOs) and compliance deadlines
- Testing laboratory accreditations and test parameters
- Gold and silver hallmarking and 6-digit alphanumeric HUID verification
- Consumer rights and grievance procedures under the BIS Act 2016

CRITICAL RULES:
1. Grounding & Citations: Whenever you cite a specific requirement, standard number, clause, or fact from the retrieved context, place an inline citation marker like [S1], [S2] immediately after it.
2. Only cite passages that were actually provided in the retrieved context.
3. If relevant context is provided, ALWAYS produce a comprehensive, well-structured, actionable response. Do NOT abstain if you can answer the query accurately.
4. If retrieved context is completely empty and the query is outside BIS scope, set abstain=true.
5. Follow-up Questions: ALWAYS suggest 2 to 3 high-value, logical follow-up questions that the user might want to ask next (e.g., fee structure, application steps, lab testing, MSME concessions).
6. Provide a subtle compliance disclaimer: "Informational guidance only. Refer to official BIS guidelines for certification decisions."
7. Clean Professional Styling: Do NOT use raw cartoon or unicode emojis (such as 📌, 💡, 🔍, 🚀). Maintain clean, authoritative government compliance formatting with markdown headings, bold terms, and lists.

Output Format (strict JSON):
{
  "answer": "markdown string with [S1] citations inline",
  "citations": [{"id": "S1", "text": "...", "source": "...", "page": null}],
  "abstain": false,
  "follow_up": "primary follow-up question",
  "follow_ups": ["Question 1?", "Question 2?", "Question 3?"]
}
"""


class BaseAgent:
    def __init__(self, name: str):
        self.name = name
        groq_key = os.getenv("GROQ_API_KEY")
        self.groq_client = AsyncGroq(api_key=groq_key, max_retries=1) if groq_key else None
        
        gemini_key = os.getenv("GEMINI_API_KEY")
        self.gemini_client = genai.Client(api_key=gemini_key) if gemini_key else None
        self.gemini_model = "gemini-3.5-flash-lite"

        logger.info(f"✅ Agent '{name}' initialized (Groq: {'yes' if self.groq_client else 'no'}, Gemini: {'yes' if self.gemini_client else 'no'})")

    async def retrieve_context(self, query: str, limit: int = 8) -> list[dict]:
        """Override in subclass to implement RAG retrieval."""
        return []

    async def _generate_with_groq(self, prompt: str) -> Optional[dict]:
        """Fast primary generation with Groq guarded by Circuit Breaker."""
        if not self.groq_client:
            return None

        # Check circuit breaker before wasting network roundtrips
        if not await groq_breaker.can_execute():
            logger.info(f"⚡ Circuit breaker 'groq' is OPEN. Fast-failing to Gemini (0ms).")
            return None

        models_to_try = ["qwen/qwen3.8-27b"]
        for model in models_to_try:
            try:
                import asyncio
                response = await asyncio.wait_for(
                    self.groq_client.chat.completions.create(
                        model=model,
                        messages=[
                            {"role": "system", "content": GENERATION_SYSTEM},
                            {"role": "user", "content": prompt},
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.1,
                        max_tokens=1500,
                    ),
                    timeout=3.8,
                )
                text = response.choices[0].message.content
                parsed = self._parse_response(text)
                if parsed.get("answer"):
                    await groq_breaker.record_success()
                    return parsed
            except Exception as e:
                logger.warning(f"Groq model {model} failed in '{self.name}': {e}")
                await groq_breaker.record_failure(e)
        return None

    async def _generate_with_gemini(self, prompt: str) -> Optional[dict]:
        """Secondary fallback generation with Gemini guarded by Circuit Breaker."""
        if not self.gemini_client:
            return None

        # Check circuit breaker before wasting network roundtrips
        if not await gemini_breaker.can_execute():
            logger.info(f"⚡ Circuit breaker 'gemini' is OPEN. Fast-failing to rule-based fallback (0ms).")
            return None

        models_to_try = [self.gemini_model, "gemini-3.5-flash", "gemini-2.0-flash"]
        for model_name in models_to_try:
            try:
                config = genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                    max_output_tokens=1500,
                    system_instruction=GENERATION_SYSTEM,
                )
                response = await self.gemini_client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )
                parsed = self._parse_response(response.text)
                if parsed.get("answer"):
                    await gemini_breaker.record_success()
                    return parsed
            except Exception as e:
                logger.warning(f"Gemini {model_name} generation failed in '{self.name}': {e}")
                await gemini_breaker.record_failure(e)
        return None

    def _generate_fallback_from_passages(self, query: str, passages: list[dict]) -> dict:
        """Rule-based fallback when all LLM services are temporarily unavailable."""
        if not passages:
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": "Would you like to search the standards directory for a specific product?",
                "follow_ups": [
                    "What are the mandatory certification schemes?",
                    "How do I apply for an ISI mark?",
                    "Where can I find recognized testing laboratories?"
                ],
            }

        lines = [f"Based on the official BIS standards database for **{query}**:\n"]
        citations = []
        for i, p in enumerate(passages[:3], 1):
            text = p.get("text", "")
            source = p.get("source", "BIS Catalogue")
            lines.append(f"- **{source}**: {text} [S{i}]")
            citations.append({
                "id": f"S{i}",
                "text": text[:200],
                "source": source,
                "page": None
            })
        lines.append("\n*Informational guidance only. Refer to official BIS guidelines for certification decisions.*")
        
        return {
            "answer": "\n".join(lines),
            "citations": citations,
            "abstained": False,
            "follow_up": "Do you need details on the testing parameters or application fees for this standard?",
            "follow_ups": [
                "What is the application fee for MSMEs?",
                "Which laboratories test this product?",
                "Is an ISI mark mandatory under a Quality Control Order (QCO)?"
            ],
        }

    async def run(
        self,
        query: str,
        session_id: Optional[str] = None,
        context: Optional[list] = None,
        project_context: Optional[dict] = None,
    ) -> dict:
        """Main agent pipeline: fast-retrieval cache → multi-LLM circuit breaker generation → validate citations."""
        try:
            # Step 1: Retrieve relevant passages (guarded by Fast Retrieval Cache)
            cache_key = f"{self.name}:{query}"
            cached_passages = await retrieval_cache.get(cache_key)
            if cached_passages is not None:
                passages = cached_passages
                logger.debug(f"⚡ Fast retrieval cache HIT for '{query}'")
            else:
                passages = await self.retrieve_context(query, limit=8)
                await retrieval_cache.set(cache_key, passages, ttl=600.0)

            # Step 2: Build prompt with retrieved context + conversation history + project context
            context_text = self._format_passages(passages)
            history_text = self._format_history(context or [])

            project_section = ""
            if project_context:
                p_name = project_context.get("name", "Active Project")
                p_scheme = project_context.get("scheme", "")
                p_instructions = project_context.get("instructions", "")
                p_standards = ", ".join(project_context.get("pinnedStandards", []))
                project_section = f"""
==================================================
ACTIVE PROJECT WORKSPACE CONTEXT:
Project: {p_name}
Target Scheme: {p_scheme}
Pinned Standards: {p_standards}
Custom Project System Instructions:
{p_instructions}
(Strictly prioritize and align your response with the above project constraints and custom instructions.)
==================================================
"""

            prompt = f"""{project_section}User Query: {query}
{history_text}
Retrieved Context (Cite as [S1], [S2] etc.):
{context_text}

Generate a clear, authoritative, cited compliance response.
Include 2-3 logical follow-up questions in "follow_ups".
Only set abstain=true if the query cannot be answered from the context or BIS domain knowledge."""

            # Step 3: Multi-LLM generation (Groq fast primary → Gemini fallback)
            result = await self._generate_with_groq(prompt)
            if not result:
                result = await self._generate_with_gemini(prompt)
            if not result:
                result = self._generate_fallback_from_passages(query, passages)

            # Step 4: Validate citations and clean output
            validated = self._validate_citations(result, passages)
            return validated

        except Exception as e:
            logger.error(f"Agent '{self.name}' unexpected error: {e}", exc_info=True)
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": None,
                "follow_ups": [],
            }

    def _format_history(self, context: list) -> str:
        """Format the last few conversation turns for prompt context."""
        if not context:
            return ""
        recent = context[-4:]
        lines = ["\nConversation History:"]
        for turn in recent:
            role = "User" if turn.get("role") == "user" else "Mithraa"
            content = str(turn.get("content", ""))[:300]
            lines.append(f"{role}: {content}")
        return "\n".join(lines) + "\n"

    def _format_passages(self, passages: list[dict]) -> str:
        if not passages:
            return "No specific passages found in catalogue — answer using official BIS regulations and general compliance standards."
        lines = []
        for i, p in enumerate(passages, 1):
            lines.append(f"[S{i}] Source: {p.get('source', 'BIS')} | {p.get('text', '')[:500]}")
        return "\n\n".join(lines)

    def _strip_thinking_tags(self, text: str) -> str:
        """Remove <think>...</think> blocks produced by Qwen and similar thinking models."""
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE)
        return text.strip()

    @staticmethod
    def _format_dict_or_list_to_markdown(val) -> str:
        """Intelligently converts raw structured dicts or lists into clean, readable Markdown."""
        if isinstance(val, dict):
            lines = []
            for k, v in val.items():
                k_title = str(k).replace("_", " ").title()
                if isinstance(v, (dict, list)):
                    sub = BaseAgent._format_dict_or_list_to_markdown(v)
                    lines.append(f"### {k_title}\n{sub}")
                else:
                    lines.append(f"- **{k_title}:** {v}")
            return "\n".join(lines)
        elif isinstance(val, list):
            lines = []
            for item in val:
                if isinstance(item, (dict, list)):
                    lines.append(BaseAgent._format_dict_or_list_to_markdown(item))
                else:
                    lines.append(f"- {item}")
            return "\n".join(lines)
        return str(val) if val is not None else ""

    def _unwrap_clean_markdown_answer(self, raw_val) -> str:
        """
        Recursively unwraps and extracts clean Markdown prose from raw JSON, code blocks,
        nested objects, or stringified envelopes. Ensures no raw JSON leaks to the user.
        """
        if raw_val is None:
            return ""

        # Case 1: Dict or List passed directly
        if isinstance(raw_val, (dict, list)):
            if isinstance(raw_val, dict):
                for k in ["answer", "response", "result", "content", "text", "message", "explanation", "summary", "recommendation", "recommendations", "output", "details"]:
                    if k in raw_val and raw_val[k]:
                        return self._unwrap_clean_markdown_answer(raw_val[k])
            return self._format_dict_or_list_to_markdown(raw_val)

        # Case 2: String
        text = str(raw_val).strip()
        text = self._strip_thinking_tags(text)

        # Remove markdown code block wrapping around JSON if present
        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        candidate_json_str = fence_match.group(1).strip() if fence_match else text

        def try_json_loads(s: str):
            try:
                return json.loads(s)
            except Exception:
                fixed = re.sub(r",\s*([\]}])", r"\1", s)
                try:
                    return json.loads(fixed)
                except Exception:
                    return None

        parsed_data = try_json_loads(candidate_json_str)
        if parsed_data is None and fence_match:
            parsed_data = try_json_loads(text)

        if parsed_data is None:
            brace_match = re.search(r"(\{[\s\S]*\})", text)
            if brace_match:
                parsed_data = try_json_loads(brace_match.group(1).strip())

        if parsed_data is not None:
            # If parsed_data is a string containing stringified JSON, unwrap again
            if isinstance(parsed_data, str) and (parsed_data.strip().startswith("{") or parsed_data.strip().startswith("[")):
                inner = try_json_loads(parsed_data.strip())
                if inner is not None:
                    parsed_data = inner

            if isinstance(parsed_data, dict):
                for k in ["answer", "response", "result", "content", "text", "message", "explanation", "summary", "recommendation", "recommendations", "output", "details"]:
                    if k in parsed_data and parsed_data[k]:
                        inner_answer = self._unwrap_clean_markdown_answer(parsed_data[k])
                        if inner_answer.strip():
                            return inner_answer.strip()
                return self._format_dict_or_list_to_markdown(parsed_data)
            elif isinstance(parsed_data, list):
                return self._format_dict_or_list_to_markdown(parsed_data)

        # Regex fallback for slightly broken JSON containing key: "value"
        key_pattern = re.search(r"\"(?:answer|response|content|message|text|summary|explanation)\"\s*:\s*\"((?:\\.|[^\"\\])*)\"", text)
        if key_pattern:
            raw_field = key_pattern.group(1)
            # Only accept if not just opening punctuation like { or [
            if len(raw_field.strip()) > 1:
                try:
                    unquoted = json.loads(f'"{raw_field}"')
                    if unquoted.strip():
                        return self._unwrap_clean_markdown_answer(unquoted.strip())
                except Exception:
                    cleaned = raw_field.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
                    if cleaned.strip():
                        return self._unwrap_clean_markdown_answer(cleaned.strip())

        # If text begins with ``` or ```json without proper json, strip the backticks
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        return text.strip()

    def _parse_response(self, text: str) -> dict:
        text = self._strip_thinking_tags(text)

        # Step 1: Direct JSON parse
        try:
            data = json.loads(text)
            return self._extract_parsed_fields(data, text)
        except Exception:
            pass

        # Step 2: Try JSON from markdown code blocks
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            try:
                data = json.loads(match.group(1).strip())
                return self._extract_parsed_fields(data, text)
            except Exception:
                fixed = re.sub(r",\s*([\]}])", r"\1", match.group(1).strip())
                try:
                    data = json.loads(fixed)
                    return self._extract_parsed_fields(data, text)
                except Exception:
                    pass

        # Step 3: Try extracting first JSON object anywhere
        match = re.search(r"(\{[\s\S]*\})", text)
        if match:
            try:
                data = json.loads(match.group(1).strip())
                return self._extract_parsed_fields(data, text)
            except Exception:
                fixed = re.sub(r",\s*([\]}])", r"\1", match.group(1).strip())
                try:
                    data = json.loads(fixed)
                    return self._extract_parsed_fields(data, text)
                except Exception:
                    pass

        # Step 4: Robust unwrapper fallback
        clean_text = self._unwrap_clean_markdown_answer(text)
        return {
            "answer": clean_text,
            "citations": [],
            "abstained": False,
            "follow_up": None,
            "follow_ups": [],
        }

    def _extract_parsed_fields(self, data: dict, raw_text: str) -> dict:
        if not isinstance(data, dict):
            return {
                "answer": self._unwrap_clean_markdown_answer(data or raw_text),
                "citations": [],
                "abstained": False,
                "follow_up": None,
                "follow_ups": [],
            }

        # Follow-ups extraction from any variation
        raw_fups = data.get("follow_ups") or data.get("followup") or data.get("questions") or data.get("suggested_questions") or []
        if isinstance(raw_fups, str):
            raw_fups = [raw_fups]
        follow_up = data.get("follow_up") or (raw_fups[0] if raw_fups else None)
        if follow_up and not raw_fups:
            raw_fups = [follow_up]

        # Citations extraction from any variation
        citations = data.get("citations") or data.get("sources") or data.get("references") or []
        if not isinstance(citations, list):
            citations = []

        # Find answer from candidate keys
        extracted_answer = None
        for k in ["answer", "response", "result", "content", "text", "message", "explanation", "summary", "recommendation", "recommendations", "output", "details"]:
            if k in data and data[k]:
                extracted_answer = data[k]
                break

        if extracted_answer is None:
            extracted_answer = self._format_dict_or_list_to_markdown(data)

        clean_answer = self._unwrap_clean_markdown_answer(extracted_answer)
        abstained = bool(data.get("abstain") or data.get("abstained", False))

        return {
            "answer": clean_answer,
            "citations": citations,
            "abstained": abstained,
            "follow_up": follow_up,
            "follow_ups": raw_fups,
        }

    def _validate_citations(self, result: dict, passages: list[dict]) -> dict:
        """
        Strip any [Sn] markers in the answer that don't have corresponding passages.
        Preserve legitimate answers and avoid false abstentions.
        """
        answer = self._unwrap_clean_markdown_answer(result.get("answer", ""))
        citations = result.get("citations", [])
        abstained = result.get("abstained", False)
        follow_up = result.get("follow_up")
        follow_ups = result.get("follow_ups", [])
        if follow_up and not follow_ups:
            follow_ups = [follow_up]

        # Only hard abstain when explicitly empty and zero passages
        if (abstained or "[ABSTAIN]" in answer) and len(passages) == 0:
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": follow_up,
                "follow_ups": follow_ups,
            }

        answer = answer.replace("[ABSTAIN]", "").strip()

        # Normalize any bare or bracketed cite:S1 or citation:S1 tokens to standard [S1]
        answer = re.sub(r"(?:\[(?:cite|citation):\s*S?|\b(?:cite|citation):\s*S)(\d+)\]?", r"[S\1]", answer, flags=re.IGNORECASE)

        # Find all markers in answer
        markers_in_answer = set(re.findall(r"\[S(\d+)\]", answer))
        valid_passage_ids = set(str(i) for i in range(1, len(passages) + 1))

        # Strip markers that reference non-existent passages
        for marker_id in markers_in_answer - valid_passage_ids:
            answer = answer.replace(f"[S{marker_id}]", "")

        # Filter citations to only valid ones
        valid_citations = []
        for c in citations:
            cid = str(c.get("id", "")).replace("S", "")
            if cid in valid_passage_ids:
                valid_citations.append(c)

        # Synthesize citations from passages if citations array was empty or missed any cited markers
        existing_cids = {str(c.get("id", "")).replace("S", "") for c in valid_citations}
        for marker_id in (markers_in_answer & valid_passage_ids):
            if marker_id not in existing_cids:
                idx = int(marker_id) - 1
                if 0 <= idx < len(passages):
                    p = passages[idx]
                    src = p.get("source", "BIS Official Guideline")
                    valid_citations.append({
                        "id": f"S{marker_id}",
                        "source": src,
                        "text": p.get("text", "")[:350],
                        "page": p.get("page")
                    })
                    existing_cids.add(marker_id)

        # If valid_citations is still empty but passages exist, provide primary retrieved passage as S1
        if not valid_citations and passages:
            valid_citations.append({
                "id": "S1",
                "source": passages[0].get("source", "BIS Standard / Catalogue"),
                "text": passages[0].get("text", "")[:350],
                "page": passages[0].get("page")
            })

        if not answer.strip():
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": follow_up,
                "follow_ups": follow_ups,
            }

        return {
            "answer": self._unwrap_clean_markdown_answer(answer).strip(),
            "citations": valid_citations,
            "abstained": False,
            "follow_up": follow_up,
            "follow_ups": follow_ups,
        }
