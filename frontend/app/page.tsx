"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  ShieldCheck,
  FlaskConical,
  Award,
  Mic,
  Camera,
  Languages,
  ChevronRight,
  CheckCircle,
  Cpu,
  ArrowRight,
  Factory,
  Rocket,
  GraduationCap,
  Users,
  Search,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const STATS = [
  { value: "22,000+", label: "Active Indian Standards (IS)", sub: "Catalogued in database" },
  { value: "1,500+", label: "Mandatory QCO Products", sub: "Under ISI & CRS schemes" },
  { value: "50+", label: "Accredited Testing Labs", sub: "NABL & BIS-recognized" },
  { value: "100%", label: "Citation Grounding", sub: "Zero ungrounded hallucinations" },
];

const PREVIEWS = [
  {
    id: "standards",
    label: "Standards Intelligence",
    icon: BookOpen,
    title: "Instant IS Scope, Committee & Mandate Verification",
    desc: "Query standard numbers like IS 16102 (LED Lamps), IS 694 (Wires), or IS 269 (Cement). Receive authoritative committee notes, testing parameters, and applicable Quality Control Orders (QCOs).",
    sampleQuery: "What does IS 16102 cover for LED lamps?",
    badge: "Standards Registry",
    previewData: {
      standard: "IS 16102 (Part 1 & 2): 2012",
      title: "Self-Ballasted LED Lamps for General Lighting Services",
      committee: "Electrotechnical Division Council (ETD 33)",
      scheme: "Compulsory Registration Scheme (CRS)",
      citation: "[S1] Ministry of Electronics & IT (MeitY) QCO Notification S.O. 2357",
    },
  },
  {
    id: "hallmark",
    label: "Hallmark & HUID Scanner",
    icon: Award,
    title: "Gold & Silver Hallmark Authenticity Verification",
    desc: "Verify the mandatory 3-mark hallmark: BIS Triangle Logo, Purity Grade (e.g. 22K916), and the 6-character alphanumeric Hallmark Unique Identification (HUID).",
    sampleQuery: "Verify HUID AA123456",
    badge: "Consumer Assurance",
    previewData: {
      standard: "IS 1417 & IS 15820",
      title: "Gold & Silver Jewellery Hallmarking Standard",
      committee: "Assaying & Hallmarking Centres (AHC)",
      scheme: "Mandatory Hallmarking Order 2021",
      citation: "[S1] BIS Hallmarking Guidelines for AHC Jewellers",
    },
  },
  {
    id: "labs",
    label: "Accredited Lab Radar",
    icon: FlaskConical,
    title: "Directory of Testing & Calibration Laboratories",
    desc: "Locate NABL-accredited and BIS government testing facilities by product category, state, and specialized testing scope.",
    sampleQuery: "Find LED lamp testing labs in Maharashtra",
    badge: "Testing Infrastructure",
    previewData: {
      standard: "ISO/IEC 17025 / BIS Lab Recognition Scheme (LRS)",
      title: "National Testing & Calibration Directory",
      committee: "Laboratory Recognition Division (LRD)",
      scheme: "BIS Testing & Certification Network",
      citation: "[S1] Central Laboratory Directory Gazette 2026",
    },
  },
];

