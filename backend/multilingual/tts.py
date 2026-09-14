"""
FR-9: Text-to-Speech using Sarvam AI Bulbul v3
35+ Indian language voices, handles Hinglish natively.
"""
import os
import logging
import httpx
import base64

logger = logging.getLogger(__name__)

SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"


class SarvamTTS:
    def __init__(self):
        self.sarvam_key = os.getenv("SARVAM_API_KEY", "")

    async def synthesize(self, text: str, language: str = "en") -> bytes | None:
        """
        Convert text to speech audio bytes (WAV).
        Returns None if synthesis is unavailable.
        """
        if not self.sarvam_key:
            logger.warning("SARVAM_API_KEY not set — TTS unavailable")
            return None

        # Truncate for TTS (limit to ~500 chars for speed)
        tts_text = self._clean_for_tts(text)[:500]
        lang_code = "hi-IN" if language == "hi" else "en-IN"

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    SARVAM_TTS_URL,
                    headers={
                        "api-subscription-key": self.sarvam_key,
                        "Content-Type": "application/json",
                    },
                    json={
                        "inputs": [tts_text],
                        "target_language_code": lang_code,
                        "speaker": "meera" if language == "en" else "pavithra",
                        "pitch": 0,
                        "pace": 1.0,
                        "loudness": 1.5,
                        "speech_sample_rate": 22050,
                        "enable_preprocessing": True,
                        "model": "bulbul:v1",
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    audio_b64 = data.get("audios", [""])[0]
                    if audio_b64:
                        return base64.b64decode(audio_b64)
                else:
                    logger.error(f"Sarvam TTS error: {response.status_code} {response.text[:200]}")
                    return None
        except Exception as e:
            logger.error(f"TTS synthesis failed: {e}")
            return None

    def _clean_for_tts(self, text: str) -> str:
        """Remove markdown formatting for clean TTS output."""
        import re
        text = re.sub(r"\[S\d+\]", "", text)   # Remove citation markers
        text = re.sub(r"#{1,6}\s+", "", text)    # Remove headers
        text = re.sub(r"\*{1,2}(.*?)\*{1,2}", r"\1", text)  # Remove bold/italic
        text = re.sub(r"\|.*?\|", "", text)       # Remove table rows
        text = re.sub(r"\n{2,}", " ", text)       # Collapse newlines
        text = re.sub(r"https?://\S+", "the official BIS website", text)  # Replace URLs
        return text.strip()
