"""
FR-1: Standard Lookup Agent
Answers questions about specific Indian Standards — scope, committee, year, related standards.
"""
from agents.base_agent import BaseAgent
from db.qdrant_client import QdrantStore
import logging

logger = logging.getLogger(__name__)


class StandardLookupAgent(BaseAgent):
    def __init__(self):
        super().__init__("standard_lookup")
        self.qdrant = QdrantStore()

    async def retrieve_context(self, query: str, limit: int = 8) -> list[dict]:
        try:
            results = await self.qdrant.search(query, collection="standards", limit=limit)
            return results
        except Exception as e:
            logger.warning(f"Qdrant search failed, using seeded data: {e}")
            return self._fallback_search(query)

    def _fallback_search(self, query: str, limit: int = 8) -> list[dict]:
        """Returns hardcoded key standards as fallback for demo reliability."""
        from data_seed import STANDARDS_SEED
        query_lower = query.lower()
        results = []
        for s in STANDARDS_SEED:
            score = 0
            if any(k in query_lower for k in s.get("keywords", [])):
                score += 2
            if s.get("is_number", "").lower() in query_lower:
                score += 3
            if score > 0:
                results.append({
                    "text": f"{s['is_number']}: {s['title']}. Scope: {s['scope']}",
                    "source": f"BIS Catalogue — {s['is_number']}",
                    "score": score,
                    "metadata": s,
                })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]
