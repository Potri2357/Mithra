"""
FR-5: Consumer Query Agent
Handles consumer questions: ISI mark, product safety, BIS Act rights, complaint filing.
"""
import logging
from agents.base_agent import BaseAgent
from db.qdrant_client import QdrantStore

logger = logging.getLogger(__name__)

CONSUMER_CONTEXT = """
Consumer rights and ISI mark information from BIS Act 2016 and public consumer guidance:

1. The ISI Mark: The ISI (Indian Standards Institution) Mark on a product means it has been tested and certified by BIS to conform to an Indian Standard. It ensures quality, safety, reliability.

2. How to verify an ISI Mark: Check for the official ISI logo + the IS number + the 7-digit licence number (e.g., CM/L-XXXXXXX). You can verify on the BIS Care app or at https://www.bis.gov.in/verify

3. Consumer rights under BIS Act 2016: Consumers can file complaints against manufacturers selling substandard ISI-marked products. BIS can initiate prosecution.

4. How to file a complaint:
   - Call BIS helpline: 1800-11-4000 (toll-free)
   - Online portal: https://www.bis.gov.in/consumer-affairs/consumer-complaint
   - Visit nearest BIS Regional Office
   - Use BIS Care app

5. BIS regional offices: Delhi, Mumbai, Chennai, Kolkata, Chandigarh, Patna, Jaipur, Ahmedabad, Bangalore, Hyderabad, Bhopal, Guwahati, Thiruvananthapuram.

6. What products require mandatory ISI certification: Products covered under Quality Control Orders (QCO) issued by the Ministry of Consumer Affairs. Examples: electrical switches, cables, steel, cement, helmets, LPG cylinders, pressure cookers.

Source: BIS Consumer Affairs Division, BIS Act 2016 [S1]
"""


class ConsumerQueryAgent(BaseAgent):
    def __init__(self):
        super().__init__("consumer_query")
        self.qdrant = QdrantStore()

    async def retrieve_context(self, query: str, limit: int = 6) -> list[dict]:
        try:
            results = await self.qdrant.search(query, collection="consumer", limit=limit)
            return results
        except Exception:
            return [
                {"text": CONSUMER_CONTEXT, "source": "BIS Consumer Affairs", "score": 1.0},
            ]
