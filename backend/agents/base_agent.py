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

logger = logging.getLogger(__name__)

BIS_ABSTENTION_MSG = (
    "I don't have enough verified information in the official BIS database to answer this specific query with complete certainty. "
    "Please visit the official BIS portal at https://www.bis.gov.in or contact the national helpline at 1800-11-4000 for authoritative guidance."
)

GENERATION_SYSTEM = """You are Mithra, the authoritative AI compliance and standards intelligence assistant for the Bureau of Indian Standards (BIS), Government of India.

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
        self.gemini_model = "gemini-2.5-flash"

        logger.info(f"✅ Agent '{name}' initialized (Groq: {'yes' if self.groq_client else 'no'}, Gemini: {'yes' if self.gemini_client else 'no'})")

    async def retrieve_context(self, query: str, limit: int = 8) -> list[dict]:
        """Override in subclass to implement RAG retrieval."""
        return []

    async def _generate_with_groq(self, prompt: str) -> Optional[dict]:
        """Fast primary generation with Groq."""
        if not self.groq_client:
            return None
        
        models_to_try = ["qwen/qwen3.8-27b", "groq/compound-mini"]
        for model in models_to_try:
            try:
                response = await self.groq_client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": GENERATION_SYSTEM},
                        {"role": "user", "content": prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1,
                    max_tokens=2048,
                )
                text = response.choices[0].message.content
                parsed = self._parse_response(text)
                if parsed.get("answer"):
                    return parsed
            except Exception as e:
                logger.warning(f"Groq model {model} failed in '{self.name}': {e}")
        return None

    async def _generate_with_gemini(self, prompt: str) -> Optional[dict]:
        """Secondary fallback generation with Gemini."""
        if not self.gemini_client:
            return None
        
        try:
            config = genai_types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
                max_output_tokens=2048,
                system_instruction=GENERATION_SYSTEM,
            )
            response = await self.gemini_client.aio.models.generate_content(
                model=self.gemini_model,
                contents=prompt,
                config=config,
            )
            parsed = self._parse_response(response.text)
            if parsed.get("answer"):
                return parsed
        except Exception as e:
            logger.warning(f"Gemini generation failed in '{self.name}': {e}")
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

    async def run(self, query: str, session_id: Optional[str] = None, context: Optional[list] = None) -> dict:
        """Main agent pipeline: retrieve → generate → validate citations."""
        try:
            # Step 1: Retrieve relevant passages
            passages = await self.retrieve_context(query, limit=8)

            # Step 2: Build prompt with retrieved context + conversation history
            context_text = self._format_passages(passages)
            history_text = self._format_history(context or [])
            prompt = f"""User Query: {query}
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
            role = "User" if turn.get("role") == "user" else "Mithra"
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

    def _parse_response(self, text: str) -> dict:
        try:
            data = json.loads(text)
            return self._extract_parsed_fields(data, text)
        except Exception:
            # Try extracting JSON from markdown code blocks
            match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(1))
                    return self._extract_parsed_fields(data, text)
                except Exception:
                    pass
            return {
                "answer": text,
                "citations": [],
                "abstained": False,
                "follow_up": None,
                "follow_ups": [],
            }

    def _extract_parsed_fields(self, data: dict, raw_text: str) -> dict:
        follow_ups = data.get("follow_ups") or []
        if isinstance(follow_ups, str):
            follow_ups = [follow_ups]
        follow_up = data.get("follow_up") or (follow_ups[0] if follow_ups else None)
        if follow_up and not follow_ups:
            follow_ups = [follow_up]

        return {
            "answer": data.get("answer", raw_text),
            "citations": data.get("citations", []),
            "abstained": data.get("abstain", False),
            "follow_up": follow_up,
            "follow_ups": follow_ups,
        }

    def _validate_citations(self, result: dict, passages: list[dict]) -> dict:
        """
        Strip any [Sn] markers in the answer that don't have corresponding passages.
        Preserve legitimate answers and avoid false abstentions.
        """
        answer = result.get("answer", "")
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

        if not answer.strip():
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": follow_up,
                "follow_ups": follow_ups,
            }

        return {
            "answer": answer.strip(),
            "citations": valid_citations,
            "abstained": False,
            "follow_up": follow_up,
            "follow_ups": follow_ups,
        }
