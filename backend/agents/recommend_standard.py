"""
FR-2: Recommend Standard Agent
Takes a product description and recommends the applicable IS number(s) with confidence + rationale.
"""
import logging
from agents.base_agent import BaseAgent
from db.qdrant_client import QdrantStore

logger = logging.getLogger(__name__)

RECOMMEND_EXTRA_PROMPT = """
When recommending standards:
1. Provide a RANKED list of 1-3 IS numbers most relevant to the product
2. For each, explain WHY it applies (plain language)
3. Mention which BIS scheme/licence applies (ISI/CRS/Hallmarking etc.)
4. Include a confidence indicator: HIGH (>85%), MEDIUM (60-85%), LOW (<60%)
5. If description is ambiguous, set follow_up to ONE clarifying question
6. NEVER suggest an IS number you're not confident about — abstain instead
"""


class RecommendStandardAgent(BaseAgent):
    def __init__(self):
        super().__init__("recommend_standard")
        self.qdrant = QdrantStore()

    async def retrieve_context(self, query: str, limit: int = 10) -> list[dict]:
        try:
            # Search both standards and QCO/scheme docs
            std_results = await self.qdrant.search(query, collection="standards", limit=7)
            scheme_results = await self.qdrant.search(query, collection="schemes", limit=3)
            return std_results + scheme_results
        except Exception as e:
            logger.warning(f"Retrieval failed: {e}")
            return self._product_keyword_search(query)

    def _product_keyword_search(self, query: str) -> list[dict]:
        from data_seed import STANDARDS_SEED, SCHEMES_SEED
        q = query.lower()
        results = []
        for s in STANDARDS_SEED:
            score = sum(1 for kw in s.get("keywords", []) if kw in q)
            if score > 0:
                results.append({
                    "text": f"IS {s['is_number']}: {s['title']}. Scheme: {s.get('scheme','ISI')}. Scope: {s['scope']}",
                    "source": f"BIS Catalogue — {s['is_number']}",
                    "score": score,
                    "metadata": s,
                })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:10]

    async def run(self, query: str, session_id=None, context=None) -> dict:
        result = await super().run(query, session_id, context)
        return result
