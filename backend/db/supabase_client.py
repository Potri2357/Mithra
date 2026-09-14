"""
Supabase client for structured data (labs, standards catalogue).
"""
import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)


class SupabaseClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        url = os.getenv("SUPABASE_URL", "")
        key = os.getenv("SUPABASE_ANON_KEY", "")
        if url and key:
            try:
                self.client: Client = create_client(url, key)
                logger.info("✅ Supabase client initialized")
            except Exception as e:
                logger.warning(f"Supabase init failed: {e}")
                self.client = None
        else:
            logger.warning("Supabase credentials not set — using local data only")
            self.client = None

    async def get_labs(self, category: str = None, state: str = None) -> list[dict]:
        if not self.client:
            return []
        try:
            query = self.client.table("labs").select("*")
            if state:
                query = query.ilike("state", f"%{state}%")
            result = query.execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Supabase labs query failed: {e}")
            return []
