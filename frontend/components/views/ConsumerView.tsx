"use client";

import { useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";

interface ConsumerViewProps {
  onAskMithra?: (query: string) => void;
}

export function ConsumerView({ onAskMithra }: ConsumerViewProps) {
  const [productCategory, setProductCategory] = useState("electronics");
  const [activeTab, setActiveTab] = useState<"visual-guide" | "grievance-steps" | "penalties">("visual-guide");

  const handleAskComplaint = (customSubject?: string) => {
    const topic = customSubject || "How do I file an official consumer complaint with BIS against a fake ISI marked product?";
    if (onAskMithra) {
      onAskMithra(topic);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(topic)}`, "_blank");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-900/60 text-xs font-bold text-[#DC2626] dark:text-rose-400">
          <MaterialIcon name="shield" size={15} />
          <span>Citizen Protection & Redressal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Consumer Protection <span className="text-[#DC2626] dark:text-rose-400">&amp; Grievance Center</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-3xl leading-relaxed">
          Verify ISI mark authenticity, report counterfeit certification stamps or substandard goods,
          and understand your statutory rights under the Bureau of Indian Standards Act 2016.
        </p>
      </div>

      {/* Emergency Action Helpline Bar */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-[#DC2626] dark:text-rose-400 flex-shrink-0">
            <MaterialIcon name="call" size={24} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#DC2626] dark:text-rose-300">
              National Consumer Toll-Free Helpline
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono leading-tight">
              1800-11-4000
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Operational Monday to Saturday (9:00 AM – 5:30 PM) for immediate citizen complaints.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:1800114000"
            className="h-10 px-5 rounded-full bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MaterialIcon name="call" size={16} />
            <span>Call Helpline</span>
          </a>
          <button
            type="button"
            onClick={() => handleAskComplaint("I purchased a substandard item with a questionable ISI mark. Can you guide me step-by-step through drafting a complaint?")}
            className="h-10 px-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <MaterialIcon name="auto_awesome" size={16} className="text-[#0052CC] dark:text-blue-400" />
            <span>Draft Grievance with Mithra</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("visual-guide")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "visual-guide"
              ? "bg-[#0052CC] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MaterialIcon name="fact_check" size={16} />
          <span>ISI Mark Spotter (Real vs Fake)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("grievance-steps")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "grievance-steps"
              ? "bg-[#0052CC] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MaterialIcon name="playlist_add_check" size={16} />
          <span>4-Step Grievance Procedure</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("penalties")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "penalties"
              ? "bg-[#0052CC] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MaterialIcon name="gavel" size={16} />
          <span>Statutory Penalties (BIS Act 2016)</span>
        </button>
      </div>

      {/* Visual Guide Tab */}
      {activeTab === "visual-guide" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genuine Mark Card */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-[#059669] dark:text-emerald-400 flex items-center gap-1.5">
                  <MaterialIcon name="check_circle" size={18} />
                  <span>GENUINE ISI MARK SPECIMEN</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-emerald-200">
                  Legal &amp; Verified
                </span>
              </div>

              {/* Graphical representation */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-2 font-mono">
                <div className="text-xs text-[#0052CC] dark:text-blue-400 font-bold tracking-wider">IS 16102 (Part 1)</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white py-2 tracking-widest">
                  [ ISI ]
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">CM/L - 9512345678</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Standard Number at Top: </strong>
                    Must cite exact IS number, e.g. IS 16102 for LED bulbs or IS 269 for cement.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Iconic ISI Monogram: </strong>
                    Mandated geometric proportion with exact lettering.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">7 or 8-Digit License Number (CM/L): </strong>
                    Unique manufacturer license code traceable in the BIS national registry.
                  </div>
                </div>
              </div>
            </div>

            {/* Counterfeit / Fake Mark Card */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-[#DC2626] dark:text-rose-400 flex items-center gap-1.5">
                  <MaterialIcon name="cancel" size={18} />
                  <span>COMMON COUNTERFEIT WARNING SIGNS</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 border border-rose-200">
                  Illegal Misuse
                </span>
              </div>

              {/* Graphical fake representation */}
              <div className="p-6 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center space-y-2 font-mono">
                <div className="text-xs text-rose-500 line-through">Missing IS Number</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white py-2 tracking-widest">
                  [ ISI ]
                </div>
                <div className="text-xs text-rose-500 line-through">NO CM/L LICENSE CODE</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">No CM/L License Number: </strong>
                    An ISI mark without a 7 or 8 digit CM/L number below it is always fake and unauthorized.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Missing Standard Code: </strong>
                    Without the IS code at the top, consumers cannot determine what standard was claimed.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Distorted Proportions: </strong>
                    Distorted lines, blurry prints, or sticker-overlays over non-certified items.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grievance Steps Tab */}
      {activeTab === "grievance-steps" && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              4-Step Grievance Redressal Procedure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How to report substandard goods or unauthorized use of the Standard Mark under BIS Act 2016:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 01</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gather Evidence</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Photograph the product packaging, batch number, bill/cash memo, and clear view of the stamp.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 02</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">File Online via BIS Care</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download the official BIS Care mobile app or lodge complaint on the national portal.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 03</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enforcement Raid</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                BIS Vigilance wing conducts investigation, testing, and search &amp; seizure operations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 04</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Statutory Redressal</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Prosecution under Section 29, license revocation, and consumer compensation.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Statutory Rights / Penalties Tab */}
      {activeTab === "penalties" && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <MaterialIcon name="gavel" size={20} className="text-[#0052CC] dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Statutory Consumer Legal Rights (BIS Act, 2016)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 29: Penalties for Misuse of Standard Mark</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Any person who deceives the public with unauthorized ISI mark or falsely represents compliance faces
                imprisonment up to <strong className="text-slate-900 dark:text-white">2 years</strong>, or a fine not less than <strong className="text-slate-900 dark:text-white">₹2,00,000</strong>, extending
                up to 10 times the value of goods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 30: Compensation to Consumers</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Where goods bearing the Standard Mark fail to conform to the relevant standard, the licensee or seller
                is liable to compensate the consumer, replace the product, or refund the purchase amount in full.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Action footer */}
      <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="help_outline" size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Need help drafting an official complaint letter?</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Mithra AI can generate a formatted complaint letter referencing relevant BIS clauses.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAskComplaint("Draft a formal complaint letter to BIS regarding a substandard electrical product with an unauthorized ISI mark.")}
          className="h-9 px-4 rounded-xl bg-[#0052CC] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 shadow-sm"
        >
          <MaterialIcon name="edit_note" size={16} />
          <span>Draft with Mithra AI</span>
        </button>
      </div>
    </div>
  );
}
export default ConsumerView;
