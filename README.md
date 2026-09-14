# BIS Saathi — AI-Powered Assistant for Indian Standards & BIS Services

**SIH Problem Statement 26107 | Bureau of Indian Standards (BIS) | Category: GenAI/RAG**

A fully functional MVP implementing all 10 Tier-1 features end-to-end on real BIS data with citation grounding and abstention.

---

## 🚀 Quick Start (2 commands)

```bash
# 1. Set up API keys
cp .env.example backend/.env
# Edit backend/.env with your actual API keys (see below)

# 2. Run everything
chmod +x start.sh && ./start.sh
```

Then open **http://localhost:3000** 🎉

---

## 🔑 API Keys Required

All on free tiers — no credit card needed:

| Service | Get Key | Used For |
|---|---|---|
| **Google AI Studio** | [aistudio.google.com](https://aistudio.google.com) | Gemini 2.5 Flash — LLM + vision |
| **Groq** | [console.groq.com](https://console.groq.com) | Intent router + Whisper STT fallback |
| **Sarvam AI** | [dashboard.sarvam.ai](https://dashboard.sarvam.ai) | Hindi translation, STT, TTS |
| **Supabase** | [supabase.com](https://supabase.com) | Structured data (labs, catalogue) |

Edit `backend/.env`:
```
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
SARVAM_API_KEY=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

---

## 🏗️ Architecture

```
User (text / voice / photo, EN or HI)
        │
   Language detect + Sarvam translate-to-pivot
        │
   Intent Router (Groq Llama-3.1-8B-Instant — ~100ms)
        │
   ┌────┴─────────────────────────────────────────────┐
   │  standard_lookup  recommend_standard  scheme_guide │
   │  hallmark_verify  lab_finder          consumer_query│
   └────┬─────────────────────────────────────────────┘
        │
   Hybrid dense+keyword retrieval (Qdrant / seed data)
        │
   Gemini 2.5 Flash — grounded, citation-tagged JSON output
        │
   Citation Validator — strips [Sn] markers that don't resolve → abstains
        │
   Sarvam translate-back + TTS (Bulbul v3)
        │
   Next.js UI (chat / hallmark / labs)
```

---

## ✅ Tier-1 Features (all 10 implemented)

| # | Feature | Status |
|---|---|---|
| FR-1 | Standards Q&A with citations | ✅ |
| FR-2 | Standard recommendation from product description | ✅ |
| FR-3 | BIS certification scheme guidance | ✅ |
| FR-4 | Certification process + document checklist | ✅ |
| FR-5 | Consumer query handling + complaint flow | ✅ |
| FR-6 | Hallmarking guidance + HUID verification | ✅ |
| FR-7 | Testing lab suggestions by category + location | ✅ |
| FR-8 | Multilingual (English + Hindi) via Sarvam AI | ✅ |
| FR-9 | Voice input/output (Sarvam Saarika/Bulbul) | ✅ |
| FR-10 | Photo-based product classification + hallmark OCR | ✅ |

---

## 📁 Project Structure

```
Vannu/
├── frontend/          # Next.js 14 app (TypeScript + Tailwind)
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── chat/page.tsx      # Main chat (text + voice + photo)
│   │   ├── hallmark/page.tsx  # Hallmark HUID verification
│   │   └── labs/page.tsx      # Lab finder
│   └── globals.css            # BIS Saathi design system
├── backend/           # FastAPI + Python
│   ├── main.py                # All API endpoints
│   ├── router/intent_router.py # Groq-powered intent classification
│   ├── agents/                # 6 specialized agents (one per intent)
│   ├── multilingual/          # Sarvam translate + STT + TTS
│   ├── vision/                # Gemini vision + HUID OCR
│   └── db/                    # Qdrant + Supabase clients
└── data/              # Seeded BIS data (200 standards, 20 labs, schemes)
```

---

## 🎯 Demo Scenarios (canonical test cases)

1. **LED Bulb (text):** "I manufacture LED bulbs, which standard applies and what licence do I need?"
2. **LED Bulb (voice):** Speak same query → transcription + cited answer + audio response
3. **Hindi:** "मैं LED बल्ब बनाता हूँ, कौन सा IS नंबर है?"
4. **Photo product:** Upload LED bulb photo → IS 16102 recommended with CRS scheme guidance
5. **Hallmark HUID valid:** Enter `AA123456` → ✅ Valid, 22K Gold, Sri Lakshmi Jewellers
6. **Hallmark HUID fraud:** Enter `DD901234` → ❌ Not found, complaint filing guidance
7. **Lab finder:** Category = LED Lamps, State = Maharashtra → ETL India + SGS India + BIS Western
8. **Abstention test:** "What is the latest interest rate?" → graceful out-of-scope response

---

## 🔧 Manual Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi "uvicorn[standard]" python-multipart pydantic google-generativeai groq httpx python-dotenv pillow langdetect supabase
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🏆 Winning Strategy

1. **All 10 Tier-1 features working** — no gaps in the demo checklist
2. **Citation validator + abstention** — zero hallucinated legal requirements
3. **Voice + Photo** — the two wow-factor differentiators, promoted to Tier 1
4. **Hindi + English** — full multilingual via Sarvam AI (purpose-built for Indian languages)
5. **Free-tier only** — "we built this entirely on free infrastructure" is a strong pitch line

---

## 📜 Legal Disclaimer

This assistant provides informational guidance only. It does not reproduce full IS standard text (copyright protected). All certification decisions must be verified with your nearest BIS office. BIS Helpline: **1800-11-4000**.
