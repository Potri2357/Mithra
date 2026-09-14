"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MessageSquare,
  FlaskConical,
  Award,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Factory,
  Rocket,
  GraduationCap,
  Users,
  Search,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

const STATS = [
  { value: "22,000+", label: "Active Indian Standards (IS)", sub: "Catalogued in database" },
  { value: "1,500+", label: "Mandatory QCO Products", sub: "Under ISI & CRS schemes" },
  { value: "50+", label: "Accredited Testing Labs", sub: "NABL & BIS-recognized" },
  { value: "100%", label: "Citation Grounding", sub: "Zero ungrounded hallucinations" },
];

const DIRECT_MODULES = [
  {
    href: "/standards",
    title: "Standards Catalogue",
    desc: "Browse 22,000+ Indian Standards (IS), mandatory QCOs, and technical committees.",
    icon: BookOpen,
    badge: "Catalogue",
    accent: "text-blue-400 bg-blue-950/60 border-blue-800/60",
  },
  {
    href: "/schemes",
    title: "Certification Schemes",
    desc: "Eligibility wizard, checklists, and fee concession guides for ISI, CRS, and FMCS.",
    icon: Award,
    badge: "Licensing",
    accent: "text-blue-400 bg-blue-950/60 border-blue-800/60",
  },
  {
    href: "/hallmark",
    title: "Hallmark & HUID",
    desc: "Verify 6-character HUID jewellery codes, gold fineness calculator, and assaying rules.",
    icon: Award,
    badge: "Assaying",
    accent: "text-red-400 bg-red-950/60 border-red-800/60",
  },
  {
    href: "/labs",
    title: "Testing Labs Directory",
    desc: "Locate NABL and BIS-accredited testing facilities by product category and state.",
    icon: FlaskConical,
    badge: "Laboratories",
    accent: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60",
  },
  {
    href: "/consumer",
    title: "Consumer Grievances",
    desc: "Verify genuine ISI marks, spot fake imprints, and file statutory complaints.",
    icon: ShieldAlert,
    badge: "Enforcement",
    accent: "text-red-400 bg-red-950/60 border-red-800/60",
  },
  {
    href: "/chat",
    title: "AI Saathi Assistant",
    desc: "Consult our multi-agent AI engine with text, voice, or photo in English and Hindi.",
    icon: MessageSquare,
    badge: "GenAI RAG",
    accent: "text-blue-400 bg-blue-950/60 border-blue-800/60",
  },
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
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-16">
        {/* ── Hero Section with BIS Official Logo & Colors ──────────────── */}
        <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EC171F] animate-pulse" />
            <span>Bureau of Indian Standards • SIH Problem Statement 26107</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            National Standards Advisory,{" "}
            <span className="text-[#024DA1]">Authoritatively Delivered</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Direct, citation-grounded intelligence on Indian Standards (IS), mandatory QCOs,
            certification schemes, gold HUID verification, and accredited laboratories — in English and Hindi.
          </p>

          {/* ── Interactive Instant Query Box ───────────────────────────── */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto p-2 rounded-2xl bg-[#0B1324] border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 flex-1 px-4 py-2 w-full">
              <Search size={20} className="text-blue-400 flex-shrink-0" />
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

          {/* Quick Query Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Frequent Inquiries:</span>
            {[
              "IS 16102 LED lamps",
              "Verify HUID AA123456",
              "Cables testing in Maharashtra",
              "ISI mark vs CRS scheme",
              "Fake ISI complaint procedure",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => navigateToQuery(prompt)}
                className="px-3 py-1.5 rounded-full bg-[#0B1324] border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        {/* ── Multi-Page Navigation Grid ─────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-black text-white">
                Explore Dedicated Service Modules
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access specialized tools tailored for manufacturers, exporters, labs, and consumers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIRECT_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="bis-panel p-6 bg-[#0B1324] border border-slate-800 hover:border-blue-600/70 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${mod.accent}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>Open Module</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Live Key Metrics Ticker ────────────────────────────────────── */}
        <section className="border-y border-slate-800 bg-[#0B1324]/80 py-10 px-6">
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

        {/* ── Interactive Feature Showcase ───────────────────────────────── */}
        <section className="py-8 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Referencing Bureau Registers
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              How the multi-agent system verifies official specifications without ungrounded speculation.
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
                      ? "bg-[#024DA1] text-white border-blue-500 shadow-lg"
                      : "bg-[#0B1324] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Showcase Card */}
          <div className="bis-panel p-8 bg-[#0B1324] border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400">
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
            <div className="lg:col-span-6 bg-[#060B14] border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400 uppercase tracking-widest text-[11px]">
                  Official Bureau Record
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
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-blue-400 flex items-center gap-1.5">
                <CheckCircle size={13} />
                <span>{activePreview.previewData.citation}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Audience Segment Cards ─────────────────────────────────────── */}
        <section className="py-12 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
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
                  className="bis-panel-interactive p-5 bg-[#0B1324] border border-slate-800 flex flex-col justify-between cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigateToQuery(p.prompt);
                  }}
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-3.5 group-hover:scale-105 transition-transform">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                      {p.label}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <span>Inquire now</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
