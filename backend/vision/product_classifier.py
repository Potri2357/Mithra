"""
FR-10: Product Photo Classifier using Gemini 2.5 Flash multimodal.
"""
import os
import logging
import json
from dotenv import load_dotenv
load_dotenv()

from google import genai
from google.genai import types as genai_types
from PIL import Image
import io

logger = logging.getLogger(__name__)

PRODUCT_CATEGORIES = [
    "LED Lamps & Luminaires", "Electrical Switches & Sockets", "Wires & Cables",
    "Fans (Ceiling/Table/Exhaust)", "Pressure Cookers & Utensils", "Helmets (Two-Wheeler)",
    "Toys", "Electronic & IT Products", "Cement", "Steel & Iron Products",
    "LPG Cylinders & Appliances", "Water Meters & Pipes", "Fire Safety Equipment",
    "Solar Products", "EV Charging Equipment", "Footwear", "Textiles & Garments",
    "Batteries", "Pumps & Motors", "Furniture", "Other",
]

CLASSIFY_PROMPT = f"""You are a BIS (Bureau of Indian Standards) product classification expert.
Analyze this product image and:
1. Identify what the product is
2. Classify it into one of these BIS product categories: {', '.join(PRODUCT_CATEGORIES)}
3. Assess your confidence (0.0 to 1.0)
4. Describe the product for a standards recommender

Respond with JSON only:
{{
  "product_name": "specific product name",
  "category": "one of the categories above",
  "confidence": 0.85,
  "product_description": "detailed description for IS number recommendation",
  "visible_features": ["feature1", "feature2"],
  "not_product": false
}}

If this is NOT a physical product (blank image, text, landscape), set not_product=true."""


class ProductClassifier:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        logger.info("✅ Product Classifier initialized (Gemini 2.5 Flash)")

    async def classify(self, image_bytes: bytes) -> dict:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")
            if max(img.size) > 1024:
                img.thumbnail((1024, 1024), Image.LANCZOS)
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=85)
            image_bytes = buf.getvalue()

            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    CLASSIFY_PROMPT,
                    genai_types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                ],
                config=genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
            result = json.loads(response.text)

            if result.get("not_product"):
                return {"confident": False, "reason": "Image does not appear to show a product", "product_description": None}

            confidence = float(result.get("confidence", 0))
            return {
                "confident": confidence >= 0.6,
                "product_name": result.get("product_name", "Unknown"),
                "category": result.get("category", "Other"),
                "confidence": confidence,
                "product_description": result.get("product_description", ""),
                "visible_features": result.get("visible_features", []),
            }
        except Exception as e:
            logger.error(f"Product classification failed: {e}")
            return {"confident": False, "reason": str(e), "product_description": None}
