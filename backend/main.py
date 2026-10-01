from __future__ import annotations
"""
BIS AI Assistant — Main FastAPI Application
Serves all Tier-1 features via REST API
"""

import os
import logging
from dotenv import load_dotenv
load_dotenv()
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import uvicorn

from router.intent_router import BISRouter
from agents.lab_finder import LabFinderAgent
from multilingual.translator import SarvamTranslator
from multilingual.stt import SarvamSTT
from multilingual.tts import SarvamTTS
from vision.product_classifier import ProductClassifier
from vision.huid_ocr import HUIDOCRAgent
from db.qdrant_client import QdrantStore
from db.supabase_client import SupabaseClient
from circuit_breaker import (
    groq_breaker,
    gemini_breaker,
    sarvam_breaker,
    retrieval_cache,
    translation_cache,
    response_cache,
)

from pydantic import BaseModel
from typing import Any, Optional, Dict, List, Union
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Lifespan (startup / shutdown) ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting BIS AI Assistant...")
    app.state.router = BISRouter()
    app.state.lab_agent = LabFinderAgent()
    app.state.translator = SarvamTranslator()
    app.state.stt = SarvamSTT()
    app.state.tts = SarvamTTS()
    app.state.product_classifier = ProductClassifier()
    app.state.huid_ocr = HUIDOCRAgent()
    app.state.qdrant = QdrantStore()
    app.state.supabase = SupabaseClient()
    
    # Initialize vector store with seeded data
    await app.state.qdrant.initialize()
    logger.info("✅ BIS AI Assistant ready!")
    yield
    logger.info("Shutting down...")

# ─── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Mithraa — BIS AI Assistant API",
    description="AI-Powered Intelligent Assistant for Indian Standards & BIS Services",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv(
    "CORS_ORIGINS",
    "https://mithraa.me,https://www.mithraa.me,http://localhost:3000,http://127.0.0.1:3000",
)
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_api_answer(val: Any) -> str:
    """Guarantee that the returned answer is always clean Markdown prose and never raw JSON."""
    if val is None:
        return ""
    from agents.base_agent import BaseAgent
    if isinstance(val, (dict, list)):
        return BaseAgent._format_dict_or_list_to_markdown(val)
    text = str(val).strip()
    if text.startswith("{") or "```json" in text or (text.startswith("```") and "}" in text):
        dummy = BaseAgent("sanitizer")
        return dummy._unwrap_clean_markdown_answer(text)
    return text

# ─── Request/Response Models ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    language: str = "en"          # "en" or "hi"
    session_id: Optional[str] = None
    context: Optional[list] = []
    project_context: Optional[dict] = None
    mini: bool = False            # True = mini chatbot widget, keep answers very short

class ChatResponse(BaseModel):
    answer: str
    citations: list[dict]
    intent: str
    language: str
    abstained: bool = False
    follow_up: Optional[str] = None
    follow_ups: Optional[list[str]] = []

class LabSearchRequest(BaseModel):
    category: str
    state: Optional[str] = None
    city: Optional[str] = None

class HallmarkVerifyRequest(BaseModel):
    huid: Optional[str] = None
    # image provided via form data separately

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.api_route("/api/health", methods=["GET", "HEAD"])
async def health():
    return {"status": "ok", "service": "Mithraa — BIS AI Assistant", "version": "1.0.0"}


