import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldAlert,
  Phone,
  Mail,
  Gavel,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function ConsumerPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-red-50/60 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#970C12] border border-red-200 text-xs font-semibold">
            <ShieldAlert size={13} />
            <span>Citizen Rights &amp; Grievance Redressal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Consumer Protection <span className="text-[#EC171F]">&amp; Grievance Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Verify ISI mark authenticity, report counterfeit certification stamps or substandard goods,
            and understand your statutory rights under the Bureau of Indian Standards Act 2016.
          </p>
        </div>

        {/* Emergency Action Helpline Bar */}
        <div className="bg-white border border-red-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#EC171F] flex-shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#970C12]">
                National Consumer Toll-Free Helpline
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono leading-tight">
                1800-11-4000
              </div>
              <p className="text-xs text-slate-500">
                Operational Monday to Saturday (9:00 AM – 5:30 PM) for immediate citizen complaints.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="tel:1800114000"
              className="bg-[#EC171F] hover:bg-[#C50F16] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone size={13} />
              <span>Call Helpline</span>
            </a>
            <a
              href="mailto:consumer@bis.gov.in"
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Mail size={13} />
              <span>Email Grievance Cell</span>
            </a>
          </div>
        </div>

        {/* Visual Guide: How To Spot a Fake vs Genuine ISI Mark */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Anatomy of a Genuine ISI Mark vs. Counterfeit Imprint
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Every genuine ISI mark in India must display three mandatory components. Missing any component indicates illegal misuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Genuine Mark Card */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#0E8A5F] flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>GENUINE ISI MARK SPECIMEN</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#0E8A5F] border border-emerald-200">
                  Legal &amp; Verified
                </span>
              </div>

              {/* Graphical representation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 font-mono">
                <div className="text-xs text-[#024DA1] font-bold">IS 16102 (Part 1)</div>
                <div className="text-2xl font-black tracking-widest text-slate-900 py-1">
                  [ ISI ]
                </div>
                <div className="text-xs text-slate-600">CM/L - 9512345678</div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#0E8A5F] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Standard Number at Top: </strong>
                    Must cite exact IS number, e.g. IS 16102 for LED bulbs or IS 269 for cement.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#0E8A5F] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Iconic ISI Monogram: </strong>
                    Standard geometric proportion mandated in Bureau guidelines.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#0E8A5F] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900">7 or 8-Digit License Number (CM/L): </strong>
                    Unique manufacturer license code traceable in the BIS national registry.
                  </div>
                </div>
              </div>
            </div>

            {/* Counterfeit / Fake Mark Card */}
            <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#970C12] flex items-center gap-1.5">
                  <XCircle size={16} />
                  <span>COMMON COUNTERFEIT WARNING SIGNS</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-[#970C12] border border-red-200">
                  Illegal Misuse
                </span>
              </div>

              {/* Graphical fake representation */}
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 text-center space-y-2 font-mono">
                <div className="text-xs text-red-500 line-through">Missing IS Number</div>
                <div className="text-2xl font-black tracking-widest text-slate-800 py-1">
                  [ ISI ]
                </div>
                <div className="text-xs text-red-500 line-through">NO CM/L LICENSE CODE</div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-[#970C12] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    ⚠
                  </span>
                  <div>
                    <strong className="text-slate-900">No CM/L License Number: </strong>
                    An ISI mark without a 7 or 8 digit CM/L number below it is always fake and unauthorized.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-[#970C12] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    ⚠
                  </span>
                  <div>
                    <strong className="text-slate-900">Missing Standard Code: </strong>
                    Without the IS code at the top, consumers cannot determine what standard was claimed.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-[#970C12] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    ⚠
                  </span>
                  <div>
                    <strong className="text-slate-900">Distorted Proportions: </strong>
                    Distorted lines, blurry prints, or sticker-overlays over non-certified items.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4-Step Grievance Procedure ── */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              4-Step Grievance Redressal Procedure
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How to report substandard goods or unauthorized use of the Standard Mark under BIS Act 2016:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] block">Step 01</span>
              <h4 className="text-xs font-bold text-slate-900">Gather Evidence</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Photograph the product packaging, batch number, bill/cash memo, and clear view of the stamp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] block">Step 02</span>
              <h4 className="text-xs font-bold text-slate-900">File Online via BIS Care</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Download the official BIS Care mobile app or lodge complaint on the national portal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] block">Step 03</span>
              <h4 className="text-xs font-bold text-slate-900">Enforcement Raid</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                BIS Vigilance wing conducts investigation, testing, and search &amp; seizure operations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] block">Step 04</span>
              <h4 className="text-xs font-bold text-slate-900">Statutory Redressal</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Prosecution under Section 29, license revocation, and consumer compensation.
              </p>
            </div>
          </div>
        </section>

        {/* ── Statutory Rights under BIS Act 2016 ── */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Gavel size={18} className="text-[#024DA1]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Statutory Consumer Legal Rights (BIS Act, 2016)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-900 block">Section 29: Penalties for Misuse of Standard Mark</span>
              <p className="leading-relaxed">
                Any person who deceives the public with unauthorized ISI mark or falsely represents compliance faces
                imprisonment up to <strong>2 years</strong>, or a fine not less than <strong>₹2,00,000</strong>, extending
                up to 10 times the value of goods.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-900 block">Section 30: Compensation to Consumers</span>
              <p className="leading-relaxed">
                Where goods bearing the Standard Mark fail to conform to the relevant standard, the licensee or seller
                is liable to compensate the consumer, replace the product, or refund the purchase amount in full.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <Link
              href="/chat?q=How%20do%20I%20file%20a%20formal%20consumer%20complaint%20against%20a%20substandard%20ISI%20marked%20product"
              className="font-bold text-[#024DA1] hover:underline flex items-center gap-1"
            >
              <Sparkles size={13} />
              <span>Ask AI Saathi to draft my complaint details</span>
            </Link>

            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <span>BIS National Portal Guidelines</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
