"""
FR-3 + FR-4: Scheme Guide Agent
Explains BIS certification schemes (ISI, CRS, FMCS, Hallmarking).
Provides step-by-step process, document checklists, timelines.
Surfaces MSME fee concessions when applicable.
"""
import logging
from agents.base_agent import BaseAgent
from db.qdrant_client import QdrantStore

logger = logging.getLogger(__name__)


class SchemeGuideAgent(BaseAgent):
    def __init__(self):
        super().__init__("scheme_guide")
        self.qdrant = QdrantStore()

    async def retrieve_context(self, query: str, limit: int = 8) -> list[dict]:
        try:
            results = await self.qdrant.search(query, collection="schemes", limit=limit)
            return results
        except Exception as e:
            logger.warning(f"Scheme retrieval failed: {e}")
            return self._scheme_fallback(query)

    def _scheme_fallback(self, query: str) -> list[dict]:
        from data_seed import SCHEMES_SEED
        q = query.lower()
        results = []
        for s in SCHEMES_SEED:
            score = sum(1 for kw in s.get("keywords", []) if kw in q)
            if score > 0:
                results.append({
                    "text": s["content"],
                    "source": s["source"],
                    "score": score,
                    "metadata": s,
                })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:8] or SCHEMES_SEED[:3]
