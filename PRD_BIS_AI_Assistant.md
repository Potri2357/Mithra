# Product Requirements Document (PRD)
## AI-Powered Intelligent Assistant for Indian Standards & BIS Services
**Problem Statement ID:** 26107 | **Organization:** Bureau of Indian Standards (BIS), Ministry of Consumer Affairs | **Category:** Software (GenAI / RAG)
**Doc owner:** Product/CTO | **Version:** 1.0 | **Status:** Draft for build

---

## 1. Purpose & Background

BIS runs eight-plus distinct digital surfaces — the standards catalogue, Manak Online (licensing), CRS/hallmarking portal, BIS Care app (HUID/consumer verification), the lab-recognition directory, Standards Clubs/training material, and consumer-grievance forms — none of which talk to each other and none of which understand natural language. A manufacturer who asks "I make LED bulbs, which standard applies and what licence do I need?" must manually cross-reference the catalogue, a scheme guideline PDF, a Quality Control Order (QCO) notification, and the lab directory. MSMEs, first-time exporters, students, and consumers — the least resourced users — bear this cost most, and a market of paid BIS consultants (Corpseed, Agile Regulatory, UMSPCS, etc.) has grown specifically to fill this navigation gap.

**Goal:** Build a conversational, source-cited AI assistant that collapses this multi-portal search into a single natural-language interaction, in English and Indian regional languages, for four user segments: **MSMEs/manufacturers, startups/exporters, students/researchers, and consumers.**

---

## 2. Problem Statement Restated (Official Scope)

The assistant **must**, at minimum:
1. Answer questions related to Indian Standards.
2. Recommend applicable standards based on product descriptions.
3. Provide guidance on BIS certification schemes.
4. Explain certification processes.
5. Answer consumer-related queries.
6. Guide users regarding hallmarking.
7. Suggest relevant testing laboratories.
8. Support multilingual interaction.

Every response should be **context-aware and source-backed**, citing the document or clause it draws from.

---

## 3. Personas

| Persona | Need | Current workaround | Pain level |
|---|---|---|---|
| **Manufacturing MSME owner** (e.g., LED bulbs, cookware, cables) | "Which IS number applies to my product, and how do I get licensed?" | Hires a consultant (₹15k–₹1L+) or trial-and-errors the Manak Online portal | High — wrong IS code choice is a leading cause of application rejection |
| **Startup/exporter** | Certification scheme choice (ISI/CRS/FMCS), cost & timeline estimate | Scattered blog posts, consultant calls; FMCS for foreign manufacturers can take 24–30 months | High |
| **Student/researcher** | Understand what a standard covers, its committee, related standards | Catalogue search only gives metadata; full IS text is paywalled | Medium |
| **Consumer** | Verify hallmark/HUID authenticity, file a complaint, understand ISI mark | BIS Care/SCARE app exists but has low awareness and reported gaps (jewellers requesting an "upgrade" after fraud incidents) | Medium–High (trust/fraud risk) |

---

## 4. Competitive & Reference Landscape

### 4.1 Direct competitors (same PS, other hackathon teams — observed live on GitHub)
| Project | Approach | Strengths to match/beat | Gaps to exploit |
|---|---|---|---|
| **Team (Dhyey2907/Hackathon-2026)** | Python/FastAPI backend, intent-routed agent (not single RAG chain), Qdrant hybrid dense+sparse search, `bge-m3` local embeddings, Groq (Llama-3.3-70B) generation, **citation-marker validator that strips unverified `[S1]` citations and abstains rather than guesses** | Rigorous grounding/abstention discipline; committee-mapping self-verification catching miscategorized standards (e.g., helmets filed under "Fire Fighting", not PPE) | No frontend at time of observation; full standard text not ingested (metadata only); hallmarking/lab-directory ingestion incomplete |
| **Team InvictX (Riky-18/SIH26107)** | React + Vite frontend, live deployed demo, pitch emphasizes **clause-level citations, photo verification, and voice support** | Ships a real deployed UI; photo-based verification is a strong differentiator for hallmarking/product ID | Repo scaffolding suggests frontend-first; depth of backend grounding/citation validation unverified |

