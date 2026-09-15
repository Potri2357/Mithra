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
        """Translate text using Gemini 2.5 Flash with Sarvam/Groq fallbacks."""
        if not text or not text.strip():
            return text

        if source == target:
            return text

        # Primary engine: Gemini 2.5 Flash (fastest, preserves markdown/citations/IS clauses)
        translated = await self._translate_gemini(text, source, target)
        if translated and translated.strip():
            return translated.strip()

        # Secondary: Sarvam AI Translate
        if self.api_key:
            try:
                lang_map = {"en": "en-IN", "hi": "hi-IN", "ta": "ta-IN"}
                src = lang_map.get(source, source)
                tgt = lang_map.get(target, target)
                async with httpx.AsyncClient(timeout=3.0) as client:
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
                            "model": "mayura:v1",
                        },
                    )
                    if response.status_code == 200:
                        data = response.json()
                        return data.get("translated_text", text)
            except Exception as e:
                logger.debug(f"Sarvam translate fallback skipped: {e}")

        # Tertiary: Groq LLM
        return await self._translate_groq(text, source, target)

    async def _translate_gemini(self, text: str, source: str, target: str) -> str:
        """High-speed, high-fidelity translation using Gemini 2.5 Flash."""
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            return text

        target_lang_name = "Tamil" if target == "ta" else ("Hindi" if target == "hi" else "English")
        prompt = (
            f"You are a professional multilingual translator for the Bureau of Indian Standards.\n"
            f"Translate the following text into natural, accurate, fluent {target_lang_name}.\n"
            f"RULES:\n"
            f"1. Preserve ALL markdown formatting (bold, headers, bullet points, links) exactly.\n"
            f"2. Keep Indian Standard codes (e.g., IS 14543, IS 16444, IS 1417) and alphanumeric identifiers (e.g., HUID, CM/L) intact.\n"
            f"3. Keep citation markers like [S1], [S2], [S3] intact and correctly placed.\n"
            f"4. Return ONLY the translated text without extra commentary, introductory notes, or English pronunciation notes.\n\n"
            f"Text:\n{text}\n\nTranslation:"
        )

        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            resp = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if resp.text and resp.text.strip():
                return resp.text.strip()
        except Exception as e:
            logger.warning(f"Gemini translation error (falling back to Groq): {e}")
        return None

    async def _translate_groq(self, text: str, source: str, target: str) -> str:
        """Groq fallback translation."""
        groq_key = os.getenv("GROQ_API_KEY")
        if not groq_key:
            return text

        target_lang_name = "Tamil" if target == "ta" else ("Hindi" if target == "hi" else "English")
        prompt = (
            f"Translate the following text into natural, professional {target_lang_name}.\n"
            f"Preserve all markdown formatting, IS numbers (e.g. IS 14543), bullet points, technical terms, and citation markers like [S1], [S2] exactly.\n"
            f"Only return the translation, no extra commentary.\n\n"
            f"Text:\n{text}\n\nTranslation:"
        )

        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=groq_key, max_retries=1, timeout=3.0)
            completion = await client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {"role": "system", "content": "You are a professional multilingual translator for official government standards."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=2048,
            )
            res = completion.choices[0].message.content
            if res and res.strip():
                return res.strip()
        except Exception as e:
            logger.debug(f"Groq translation fallback failed: {e}")
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
