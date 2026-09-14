"""
FR-10: HUID OCR from hallmark photos using Gemini Vision.
"""
import os
import logging
import json
import re
import io
from dotenv import load_dotenv
load_dotenv()

from google import genai
from google.genai import types as genai_types
from PIL import Image

logger = logging.getLogger(__name__)

HUID_EXTRACT_PROMPT = """You are a hallmark stamp OCR specialist for BIS India.
Analyze this image of a jewellery hallmark stamp.

Extract visible information and respond with JSON ONLY:
{
  "huid": "6-character alphanumeric HUID or null if not visible",
  "purity_mark": "purity code like 916, 750, 999 or null",
  "bis_logo_present": true,
  "confidence": 0.85,
  "metal": "Gold",
  "all_text_visible": ["list of all text/numbers visible in image"],
  "image_quality": "good"
}

image_quality options: "good", "fair", "poor"
If image quality is too poor to read HUID, set huid to null and image_quality to "poor"."""


class HUIDOCRAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        logger.info("✅ HUID OCR Agent initialized")

    async def extract_huid(self, image_bytes: bytes) -> dict:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=90)
            image_bytes = buf.getvalue()

            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    HUID_EXTRACT_PROMPT,
                    genai_types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                ],
                config=genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.0,
                ),
            )
            result = json.loads(response.text)

            huid = result.get("huid")
            if huid:
                huid = re.sub(r"[^A-Z0-9]", "", huid.upper())
                if not (6 <= len(huid) <= 8):
                    huid = None

            return {
                "huid": huid,
                "purity_mark": result.get("purity_mark"),
                "bis_logo_present": result.get("bis_logo_present", False),
                "confidence": float(result.get("confidence", 0)),
                "metal": result.get("metal", "Unknown"),
                "all_text": result.get("all_text_visible", []),
                "image_quality": result.get("image_quality", "unknown"),
            }
        except Exception as e:
            logger.error(f"HUID OCR failed: {e}")
            return {"huid": None, "confidence": 0, "image_quality": "error"}
