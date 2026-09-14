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
} from "lucide-react";

const DIRECT_MODULES = [
  {
    href: "/standards",
    title: "Standards Catalogue",
    desc: "Browse 22,000+ Indian Standards (IS), mandatory QCOs, and technical committees.",
    icon: BookOpen,
    iconBoxClass: "bg-blue-50 text-[#024DA1] border border-blue-100",
  },
  {
    href: "/schemes",
    title: "Certification Schemes",
    desc: "Eligibility wizard, checklists, and fee concession guides for ISI, CRS, and FMCS.",
    icon: FileText,
    iconBoxClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    href: "/hallmark",
    title: "Hallmark & HUID",
    desc: "Verify 6-character HUID jewellery codes, gold fineness calculator, and assaying rules.",
    icon: Award,
    iconBoxClass: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  {
    href: "/labs",
    title: "Testing Labs Directory",
    desc: "Locate NABL and BIS-accredited testing facilities by product category and state.",
    icon: FlaskConical,
    iconBoxClass: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  {
    href: "/consumer",
    title: "Consumer Grievances",
    desc: "Verify genuine ISI marks, spot fake imprints, and file statutory complaints.",
    icon: ShieldAlert,
    iconBoxClass: "bg-red-50 text-red-600 border border-red-100",
  },
  {
    href: "/chat",
    title: "Guided Chat Assistant",
    desc: "Consult our multi-agent AI engine with text, voice, or photo in English, Hindi, or Tamil.",
    icon: MessageSquare,
    iconBoxClass: "bg-cyan-50 text-cyan-600 border border-cyan-100",
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
  },
  {
    id: "hallmark",
    label: "Hallmark & HUID",
    icon: Award,
    title: "Gold & Silver Jewellery Authentication",
    desc: "Verify 6-character alphanumeric HUID stamps against BIS central registries. Calculate exact purity fineness from 24K down to 9K.",
    sampleQuery: "Verify hallmark HUID AA123456",
  },
  {
    id: "labs",
    label: "Laboratory Radar",
    icon: FlaskConical,
    title: "Authorized Conformity Testing Facilities",
    desc: "Locate accredited laboratories recognized under the Laboratory Recognition Scheme (LRS) to run mandatory product batch inspections.",
    sampleQuery: "Where can I test wires and cables in Maharashtra?",
  },
];

const PERSONAS = [
  {
    label: "MSME & Manufacturers",
    desc: "Identify mandatory QCOs and applicable IS codes without costly third-party consultants.",
    Icon: Factory,
    prompt: "I manufacture LED bulbs, which standard applies and what licence do I need?",
  },
  {
    label: "Importers & Exporters",
    desc: "Streamline FMCS licenses and CRS electronics compliance before customs clearance.",
    Icon: Ship,
    prompt: "What is the difference between ISI Mark and CRS scheme for electronics?",
  },
  {
    label: "Engineers & Researchers",
    desc: "Access technical committees, testing parameter thresholds, and standard summaries instantly.",
    Icon: GraduationCap,
    prompt: "What are the mechanical and chemical testing requirements for IS 269 cement?",
  },
  {
    label: "Citizens & Consumers",
    desc: "Check gold jewellery HUID purity, report substandard goods, and understand citizen rights.",
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 space-y-10 pb-16">
        {/* ── Hero Section (Split Layout matching Reference Image) ───────── */}
        <section className="bg-gradient-to-r from-[#EFF6FF]/60 via-[#F8FAFC] to-white border-b border-slate-200/70 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Eyebrow, Heading, Description, Search, Quick Queries */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase block">
                STANDARDS FOR A SAFER, STRONGER, BRIGHTER INDIA
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                National Standards Intelligence, <br />
                <span className="text-[#024DA1]">Authoritatively Grounded</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Direct, citation-grounded advisory on 22,000+ Indian Standards (IS), mandatory QCOs,
                certification schemes, gold HUID verification, and accredited laboratories.
              </p>

              {/* Pill Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl bg-white border border-slate-200/90 rounded-full p-1.5 pl-4 shadow-sm shadow-slate-200/60 flex items-center gap-2"
              >
                <Search size={16} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  placeholder="Ask an IS number, product compliance, or paste HUID..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 flex-shrink-0 transition-colors"
                >
                  <span>Ask Mithra</span>
                  <ArrowRight size={13} />
                </button>
              </form>

              {/* Quick queries row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                <span className="text-[11px] font-bold text-slate-700 mr-1">Quick Queries:</span>
                {[
                  "IS 16102",
                  "LED Lamps",
                  "How to get ISI mark",
                  "Verify HUID AA123456",
                  "QCO on Footwear",
                  "Electronics CRS Scheme",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => navigateToQuery(chip)}
                    className="bg-white border border-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full hover:border-blue-400 hover:text-[#024DA1] transition-colors shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Bureau of Indian Standards Headquarters Building */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-end">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 max-w-[420px] bg-white">
                <Image
                  src="/bis_building.jpg"
                  alt="Bureau of Indian Standards Building with Indian Flag"
                  width={430}
                  height={240}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats 4-Cards Row ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#024DA1] border border-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 leading-tight">22,000+</div>
                <div className="text-xs font-bold text-slate-800 leading-snug">Active Indian Standards (IS)</div>
                <div className="text-[11px] text-slate-500">Catalogued in database</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 leading-tight">1,500+</div>
                <div className="text-xs font-bold text-slate-800 leading-snug">Mandatory QCO Products</div>
                <div className="text-[11px] text-slate-500">Under ISI &amp; CRS schemes</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                <FlaskConical size={20} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 leading-tight">50+</div>
                <div className="text-xs font-bold text-slate-800 leading-snug">Accredited Testing Labs</div>
                <div className="text-[11px] text-slate-500">NABL &amp; BIS-recognized</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 leading-tight">100%</div>
                <div className="text-xs font-bold text-slate-800 leading-snug">Citation Grounding</div>
                <div className="text-[11px] text-slate-500">Zero ungrounded hallucinations</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Specialized Compliance Portals (6 Cards) ──────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Specialized Compliance Portals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct access to tools for manufacturers, importers, consumers, and accredited testing labs.
              </p>
            </div>
            <Link
              href="/standards"
              className="text-xs font-bold text-[#024DA1] hover:underline flex items-center gap-1 flex-shrink-0"
            >
              <span>View All Tools</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {DIRECT_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.href} href={mod.href} className="block group">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 h-full flex flex-col justify-between shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all">
                    <div>
                      <div className={`w-10 h-10 rounded-xl ${mod.iconBoxClass} flex items-center justify-center mb-3`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mb-1 leading-snug group-hover:text-[#024DA1] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-[#024DA1] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Open Tool</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Tailored Guidance by User Role (4 Cards) ──────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Tailored Guidance by User Role
            </h2>
            <p className="text-xs text-slate-500">
              Mithra adapts terminology and recommendations depending on your specific compliance objective.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAS.map((p) => {
              const Icon = p.Icon;
              return (
                <div
                  key={p.label}
                  onClick={() => navigateToQuery(p.prompt)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#024DA1] border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-[#024DA1] transition-colors">
                      {p.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                      {p.desc}
                    </p>
                    <div className="text-xs font-bold text-[#024DA1] flex items-center gap-1">
                      <span>Ask this query</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Authoritative Citations & Grounded RAG ─────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Authoritative Citations &amp; Grounded RAG
              </h2>
              <p className="text-xs text-slate-500">
                Every assertion references gazette notifications, Quality Control Orders, or standard clauses.
              </p>
            </div>
            <button
              onClick={() => navigateToQuery("Show sample BIS citations and gazette references")}
              className="text-xs font-bold text-[#024DA1] bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <span>View Sample Queries</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            {/* Tabs Row */}
            <div className="flex flex-wrap items-center gap-2">
              {PREVIEWS.map((tab) => {
                const isSelected = activePreview.id === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePreview(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#024DA1] text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {activePreview.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activePreview.desc}
                </p>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => navigateToQuery(activePreview.sampleQuery)}
                  className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                >
                  <span>Run Query: &quot;{activePreview.sampleQuery}&quot;</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
