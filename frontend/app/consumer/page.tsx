import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldAlert,
  Phone,
  Mail,
  ChevronRight,
  Gavel,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function ConsumerPage() {

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-semibold">
            <ShieldAlert size={14} />
            <span>Citizen Rights &amp; Grievance Redressal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Consumer Protection <span className="text-[#EC171F]">&amp; Grievance Portal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Verify ISI mark authenticity, report counterfeit certification stamps or substandard goods,
            and understand your statutory rights under the Bureau of Indian Standards Act 2016.
          </p>
        </div>

        {/* ── Emergency Action Bar ───────────────────────────────────────── */}
        <div className="bis-panel p-6 bg-[#0B1324] border border-red-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
                National Consumer Toll-Free Helpline
              </div>
              <div className="text-2xl font-black text-white font-mono">
                1800-11-4000
              </div>
              <p className="text-xs text-slate-400">
                Operational Monday to Saturday (9:00 AM – 5:30 PM) for immediate citizen complaints.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="tel:1800114000"
              className="btn-red text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5"
            >
              <Phone size={14} />
              <span>Call Helpline</span>
            </a>
            <a
              href="mailto:consumer@bis.gov.in"
              className="btn-ghost text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5"
            >
              <Mail size={14} />
              <span>Email Grievance Cell</span>
            </a>
          </div>
        </div>

        {/* ── Visual Guide: How To Spot a Fake vs Genuine ISI Mark ──────── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Anatomy of a Genuine ISI Mark vs. Counterfeit Imprint
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every genuine ISI mark in India must display three mandatory components. Missing any component indicates illegal misuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genuine Mark Card */}
            <div className="bis-panel p-6 bg-[#0B1324] border border-emerald-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>Genuine ISI Mark (Standard Format)</span>
                </span>
                <span className="text-[11px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                  Compliant
                </span>
              </div>

              {/* Graphic Representation */}
              <div className="p-5 rounded-xl bg-[#101E38] border border-emerald-800/40 text-center space-y-2 font-mono">
                <div className="text-xs text-emerald-400 font-bold tracking-wider">
                  IS: [Indian Standard Number] (e.g. IS 694)
                </div>
                <div className="w-16 h-12 mx-auto rounded border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-300 text-lg">
                  ISI
                </div>
                <div className="text-xs text-emerald-400 font-bold tracking-wider">
                  CM/L - XXXXXXX (7-Digit License Number)
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Indian Standard Code</strong> is printed clearly above the emblem.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>7-Digit CM/L Number</strong> is present below, verifying the licensed manufacturing plant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Traceable directly in the BIS Care App or on <code>bis.gov.in</code>.</span>
                </li>
              </ul>
            </div>

            {/* Counterfeit Mark Card */}
            <div className="bis-panel p-6 bg-[#0B1324] border border-red-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <XCircle size={16} />
                  <span>Common Red Flags of Counterfeit Goods</span>
                </span>
                <span className="text-[11px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-300">
                  Illegal / Fraud
                </span>
              </div>

              {/* Graphic Representation */}
              <div className="p-5 rounded-xl bg-[#101E38] border border-red-800/40 text-center space-y-2 font-mono">
                <div className="text-xs text-red-400/60 line-through">
                  [Missing or Incorrect IS Code]
                </div>
                <div className="w-16 h-12 mx-auto rounded border-2 border-dashed border-red-500 flex items-center justify-center font-bold text-red-400 text-lg">
                  ISI?
                </div>
                <div className="text-xs text-red-400 font-bold bg-red-950/60 py-1 rounded">
                  ⚠️ No CM/L License Number Displayed
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Missing CM/L Number:</strong> Goods bearing only the letters &quot;ISI&quot; without a 7-digit license code are illegal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Smudged or Hand-Drawn Logo:</strong> Unauthorized manufacturers stamp distorted logos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Mismatched Standard:</strong> Printing an electrical standard on a plumbing pipe or cement bag.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 4-Step Grievance Filing Assistant ──────────────────────────── */}
        <section className="bis-panel p-6 sm:p-8 bg-[#0B1324] border border-slate-800 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Official Grievance Registration Procedure
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              How BIS processes citizen complaints regarding substandard or fake products:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-800/60">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Preserve Evidence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save the cash invoice, retail bill, packaging photographs, and clear photos of the fake mark or defective part.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-800/60">
                2
              </div>
              <h3 className="text-sm font-bold text-white">File Formal Complaint</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit details via BIS Care App, email to <code>consumer@bis.gov.in</code>, or toll-free call to 1800-11-4000.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-800/60">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Bureau Investigation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                BIS investigating officers conduct surprise factory or retail raids within 30 days of receiving valid evidence.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 font-bold flex items-center justify-center text-sm border border-red-800/60">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Prosecution &amp; Seizure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Non-conforming stock is seized; violating firms face license cancellation and prosecution in court.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Draft a Consumer Complaint Letter with AI
              </h4>
              <p className="text-xs text-slate-400">
                Ask AI Saathi to format your complaint letter with legal references to the BIS Act 2016.
              </p>
            </div>
            <Link
              href={`/chat?q=${encodeURIComponent("How do I write a formal complaint letter to the Bureau of Indian Standards for a fake ISI mark product?")}`}
            >
              <button className="btn-primary text-xs py-2 px-4 rounded-lg flex-shrink-0">
                <Sparkles size={13} />
                <span>Draft Complaint with AI</span>
                <ChevronRight size={13} />
              </button>
            </Link>
          </div>
        </section>

        {/* ── Statutory Rights & Penalties (BIS Act 2016) ────────────────── */}
        <section className="bis-panel p-6 sm:p-8 bg-[#0B1324] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Gavel size={22} className="text-[#EC171F]" />
            <h2 className="text-xl font-bold text-white">
              Legal Provisions &amp; Penalties Under BIS Act 2016
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-red-400 block">
                Section 29 (Substandard ISI Goods)
              </span>
              <h4 className="text-sm font-bold text-white">Up to 2 Years Imprisonment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Any manufacturer selling sub-standard goods under a forged or unauthorized ISI Mark faces imprisonment up to 2 years and a fine of ₹2 Lakh+.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-red-400 block">
                Section 30 (Hallmark Violations)
              </span>
              <h4 className="text-sm font-bold text-white">Up to 1 Year Imprisonment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selling un-hallmarked gold or counterfeit HUID stamps attracts imprisonment up to 1 year or a fine of up to ₹1 Lakh per article.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101E38] border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 block">
                Mandatory 30-Day Resolution
              </span>
              <h4 className="text-sm font-bold text-white">Statutory Citizen Investigation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Bureau is legally bound under Section 17 to initiate formal testing and grievance inquiry on consumer complaints within 30 days.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
