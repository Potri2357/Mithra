# MVP & Execution Plan
## AI-Powered Intelligent Assistant for Indian Standards & BIS Services (SIH PS 26107)
**Role posture:** CTO + Product Manager build plan | **Version:** 1.0

---

## 1. MVP Definition

**MVP = all 10 Tier-1 features, fully working end-to-end, on real BIS data, with citation grounding and abstention.** Tier 1 is now the 8 PS-mandated capabilities *plus two promoted wow-factor features — voice input/output and photo-based verification/classification* — because they make the 8 mandated capabilities themselves more compelling to watch live, rather than standing alone as separate add-ons.

Everything remaining in Tier 2 (WhatsApp, cost/timeline estimator, guided complaint drafting, freshness labeling) is a stretch goal ordered by ROI, attempted only after all 10 Tier-1 features are demo-stable.

**Definition of done for the MVP demo:**
1. A user can **type or speak, or simply photograph the product,** "I manufacture LED bulbs, which standard applies and what licence do I need?" and get a single cited answer covering the standard, the scheme, the process, and a nearby lab — the exact scenario BIS's own problem framing and competing teams use as the canonical test case.
2. Every factual/legal claim in that answer is traceable to a real retrieved passage; if it isn't, the assistant says so instead of guessing.
3. The same flow works in Hindi, by text and by voice.
4. A consumer can **photograph a hallmark/HUID stamp** (or type the HUID) to verify it, and be walked through filing a complaint if it doesn't match.

---

## 2. Recommended Tech Stack (strategic, not default)

Chosen for: fast hackathon velocity, believable production path, multilingual-India fit, and defensible answers on "why this stack" during judging.

### 2.1 Core architecture pattern
**Intent-routed multi-agent RAG, not a single RAG chain.** The 8 required capabilities need different retrieval strategies (structured lookup for labs/catalogue vs. semantic search for scheme/hallmarking guidance vs. recommendation logic for product→standard). A router classifies intent first, then dispatches to a specialized tool. This is the single most important architectural decision — a single generic RAG chain will visibly underperform on this PS.

```
User (text/voice/photo, any language)
        │
   Language detect + translate-to-pivot (if needed)
        │
   Intent Router (small/fast model)
        │
   ┌────┴─────────────────────────────────────────────┐
   │  standard_lookup   recommend_standard   scheme_guide │
   │  hallmark_verify    lab_finder           complaint_flow │
   └────┬─────────────────────────────────────────────┘
        │
   Retrieval layer (hybrid dense + lexical, RRF fusion, reranker)
        │
   Generation (grounded, JSON-structured for citations)
        │
   Citation validator (strip unresolved markers → abstain if too weak)
        │
   Translate-back-to-user-language
        │
   Response (web / WhatsApp / voice)
```

### 2.2 Layer-by-layer stack — free-tier / zero-cost build (revised)

Every choice below is buildable on a free tier or a free, self-hostable open-weight model — no paid API keys required for the hackathon build. This matters twice over: it removes a funding blocker for a student team, and "we built this entirely on free infrastructure" is itself a strong line in the pitch (cost-to-BIS-at-scale becomes near-zero).

