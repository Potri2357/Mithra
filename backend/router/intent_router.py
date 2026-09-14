"""
Intent Router using LangGraph.
Classifies user intent into one of 6 BIS tool categories,
then dispatches to the appropriate specialized agent.
"""

import os
import json
import logging
from typing import Optional, TypedDict, Annotated
from enum import Enum

from groq import AsyncGroq

from agents.standard_lookup import StandardLookupAgent
from agents.recommend_standard import RecommendStandardAgent
from agents.scheme_guide import SchemeGuideAgent
from agents.hallmark_verify import HallmarkVerifyAgent
from agents.lab_finder import LabFinderAgent
from agents.consumer_query import ConsumerQueryAgent

logger = logging.getLogger(__name__)

INTENT_SYSTEM_PROMPT = """You are an intent classifier for the BIS (Bureau of Indian Standards) AI Assistant.
Classify the user query into EXACTLY ONE of these intents:

1. standard_lookup — Questions about what a specific Indian Standard (IS) covers, its scope, committee, year
2. recommend_standard — User describes a product and wants to know which IS number(s) apply
3. scheme_guide — Questions about BIS certification schemes (ISI, CRS, FMCS, hallmarking), which to choose, fees, eligibility
4. hallmark_verify — Verifying a HUID, checking gold/silver hallmark authenticity, hallmarking registration for jewellers
5. lab_finder — Finding BIS-recognized testing laboratories by product or location
6. consumer_query — Consumer rights, ISI mark meaning, how to file complaints, product safety

Respond with ONLY a JSON object: {"intent": "<intent_name>", "confidence": <0.0-1.0>}

Examples:
- "What does IS 16102 cover?" → {"intent": "standard_lookup", "confidence": 0.95}
- "I make LED bulbs, which standard applies?" → {"intent": "recommend_standard", "confidence": 0.93}
- "How do I get ISI certification for my fan?" → {"intent": "scheme_guide", "confidence": 0.91}
- "Is HUID AA123456 authentic?" → {"intent": "hallmark_verify", "confidence": 0.97}
- "Where can I get my cables tested in Mumbai?" → {"intent": "lab_finder", "confidence": 0.94}
- "How do I complain about a fake ISI mark?" → {"intent": "consumer_query", "confidence": 0.89}
"""


class BISRouter:
    def __init__(self):
        self.groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
        self.agents = {
            "standard_lookup": StandardLookupAgent(),
            "recommend_standard": RecommendStandardAgent(),
            "scheme_guide": SchemeGuideAgent(),
            "hallmark_verify": HallmarkVerifyAgent(),
            "lab_finder": LabFinderAgent(),
            "consumer_query": ConsumerQueryAgent(),
        }
        logger.info("✅ BIS Intent Router initialized with 6 agents")

    async def classify_intent(self, message: str) -> tuple[str, float]:
        """Use Groq (fast) to classify intent. Falls back to keyword matching."""
        try:
            response = await self.groq_client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {"role": "system", "content": INTENT_SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ],
                response_format={"type": "json_object"},
                max_tokens=100,
                temperature=0.0,
            )
            result = json.loads(response.choices[0].message.content)
            intent = result.get("intent", "standard_lookup")
            confidence = float(result.get("confidence", 0.7))
            return intent, confidence
        except Exception as e:
            logger.warning(f"Groq classification failed, using keyword fallback: {e}")
            return self._keyword_fallback(message)

    def _keyword_fallback(self, message: str) -> tuple[str, float]:
        """Simple keyword-based intent classifier as fallback."""
        msg = message.lower()
        if any(k in msg for k in ["huid", "hallmark", "gold", "silver", "jewel", "verify huid", "ahc"]):
            return "hallmark_verify", 0.8
        if any(k in msg for k in ["lab", "test", "testing", "laboratory", "accreditation"]):
            return "lab_finder", 0.8
        if any(k in msg for k in ["recommend", "which standard", "what standard", "i make", "i manufacture", "my product"]):
            return "recommend_standard", 0.8
        if any(k in msg for k in ["isi", "crs", "fmcs", "scheme", "certif", "licence", "license", "process", "steps"]):
            return "scheme_guide", 0.8
        if any(k in msg for k in ["complaint", "consumer", "isi mark", "fake", "fraud", "verify product", "rights"]):
            return "consumer_query", 0.8
        return "standard_lookup", 0.7

    async def route(
        self,
        message: str,
        session_id: Optional[str] = None,
        context: Optional[list] = None,
        force_intent: Optional[str] = None,
    ) -> dict:
        """
        Main routing function.
        Classifies intent then dispatches to the appropriate agent.
        Returns: {answer, citations, intent, abstained, follow_up, verified}
        """
        if force_intent and force_intent in self.agents:
            intent = force_intent
            confidence = 1.0
        else:
            intent, confidence = await self.classify_intent(message)

        logger.info(f"Intent: {intent} (confidence: {confidence:.2f}) | Query: {message[:80]}")

        agent = self.agents.get(intent, self.agents["standard_lookup"])
        result = await agent.run(
            query=message,
            session_id=session_id,
            context=context or [],
        )
        result["intent"] = intent
        return result