**Implication:** the bar in this specific PS pool already includes citation-grounding-with-abstention on one side and photo+voice UX on the other. A winning build needs **both** — not novelty, thoroughness.

### 4.2 Adjacent official/government reference patterns
| Product | Pattern worth reusing |
|---|---|
| **BIS Care / "SCARE" app** | HUID verification is already a validated consumer need — reuse the concept but fix reported gaps (low discoverability, jewellers publicly asking BIS to "upgrade" the app after fraud in Kashmir, 2025) |
| **DGFT's VAHEI chatbot** | Domain-specific regulatory Q&A + application-status lookup in one bot |
| **Income Tax's Kar Saathi** | Keeps users updated on the latest rules inline with the answer, reducing "am I looking at outdated info" anxiety |
| **MyGov Saathi (COVID WhatsApp bot)** | Proved WhatsApp can serve 300k+ users/day for a government use case in India — validates a WhatsApp channel for BIS |
| **JanSetu (hackathon reference, multi-agent scheme+regulatory assistant)** | Multi-agent split (regulatory agent vs. scheme-matching agent) is a clean pattern to mirror for BIS's scheme-vs-standard-vs-lab split |

### 4.3 Indirect competitors (who the assistant should disintermediate)
Paid BIS consultancy sites (Corpseed, Agile Regulatory, UMSPCS, Aleph India, etc.) currently monetize exactly this confusion — IS-code selection, document checklists, timeline estimates. The assistant's value proposition is explicitly: **give MSMEs and startups free, instant, source-backed access to what they currently pay a consultant for**, while being honest about what still requires a human specialist (factory inspection scheduling, legal representation for FMCS, etc.).

### 4.4 Feature synthesis — "best of all"
Pulling the strongest feature from each reference point:
- Grounded, validated, citation-linked answers with abstention (Dhyey2907 team)
- Photo-based product/jewellery verification + voice I/O (InvictX)
- WhatsApp-first distribution for reach (MyGov Saathi)
- Multi-agent intent routing across standards / schemes / hallmarking / labs (JanSetu pattern)
- Always-current regulatory framing, "as of" dating on answers (Kar Saathi)
- Consultant-grade checklists and timeline/cost estimates, for free (against Corpseed/Agile Regulatory)

---

## 5. User Pain Points → Feature Mapping

Sourced from BIS's own public materials, consultancy blogs, news coverage of hallmarking fraud, and existing hackathon submissions on this exact PS.

| Pain point (evidence) | Feature response |
|---|---|
| Applications rejected for choosing the **wrong IS code** — a commonly cited rejection cause | Product-description → standard recommender with a confidence score and "why this standard" explanation |
| Info fragmented across catalogue, Manak Online, CRS, BIS Care, lab directory | Single conversational entry point with intent routing behind the scenes |
| ISI licensing takes **4–6 weeks domestic**, **24–30 months for Foreign Manufacturers (FMCS)** with manual, paper-heavy steps | Step-by-step process explainer + document checklist + realistic timeline estimator per scheme |
| Full IS standard text is **paywalled** — the assistant cannot legally reproduce it | Be explicit in the UI: metadata + scope description + link to the official paid copy; never fabricate clause text for standards not in the ingested corpus |
| Hallmarking fraud — fake/duplicated HUIDs, jewellers demanding BIS "upgrade" the verification app (Kashmir, 2025) | Photo/HUID-based hallmark verification + guided fraud-complaint filing flow |
| Consumers don't know how or where to file a certification/hallmarking complaint | Guided complaint-drafting flow that outputs a ready-to-submit form/PDF with the right regional office |
| MSMEs can't find a nearby BIS-recognized testing lab for their product category | Lab-finder by product category + geography |
| Regional-language users are underserved by English-only portals | Multilingual chat (text + voice) via an Indic translation layer |
| Government testing-fee concessions exist for MSMEs/startups/women entrepreneurs but are poorly known | Proactively surface applicable fee concessions when a user self-identifies as MSME/startup/woman entrepreneur |
| Consultants charge for what is largely "read the guideline and summarize it" work | Free, cited, always-on version of that first-pass guidance |

---

## 6. Scope: Tiered Feature Plan

