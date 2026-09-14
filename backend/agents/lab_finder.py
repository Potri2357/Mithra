"""
FR-7: Lab Finder Agent
Finds BIS-recognized testing labs by product category and location.
Uses relational DB (Supabase) + seeded data as fallback.
"""
import logging
import json
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class LabFinderAgent:
    def __init__(self):
        self.labs_data = self._load_labs()
        logger.info(f"✅ Lab Finder: loaded {len(self.labs_data)} labs")

    def _load_labs(self) -> list[dict]:
        try:
            labs_path = Path(__file__).parent.parent.parent / "data" / "labs_directory.json"
            with open(labs_path) as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load labs file: {e}")
            return []

    async def find(self, category: str, state: Optional[str] = None, city: Optional[str] = None) -> list[dict]:
        """Filter labs by category and optional location."""
        q_cat = category.lower().strip()
        q_state = state.lower().strip() if state else None
        q_city = city.lower().strip() if city else None

        results = []
        for lab in self.labs_data:
            # Category match (check categories list and name)
            cat_match = False
            lab_cats = [c.lower() for c in lab.get("categories", [])]
            lab_name = lab.get("name", "").lower()
            if any(q_cat in c for c in lab_cats) or q_cat in lab_name:
                cat_match = True
            # Broad keyword match
            if not cat_match:
                keywords = self._get_category_keywords(q_cat)
                for kw in keywords:
                    if any(kw in c for c in lab_cats):
                        cat_match = True
                        break

            if not cat_match:
                continue

            # Location filter
            lab_state = lab.get("state", "").lower()
            lab_city = lab.get("city", "").lower()
            if q_state and q_state not in lab_state:
                continue
            if q_city and q_city not in lab_city:
                continue

            results.append(lab)

        return results[:20]  # cap results

    async def run(self, query: str, session_id=None, context=None) -> dict:
        """Handle natural language lab queries."""
        # Extract category and location from natural language
        category, state, city = self._extract_params(query)
        labs = await self.find(category, state, city)

        if not labs:
            return {
                "answer": (
                    f"No BIS-recognized labs found for **{category}** in {state or 'India'}. "
                    f"Please visit [BIS Lab Directory](https://www.bis.gov.in/laboratories) for the complete list."
                ),
                "citations": [],
                "abstained": False,
                "follow_up": "Can you provide more details about the product category or a different location?",
            }

        # Format lab results
        answer_lines = [f"## BIS-Recognized Testing Labs for {category.title()}\n"]
        if state:
            answer_lines.append(f"*State: {state.title()}*\n")
        answer_lines.append(f"Found **{len(labs)} lab(s)**:\n")

        for i, lab in enumerate(labs[:10], 1):
            answer_lines.append(
                f"### {i}. {lab['name']}\n"
                f"- 📍 **Location:** {lab.get('city', '')}, {lab.get('state', '')}\n"
                f"- 📞 **Contact:** {lab.get('phone', 'N/A')}\n"
                f"- ✉️ **Email:** {lab.get('email', 'N/A')}\n"
                f"- 🔬 **Scope:** {', '.join(lab.get('categories', []))}\n"
                f"- 🏛️ **Accreditation:** {lab.get('accreditation', 'BIS Recognized')}\n"
            )

        answer_lines.append(
            "\n*Source: BIS Recognized Laboratories Directory. "
            "For complete up-to-date listings, visit [bis.gov.in](https://www.bis.gov.in/laboratories)*"
        )

        return {
            "answer": "\n".join(answer_lines),
            "citations": [{"id": "S1", "text": "BIS Recognized Laboratories Directory", "source": "bis.gov.in/laboratories"}],
            "abstained": False,
            "labs": labs,
            "follow_up": None,
        }

    def _extract_params(self, query: str) -> tuple[str, Optional[str], Optional[str]]:
        """Simple extraction of category, state, city from natural language."""
        import re
        q = query.lower()

        # States
        states = {
            "maharashtra": "Maharashtra", "delhi": "Delhi", "karnataka": "Karnataka",
            "tamil nadu": "Tamil Nadu", "gujarat": "Gujarat", "rajasthan": "Rajasthan",
            "uttar pradesh": "Uttar Pradesh", "west bengal": "West Bengal",
            "telangana": "Telangana", "kerala": "Kerala", "punjab": "Punjab",
            "haryana": "Haryana", "madhya pradesh": "Madhya Pradesh",
        }
        detected_state = None
        for state_key, state_name in states.items():
            if state_key in q:
                detected_state = state_name
                break

        # Cities
        cities = ["mumbai", "delhi", "bangalore", "chennai", "hyderabad", "pune", "kolkata",
                  "ahmedabad", "surat", "jaipur", "lucknow", "noida", "gurugram"]
        detected_city = None
        for city in cities:
            if city in q:
                detected_city = city.title()
                break

        # Category keywords
        category_map = {
            "led": "LED Lamps", "bulb": "LED Lamps", "lamp": "LED Lamps",
            "cable": "Wires & Cables", "wire": "Wires & Cables",
            "fan": "Household Electrical", "switch": "Household Electrical", "socket": "Household Electrical",
            "cement": "Cement", "steel": "Steel & Construction",
            "helmet": "Helmets & PPE", "ppe": "Helmets & PPE",
            "toy": "Toys", "electronic": "Electronics & IT", "it product": "Electronics & IT",
            "gold": "Hallmarking", "silver": "Hallmarking", "jewel": "Hallmarking",
            "pressure cooker": "Cookers & Utensils", "cooker": "Cookers & Utensils",
            "lpg": "LPG Appliances", "gas": "LPG Appliances",
            "water": "Drinking Water", "pipe": "Pipes & Plumbing",
        }
        detected_cat = "General Testing"
        for kw, cat in category_map.items():
            if kw in q:
                detected_cat = cat
                break

        return detected_cat, detected_state, detected_city

    def _get_category_keywords(self, category: str) -> list[str]:
        """Expand category to keywords for matching."""
        keyword_groups = {
            "led": ["electrical", "lighting", "lamps"],
            "cable": ["electrical", "wires"],
            "helmet": ["ppe", "protective"],
            "cement": ["construction", "building materials"],
            "toy": ["toys", "children"],
            "electronics": ["it", "electrical", "crs"],
            "gold": ["hallmarking", "precious metals", "jewellery"],
        }
        for key, kws in keyword_groups.items():
            if key in category:
                return kws
        return []
