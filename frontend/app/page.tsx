"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Shield,
  FlaskConical,
  Stamp,
  Mic,
  Camera,
  Globe,
  ChevronRight,
  Star,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    color: "from-orange-500 to-amber-500",
    title: "Standards Q&A",
    desc: "Ask any question about Indian Standards (IS numbers) — get cited, grounded answers instantly.",
    example: "What does IS 16102 cover?",
    badge: "FR-1",
  },
  {
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    title: "Standard Recommender",
    desc: "Describe your product — get ranked IS numbers with rationale and the right BIS scheme.",
    example: "I make LED bulbs. Which standard applies?",
    badge: "FR-2",
  },
  {
    icon: Shield,
    color: "from-blue-500 to-indigo-500",
    title: "Certification Guidance",
    desc: "ISI, CRS, FMCS, Hallmarking — know exactly which scheme applies, with step-by-step process.",
    example: "How do I get CRS registration for my power bank?",
    badge: "FR-3 & 4",
  },
  {
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    title: "Consumer Help",
    desc: "Verify ISI marks, understand consumer rights under BIS Act 2016, file complaints.",
    example: "Is this ISI mark genuine? How do I complain?",
    badge: "FR-5",
  },
  {
    icon: Stamp,
    color: "from-purple-500 to-pink-500",
    title: "Hallmark Verification",
    desc: "Verify HUID authenticity, understand gold purity marks, register as AHC jeweller.",
    example: "Verify HUID: AA123456",
    badge: "FR-6",
  },
  {
    icon: FlaskConical,
    color: "from-teal-500 to-cyan-500",
    title: "Lab Finder",
    desc: "Find BIS-recognized testing labs near you by product category and state.",
    example: "LED lamp testing labs in Maharashtra",
    badge: "FR-7",
  },
  {
    icon: Globe,
    color: "from-rose-500 to-red-500",
    title: "Multilingual (EN/HI)",
    desc: "Full support for English and Hindi. Ask in Hindi, get answers in Hindi.",
    example: "मैं LED बल्ब बनाता हूँ, कौन सा IS नंबर लागू होता है?",
    badge: "FR-8",
  },
  {
    icon: Mic,
    color: "from-fuchsia-500 to-purple-500",
    title: "Voice Input/Output",
    desc: "Speak your question, hear the answer. Works in English and Hindi via Sarvam AI.",
    example: "Just tap the mic and ask!",
    badge: "FR-9",
  },
  {
    icon: Camera,
    color: "from-sky-500 to-blue-500",
    title: "Photo Verification",
    desc: "Photograph a product for standard recommendation, or hallmark stamp for HUID verification.",
    example: "Point camera at any product or hallmark stamp",
    badge: "FR-10",
  },
];

const PERSONAS = [
  { label: "MSME Owner", desc: "Get the right IS code for your product on the first try", icon: "🏭" },
  { label: "Startup / Exporter", desc: "Navigate ISI, CRS, FMCS certification without a consultant", icon: "🚀" },
  { label: "Student / Researcher", desc: "Understand standards, committees, and scope — instantly", icon: "🎓" },
  { label: "Consumer", desc: "Verify hallmarks, file complaints, know your rights", icon: "🛡️" },
];

const EXAMPLE_QUERIES = [
  "I manufacture LED bulbs, which standard applies and what licence do I need?",
  "What is the difference between ISI Mark and CRS?",
  "Verify HUID AA123456",
  "Find testing labs for pressure cookers in Mumbai",
  "मैं सीमेंट का निर्माण करता हूँ, कौन सा IS नंबर है?",
  "How do I file a complaint about a fake ISI mark?",
];

export default function Home() {
  const router = useRouter();

  const handleExampleQuery = (query: string) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-grid bg-radial-saffron relative overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,82,165,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10, 12, 15, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C38)" }}
          >
            B
          </div>
          <div>
            <div className="text-white font-bold text-base leading-none">BIS Saathi</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              AI Assistant for Indian Standards
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/chat" className="nav-link">Chat</Link>
          <Link href="/hallmark" className="nav-link">Hallmark</Link>
          <Link href="/labs" className="nav-link">Labs</Link>
        </div>

        <Link href="/chat">
          <button className="btn-primary py-2 px-4 text-sm">
            Start Chat
            <ChevronRight size={14} />
          </button>
        </Link>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{
            background: "rgba(255, 107, 0, 0.1)",
            border: "1px solid rgba(255, 107, 0, 0.25)",
            color: "var(--saffron-light)",
          }}
        >
          <Star size={14} />
          <span>10 Tier-1 Features • Real BIS Data • Free for MSMEs</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="gradient-text">BIS Standards,</span>
          <br />
          <span className="text-white">Instantly Answered</span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Ask in text, voice, or photo. Get cited, grounded answers on Indian Standards,
          BIS certification, hallmarking and testing labs — in English or Hindi.
          No consultant needed.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link href="/chat">
            <button className="btn-primary text-base px-8 py-3 glow-saffron">
              <MessageSquare size={18} />
              Start Chatting — Free
            </button>
          </Link>
          <Link href="/hallmark">
            <button className="btn-ghost text-base px-8 py-3">
              <Stamp size={18} />
              Verify Hallmark
            </button>
          </Link>
        </div>

        {/* Example queries */}
        <div>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Try these example queries:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleExampleQuery(q)}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "var(--saffron)";
                  (e.target as HTMLButtonElement).style.color = "var(--saffron-light)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.target as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                {q.length > 50 ? q.slice(0, 50) + "…" : q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personas ───────────────────────────────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {PERSONAS.map((p) => (
            <div key={p.label} className="glass text-center p-5 hover:border-orange-500/30 transition-all">
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="text-sm font-semibold text-white mb-1">{p.label}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              All 10 Tier-1 Features
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Every PS-mandated capability, fully working end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.badge}
                  className="feature-card group"
                  onClick={() => handleExampleQuery(f.example)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{f.title}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--surface-3)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {f.badge}
                        </span>
                      </div>
                      <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                        {f.desc}
                      </p>
                      <div
                        className="text-xs italic px-3 py-2 rounded-lg"
                        style={{
                          background: "var(--surface-3)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        "{f.example}"
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--saffron-light)" }}
                  >
                    Try this example <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-8 px-6 text-center"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-sm">
          BIS Saathi — Built for SIH Problem Statement 26107 |{" "}
          <span style={{ color: "var(--saffron-light)" }}>Bureau of Indian Standards</span>
        </p>
        <p className="text-xs mt-2">
          This is informational guidance only. Verify with your nearest BIS office for certification decisions.
        </p>
      </footer>
    </div>
  );
}