const FEATURES = [
  {
    icon: MessageSquare,
    accent: "text-amber-400 bg-amber-950/40 border-amber-800/50",
    title: "Standards Q&A",
    desc: "Direct answers on Indian Standards (IS numbers) grounded strictly in official Bureau catalogues with citation tracking.",
    example: "What does IS 16102 cover?",
    badge: "FR-1",
  },
  {
    icon: Cpu,
    accent: "text-orange-400 bg-orange-950/40 border-orange-800/50",
    title: "Standard Recommender",
    desc: "Describe your product materials and usage to receive ranked applicable Indian Standards and registration schemes.",
    example: "I make LED bulbs. Which standard applies?",
    badge: "FR-2",
  },
  {
    icon: ShieldCheck,
    accent: "text-blue-400 bg-blue-950/40 border-blue-800/50",
    title: "Certification Schemes",
    desc: "Complete guidance for ISI mark, CRS (Electronics), FMCS (Foreign Manufacturers), and Hallmarking compliance pathways.",
    example: "How do I get CRS registration for my power bank?",
    badge: "FR-3 & 4",
  },
  {
    icon: CheckCircle,
    accent: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    title: "Consumer Rights & Complaints",
    desc: "Verify ISI authenticity, understand consumer protections under BIS Act 2016, and access grievance redressal workflows.",
    example: "Is this ISI mark genuine? How do I complain?",
    badge: "FR-5",
  },
  {
    icon: Award,
    accent: "text-amber-400 bg-amber-950/40 border-amber-800/50",
    title: "Hallmark & HUID Verification",
    desc: "Validate 6-character Hallmark Unique Identification (HUID) numbers and gold/silver purity markers in seconds.",
    example: "Verify HUID: AA123456",
    badge: "FR-6",
  },
  {
    icon: FlaskConical,
    accent: "text-cyan-400 bg-cyan-950/40 border-cyan-800/50",
    title: "Accredited Lab Directory",
    desc: "Search over 50+ NABL & BIS-recognized testing laboratories by product category, state, and accreditation level.",
    example: "LED lamp testing labs in Maharashtra",
    badge: "FR-7",
  },
  {
    icon: Languages,
    accent: "text-sky-400 bg-sky-950/40 border-sky-800/50",
    title: "Bilingual English & Hindi",
    desc: "Native Indian language processing via Sarvam AI. Query in Hindi or English and receive answers in your chosen language.",
    example: "मैं LED बल्ब बनाता हूँ, कौन सा IS नंबर लागू होता है?",
    badge: "FR-8",
  },
  {
    icon: Mic,
    accent: "text-blue-400 bg-blue-950/40 border-blue-800/50",
    title: "Voice-First Interaction",
    desc: "Hands-free speech-to-text and text-to-speech engine tailored for Indian accents and terminology.",
    example: "Tap the microphone and ask naturally",
    badge: "FR-9",
  },
  {
    icon: Camera,
    accent: "text-indigo-400 bg-indigo-950/40 border-indigo-800/50",
    title: "Visual Product & HUID Inspection",
    desc: "Upload photos of products to identify standard categories, or photograph jewellery stamps for OCR-based HUID lookup.",
    example: "Upload hallmark stamp or product photo",
    badge: "FR-10",
  },
];

const PERSONAS = [
  {
    label: "MSME & Manufacturers",
    desc: "Identify mandatory Quality Control Orders (QCOs) and applicable IS codes without costly third-party consultants.",
    Icon: Factory,
    prompt: "I manufacture LED bulbs, which standard applies and what licence do I need?",
  },
  {
    label: "Importers & Exporters",
    desc: "Streamline foreign manufacturer FMCS licenses and CRS electronics compliance before customs clearance.",
    Icon: Rocket,
    prompt: "What is the difference between ISI Mark and CRS scheme for electronics?",
  },
  {
    label: "Engineers & Researchers",
    desc: "Access technical committees, testing parameter thresholds, and standard scope summaries instantly.",
    Icon: GraduationCap,
    prompt: "What are the mechanical and chemical testing requirements for IS 269 cement?",
  },
  {
    label: "Citizens & Consumers",
    desc: "Check gold jewellery HUID purity, report substandard ISI-marked goods, and understand citizen rights.",
    Icon: Users,
    prompt: "How do I file a complaint about a fake ISI mark product?",
  },
];