| Layer | Recommendation | Free-tier basis | Why |
|---|---|---|---|
| **Frontend (web)** | Next.js + Tailwind + shadcn/ui, deployed on Vercel | Vercel Hobby tier — free | Fast to ship, matches the pattern the stronger competing team already validated works for demo purposes; PWA-capable for later offline/low-bandwidth mode |
| **Backend / orchestration** | Python + FastAPI | Self-hosted, free | Best ecosystem for RAG/agent tooling (LangGraph, LlamaIndex); async-friendly for concurrent tool calls |
| **Agent framework** | LangGraph (or a hand-rolled router if the team is short on time) | Open source, free | Explicit, debuggable state machine for intent routing — easier to demo/explain to judges than an opaque agent loop |
| **LLM (primary generation + reasoning)** | **Gemini 2.5 Flash** (Google AI Studio) | Free tier — roughly 1,500 requests/day, no billing account required | Multimodal (handles both text generation and the photo-classification/OCR tasks in one model), strong instruction-following for structured, citation-tagged output, and the most generous first-party free tier of any current flagship-adjacent model |
| **LLM (fast intent router + fallback)** | **Groq** running an open model (e.g., Llama-3.x-Instant) | Free tier — thousands of free requests/day, extremely low latency | ~100–200ms intent classification; also a same-day fallback if the Gemini free quota is hit mid-demo |
| **Embeddings** | **BGE-M3** (open-weight, self-hosted locally — via `sentence-transformers` or `FlagEmbedding`) | Free — runs on a laptop CPU/GPU, no API cost | A Hindi question must match English source text without a full translation round-trip for every retrieval call; multilingual by design |
| **Reranker** | **BGE-reranker-v2-m3** (open-weight, self-hosted) | Free | Single biggest lever on answer quality after hybrid retrieval — confirmed as the highest-impact component by a competing team's own build notes |
| **Vector store** | Qdrant — self-hosted in embedded/local mode for dev, or Qdrant Cloud free cluster (1GB) for the deployed demo | Free | Hybrid dense+sparse search with Reciprocal Rank Fusion, well suited to short, clause-shaped legal/technical passages |
| **Structured data (catalogue, labs, licences)** | Postgres via **Supabase free tier** (500MB DB, free auth included) | Free | Catalogue lookups (standard number → title/committee/year) and lab lookups (category → location) are relational queries, not semantic search — don't force them through RAG |
| **Multilingual translation layer** | **Sarvam AI** — `Sarvam-Translate`/Mayura for translate-in/translate-out, kept separate from the reasoning model | Free signup credits via dashboard.sarvam.ai; open-source AI4Bharat IndicTrans2 as a zero-cost self-hosted fallback if credits run out | Sarvam is purpose-built for Indian languages including code-mixed Hinglish/Tanglish, materially more reliable on legal/technical Hindi than relying on a general LLM's raw multilingual ability |
| **Speech-to-text** | **Sarvam AI Saarika/Saaras** (Indic ASR, auto language detection) | Free signup credits; Groq's free-tier Whisper-large-v3 endpoint as a zero-cost backup for pure English audio | Purpose-trained on Indian speech and code-mixed audio — a materially better fit than a general-purpose ASR model for this user base |
| **Text-to-speech** | **Sarvam AI Bulbul v3** (35+ Indian-language voices, handles Hinglish natively) | Free — the public Sarvam TTS tool requires no sign-up at all for light use; API tier has free credits | Trained from scratch on Indian speech rather than fine-tuned from an English base — names, places, and code-switched sentences are pronounced correctly, which matters for a compliance/legal-adjacent product |
| **Photo/vision** | **Gemini 2.5 Flash** (multimodal) for product-photo → likely-category classification; **Sarvam Vision** (document intelligence) for HUID/hallmark-stamp OCR and for parsing scanned BIS PDFs during ingestion | Both free-tier | One model layer covers both "what product is this" and "read this stamp/scan," keeping the vision surface simple; Sarvam Vision is specifically tuned for Indian documents/handwriting |
| **WhatsApp channel** | Meta WhatsApp Cloud API direct (not a paid BSP like Twilio/Gupshup) | Meta's own Cloud API has a free monthly conversation allowance sufficient for a hackathon demo and early pilot | Matches how India's government chatbots (MyGov Saathi, DGFT's VAHEI) already reach citizens at scale; reuses the same backend intent router |
| **Ingestion pipeline** | Python scraper against BIS's public catalogue endpoints + PDF parsers for scheme/QCO/hallmarking/consumer documents, throttled + disk-cached, with a committee-mapping self-check (verify known IS numbers land under the expected committee before trusting a scrape) | Free (self-written) | BIS's endpoints are undocumented and inconsistent (silent default page sizes, case-inconsistent standard numbers like `IS 2347:2023` vs `Is 2347:2023`, opaque encrypted committee IDs) — defensive, self-verifying ingestion is not optional |
| **Citation/guardrail layer** | Custom validator: LLM emits inline markers (e.g., `[S1]`), validator resolves each marker against actually-retrieved passages and strips anything that doesn't resolve; if remaining grounded evidence is too thin, the answer abstains and links to the official BIS page | Free (self-written) | This is the trust mechanism the entire product's credibility rests on — treat it as a first-class component, not an afterthought |
| **Auth/users** | Supabase Auth (email/OTP) — optional for MVP, required only for saved complaints/dashboards | Free tier | Don't gate the core Q&A behind login; login only where personalization is genuinely needed |
| **Deployment** | Frontend: Vercel free tier. Backend: Render free web service or Fly.io free allowance, Dockerized. | Free | Fast iteration during the hackathon, credible production path afterward |
| **Observability** | Basic request/response logging + a simple citation-precision eval script run against a held-out question set before the demo | Free (self-written) | Judges respond well to "here's our eval score," not just a live demo |

### 2.3 Explicit non-choices (and why)
- **No single flat RAG chain** — the 8 capabilities are too heterogeneous; a router is not optional polish, it's the correct architecture.
- **No reproduction of full paywalled IS standard text** in the corpus — legal/licensing risk and explicitly out of scope; ingest catalogue metadata + BIS's own free public documents only.
- **No paid API dependency anywhere in the MVP** — Gemini 2.5 Flash, Groq, and Sarvam AI all have usable free tiers; BGE-M3/BGE-reranker run self-hosted at zero cost. Keep a config flag to swap in a paid tier later (e.g., Gemini 2.5 Pro, or a larger Sarvam model) once the product is past the hackathon and has a funding source — don't architect around a specific vendor's paid-only model.
- **Gemini over Claude/GPT-4V for the hackathon build specifically because of the free tier** — this is a cost decision, not a quality judgment; if the team later has API budget, swapping the generation model behind the same interface is a one-line change, and a stronger commercial-grade model is worth revisiting for production accuracy on legal/compliance text.

---

## 3. Corpus Strategy

Don't attempt all ~15,000+ published standards. Scope to the highest-traffic, QCO-heavy product groups where real questions cluster: household electrical, electronics & IT, wires & cables, cement, steel & construction, drinking water, automobiles & tyres, helmets & PPE, cookers & utensils, LPG appliances, toys, hallmarking, food, pipes & plumbing, fire safety, solar, EV charging, furniture, footwear, textiles, pumps & motors, batteries, chemicals/plastics/rubber. Map each group to its actual BIS sectional committee — and verify the mapping, because committee names are misleading (helmets sit under a fire-safety committee, not a PPE-named one; electric toys sit under an electrical-appliances committee, not "Toys"; solar pumping standards sit under a pumps committee). A self-check that fails loudly when a known-important IS number doesn't appear under its expected committee catches these traps before they become wrong answers in front of judges.

---

## 4. Team & Role Split (assume a 6-person SIH team)

| Role | Owns | Tier-1 deliverable |
|---|---|---|
| Data/ingestion engineer | Scraper, PDF parsing, committee mapping, corpus QA | Verified catalogue + document corpus |
| Backend/RAG engineer | Intent router, retrieval, reranking, citation validator | Grounded, cited answers for FR-1–FR-7 |
| ML/multilingual engineer | Translation layer, STT/TTS integration, embeddings/reranker hosting | FR-8 (multilingual) + FR-9 (voice) |
| Vision/CV engineer *(or shared with ML engineer on a smaller team)* | Product-photo classification, HUID/hallmark OCR | FR-10 (photo-based verification) |
| Frontend engineer | Next.js chat UI, mic input, camera/photo upload, lab finder map/list view | Usable, demoable web app surfacing FR-9 and FR-10 |
| Integrations engineer | WhatsApp channel, lab/complaint flows | Remaining Tier-2 reach features |
| PM / pitch owner | PRD, eval harness, judging narrative, demo script | This document + live demo choreography |

*On a 6-person team, fold the vision/CV work into the ML/multilingual engineer's scope or the backend engineer's — FR-10 is API-shaped (send image, get classification) and doesn't need a dedicated headcount if time is tight.*

---

## 5. Build Timeline (36–48h hackathon window)

**Phase 0 (pre-hackathon, if allowed): Research & scaffolding**
- Finalize committee-to-product-group mapping; stand up repo, CI, base FastAPI + Next.js skeletons; get BIS public endpoints and rate limits confirmed.

**Phase 1 (Hours 0–10): Data foundation**
- Run catalogue ingestion with the self-verifying committee check.
- Parse the highest-priority scheme/QCO/hallmarking/consumer PDFs into clause-aware chunks (never split a chunk mid-clause — that's what makes clause-level citation honest).
- Load labs directory.

**Phase 2 (Hours 10–22): Retrieval + agent core**
- Stand up hybrid dense+sparse retrieval with reranking.
- Build the intent router and the six tools (standard_lookup, recommend_standards, scheme_guide, hallmark_verify, lab_finder, complaint_flow) — voice and photo inputs will feed these same six tools as alternate entry points, not new tools.
- Build and wire the citation validator with abstention.

**Phase 3 (Hours 22–32): Surfaces — this phase now carries two Tier-1 (not stretch) deliverables**
- Web chat UI with citations rendered inline and a "sources" panel.
- Hindi language path end-to-end (translate-in → route/retrieve on pivot text or multilingual embeddings → translate-out).
- **[Tier 1] Voice input/output** on at least the standard-recommendation, certification-process, and hallmark-verification flows, with graceful text-only fallback.
- **[Tier 1] Photo upload/camera capture** → product classification → standard recommendation, and → HUID/hallmark OCR → verification lookup.
- Treat these two as blocking for demo-readiness, not optional polish — protect time for them earlier in the schedule if Phase 1/2 slip.

**Phase 4 (Hours 32–40): Reach + remaining Tier-2 polish**
- WhatsApp channel wired to the same backend.
- Guided complaint-drafting flow producing a ready-to-submit form.
- Cost/timeline estimator surfaced inside scheme guidance answers.

**Phase 5 (Hours 40–48): Eval, hardening, pitch**
- Run a held-out question set through the citation-precision/abstention eval script; fix the worst failure modes.
- Rehearse the exact canonical demo scenario ("I manufacture LED bulbs...") plus one Hindi scenario and one hallmark-fraud scenario.
- Prepare the competitive-positioning slide (this PRD's competitor table) and the "what we deliberately left out and why" slide (full standard text, payment processing) — judges reward teams that show scoping discipline, not just feature count.

---

## 6. Winning Strategy vs. Other Teams

Two other public builds against this exact PS already exist and are informative benchmarks, not just competitors:
- One has strong backend grounding/citation discipline but, at last check, no shipped frontend and incomplete hallmarking/lab data — **beat it by finishing what it hasn't**: a complete, demoable, all-10-features experience.
- One pitches photo verification and voice support with a live deployed frontend — this is exactly why those two features were promoted into our own Tier 1 rather than left as optional stretch goals. **Match it on both, and pair them with the citation-grounding rigor the other team demonstrates**, so the demo is simultaneously the most visually impressive and the most trustworthy in the room.

The defensible wedge is therefore not a single novel feature — it's being the team that ships **all 10 Tier-1 capabilities (the 8 mandated ones plus voice and photo verification), working end-to-end, on real BIS data, with visible source citations, in two languages** — a combination none of the observed competitors currently have simultaneously. Judges in this PS pool will have seen citation-grounded RAG demos before, and they'll have seen voice or photo features in isolation — what they won't have seen as often is one team clearing the entire 10-point checklist live, without gaps, while also explaining precisely why full standard text isn't reproduced and how the abstention behavior protects an MSME from a costly wrong answer. Lead the pitch with that discipline, then close on the "photograph it, ask it, hear it answer" moment — that's the wow factor that should be the literal first 30 seconds of the demo.

---

## 7. What to explicitly show judges you deliberately did NOT build
- Full paywalled IS standard text reproduction (copyright risk — and say so out loud).
- Payment/licence-fee processing.
- Any claim of guaranteed certification outcome.

Naming these out loud signals engineering maturity and regulatory awareness — both of which score well in a BIS-sponsored PS.
