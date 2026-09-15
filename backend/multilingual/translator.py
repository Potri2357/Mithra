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
        lang_map = {"en": "en-IN", "hi": "hi-IN", "ta": "ta-IN"}
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
                    logger.warning(f"Sarvam translate error {response.status_code}, falling back to Groq/Gemini")
                    return await self._translate_llm(text, source, target)
        except Exception as e:
            logger.warning(f"Sarvam translate unavailable ({e}), falling back to Groq/Gemini")
            return await self._translate_llm(text, source, target)

    async def _translate_llm(self, text: str, source: str, target: str) -> str:
        """High-quality translation fallback using Groq or Gemini."""
        target_lang_name = "Tamil" if target == "ta" else ("Hindi" if target == "hi" else "English")
        prompt = (
            f"Translate the following text into natural, professional {target_lang_name}.\n"
            f"IMPORTANT: Preserve all markdown formatting, IS numbers (e.g. IS 14543), bullet points, technical terms, and citation markers like [S1], [S2] exactly.\n"
            f"Only return the translation, no extra commentary or intro.\n\n"
            f"Text:\n{text}\n\nTranslation:"
        )

        # 1. Try Groq (Fast & highly available)
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                from groq import AsyncGroq
                client = AsyncGroq(api_key=groq_key, max_retries=1)
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
                logger.warning(f"Groq translation fallback failed: {e}, trying Gemini")

        # 2. Try Gemini
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=gemini_key)
                resp = await client.aio.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                if resp.text and resp.text.strip():
                    return resp.text.strip()
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
