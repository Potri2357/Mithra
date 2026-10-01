"""
FR-8: Multilingual Translator (translate-in / translate-out)
Uses Gemini 2.5 Flash, Groq, and Sarvam AI for multilingual BIS queries and responses.
Supports Indian languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Gujarati, Marathi, Punjabi, Odia, Urdu, etc.)
and global languages (Spanish, French, German, etc.).
"""
import os
import re
import logging
from typing import Optional
import httpx
from circuit_breaker import groq_breaker, gemini_breaker, sarvam_breaker, translation_cache

logger = logging.getLogger(__name__)

SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"

LANGUAGE_NAMES: dict[str, str] = {
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "bn": "Bengali",
    "mr": "Marathi",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "ur": "Urdu",
    "or": "Odia",
    "as": "Assamese",
    "sa": "Sanskrit",
    "ne": "Nepali",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "zh": "Chinese",
    "ja": "Japanese",
    "ar": "Arabic",
    "en": "English",
}


def resolve_language_name(code_or_name: str) -> str:
    """Resolve ISO code or language string to full descriptive English name."""
    if not code_or_name:
        return "English"
    normalized = code_or_name.strip().lower()
    return LANGUAGE_NAMES.get(normalized, code_or_name.title())


class SarvamTranslator:
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY", "")
        if not self.api_key:
            logger.warning("SARVAM_API_KEY not set — translation will use Gemini/Groq primary pipeline")

    async def translate(self, text: str, source: str = "auto", target: str = "en") -> str:
        """Translate text with fast Groq pivot for English, Gemini for Indic/global, and Sarvam fallback."""
        if not text or not text.strip():
            return text

        if source == target and target != "auto":
            return text

        # ⚡ Fast in-memory cache check (0.01ms lookup)
        cache_key = f"{source}->{target}:{text.strip()}"
        cached = await translation_cache.get(cache_key)
        if cached:
            return cached

        # Fast path: translating incoming query to English with Groq takes ~0.2s!
        if target == "en":
            groq_tr = await self._translate_groq(text, source, "en")
            if groq_tr and groq_tr.strip() and groq_tr.strip() != text.strip():
                await translation_cache.set(cache_key, groq_tr.strip())
                return groq_tr.strip()

        # Primary engine for foreign languages: Gemini 3.5 Flash Lite
        translated = await self._translate_gemini(text, source, target)
        if translated and translated.strip():
            await translation_cache.set(cache_key, translated.strip())
            return translated.strip()

        # Secondary: Sarvam AI Translate (if supported Indic language)
        if self.api_key and target in ("hi", "ta", "te", "kn", "ml", "bn", "mr", "gu", "pa", "or") and await sarvam_breaker.can_execute():
            try:
                lang_map = {
                    "en": "en-IN", "hi": "hi-IN", "ta": "ta-IN", "te": "te-IN",
                    "kn": "kn-IN", "ml": "ml-IN", "bn": "bn-IN", "mr": "mr-IN",
                    "gu": "gu-IN", "pa": "pa-IN", "or": "od-IN",
                }
                src = lang_map.get(source, "en-IN")
                tgt = lang_map.get(target, "hi-IN")
                async with httpx.AsyncClient(timeout=4.0) as client:
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
                        translated_text = data.get("translated_text")
                        if translated_text and translated_text.strip():
                            await sarvam_breaker.record_success()
                            await translation_cache.set(cache_key, translated_text.strip())
                            return translated_text.strip()
            except Exception as e:
                logger.debug(f"Sarvam translate fallback skipped: {e}")
                await sarvam_breaker.record_failure(e)

        # Tertiary: Groq LLM (High-accuracy open model)
        fallback = await self._translate_groq(text, source, target)
        if fallback and fallback.strip() and fallback.strip() != text.strip():
            await translation_cache.set(cache_key, fallback.strip())
        return fallback

    async def translate_response_bundle(
        self,
        answer: str,
        follow_up: Optional[str],
        follow_ups: list[str],
        target_language: str
    ) -> tuple[str, Optional[str], list[str]]:
        """
        Translates answer, follow_up, and follow_ups together in a single structured LLM call.
        Eliminates multiple sequential network round-trips and avoids rate limits.
        """
        import json
        if not target_language or target_language == "en":
            return answer, follow_up, follow_ups

        if not answer or not answer.strip():
            return answer, follow_up, follow_ups

        target_lang_name = resolve_language_name(target_language)

        all_fups: list[str] = []
        if follow_up and follow_up.strip():
            all_fups.append(follow_up.strip())
        for f in (follow_ups or []):
            if f and isinstance(f, str) and f.strip() and f.strip() not in all_fups:
                all_fups.append(f.strip())

        payload = {
            "answer": answer,
            "follow_ups": all_fups[:3],
        }

        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key and await gemini_breaker.can_execute():
            prompt = (
                f"You are a professional multilingual translator for the Bureau of Indian Standards (BIS).\n"
                f"Translate the following JSON object into natural, accurate, fluent {target_lang_name}.\n"
                f"CRITICAL RULES:\n"
                f"1. Preserve ALL markdown formatting (bold, bullet points, headers) exactly.\n"
                f"2. Keep Indian Standard codes (e.g. IS 14543, IS 1293), HUID, BIS, QCO, FMCS, and citation markers like [S1], [S2] intact.\n"
                f"3. Return ONLY a valid JSON object matching the exact schema with keys 'answer' and 'follow_ups'.\n\n"
                f"JSON to translate:\n{json.dumps(payload)}"
            )
            try:
                from google import genai
                from google.genai import types as genai_types
                client = genai.Client(api_key=gemini_key)
                for model_name in ["gemini-3.5-flash-lite", "gemini-3.5-flash"]:
                    try:
                        resp = await client.aio.models.generate_content(
                            model=model_name,
                            contents=prompt,
                            config=genai_types.GenerateContentConfig(
                                response_mime_type="application/json",
                                temperature=0.1,
                            ),
                        )
                        resp_clean = re.sub(r"<think>.*?</think>", "", resp.text, flags=re.DOTALL | re.IGNORECASE).strip()
                        # Strip code fence if present
                        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", resp_clean)
                        json_str = fence_match.group(1).strip() if fence_match else resp_clean
                        parsed = json.loads(json_str)
                        tr_answer = parsed.get("answer", answer)
                        if isinstance(tr_answer, dict):
                            tr_answer = tr_answer.get("text") or tr_answer.get("answer") or answer
                        tr_fups = parsed.get("follow_ups", all_fups)
                        tr_primary = tr_fups[0] if tr_fups else follow_up
                        await gemini_breaker.record_success()
                        return str(tr_answer).strip(), tr_primary, tr_fups
                    except Exception as e:
                        logger.warning(f"Bundled Gemini translation with {model_name} failed: {e}")
                        await gemini_breaker.record_failure(e)
            except Exception as e:
                logger.warning(f"Bundled Gemini translation setup error: {e}")
                await gemini_breaker.record_failure(e)

        # Fallback to single translate calls if bundled fails
        tr_ans = await self.translate(answer, source="en", target=target_language)
        return tr_ans, follow_up, follow_ups

    async def _translate_gemini(self, text: str, source: str, target: str) -> str:
        """High-speed, high-fidelity translation using Gemini Flash models."""
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key or not await gemini_breaker.can_execute():
            return None

        target_lang_name = resolve_language_name(target)
        prompt = (
            f"You are a professional multilingual translator for the Bureau of Indian Standards (BIS).\n"
            f"Translate the following text into natural, accurate, fluent {target_lang_name}.\n"
            f"CRITICAL RULES:\n"
            f"1. Preserve ALL markdown formatting (bold, italics, headers, bullet points, links, tables) exactly.\n"
            f"2. Keep Indian Standard codes (e.g., IS 14543, IS 16444, IS 1417, IS 1293) and alphanumeric identifiers (e.g., HUID, CM/L, QCO, FMCS) intact.\n"
            f"3. Keep citation markers like [S1], [S2], [S3] intact and correctly placed in sentences.\n"
            f"4. Return ONLY the translated text without extra commentary, introductory notes, or pronunciation guides.\n\n"
            f"Text:\n{text}\n\nTranslation:"
        )

        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            models_to_try = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.0-flash"]
            for model_name in models_to_try:
                try:
                    resp = await client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                    if resp.text and resp.text.strip():
                        await gemini_breaker.record_success()
                        return resp.text.strip()
                except Exception as inner_e:
                    logger.debug(f"Gemini {model_name} error: {inner_e}")
                    await gemini_breaker.record_failure(inner_e)
                    continue
        except Exception as e:
            logger.warning(f"Gemini translation error (falling back to Groq): {e}")
            await gemini_breaker.record_failure(e)
        return None

    async def _translate_groq(self, text: str, source: str, target: str) -> str:
        """Groq fallback translation."""
        groq_key = os.getenv("GROQ_API_KEY")
        if not groq_key or not await groq_breaker.can_execute():
            return text

        target_lang_name = resolve_language_name(target)
        prompt = (
            f"You are an expert official translator for the Bureau of Indian Standards.\n"
            f"Translate the following text into natural, accurate, professional {target_lang_name}.\n"
            f"Preserve all markdown formatting, IS numbers (e.g. IS 14543, IS 16444), bullet points, technical terms, and citation markers like [S1], [S2] exactly.\n"
            f"Only return the translation, without any additional explanations or greetings.\n\n"
            f"Text:\n{text}\n\nTranslation:"
        )

        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=groq_key, max_retries=1, timeout=4.0)
            models_to_try = ["qwen/qwen3.8-27b"]
            for model_name in models_to_try:
                try:
                    completion = await client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": f"You are a professional multilingual translator specialized in official Indian Standards translating to {target_lang_name}."},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=0.2,
                        max_tokens=2048,
                    )
                    res = completion.choices[0].message.content
                    if res and res.strip():
                        # Strip thinking tags
                        cleaned_res = re.sub(r"<think>.*?</think>", "", res, flags=re.DOTALL | re.IGNORECASE).strip()
                        # If wrapped in code block
                        m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned_res)
                        if m:
                            try:
                                d = json.loads(m.group(1).strip())
                                if isinstance(d, dict) and "translation" in d:
                                    cleaned_res = str(d["translation"]).strip()
                            except Exception:
                                pass
                        await groq_breaker.record_success()
                        return cleaned_res
                except Exception as inner_e:
                    logger.debug(f"Groq {model_name} translation error: {inner_e}")
                    await groq_breaker.record_failure(inner_e)
                    continue
        except Exception as e:
            logger.debug(f"Groq translation fallback failed: {e}")
            await groq_breaker.record_failure(e)
        return text

    async def detect_language(self, text: str) -> str:
        """
        Detect language of user input.
        1. Fast Unicode script heuristic for Indian scripts.
        2. Fast regex for common Romanized Hinglish/Tanglish queries.
        3. Statistical detector (langdetect) for world and Latin languages.
        Defaults to 'en' if confidence is low or purely English.
        """
        if not text or not text.strip():
            return "en"

        clean = text.strip()

        # 1. Unicode Indian script ranges
        script_map = [
            (r"[\u0B80-\u0BFF]", "ta"),  # Tamil
            (r"[\u0C00-\u0C7F]", "te"),  # Telugu
            (r"[\u0C80-\u0CFF]", "kn"),  # Kannada
            (r"[\u0D00-\u0D7F]", "ml"),  # Malayalam
            (r"[\u0980-\u09FF]", "bn"),  # Bengali / Assamese
            (r"[\u0A80-\u0AFF]", "gu"),  # Gujarati
            (r"[\u0A00-\u0A7F]", "pa"),  # Gurmukhi / Punjabi
            (r"[\u0B00-\u0B7F]", "or"),  # Odia
            (r"[\u0600-\u06FF]", "ur"),  # Arabic / Urdu
            (r"[\u0900-\u097F]", "hi"),  # Devanagari (Hindi / Marathi)
        ]
        for pattern, code in script_map:
            if re.search(pattern, clean):
                if code == "hi":
                    # Check if Marathi specific markers or langdetect detects mr
                    try:
                        from langdetect import detect
                        ld = detect(clean)
                        if ld in ("mr", "ne", "sa"):
                            return ld
                    except Exception:
                        pass
                return code

        # 2. Check for Romanized Hinglish patterns
        hinglish_words = [
            r"\bkya\b", r"\bkaise\b", r"\bkare\b", r"\bchahiye\b", r"\bkaren\b",
            r"\bkyu\b", r"\bkyun\b", r"\bhota\b", r"\bhoti\b", r"\bhote\b",
            r"\bhai\b", r"\bhain\b", r"\bmujhe\b", r"\bmera\b", r"\bmeri\b",
            r"\baap\b", r"\bbatao\b", r"\bbataiye\b", r"\bkitna\b", r"\bkitni\b",
            r"\bkaun\b", r"\bkahan\b", r"\bkab\b"
        ]
        if any(re.search(pat, clean, re.IGNORECASE) for pat in hinglish_words):
            return "hi"

        # 3. Check for Romanized Tanglish patterns
        tanglish_words = [
            r"\benna\b", r"\bepdi\b", r"\byenga\b", r"\bvenum\b", r"\bpannanum\b",
            r"\berukku\b", r"\birukku\b", r"\bsollunga\b", r"\beppadi\b"
        ]
        if any(re.search(pat, clean, re.IGNORECASE) for pat in tanglish_words):
            return "ta"

        # 4. For Latin text: Mithraa is an Indian standards portal.
        # Only classify as non-English if there's very strong evidence.
        # If the text is standard ASCII letters, numbers, and punctuation, it is English ("en").
        # Statistical detectors (like langdetect) frequently misidentify short English sentences as German, Somali, Dutch, etc.
        # Never let short Latin queries fall back to European languages.
        is_pure_ascii = all(ord(char) < 128 for char in clean)
        if is_pure_ascii:
            return "en"

        # 5. Fallback statistical detector only for non-ASCII Latin or international scripts
        try:
            from langdetect import detect
            ld = detect(clean)
            # Only accept supported Indian languages from langdetect
            supported_indic = {"hi", "ta", "te", "kn", "ml", "bn", "gu", "pa", "or", "ur", "mr", "as"}
            if ld in supported_indic:
                return ld
        except Exception:
            pass

        return "en"
