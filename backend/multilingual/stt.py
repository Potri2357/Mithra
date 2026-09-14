"""
FR-9: Speech-to-Text using Sarvam AI Saarika (Indic ASR)
Falls back to Groq Whisper for English.
"""
import os
import logging
import httpx

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"


class SarvamSTT:
    def __init__(self):
        self.sarvam_key = os.getenv("SARVAM_API_KEY", "")
        self.groq_key = os.getenv("GROQ_API_KEY", "")

    async def transcribe(self, audio_bytes: bytes, language_hint: str = "en") -> tuple[str, str]:
        """
        Transcribe audio bytes to text.
        Returns: (transcript, detected_language)
        """
        if self.sarvam_key:
            try:
                return await self._transcribe_sarvam(audio_bytes, language_hint)
            except Exception as e:
                logger.warning(f"Sarvam STT failed, trying Groq: {e}")

        if self.groq_key:
            try:
                return await self._transcribe_groq(audio_bytes)
            except Exception as e:
                logger.error(f"Groq Whisper failed: {e}")

        return "", language_hint

    async def _transcribe_sarvam(self, audio_bytes: bytes, language_hint: str) -> tuple[str, str]:
        """Sarvam AI Saarika ASR — purpose-built for Indian speech."""
        lang_code = "hi-IN" if language_hint == "hi" else "en-IN"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                SARVAM_STT_URL,
                headers={"api-subscription-key": self.sarvam_key},
                files={"file": ("audio.wav", audio_bytes, "audio/wav")},
                data={
                    "language_code": lang_code,
                    "model": "saarika:v2",
                    "with_timestamps": "false",
                },
            )
            if response.status_code == 200:
                data = response.json()
                transcript = data.get("transcript", "")
                detected = "hi" if "hi" in data.get("language_code", "") else "en"
                return transcript, detected
            else:
                raise Exception(f"Sarvam STT error: {response.status_code}")

    async def _transcribe_groq(self, audio_bytes: bytes) -> tuple[str, str]:
        """Groq Whisper-large-v3 as fallback (English-primary)."""
        from groq import AsyncGroq
        client = AsyncGroq(api_key=self.groq_key)
        transcription = await client.audio.transcriptions.create(
            file=("audio.wav", audio_bytes),
            model="whisper-large-v3",
            response_format="json",
        )
        return transcription.text, "en"