export default function Home() {
  const router = useRouter();
  const [activePreview, setActivePreview] = useState(PREVIEWS[0]);
  const [heroInput, setHeroInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(heroInput.trim())}`);
  };

  const navigateToQuery = (q: string) => {
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100">
      {/* ── Top App Bar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C2410C] flex items-center justify-center text-white font-black text-lg shadow-sm border border-orange-500/30">
              B
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-tight leading-tight">
                BIS Saathi
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Bureau of Indian Standards Advisory
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <Link href="/chat" className="nav-link">
              Chat Assistant
            </Link>
            <Link href="/hallmark" className="nav-link">
              Hallmark & HUID
            </Link>
            <Link href="/labs" className="nav-link">
              Testing Labs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/chat">
              <button className="btn-primary py-2 px-4 text-sm" aria-label="Launch Assistant">
                Launch Assistant
                <ChevronRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section with Live Search ────────────────────────────────── */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Bureau of Indian Standards,{" "}
          <span className="text-orange-500">Authoritatively Answered</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Direct, citation-grounded guidance on Indian Standards (IS), mandatory QCOs,
          certification schemes, gold HUID verification, and accredited laboratories — in English and Hindi.
        </p>

        {/* ── Interactive Instant Query Box ─────────────────────────────── */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto mb-10 p-2 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-3 flex-1 px-4 py-2 w-full">
            <Search size={20} className="text-orange-400 flex-shrink-0" />
            <input
              type="text"
              className="bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none w-full"
              placeholder="Ask an IS number, product compliance, or paste HUID..."
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              aria-label="Direct standards search query"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto py-3 px-6 text-sm justify-center rounded-xl flex-shrink-0"
            disabled={!heroInput.trim()}
          >
            <span>Ask Saathi</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Try querying:</span>
          {[
            "IS 16102 LED lamps",
            "Verify HUID AA123456",
            "Cables testing in Maharashtra",
            "ISI mark vs CRS scheme",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => navigateToQuery(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-orange-500 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3.5 justify-center mb-16">
          <Link href="/chat">
            <button className="btn-primary text-base px-7 py-3" aria-label="Start asking questions">
              <MessageSquare size={18} />
              Open Full Chat
            </button>
          </Link>
          <Link href="/hallmark">
            <button className="btn-ghost text-base px-7 py-3" aria-label="Verify Hallmark HUID">
              <Award size={18} />
              Hallmark Authenticator
            </button>
          </Link>
          <Link href="/labs">
            <button className="btn-ghost text-base px-7 py-3" aria-label="Browse testing laboratories">
              <FlaskConical size={18} />
              Accredited Labs Radar
            </button>
          </Link>
        </div>
      </section>

      {/* ── Live Key Metrics Ticker ──────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-[#0F172A]/70 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <div key={i} className="px-3">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1 font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Feature Showcase ─────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How BIS Saathi Works
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Switch tabs below to inspect how the multi-agent system cross-references authentic Bureau registers.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist">
          {PREVIEWS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activePreview.id === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActivePreview(tab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  isSelected
                    ? "bg-[#C2410C] text-white border-orange-500 shadow-lg"
                    : "bg-[#0F172A] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Showcase Card */}
        <div className="bis-panel p-8 bg-[#0F172A] border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-orange-950/60 border border-orange-800/60 text-orange-400">
              {activePreview.badge}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {activePreview.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activePreview.desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateToQuery(activePreview.sampleQuery)}
                className="btn-primary text-xs py-2 px-4 rounded-lg"
              >
                <span>Run Demonstration: &ldquo;{activePreview.sampleQuery}&rdquo;</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Interactive Mock Terminal / Card Display */}
          <div className="lg:col-span-6 bg-[#090D16] border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400 uppercase tracking-widest text-[11px]">
                Active Register Record
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <span className="text-slate-400">Code / Standard:</span>
              <p className="text-white font-bold mt-0.5">{activePreview.previewData.standard}</p>
            </div>
            <div>
              <span className="text-slate-400">Title / Subject:</span>
              <p className="text-slate-200 mt-0.5">{activePreview.previewData.title}</p>
            </div>
            <div>
              <span className="text-slate-400">Governance Committee:</span>
              <p className="text-slate-200 mt-0.5">{activePreview.previewData.committee}</p>
            </div>
            <div>
              <span className="text-slate-400">Regulatory Framework:</span>
              <p className="text-slate-200 mt-0.5">{activePreview.previewData.scheme}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-orange-400 flex items-center gap-1.5">
              <CheckCircle size={13} />
              <span>{activePreview.previewData.citation}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Audience Segment Cards ───────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tailored For Every Stakeholder
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Select your category to explore direct compliance answers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERSONAS.map((p) => {
            const Icon = p.Icon;
            return (
              <div
                key={p.label}
                onClick={() => navigateToQuery(p.prompt)}
                className="bis-panel-interactive p-5 bg-[#0F172A] border border-slate-800 flex flex-col justify-between cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigateToQuery(p.prompt);
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-orange-400 mb-3.5 group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">
                    {p.label}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs font-semibold text-orange-400 flex items-center gap-1">
                  <span>Inquire now</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Complete Capabilities Grid ───────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              All 10 PS-Mandated Tier-1 Modules
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              End-to-end multi-agent pipeline with deterministic citation grounding.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hidden sm:inline-block">
            SIH Problem Statement 26107
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.badge}
                className="bis-panel-interactive p-5 flex flex-col justify-between cursor-pointer group"
                onClick={() => navigateToQuery(f.example)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigateToQuery(f.example);
                }}
                aria-label={`${f.title}: ${f.example}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${f.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {f.desc}
                  </p>
                </div>

                <div>
                  <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
                    <span className="truncate italic max-w-[200px] text-slate-400">
                      &ldquo;{f.example}&rdquo;
                    </span>
                    <span className="text-orange-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      Ask <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Institutional Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#0A0E1A] py-12 px-6 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200">
              BIS Saathi — Bureau of Indian Standards AI Advisory Platform
            </p>
            <p className="text-slate-400 mt-1">
              Developed for Smart India Hackathon (SIH 26107). Built upon official Bureau of Indian Standards catalogues.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-slate-400 font-medium">
            <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              <span>bis.gov.in</span>
              <ExternalLink size={12} />
            </a>
            <a href="tel:1800114000" className="hover:text-white">
              Toll-Free Helpline: 1800-11-4000
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