### Tier 1 — Mandatory + wow-factor (the 8 PS-mandated capabilities plus 2 promoted differentiators; MVP cannot ship without these)
| # | Feature | Notes | Source |
|---|---|---|---|
| 1.1 | **General Indian Standards Q&A** | Conversational answers grounded in catalogue + public documents, with citations | PS-mandated |
| 1.2 | **Standard recommendation from product description** | Text input → ranked IS numbers with confidence + rationale | PS-mandated |
| 1.3 | **BIS certification scheme guidance** | Explains ISI (Scheme-I), CRS, FMCS, voluntary vs. mandatory, which applies when | PS-mandated |
| 1.4 | **Certification process explanation** | Step-by-step (apply → test → inspect → grant → renew), with document checklist | PS-mandated |
| 1.5 | **Consumer query handling** | ISI mark meaning, how to verify a product, how/where to complain | PS-mandated |
| 1.6 | **Hallmarking guidance** | HUID meaning, purity marks, registration for jewellers, verification steps | PS-mandated |
| 1.7 | **Testing lab suggestions** | Lab lookup by product category + state/city | PS-mandated |
| 1.8 | **Multilingual interaction** | At minimum Hindi + English; architecture designed to extend to more Indic languages | PS-mandated |
| 1.9 | **Voice input/output** | Speak a question, hear a spoken answer, in English or Hindi — makes every capability above hands-free and accessible to low-literacy users | Promoted from Tier 2 — wow factor |
| 1.10 | **Photo-based verification/classification** | Photograph a product to get a standard recommendation, or photograph a hallmark/HUID stamp to verify authenticity on the spot | Promoted from Tier 2 — wow factor |

**Why these two, specifically:** they were the strongest live-demo differentiators identified in the competitive landscape (Section 4), and unlike the other Tier-2 items, they don't stand alone as separate features — they make the 8 mandated capabilities themselves more impressive to watch. Standard recommendation (1.2) becomes "point your phone at the product," hallmarking guidance (1.6) becomes "photograph the stamp and know instantly," and every capability becomes usable by voice. This is why they're the right two to promote rather than, say, WhatsApp or the cost estimator, which add reach and utility but don't change how the *core* pitch demo feels.

### Tier 2 — Remaining competitive differentiators (build these to win, not just qualify)
- Clause/marker-level citations with an automatic **validator that strips unverifiable citations and makes the assistant abstain** rather than hallucinate a legal requirement
- **WhatsApp channel** (in addition to web) — matches how Bharat actually communicates and how MyGov and DGFT already distribute similar bots
- **Cost & timeline estimator** per scheme/product category, sourced from published fee schedules and processing-time data
- **Guided complaint drafting** (hallmark fraud, certified-product quality issue) producing a submission-ready form addressed to the right regional office
- **"As of" freshness labeling** on every answer plus a visible corpus/version date, so users know they're not reading stale guidance

### Tier 3 — Moonshot / post-hackathon roadmap (do not attempt in 36–48h; show as vision slide)
- Live status tracking by integrating (with permission) into Manak Online / CRS application IDs
- Personalized MSME dashboard: licence renewal reminders, QCO-change alerts for a user's product categories
- Marketplace-style lab booking with real-time slot availability
- Auto-fill of application forms from a conversation (human-in-the-loop review before submission)
- DigiLocker/Udyam-linked identity autofill for KYC fields
- Admin analytics dashboard for BIS to see query volume by product category/region (a genuine internal-ops upsell for BIS itself)
- Offline-first / low-bandwidth PWA mode for rural connectivity

---

## 7. Functional Requirements (Tier 1, detailed)

**FR-1 Standards Q&A**
- Accepts free-text questions in chat.
- Retrieves from catalogue metadata (number, title, committee, year) + ingested public documents.
- Every factual claim carries an inline citation marker resolving to a retrieved passage; unresolved markers are stripped before the answer is shown.
- If retrieval confidence is low, the assistant abstains and links to the official BIS page instead of guessing.

**FR-2 Standard Recommendation**
- Input: free-text product description (optionally + photo).
- Output: ranked list of candidate IS numbers with a plain-language reason and a link to the licensing scheme that applies.
- Must handle ambiguous descriptions by asking one clarifying question rather than guessing.