@app.get("/api/circuits")
async def get_circuits_status():
    """Diagnostic endpoint to monitor Circuit Breakers and Caches."""
    return {
        "circuits": {
            "groq": groq_breaker.get_status(),
            "gemini": gemini_breaker.get_status(),
            "sarvam": sarvam_breaker.get_status(),
        },
        "caches": {
            "retrieval_cache": {"size": retrieval_cache.size(), "max_size": retrieval_cache.max_size},
            "translation_cache": {"size": translation_cache.size(), "max_size": translation_cache.max_size},
            "response_cache": {"size": response_cache.size(), "max_size": response_cache.max_size},
        }
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Main chat endpoint — handles all 7 text-based Tier-1 intents.
    Detects intent → retrieves → generates cited answer → validates citations.
    Supports project_context for ChatGPT/Claude inspired project workspaces.
    """
    try:
        router: BISRouter = app.state.router
        translator: SarvamTranslator = app.state.translator

        # Step 1: Detect user's input language and determine target response language
        # If user explicitly selected a non-English language in UI, or if the message itself is in another language:
        detected_lang = await translator.detect_language(req.message)

        # Target language priority:
        # 1. If mini chatbot widget → always English (user is on English portal, avoid language misdetection)
        # 2. If message itself is written in a non-English language (e.g. Hindi, Tamil), target is that language.
        # 3. Otherwise if the user requested a specific non-English language in req.language, target is req.language.
        # 4. Otherwise "en".
        if req.mini:
            target_language = "en"  # Mini widget always returns English
        elif detected_lang and detected_lang != "en":
            target_language = detected_lang
        elif req.language and req.language != "en":
            target_language = req.language
        else:
            target_language = "en"

        # ⚡ Fast Response Cache: Instant <1ms answer for standalone repeated inquiries
        response_cache_key = f"{target_language}:{req.message.strip().lower()}"
        if not req.context and not req.project_context:
            cached_resp = await response_cache.get(response_cache_key)
            if cached_resp:
                logger.info(f"⚡ Fast response cache HIT for '{req.message[:40]}...'")
                return cached_resp

        # Step 2: Translate to English pivot if query is non-English
        pivot_message = req.message
        if target_language != "en":
            pivot_message = await translator.translate(req.message, source=target_language, target="en")

        # Step 3: Route + agent call
        result = await router.route(
            pivot_message,
            session_id=req.session_id,
            context=req.context,
            project_context=req.project_context,
            mini=req.mini,
        )

        # Step 4: Translate answer and follow-ups back to target language
        answer = result.get("answer", "")
        follow_up = result.get("follow_up")
        follow_ups = result.get("follow_ups", [])

        if target_language != "en":
            answer, follow_up, follow_ups = await translator.translate_response_bundle(
                answer=answer,
                follow_up=follow_up,
                follow_ups=follow_ups,
                target_language=target_language,
            )

        safe_answer = clean_api_answer(answer)
        chat_response = ChatResponse(
            answer=safe_answer,
            citations=result.get("citations", []),
            intent=result.get("intent", "unknown"),
            language=target_language,
            abstained=result.get("abstained", False),
            follow_up=follow_up,
            follow_ups=follow_ups,
        )

        # Save to fast response cache (3 minute TTL)
        if not req.context and not req.project_context:
            await response_cache.set(response_cache_key, chat_response, ttl=180.0)

        return chat_response
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/voice")
async def voice_chat(
    audio: UploadFile = File(...),
    language: str = Form("en"),
    session_id: str = Form(None),
):
    """
    Voice pipeline: STT → chat → TTS
    Returns JSON with answer text + base64 audio.
    """
    try:
        stt: SarvamSTT = app.state.stt
        tts: SarvamTTS = app.state.tts
        router: BISRouter = app.state.router
        translator: SarvamTranslator = app.state.translator

        audio_bytes = await audio.read()

        # STT
        transcript, detected_lang = await stt.transcribe(audio_bytes, language_hint=language)
        lang = detected_lang or language

        # Translate if non-English
        pivot = transcript
        if lang and lang != "en":
            pivot = await translator.translate(transcript, source=lang, target="en")

        # Chat
        result = await router.route(pivot, session_id=session_id, context=[])
        answer = result["answer"]

        if lang and lang != "en" and not result.get("abstained"):
            answer = await translator.translate(answer, source="en", target=lang)

        safe_answer = clean_api_answer(answer)

        # TTS
        audio_out = await tts.synthesize(safe_answer, language=lang)
        audio_b64 = base64.b64encode(audio_out).decode("utf-8") if audio_out else None

        return JSONResponse({
            "transcript": transcript,
            "answer": safe_answer,
            "citations": result.get("citations", []),
            "intent": result.get("intent", "unknown"),
            "language": lang,
            "audio_base64": audio_b64,
            "abstained": result.get("abstained", False),
        })
    except Exception as e:
        logger.error(f"Voice error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/photo/product")
async def photo_product(
    image: UploadFile = File(...),
    language: str = Form("en"),
    session_id: str = Form(None),
):
    """
    FR-10: Upload product photo → classify → recommend IS standard.
    """
    try:
        classifier: ProductClassifier = app.state.product_classifier
        router: BISRouter = app.state.router
        translator: SarvamTranslator = app.state.translator

        image_bytes = await image.read()
        classification = await classifier.classify(image_bytes)

        if not classification["confident"]:
            return JSONResponse({
                "error": "Image quality too low — please retake or describe the product in text.",
                "classification": None,
            })

        # Feed classification into standard recommender
        product_desc = classification["product_description"]
        result = await router.route(
            f"Recommend Indian Standards for: {product_desc}",
            session_id=session_id,
            context=[],
            force_intent="recommend_standard",
        )

        answer = result["answer"]
        if language and language != "en":
            answer = await translator.translate(answer, source="en", target=language)

        return JSONResponse({
            "classification": classification,
            "answer": answer,
            "citations": result.get("citations", []),
            "intent": "recommend_standard",
            "language": language,
        })
    except Exception as e:
        logger.error(f"Photo product error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/photo/hallmark")
async def photo_hallmark(
    image: UploadFile = File(...),
    language: str = Form("en"),
):
    """
    FR-10: Upload hallmark/HUID photo → OCR → verify.
    """
    try:
        huid_ocr: HUIDOCRAgent = app.state.huid_ocr
        router: BISRouter = app.state.router
        translator: SarvamTranslator = app.state.translator

        image_bytes = await image.read()
        ocr_result = await huid_ocr.extract_huid(image_bytes)

        if not ocr_result["huid"]:
            return JSONResponse({
                "error": "Could not read HUID from image. Please ensure the stamp is clearly visible, or enter the HUID manually.",
                "ocr_result": ocr_result,
            })

        huid = ocr_result["huid"]
        result = await router.route(
            f"Verify HUID: {huid}",
            session_id=None,
            context=[],
            force_intent="hallmark_verify",
        )

        answer = result["answer"]
        if language and language != "en":
            answer = await translator.translate(answer, source="en", target=language)

        return JSONResponse({
            "huid": huid,
            "ocr_confidence": ocr_result.get("confidence", 0),
            "answer": answer,
            "citations": result.get("citations", []),
            "verified": result.get("verified", False),
            "language": language,
        })
    except Exception as e:
        logger.error(f"Photo hallmark error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/hallmark/verify")
async def hallmark_verify(req: HallmarkVerifyRequest):
    """
    FR-6: Verify a HUID by text input.
    """
    try:
        if not req.huid:
            raise HTTPException(status_code=400, detail="HUID required")
        router: BISRouter = app.state.router
        result = await router.route(
            f"Verify HUID: {req.huid}",
            session_id=None,
            context=[],
            force_intent="hallmark_verify",
        )
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/labs")
async def labs(
    category: str,
    state: Optional[str] = None,
    city: Optional[str] = None,
):
    """
    FR-7: Find BIS-recognized testing labs by product category + location.
    """
    try:
        lab_agent: LabFinderAgent = app.state.lab_agent
        results = await lab_agent.find(category=category, state=state, city=city)
        return JSONResponse({"labs": results, "count": len(results)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/standards/search")
async def standards_search(q: str, limit: int = 10):
    """Quick catalogue search by keyword."""
    try:
        qdrant: QdrantStore = app.state.qdrant
        results = await qdrant.search(q, collection="standards", limit=limit)
        return JSONResponse({"results": results})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
