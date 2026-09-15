"""
FR-6: Hallmark Verify Agent
Verifies HUID authenticity, explains hallmarking system, guides fraud complaint filing.
"""
import logging
import json
import os
from agents.base_agent import BaseAgent, BIS_ABSTENTION_MSG

logger = logging.getLogger(__name__)

# Mock HUID registry for demo (real BIS API not publicly documented)
# Format: huid -> {valid, metal, purity, ahc_name, ahc_id, city}
MOCK_HUID_REGISTRY = {
    "AA123456": {"valid": True, "metal": "Gold", "purity": "22K (916)", "ahc": "Sri Lakshmi Jewellers", "city": "Chennai"},
    "BB789012": {"valid": True, "metal": "Gold", "purity": "18K (750)", "ahc": "Tanishq - Bandra", "city": "Mumbai"},
    "CC345678": {"valid": True, "metal": "Silver", "purity": "S999", "ahc": "Khazana Jewellery", "city": "Hyderabad"},
    "DD901234": {"valid": False, "metal": None, "purity": None, "ahc": None, "city": None},
    "EE567890": {"valid": True, "metal": "Gold", "purity": "14K (585)", "ahc": "PC Jeweller", "city": "Delhi"},
}

HALLMARK_CONTEXT = """
The BIS Hallmarking system in India:
- HUID (Hallmark Unique ID): 6-character alphanumeric code assigned to each piece of jewellery
- The 3-mark hallmarking system includes: BIS logo, purity mark (e.g., 916 for 22K gold), and HUID
- Purity marks: 999 (24K), 958 (23K), 916 (22K), 875 (21K), 750 (18K), 585 (14K), 375 (9K)
- AHC: Assaying and Hallmarking Centre — BIS-recognized labs that hallmark jewellery
- Mandatory hallmarking: Compulsory for gold jewellery above 2 grams since June 2021
- Consumer protection: Under BIS Act 2016, selling unhallmarked/mismarked gold jewellery is an offence
- Complaint filing: Visit nearest BIS regional office or call 1800-11-4000
- Source: BIS Hallmarking Division Guidelines (public) [S1]
"""


class HallmarkVerifyAgent(BaseAgent):
    def __init__(self):
        super().__init__("hallmark_verify")

    async def retrieve_context(self, query: str, limit: int = 5) -> list[dict]:
        return [{"text": HALLMARK_CONTEXT, "source": "BIS Hallmarking Guidelines", "score": 1.0}]

    async def run(self, query: str, session_id=None, context=None, project_context=None, **kwargs) -> dict:
        # Extract HUID from query (standard format: 2 letters + 6 digits, or 6-char alphanumeric with digits)
        import re
        huid = None
        huid_match = re.search(r'\b([A-Z]{2}\d{6})\b', query.upper())
        if huid_match:
            huid = huid_match.group(1)
        else:
            candidates = re.findall(r'\b([A-Z0-9]{6,8})\b', query.upper())
            stop_words = {"VERIFY", "STATUS", "NUMBER", "PLEASE", "ONLINE", "REPORT", "DETAIL"}
            for c in candidates:
                if c not in stop_words and any(ch.isdigit() for ch in c):
                    huid = c
                    break

        passages = await self.retrieve_context(query)
        context_text = self._format_passages(passages)

        if huid:
            registry_entry = MOCK_HUID_REGISTRY.get(huid)
            if registry_entry:
                if registry_entry["valid"]:
                    answer = self._format_valid_response(huid, registry_entry)
                    return {
                        "answer": answer,
                        "citations": [{"id": "S1", "text": HALLMARK_CONTEXT[:200], "source": "BIS Hallmarking Guidelines"}],
                        "abstained": False,
                        "verified": True,
                        "huid": huid,
                        "follow_up": None,
                    }
                else:
                    answer = self._format_invalid_response(huid)
                    return {
                        "answer": answer,
                        "citations": [{"id": "S1", "text": HALLMARK_CONTEXT[:200], "source": "BIS Hallmarking Guidelines"}],
                        "abstained": False,
                        "verified": False,
                        "huid": huid,
                        "follow_up": "Would you like help filing a fraud complaint with BIS?",
                    }
            else:
                # HUID not in mock registry — note it's a demo registry
                answer = (
                    f"## HUID Verification: {huid}\n\n"
                    f"⚠️ **HUID '{huid}' was not found in our demo registry.** [S1]\n\n"
                    f"In a live deployment, this would be verified against the BIS HUID registry in real-time. "
                    f"For actual verification:\n\n"
                    f"1. **Use BIS Care App** — Available on iOS and Android, lets you scan or enter the HUID\n"
                    f"2. **Visit BIS Portal** — https://www.bis.gov.in/hallmarking\n"
                    f"3. **Call BIS Helpline** — 1800-11-4000 (toll-free)\n\n"
                    f"If you suspect fraud, you can file a complaint at your nearest BIS regional office.\n\n"
                    f"*This is informational guidance. Verify with your nearest BIS office.*"
                )
                return {
                    "answer": answer,
                    "citations": [{"id": "S1", "text": HALLMARK_CONTEXT[:200], "source": "BIS Hallmarking Guidelines"}],
                    "abstained": False,
                    "verified": None,
                    "huid": huid,
                    "follow_up": "Would you like help filing a hallmark fraud complaint?",
                }

        # General hallmarking question — use Gemini with context
        result = await super().run(query, session_id, context)
        result["verified"] = None
        return result

    def _format_valid_response(self, huid: str, entry: dict) -> str:
        return (
            f"## ✅ HUID Verified — Authentic Hallmark\n\n"
            f"**HUID:** `{huid}` [S1]\n\n"
            f"| Field | Details |\n"
            f"|---|---|\n"
            f"| **Status** | ✅ Valid & Registered |\n"
            f"| **Metal** | {entry['metal']} |\n"
            f"| **Purity** | {entry['purity']} |\n"
            f"| **Assaying Centre (AHC)** | {entry['ahc']} |\n"
            f"| **City** | {entry['city']} |\n\n"
            f"This hallmark is genuine and registered with BIS. The jewellery's purity has been certified "
            f"by a BIS-recognized Assaying and Hallmarking Centre. [S1]\n\n"
            f"*This is informational guidance. Verify with your nearest BIS office for legal matters.*"
        )

    def _format_invalid_response(self, huid: str) -> str:
        return (
            f"## ❌ HUID Not Found — Possible Fraud\n\n"
            f"**HUID:** `{huid}` — **NOT found** in the BIS registry. [S1]\n\n"
            f"⚠️ **This may indicate a counterfeit or incorrectly hallmarked piece.**\n\n"
            f"### Immediate Steps:\n"
            f"1. **Do not purchase** this jewellery until verified\n"
            f"2. **File a complaint** with BIS:\n"
            f"   - Call: **1800-11-4000** (toll-free)\n"
            f"   - Visit: Nearest BIS Regional/Branch Office\n"
            f"   - Online: https://www.bis.gov.in/consumer-affairs\n"
            f"3. **Report to Consumer Forum** if already purchased\n\n"
            f"### What to tell BIS:\n"
            f"- The HUID: `{huid}`\n"
            f"- Shop name and address\n"
            f"- Date of purchase/visit\n"
            f"- Invoice/receipt (if available)\n\n"
            f"Under the BIS Act 2016, selling mismarked jewellery is a punishable offence. [S1]\n\n"
            f"*This is informational guidance. Verify with your nearest BIS office.*"
        )
