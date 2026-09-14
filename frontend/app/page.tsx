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
  ArrowRight,
  Factory,
  Rocket,
  GraduationCap,
  Users,
  Search,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
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
  },
  {
    href: "/schemes",
    title: "Certification Schemes",
    desc: "Eligibility wizard, checklists, and fee concession guides for ISI, CRS, and FMCS.",
    icon: Award,
    badge: "Licensing",
  },
  {
    href: "/hallmark",
    title: "Hallmark & HUID",
    desc: "Verify 6-character HUID jewellery codes, gold fineness calculator, and assaying rules.",
    icon: Award,
    badge: "Assaying",
  },
  {
    href: "/labs",
    title: "Testing Labs Directory",
    desc: "Locate NABL and BIS-accredited testing facilities by product category and state.",
    icon: FlaskConical,
    badge: "Laboratories",
  },
  {
    href: "/consumer",
    title: "Consumer Grievances",
    desc: "Verify genuine ISI marks, spot fake imprints, and file statutory complaints.",
    icon: ShieldAlert,
    badge: "Enforcement",
  },
  {
    href: "/chat",
    title: "Guided Chat Assistant",
    desc: "Consult our multi-agent AI engine with text, voice, or photo in English, Hindi, or Tamil.",
    icon: MessageSquare,
    badge: "Maanak AI",
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
    label: "Hallmark & HUID",
    icon: Award,
    title: "Gold & Silver Jewellery Authentication",
    desc: "Verify 6-character alphanumeric HUID stamps against BIS central registries. Calculate exact purity fineness from 24K down to 9K.",
    sampleQuery: "Verify hallmark HUID AA123456",
    badge: "National Registry",
    previewData: {
      standard: "IS 1417: 2016 (Gold Purity Grading)",
      title: "Hallmark Unique Identification (HUID) Verification",
      committee: "Gold & Silver Jewellery Assaying Council",
      scheme: "Mandatory Hallmarking Order 2021",
      citation: "[S1] Central Hallmarking Register Entry AH-DEL-2024-916",
    },
  },
  {
    id: "labs",
    label: "Laboratory Radar",
    icon: FlaskConical,
    title: "Authorized Conformity Testing Facilities",
    desc: "Locate accredited laboratories recognized under the Laboratory Recognition Scheme (LRS) to run mandatory product batch inspections.",
    sampleQuery: "Where can I test wires and cables in Maharashtra?",
    badge: "Accredited Testing",
    previewData: {
      standard: "IS 694: 2010 (PVC Insulated Cables)",
      title: "Central Laboratory Western Region (CLWR)",
      committee: "Laboratory Recognition Scheme (LRS)",
      scheme: "NABL & BIS Recognized Testing Facility",
      citation: "[S1] Bureau Directory of Recognized Laboratories 2024-25",
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
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-body)] flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-16">
        {/* ── Hero Section with Maanak Saathi Official Brand ─────────────── */}
        <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--blue-50)] border border-[var(--blue-200)] text-[var(--blue-700)] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--red-500)] animate-pulse" />
            <span>Maanak Saathi (मानक साथी) • Bureau of Indian Standards</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--color-text-primary)] leading-tight">
            National Standards Intelligence,{" "}
            <span className="text-[var(--blue-600)]">Authoritatively Grounded</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed font-normal">
            Direct, citation-grounded advisory on 22,000+ Indian Standards (IS), mandatory QCOs,
            certification schemes, gold HUID verification, and accredited laboratories.
          </p>

          {/* ── Interactive Instant Query Box ───────────────────────────── */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto p-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 flex-1 px-4 py-2 w-full">
              <Search size={20} className="text-[var(--blue-600)] flex-shrink-0" />
              <input
                type="text"
                className="bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm sm:text-base outline-none w-full"
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

          {/* Quick query chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--color-text-muted)] pt-1">
            <span className="font-semibold text-[var(--color-text-primary)]">Quick Inquiries:</span>
            {[
              "IS 16102 LED Lamps",
              "How to get ISI mark",
              "Verify HUID AA123456",
              "QCO on Footwear",
              "Electronics CRS Scheme",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => navigateToQuery(chip)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--blue-400)] hover:text-[var(--blue-600)] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* ── Platform Metrics ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div key={i} className="bis-panel p-6 text-center">
                <div className="text-3xl sm:text-4xl font-black text-[var(--blue-600)] mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mb-0.5">{stat.label}</div>
                <div className="text-[11px] text-[var(--color-text-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Direct Multi-Page Portal Modules ──────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] mb-2 tracking-tight">
              Specialized Compliance Portals
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Direct access to tools for manufacturers, importers, consumers, and accredited testing labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIRECT_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.href} href={mod.href} className="block group">
                  <div className="bis-panel-interactive p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--blue-50)] text-[var(--blue-600)] flex items-center justify-center">
                          <Icon size={20} />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                          {mod.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--blue-600)] transition-colors mb-2">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{mod.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--blue-600)]">
                      <span>Open Tool</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── User Persona Entry Points ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] mb-2 tracking-tight">
              Tailored Guidance by User Role
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Maanak Saathi adapts terminology and recommendations depending on your specific compliance objective.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAS.map((p) => {
              const Icon = p.Icon;
              return (
                <div
                  key={p.label}
                  onClick={() => navigateToQuery(p.prompt)}
                  className="bis-panel p-5 cursor-pointer hover:border-[var(--blue-400)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[var(--blue-50)] text-[var(--blue-600)] flex items-center justify-center mb-3">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--blue-600)] transition-colors mb-1.5">
                      {p.label}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center gap-1.5 text-xs font-semibold text-[var(--blue-600)]">
                    <span>Ask this query</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Interactive Domain Demonstrator ───────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 space-y-6 pb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] mb-2 tracking-tight">
              Authoritative Citations &amp; Grounded RAG
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Every assertion references gazette notifications, Quality Control Orders, or standard clauses.
            </p>
          </div>

          <div className="bis-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap gap-2 pb-4 border-b border-[var(--color-border)]">
              {PREVIEWS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activePreview.id === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePreview(tab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-[var(--blue-600)] border-[var(--blue-600)] text-white shadow-xs"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--blue-50)] text-[var(--blue-700)] border border-[var(--blue-200)]">
                  {activePreview.badge}
                </span>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{activePreview.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">{activePreview.desc}</p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateToQuery(activePreview.sampleQuery)}
                    className="btn-primary py-2.5 px-4 text-xs rounded-lg"
                  >
                    <span>Run Query: &quot;{activePreview.sampleQuery}&quot;</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[var(--color-success)]" />
                    <span>Authoritative Registry Output</span>
                  </span>
                  <span className="text-[11px] font-mono text-[var(--blue-600)]">SIH-PS-26107</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[var(--color-text-muted)]">Standard: </span>
                    <span className="font-mono font-bold text-[var(--color-text-primary)]">
                      {activePreview.previewData.standard}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)]">Subject: </span>
                    <span className="text-[var(--color-text-primary)]">{activePreview.previewData.title}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)]">Committee: </span>
                    <span className="text-[var(--color-text-primary)]">{activePreview.previewData.committee}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)]">Mandate: </span>
                    <span className="text-[var(--color-text-primary)]">{activePreview.previewData.scheme}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--blue-700)] flex items-center justify-between">
                  <span>{activePreview.previewData.citation}</span>
                  <ExternalLink size={11} className="text-[var(--blue-600)]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