**FR-3 Certification Scheme Guidance**
- Distinguishes ISI mandatory (QCO-covered) vs. voluntary, CRS (compulsory registration for electronics/IT), FMCS (foreign manufacturers).
- Surfaces applicable MSME/startup/woman-entrepreneur fee concessions when relevant.

**FR-4 Process Explanation**
- Produces a numbered step sequence (apply → test → inspect → grant → renew) per scheme.
- Generates a document checklist tailored to domestic vs. importer/foreign manufacturer.

**FR-5 Consumer Queries**
- Explains the ISI mark, how to check authenticity, and consumer rights under the BIS Act 2016.
- Routes fraud/quality complaints to a guided drafting flow.

**FR-6 Hallmarking Guidance**
- Explains HUID, 3-mark hallmarking system, purity grades, AHC registration for jewellers.
- Verifies a HUID (via BIS Care-equivalent lookup, where data is accessible) and flags mismatches for complaint filing.

**FR-7 Lab Suggestions**
- Lets a user filter recognized testing labs by product category and location.
- Returns address, accreditation scope, and contact info.

**FR-8 Multilingual**
- Detects input language; responds in the same language.
- Minimum viable: English + Hindi at launch; architecture supports adding more Indic languages via a translation layer without re-training the core model.

**FR-9 Voice Input/Output**
- Accepts spoken questions (mic input) in English or Hindi; transcribes via speech-to-text.
- Reads answers back via text-to-speech in the same language, in addition to showing text + citations on screen.
- Available on at least the standard-recommendation, certification-process, and hallmarking flows at MVP; extendable to all flows.
- Must degrade gracefully to text-only on unsupported devices/browsers.

**FR-10 Photo-Based Verification/Classification**
- Accepts an uploaded or camera-captured photo of a product; classifies it against the priority product-group taxonomy and feeds the result into FR-2 (standard recommendation) with the same confidence + rationale format.
- Accepts a photo of a hallmark/HUID stamp; extracts the HUID via OCR and runs it through the FR-6 hallmark-verification lookup, flagging mismatches for the complaint-drafting flow.
- If image quality is too poor to classify confidently, asks the user to retake or fall back to text description rather than guessing.

---

## 8. Technology Stack Summary

The PRD stayed silent on implementation technology by design — that level of detail lives in the companion MVP & Execution Plan — but a PRD should still name what the product is built on so a reader doesn't have to cross-reference a second document to know that. Full rationale, alternatives considered, and free-tier limits are in `MVP_Build_Plan.md`, Section 2; this is the summary.

**Build principle:** the MVP runs entirely on free tiers and free self-hosted open-weight models — no paid API keys required to build or demo it.

| Layer | Tool |
|---|---|
| Frontend | Next.js + Tailwind + shadcn/ui (Vercel) |
| Backend / orchestration | Python + FastAPI, LangGraph-based intent router (not a single RAG chain) |
| LLM — primary generation & reasoning | **Gemini 2.5 Flash** (free tier, multimodal — also handles vision) |
| LLM — fast router / fallback | **Groq** (free tier, open model, low-latency intent classification) |
| Embeddings | **BGE-M3** (open-weight, self-hosted, multilingual) |
| Reranker | **BGE-reranker-v2-m3** (open-weight, self-hosted) |
| Vector store | Qdrant (self-hosted / free cloud tier) — hybrid dense+sparse with RRF fusion |
| Structured data | Postgres via Supabase (free tier) |
| Multilingual translation | **Sarvam AI** (Translate/Mayura), open-source AI4Bharat IndicTrans2 as self-hosted fallback |
| Speech-to-text | **Sarvam AI Saarika/Saaras** (Indic ASR, code-mixed speech) |
| Text-to-speech | **Sarvam AI Bulbul v3** (35+ Indian-language voices) |
| Photo/vision | **Gemini 2.5 Flash** (product classification) + **Sarvam Vision** (HUID/hallmark OCR, document parsing) |
| WhatsApp channel | Meta WhatsApp Cloud API (free conversation allowance) |
| Citation/guardrail layer | Custom-built validator — strips unresolved citation markers, forces abstention on weak evidence |
| Deployment | Vercel (frontend) + Render/Fly.io (backend), Dockerized |

