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

from pydantic import BaseModel
from typing import Optional
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
    title="BIS AI Assistant API",
    description="AI-Powered Intelligent Assistant for Indian Standards & BIS Services",
    version="1.0.0",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request/Response Models ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    language: str = "en"          # "en" or "hi"
    session_id: Optional[str] = None
    context: Optional[list] = []

class ChatResponse(BaseModel):
    answer: str
    citations: list[dict]
    intent: str
    language: str
    abstained: bool = False
    follow_up: Optional[str] = None

class LabSearchRequest(BaseModel):
    category: str
    state: Optional[str] = None
    city: Optional[str] = None

class HallmarkVerifyRequest(BaseModel):
    huid: Optional[str] = None
    # image provided via form data separately

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "BIS AI Assistant", "version": "1.0.0"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Main chat endpoint — handles all 7 text-based Tier-1 intents.
    Detects intent → retrieves → generates cited answer → validates citations.
    """
    try:
        router: BISRouter = app.state.router
        translator: SarvamTranslator = app.state.translator

        # Step 1: Translate to English pivot if Hindi
        pivot_message = req.message
        if req.language == "hi":
            pivot_message = await translator.translate(req.message, source="hi", target="en")

        # Step 2: Route + agent call
        result = await router.route(pivot_message, session_id=req.session_id, context=req.context)

        # Step 3: Translate answer back
        answer = result["answer"]
        if req.language == "hi" and not result.get("abstained"):
            answer = await translator.translate(answer, source="en", target="hi")

        return ChatResponse(
            answer=answer,
            citations=result.get("citations", []),
            intent=result.get("intent", "unknown"),
            language=req.language,
            abstained=result.get("abstained", False),
            follow_up=result.get("follow_up"),
        )
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

        # Translate if Hindi
        pivot = transcript
        if lang == "hi":
            pivot = await translator.translate(transcript, source="hi", target="en")

        # Chat
        result = await router.route(pivot, session_id=session_id, context=[])
        answer = result["answer"]

        if lang == "hi" and not result.get("abstained"):
            answer = await translator.translate(answer, source="en", target="hi")

        # TTS
        audio_out = await tts.synthesize(answer, language=lang)
        audio_b64 = base64.b64encode(audio_out).decode("utf-8") if audio_out else None

        return JSONResponse({
            "transcript": transcript,
            "answer": answer,
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
        if language == "hi" and not result.get("abstained"):
            answer = await translator.translate(answer, source="en", target="hi")

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
        if language == "hi":
            answer = await translator.translate(answer, source="en", target="hi")

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
