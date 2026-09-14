"""
Base Agent class shared by all 6 specialized BIS agents.
Handles: RAG retrieval → Gemini generation → citation validation → abstention
"""

import os
import json
import logging
import re
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types as genai_types

logger = logging.getLogger(__name__)

BIS_ABSTENTION_MSG = (
    "I don't have enough verified information to answer this confidently. "
    "Please visit the official BIS website at https://www.bis.gov.in or call the BIS helpline at 1800-11-4000 for accurate guidance. "
    "This ensures you receive the most up-to-date, authoritative information."
)

GENERATION_SYSTEM = """You are BIS Saathi, an expert AI assistant for the Bureau of Indian Standards (BIS), India.

You help MSMEs, manufacturers, startups, students, and consumers understand:
- Indian Standards (IS numbers) and what they cover
- BIS certification schemes (ISI Mark, CRS, FMCS, Hallmarking)
- Testing laboratory requirements
- Hallmarking and HUID verification
- Consumer rights under the BIS Act 2016

CRITICAL RULES:
1. EVERY factual claim about a specific IS number, certification requirement, or legal obligation MUST be followed by an inline citation marker like [S1], [S2] etc.
2. You may ONLY cite passages that were actually retrieved and provided to you in the context.
3. If you don't have sufficient grounded evidence, DO NOT fabricate — instead use the marker [ABSTAIN].
4. Never reproduce full IS standard text (copyright protected). Only metadata, scope, and guidance from BIS public documents.
5. Always add a disclaimer: "This is informational guidance. Verify with your nearest BIS office for certification decisions."
6. Be conversational but precise. MSMEs need actionable, clear answers — not vague legal hedging.

Output format: JSON with keys:
- answer: string (markdown with [S1] markers inline)
- citations: array of {id, text, source, page} matching markers in answer
- abstain: boolean
- follow_up: optional string (one clarifying question if needed)
"""


class BaseAgent:
    def __init__(self, name: str):
        self.name = name
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = "gemini-2.5-flash"
        self.generation_config = genai_types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
            max_output_tokens=2048,
            system_instruction=GENERATION_SYSTEM,
        )
        logger.info(f"✅ Agent '{name}' initialized")

    async def retrieve_context(self, query: str, limit: int = 8) -> list[dict]:
        """Override in subclass to implement RAG retrieval."""
        return []

    async def run(self, query: str, session_id: Optional[str] = None, context: Optional[list] = None) -> dict:
        """Main agent pipeline: retrieve → generate → validate citations."""
        try:
            # Step 1: Retrieve relevant passages
            passages = await self.retrieve_context(query, limit=8)

            # Step 2: Build prompt with context
            context_text = self._format_passages(passages)
            prompt = f"""Query: {query}

Retrieved context (cite these as [S1], [S2], etc.):
{context_text}

Generate a helpful, grounded answer using ONLY the above context. 
If context is insufficient, set abstain=true."""

            # Step 3: Generate with Gemini
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=self.generation_config,
            )
            result = self._parse_response(response.text)

            # Step 4: Validate citations
            validated = self._validate_citations(result, passages)
            return validated

        except Exception as e:
            logger.error(f"Agent '{self.name}' error: {e}")
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": None,
            }

    def _format_passages(self, passages: list[dict]) -> str:
        if not passages:
            return "No relevant context retrieved."
        lines = []
        for i, p in enumerate(passages, 1):
            lines.append(f"[S{i}] Source: {p.get('source', 'BIS')} | {p.get('text', '')[:500]}")
        return "\n\n".join(lines)

    def _parse_response(self, text: str) -> dict:
        try:
            data = json.loads(text)
            return {
                "answer": data.get("answer", ""),
                "citations": data.get("citations", []),
                "abstained": data.get("abstain", False),
                "follow_up": data.get("follow_up"),
            }
        except Exception:
            # Try extracting JSON from markdown code blocks
            match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(1))
                    return {
                        "answer": data.get("answer", text),
                        "citations": data.get("citations", []),
                        "abstained": data.get("abstain", False),
                        "follow_up": data.get("follow_up"),
                    }
                except Exception:
                    pass
            return {"answer": text, "citations": [], "abstained": False, "follow_up": None}

    def _validate_citations(self, result: dict, passages: list[dict]) -> dict:
        """
        Strip any [Sn] markers in the answer that don't have corresponding passages.
        If fewer than 1 valid citation remains for a factual claim, set abstained=True.
        """
        answer = result.get("answer", "")
        citations = result.get("citations", [])
        abstained = result.get("abstained", False)

        if abstained or "[ABSTAIN]" in answer:
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": result.get("follow_up"),
            }

        # Find all markers in answer
        markers_in_answer = set(re.findall(r"\[S(\d+)\]", answer))
        valid_passage_ids = set(str(i) for i in range(1, len(passages) + 1))

        # Strip invalid markers
        for marker_id in markers_in_answer - valid_passage_ids:
            answer = answer.replace(f"[S{marker_id}]", "")

        # Filter citations to only valid ones
        valid_citations = []
        for c in citations:
            cid = str(c.get("id", "")).replace("S", "")
            if cid in valid_passage_ids:
                valid_citations.append(c)

        # If we stripped too many citations and have factual claims, abstain
        remaining_markers = set(re.findall(r"\[S(\d+)\]", answer))
        has_strong_claims = any(k in answer.lower() for k in ["is required", "must", "mandatory", "shall"])
        if has_strong_claims and len(remaining_markers) == 0:
            return {
                "answer": BIS_ABSTENTION_MSG,
                "citations": [],
                "abstained": True,
                "follow_up": result.get("follow_up"),
            }

        return {
            "answer": answer.strip(),
            "citations": valid_citations,
            "abstained": False,
            "follow_up": result.get("follow_up"),
        }