This stack directly implements FR-1–FR-10 above: Gemini + the RAG/citation layer covers FR-1–FR-7, Sarvam Translate covers FR-8, Sarvam STT/TTS covers FR-9, and Gemini vision + Sarvam Vision cover FR-10.

---

## 9. Non-Functional Requirements

- **Groundedness over fluency:** no answer implying a legal certification requirement may be generated without a resolved citation; abstention is a designed behavior, not a failure state.
- **Copyright compliance:** full text of paywalled IS standards is never ingested or reproduced verbatim; only catalogue metadata + BIS's own public guideline/scheme documents are used as source text, and the assistant always links to the official (paid) source for full standard text.
- **Latency:** first-token response < 2s, full answer < 8s for a text query on a 4G connection.
- **Availability:** demo-grade 99% during hackathon judging window; design should not preclude production-grade SLAs later.
- **Data freshness:** ingestion pipeline is re-runnable and cached; corpus carries a visible "last updated" timestamp.
- **Accessibility:** WCAG-aligned UI; voice channel for low-literacy users; GIGW (Govt of India Guidelines for Websites) alignment for any future real deployment.
- **Data privacy:** no personal data required to use the core Q&A; any data collected (complaint drafts, contact info) is handled per DPDPA norms and is opt-in.
- **Security:** rate-limited API, no execution of user-supplied code, sanitized inputs, secrets never client-side.

---

## 10. Out of Scope (explicitly, to prevent scope creep)
- Legal advice / guaranteed certification outcomes — the assistant informs, it does not certify or approve.
- Reproducing full paywalled IS standard text.
- Payment processing for licence fees.
- Replacing human factory inspection or lab testing.

---

## 11. Success Metrics

| Metric | Target (hackathon demo) | Target (post-launch, 6 months) |
|---|---|---|
| Tier-1 features fully functional end-to-end (8 mandated + 2 promoted wow-factor) | 10/10 | 10/10 + remaining Tier 2 |
| Citation precision (claims traceable to a real retrieved passage) | > 90% on eval set | > 95% |
| Abstention rate on out-of-corpus questions | 100% (no fabricated clause text) | 100% |
| Query resolution without human handoff | Demo-only, qualitative | > 70% |
| Languages supported | 2 (English, Hindi) | 6+ scheduled Indian languages |
| Median response latency | < 8s | < 4s |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Hallucinated certification requirements cause real financial harm to an MSME | Mandatory citation validator + abstention; visible disclaimers; "verify with your nearest BIS office" CTA on every certification-process answer |
| BIS's own catalogue/lab APIs are undocumented and inconsistent (confirmed: paging defaults, case-inconsistent standard numbers, opaque committee IDs) | Build defensive ingestion (throttled, cached, `--check-mapping`-style self-verification against known IS numbers per committee) |
| Full standard text is copyrighted | Never ingest/reproduce it; metadata + public guideline documents only |
| Multilingual quality degrades trust | Use a dedicated Indic translation layer (**Sarvam AI Translate/Mayura**, purpose-built for Indian languages including code-mixed Hinglish, with open-source AI4Bharat IndicTrans2 as a self-hosted fallback) rather than relying on the base LLM's raw multilingual ability for legal/technical text |
| Free-tier API limits (Gemini ~1,500 req/day, Sarvam free credits) get exhausted mid-demo or at pilot scale | Groq free tier + self-hosted BGE models as zero-cost fallbacks for generation/embeddings; architecture keeps the model layer swappable behind one interface so a paid tier can be turned on later without a rebuild |
| Two other teams are building close variants of this exact PS | Differentiate on **breadth of working Tier-1 features + trust guardrails + WhatsApp/voice reach**, not on a single flashy feature |

---

## 13. Appendix — Source Notes
Findings drawn from: BIS's official pages on hallmarking consumer protection and the BIS Care/HUID verification feature; public reporting on 2025 hallmark-fraud incidents in Kashmir prompting jewellers to ask BIS to upgrade its verification app; consultancy/industry material on BIS/ISI certification timelines, common rejection causes, and FMCS delays (24–30 months); and two other public hackathon submissions against this same problem statement (26107), observed on GitHub, used here for competitive benchmarking only — no code or content from either was reused.
