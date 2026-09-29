# Mithra — AI-Powered Assistant for Indian Standards & BIS Services

> **SIH Problem Statement 26107 | Bureau of Indian Standards (BIS) | Category: GenAI / RAG**

A conversational, source-cited AI assistant that collapses BIS's fragmented multi-portal experience into a single natural-language interaction — in English and Hindi, by text, voice, or photo.

---

## ✨ What It Does

Mithra implements all **10 Tier-1 features** end-to-end on real BIS data:

| # | Feature | Description |
|---|---|---|
| FR-1 | **Standards Q&A** | Conversational answers grounded in the BIS catalogue with inline citations |
| FR-2 | **Standard Recommendation** | Product description → ranked IS numbers with confidence + rationale |
| FR-3 | **Certification Scheme Guidance** | ISI, CRS, FMCS — which applies, when, and why |
| FR-4 | **Certification Process Explainer** | Step-by-step process + document checklist per scheme |
| FR-5 | **Consumer Query Handling** | ISI mark verification, complaint filing, consumer rights |
| FR-6 | **Hallmarking Guidance** | HUID verification, purity marks, AHC jeweller registration |
| FR-7 | **Lab Finder** | BIS-recognised testing labs by product category + state |
| FR-8 | **Multilingual** | English + Hindi; translate-in/out via Sarvam AI |
| FR-9 | **Voice I/O** | Speak your query, hear the answer — Sarvam Saarika STT + Bulbul v3 TTS |
| FR-10 | **Photo Verification** | Photograph a product → standard recommendation, or a hallmark stamp → HUID lookup |

Every factual claim carries an inline citation resolved to a real retrieved passage. Unresolved markers are stripped and the assistant **abstains** rather than guessing.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- API keys (all on free tiers — see below)

### 2-Command Setup

```bash
# 1. Copy and fill in your API keys
cp .env.example .env

# 2. Start everything
chmod +x start.sh && ./start.sh
```

Open **http://localhost:3000** 🎉

---

## 🔑 API Keys

All services have free tiers — no credit card required:

