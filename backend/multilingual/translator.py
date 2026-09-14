"""
FR-8: Sarvam AI Translator (translate-in / translate-out)
Uses Sarvam AI Translate / Mayura for Hindi ↔ English.
"""
import os
import logging
import httpx

logger = logging.getLogger(__name__)

SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"


class SarvamTranslator:
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY", "")
        if not self.api_key:
            logger.warning("SARVAM_API_KEY not set — translation will be mocked")

    async def translate(self, text: str, source: str = "hi", target: str = "en") -> str:
        """Translate text using Sarvam AI."""
        if not self.api_key:
            return text  # Pass through if no key

        if source == target:
            return text

        # Map to Sarvam language codes
        lang_map = {"en": "en-IN", "hi": "hi-IN"}
        src = lang_map.get(source, source)
        tgt = lang_map.get(target, target)

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    SARVAM_TRANSLATE_URL,
                    headers={
                        "api-subscription-key": self.api_key,
                        "Content-Type": "application/json",
                    },
                    json={
                        "input": text,
                        "source_language_code": src,
                        "target_language_code": tgt,
                        "speaker_gender": "Male",
                        "mode": "formal",
                        "model": "mayura:v1",
                        "enable_preprocessing": True,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("translated_text", text)
                else:
                    logger.warning(f"Sarvam translate error {response.status_code}, falling back to Gemini")
                    return await self._translate_gemini(text, source, target)
        except Exception as e:
            logger.warning(f"Sarvam translate unavailable ({e}), falling back to Gemini")
            return await self._translate_gemini(text, source, target)

    async def _translate_gemini(self, text: str, source: str, target: str) -> str:
        """High-quality translation fallback using Gemini 2.5 Flash."""
        try:
            from google import genai
            client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
            target_lang_name = "Hindi" if target == "hi" else "English"
            prompt = (
                f"Translate the following text into natural, professional {target_lang_name}.\n"
                f"IMPORTANT: Preserve all markdown formatting, bullet points, and citation markers like [S1], [S2] exactly.\n"
                f"Only return the translation, no extra commentary.\n\n"
                f"Text:\n{text}\n\nTranslation:"
            )
            resp = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            return resp.text.strip() if resp.text else text
        except Exception as err:
            logger.error(f"Gemini translation fallback failed: {err}")
            return text

    async def detect_language(self, text: str) -> str:
        """Detect language using langdetect as primary, Sarvam as secondary."""
        try:
            from langdetect import detect
            lang = detect(text)
            if lang == "hi":
                return "hi"
            return "en"
        except Exception:
            return "en"
