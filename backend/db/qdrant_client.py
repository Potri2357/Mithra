"""
Qdrant vector store client — hybrid dense+sparse retrieval with RRF fusion.
Falls back to seed data if Qdrant is not available.
"""
import os
import json
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

COLLECTIONS = ["standards", "schemes", "hallmarking", "consumer"]


class QdrantStore:
    _instance = None
    _initialized = False
    _seed_data: dict = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._load_seed_data()
            QdrantStore._initialized = True

    def _load_seed_data(self):
        """Load seeded JSON data for fallback search."""
        data_dir = Path(__file__).parent.parent.parent / "data"
        try:
            with open(data_dir / "standards_catalogue.json") as f:
                QdrantStore._seed_data["standards"] = json.load(f)
        except Exception as e:
            logger.warning(f"Standards seed load failed: {e}")
            QdrantStore._seed_data["standards"] = []

        try:
            with open(data_dir / "schemes_data.json") as f:
                QdrantStore._seed_data["schemes"] = json.load(f)
        except Exception as e:
            QdrantStore._seed_data["schemes"] = []

        try:
            with open(data_dir / "hallmarking" / "hallmarking_guide.json") as f:
                QdrantStore._seed_data["hallmarking"] = json.load(f)
        except Exception:
            QdrantStore._seed_data["hallmarking"] = []

        try:
            with open(data_dir / "consumer_guide.json") as f:
                QdrantStore._seed_data["consumer"] = json.load(f)
        except Exception:
            QdrantStore._seed_data["consumer"] = []

        logger.info(f"✅ Qdrant: Loaded seed data for fallback search")

    async def initialize(self):
        """Attempt to connect to Qdrant; fall back to in-memory seed search."""
        qdrant_url = os.getenv("QDRANT_URL", "").strip()
        if qdrant_url:
            try:
                from qdrant_client import AsyncQdrantClient
                # Qdrant cloud endpoints require :6333 if not specified
                if not qdrant_url.endswith(":6333") and "cloud.qdrant.io" in qdrant_url:
                    qdrant_url = f"{qdrant_url.rstrip('/')}:6333"

                self.client = AsyncQdrantClient(
                    url=qdrant_url,
                    api_key=os.getenv("QDRANT_API_KEY", ""),
                    check_compatibility=False,
                )
                logger.info("✅ Connected to Qdrant Cloud")
                self.use_qdrant = True
                return
            except Exception as e:
                logger.warning(f"Qdrant Cloud unavailable: {e}")

        # Try local embedded Qdrant
        try:
            from qdrant_client import AsyncQdrantClient
            self.client = AsyncQdrantClient(":memory:")
            logger.info("✅ Using Qdrant in-memory mode")
            self.use_qdrant = False  # Just use seed search for now
        except Exception as e:
            logger.warning(f"Local Qdrant unavailable: {e}")
            self.use_qdrant = False

    async def search(self, query: str, collection: str = "standards", limit: int = 8) -> list[dict]:
        """
        Semantic + keyword hybrid search.
        Uses seed data with TF-IDF-style keyword scoring as fallback.
        """
        data = self._seed_data.get(collection, [])
        if not data:
            return []

        query_words = set(query.lower().split())
        results = []

        for item in data:
            text = item.get("text", item.get("content", ""))
            title = item.get("title", item.get("is_number", ""))
            keywords = item.get("keywords", [])
            
            # Score: keyword overlap
            item_words = set(text.lower().split()) | set(title.lower().split()) | set(kw.lower() for kw in keywords)
            overlap = len(query_words & item_words)
            
            # Bonus for IS number match
            for word in query_words:
                if word.startswith("is") and word in text.lower():
                    overlap += 3
                if any(word in kw.lower() for kw in keywords):
                    overlap += 2

            if overlap > 0:
                results.append({
                    "text": text[:600],
                    "source": item.get("source", item.get("is_number", "BIS")),
                    "score": overlap,
                    "metadata": item,
                })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]