| Service | Signup | Purpose |
|---|---|---|
| **Google AI Studio** | [aistudio.google.com](https://aistudio.google.com) | Gemini 2.5 Flash — primary LLM + vision/OCR |
| **Groq** | [console.groq.com](https://console.groq.com) | Intent router (Llama-3.x-Instant, ~100ms) + Whisper STT fallback |
| **Sarvam AI** | [dashboard.sarvam.ai](https://dashboard.sarvam.ai) | Hindi translation, Indic STT (Saarika), TTS (Bulbul v3), Vision OCR |
| **Supabase** | [supabase.com](https://supabase.com) | Postgres — labs, catalogue, structured data |
| **Qdrant** *(optional)* | [qdrant.tech](https://qdrant.tech) | Vector store — leave blank to run in local embedded mode |

Edit `.env` (copied from `.env.example`):

```env
# Required
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
SARVAM_API_KEY=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Optional — leave blank to run Qdrant locally (embedded mode)
QDRANT_URL=
QDRANT_API_KEY=

# App settings
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏗️ Architecture

```
User (text / voice / photo — English or Hindi)
        │
   Language detect → Sarvam translate-to-pivot (if Hindi)
        │
   Intent Router  (Groq Llama-3.x-Instant — ~100ms)
        │
   ┌────┴──────────────────────────────────────────────────┐
   │  standard_lookup   recommend_standard   scheme_guide  │
   │  hallmark_verify   lab_finder           consumer_query│
   └────┬──────────────────────────────────────────────────┘
        │
   Hybrid dense + keyword retrieval  (Qdrant / seeded BIS data)
        │
   Gemini 2.5 Flash — grounded, citation-tagged JSON output
        │
   Citation Validator — strips unresolved [Sn] markers → abstains on weak evidence
        │
   Sarvam translate-back + Bulbul v3 TTS (if Hindi / voice requested)
        │
   Next.js UI  (chat · hallmark · labs · schemes · standards · consumer)
```

**Key design principle:** intent-routed multi-agent RAG, not a single flat chain. Each intent maps to a specialised retrieval strategy — SQL for labs/catalogue, semantic vector search for scheme/hallmarking guidance, and recommendation logic for product→standard mapping.

---

## 📁 Project Structure

```
Mithra/
├── .env.example               # Template — copy to .env and fill in keys
├── docker-compose.yml         # Run backend + frontend together
├── render.yaml                # One-click Render.com deployment config
├── start.sh                   # Local dev launcher
│
├── frontend/                  # Next.js 16 + React 19 (TypeScript + Tailwind v4)
│   ├── app/
│   │   ├── page.tsx           # Landing / home
│   │   ├── chat/              # Main chat (text + voice + photo)
│   │   ├── hallmark/          # HUID verification flow
│   │   ├── labs/              # Lab finder (category + location filter)
│   │   ├── schemes/           # Certification scheme guidance
│   │   ├── standards/         # Standards explorer
│   │   └── consumer/          # Consumer queries + complaint flow
│   ├── components/            # Shared UI components
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Supabase client, API helpers
│   └── utils/                 # Shared utilities
│
├── backend/                   # FastAPI + Python 3.11
│   ├── main.py                # All API endpoints + app bootstrap
│   ├── router/
│   │   └── intent_router.py   # Groq-powered intent classification
│   ├── agents/
│   │   ├── base_agent.py      # Shared agent base + citation validator
│   │   ├── standard_lookup.py
│   │   ├── recommend_standard.py
│   │   ├── scheme_guide.py
│   │   ├── hallmark_verify.py
│   │   ├── lab_finder.py
│   │   └── consumer_query.py
│   ├── multilingual/          # Sarvam translate + STT + TTS
│   ├── vision/                # Gemini vision + Sarvam HUID/hallmark OCR
│   ├── rag/                   # Retrieval, embeddings, reranking
│   ├── db/                    # Qdrant + Supabase clients
│   ├── ingestion/             # BIS catalogue scraper + PDF parser
│   ├── circuit_breaker.py     # API resilience / fallback logic
│   └── requirements.txt
│
└── data/                      # Seeded BIS data (standards, labs, schemes)
```

---

## 🔧 Manual Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on **http://localhost:8000** · Frontend on **http://localhost:3000**.

---

## 🐳 Docker

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

| Service | Port |
|---|---|
| Frontend (Next.js) | 3000 |
| Backend (FastAPI) | 8000 |

The `docker-compose.yml` reads all variables from your root `.env` automatically.

---

## ☁️ Deployment

### Render (recommended — one-click)

A [`render.yaml`](render.yaml) is included. Connect this repo to [Render.com](https://render.com) and add the following environment variables in the dashboard:

| Variable | Service |
|---|---|
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `SARVAM_API_KEY` | Backend |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Backend + Frontend |
| `CORS_ORIGINS` | Backend (set to your frontend URL) |
| `NEXT_PUBLIC_API_URL` | Frontend (set to your backend URL) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Frontend |

### Vercel + Fly.io (split)

- **Frontend:** Deploy the `frontend/` directory to Vercel (auto-detects Next.js).
- **Backend:** Deploy from `backend/Dockerfile` to Fly.io or Render's Docker runtime.

---

## 🎯 Demo Scenarios

| Scenario | Input | Expected Output |
|---|---|---|
| **LED bulb (text)** | "I manufacture LED bulbs, which standard applies and what licence do I need?" | IS 16102, CRS scheme, step-by-step + nearby labs |
| **LED bulb (voice)** | Speak the same query | Transcription → cited answer → audio response |
| **Hindi text** | "मैं LED बल्ब बनाता हूँ, कौन सा IS नंबर है?" | IS 16102 with Hindi explanation |
| **Product photo** | Upload LED bulb image | IS 16102 recommended with CRS scheme guidance |
| **Valid HUID** | Enter `AA123456` | ✅ Valid — 22K Gold, Sri Lakshmi Jewellers |
| **Fraudulent HUID** | Enter `DD901234` | ❌ Not found — guided complaint filing |
| **Lab finder** | Category: LED Lamps, State: Maharashtra | ETL India + SGS India + BIS Western |
| **Out-of-scope** | "What is the latest interest rate?" | Graceful abstention — outside BIS scope |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **Primary LLM** | Gemini 2.5 Flash (generation + vision/OCR) |
| **Intent Router** | Groq — Llama-3.x-Instant (~100ms classification) |
| **Vector Store** | Qdrant (embedded local / Qdrant Cloud for prod) |
| **Structured DB** | Supabase (Postgres) — labs, catalogue, user data |
| **Multilingual** | Sarvam AI Translate / Mayura (EN ↔ HI) |
| **Speech-to-Text** | Sarvam AI Saarika (Indic ASR) + Groq Whisper (fallback) |
| **Text-to-Speech** | Sarvam AI Bulbul v3 (35+ Indian-language voices) |
| **Vision / OCR** | Gemini 2.5 Flash (product classification) + Sarvam Vision (HUID OCR) |

---

## 📐 Non-Functional Requirements

- **Groundedness over fluency** — no certification claim is shown without a resolved citation; abstention is designed behaviour, not a failure state.
- **Copyright compliance** — full paywalled IS standard text is never ingested or reproduced. Only BIS catalogue metadata and BIS's own free public documents are used.
- **Latency** — first token < 2s, full answer < 8s on a 4G connection.
- **Privacy** — no personal data required for core Q&A. Complaint data is opt-in and handled per DPDPA norms.
- **Security** — rate-limited API, sanitised inputs, secrets are never client-side.

---

## 📜 Legal Disclaimer

This assistant provides **informational guidance only**. It does not reproduce full IS standard text (copyright-protected by BIS). All certification decisions must be verified with your nearest BIS office.

**BIS Helpline:** 1800-11-4000 (toll-free) · **Website:** [www.bis.gov.in](https://www.bis.gov.in)
