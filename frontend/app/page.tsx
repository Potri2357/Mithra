"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MessageSquare,
  FlaskConical,
  Award,
  ArrowRight,
  Factory,
  Ship,
  GraduationCap,
  Users,
  Search,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";

const DIRECT_MODULES = [
  {
    href: "/standards",
    title: "Standards Catalogue",
    desc: "Browse 22,000+ Indian Standards, mandatory QCOs, and technical committees.",
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-[#024DA1]",
    accentColor: "#024DA1",
  },
  {
    href: "/schemes",
    title: "Certification Schemes",
    desc: "Eligibility wizard, checklists, and fee guides for ISI, CRS, and FMCS.",
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "#059669",
  },
  {
    href: "/hallmark",
    title: "Hallmark & HUID",
    desc: "Verify 6-character HUID jewellery codes, gold fineness calculator.",
    icon: Award,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentColor: "#D97706",
  },
  {
    href: "/labs",
    title: "Testing Labs Directory",
    desc: "Locate NABL and BIS-accredited testing facilities by state.",
    icon: FlaskConical,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    accentColor: "#7C3AED",
  },
  {
    href: "/consumer",
    title: "Consumer Grievances",
    desc: "Verify genuine ISI marks, spot fakes, and file statutory complaints.",
    icon: ShieldAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    accentColor: "#DC2626",
  },
  {
    href: "/chat",
    title: "AI Chat Assistant",
    desc: "Consult our AI engine with text, voice, or photo in English, Hindi, or Tamil.",
    icon: MessageSquare,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accentColor: "#0891B2",
  },
];

const PERSONAS = [
  {
    label: "MSME & Manufacturers",
    desc: "Identify mandatory QCOs and applicable IS codes without costly consultants.",
    Icon: Factory,
    color: "text-blue-600",
    bg: "bg-blue-50",
    prompt: "I manufacture LED bulbs, which standard applies and what licence do I need?",
  },
  {
    label: "Importers & Exporters",
    desc: "Streamline FMCS licenses and CRS electronics compliance before customs.",
    Icon: Ship,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    prompt: "What is the difference between ISI Mark and CRS scheme for electronics?",
  },
  {
    label: "Engineers & Researchers",
    desc: "Access technical committees, testing thresholds, and standard summaries instantly.",
    Icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    prompt: "What are the mechanical and chemical testing requirements for IS 269 cement?",
  },
  {
    label: "Citizens & Consumers",
    desc: "Check gold jewellery HUID purity, report substandard goods, know your rights.",
    Icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
    prompt: "How do I file a complaint about a fake ISI mark product?",
  },
];

const STATS = [
  { value: "22,000+", label: "Active Indian Standards", sub: "Catalogued in database", icon: BookOpen, iconBg: "bg-blue-50", iconColor: "text-[#024DA1]" },
  { value: "1,500+", label: "Mandatory QCO Products", sub: "Under ISI & CRS schemes", icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { value: "50+", label: "Accredited Testing Labs", sub: "NABL & BIS-recognized", icon: FlaskConical, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { value: "100%", label: "Citation Grounding", sub: "Zero ungrounded hallucinations", icon: Star, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
];

const QUICK_CHIPS = [
  "IS 16102 — LED Lamps",
  "How to get ISI mark",
  "Verify HUID AA123456",
  "QCO on Footwear",
  "Electronics CRS Scheme",
  "IS 694 — Wires & Cables",
];

export default function Home() {
  const router = useRouter();
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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────────────────────────── */}
        <section className="hero-gradient border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-7 animate-fade-up">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#EC171F] animate-pulse" />
                <span className="text-xs font-semibold text-slate-600 tracking-wide">
                  National Standards Intelligence Platform
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Instant Guidance on{" "}
                  <br className="hidden sm:block" />
                  <span className="text-[#024DA1]">Indian Standards</span> &{" "}
                  <br className="hidden sm:block" />
                  <span className="text-[#EC171F]">BIS Compliance</span>
                </h1>
                <p className="mt-4 text-base text-slate-500 leading-relaxed max-w-lg">
                  Citation-grounded advisory on 22,000+ IS codes, mandatory QCOs, certification
                  schemes, HUID gold verification, and accredited laboratories.
                </p>
              </div>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white border border-slate-200 rounded-2xl p-2 pl-5 shadow-sm flex items-center gap-3 max-w-xl group focus-within:border-[#024DA1] focus-within:shadow-blue-sm transition-all duration-200"
              >
                <Search size={16} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  placeholder="Ask about an IS number, certification, or HUID..."
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none py-1.5"
                />
                <button
                  type="submit"
                  className="btn-primary rounded-xl text-sm px-5 min-h-[40px] flex-shrink-0"
                >
                  <span>Ask Mithra</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-500 self-center mr-1">Try:</span>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => navigateToQuery(chip)}
                    className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full hover:border-[#024DA1] hover:text-[#024DA1] hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — BIS Building */}
            <div className="hidden lg:flex items-center justify-center animate-fade-up stagger-2">
              <div className="relative w-full max-w-[460px]">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-100 to-transparent opacity-60" />
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-white/80 bg-white">
                  <Image
                    src="/bis_building.jpg"
                    alt="Bureau of Indian Standards Headquarters, New Delhi"
                    width={460}
                    height={280}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-5 py-4">
                    <p className="text-white text-xs font-medium opacity-90">
                      Manak Bhavan, 9 B.S. Zafar Marg, New Delhi — BIS Headquarters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`bg-white px-6 py-6 flex items-center gap-4 animate-fade-up`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="stat-number">{stat.value}</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{stat.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COMPLIANCE PORTALS ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-overline text-[#024DA1] mb-2">DIRECT TOOLS</p>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Specialized Compliance Portals
              </h2>
              <p className="text-slate-500 text-sm mt-1.5 max-w-lg">
                Direct access to tools for manufacturers, importers, consumers, and testing labs.
              </p>
            </div>
            <Link
              href="/standards"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#024DA1] hover:underline flex-shrink-0 ml-4"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIRECT_MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.href} href={mod.href} className="block group animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="card-interactive h-full p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-xl ${mod.iconBg} ${mod.iconColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#024DA1] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                    <div
                      className="mt-auto text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: mod.accentColor }}
                    >
                      <span>Open Tool</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── WHO IS MITHRA FOR ────────────────────────────────────────────────── */}
        <section className="bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="text-center mb-10">
              <p className="text-overline text-[#EC171F] mb-2">TAILORED GUIDANCE</p>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Who is Mithra for?
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                Mithra adapts its responses and terminology to your specific compliance objective.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PERSONAS.map((p, i) => {
                const Icon = p.Icon;
                return (
                  <button
                    key={p.label}
                    onClick={() => navigateToQuery(p.prompt)}
                    className="card-interactive text-left p-6 flex flex-col gap-4 group animate-fade-up"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={`w-11 h-11 rounded-xl ${p.bg} ${p.color} flex items-center justify-center`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-[#024DA1] transition-colors">
                        {p.label}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                    <div className="mt-auto text-xs font-bold text-[#024DA1] flex items-center gap-1 group-hover:gap-2 transition-all opacity-0 group-hover:opacity-100">
                      <Sparkles size={11} />
                      <span>Ask this query</span>
                      <ArrowRight size={11} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="relative overflow-hidden rounded-3xl bg-[#024DA1] px-8 sm:px-12 py-12 sm:py-14 text-white">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#EC171F]/10" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-4">
                  <Sparkles size={12} />
                  <span>AI-Powered · Citation-Grounded · Multilingual</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Ready to verify a standard or certification?
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Ask Mithra any question about Indian Standards, certification schemes, HUID gold
                  verification, or accredited labs — in English, Hindi, or Tamil.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#024DA1] text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <MessageSquare size={16} />
                  <span>Open Mithra Chat</span>
                </Link>
                <Link
                  href="/standards"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-transparent text-white border border-white/30 text-sm font-semibold hover:bg-white/10 transition-all"
                >
                  <BookOpen size={16} />
                  <span>Browse Standards</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
