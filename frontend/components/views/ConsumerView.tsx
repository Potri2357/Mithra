"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  Sparkles,
  Scale,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface ConsumerViewProps {
  onAskMithra?: (query: string) => void;
}

export function ConsumerView({ onAskMithra }: ConsumerViewProps) {
  const { t } = useLanguage();
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="space-y-3">
        <Badge variant="danger" className="px-3 py-1 gap-1.5 font-bold shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{t("consumer.badge")}</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {t("consumer.heading")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-3xl leading-relaxed">
          {t("consumer.subheading")}
        </p>
      </div>

      {/* Dedicated Interactive Tool Banner */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/90 to-amber-50/50 dark:from-rose-950/40 dark:to-slate-900/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider">
              INTERACTIVE TOOL
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t("wizard.title")}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
            Draft formal legal complaint letters with automatic jurisdictional BIS Branch Office routing, legal penalty citations, and checklist.
          </p>
        </div>
        <Link
          href="/tools/complaint-drafter"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs hover:scale-105 active:scale-95"
        >
          <span>Launch Complaint Drafter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Emergency Action Helpline Bar */}
      <Card className="border-rose-200/90 dark:border-rose-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
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

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:1800114000"
            className="h-10 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call Helpline</span>
          </a>
          <Button
            type="button"
            onClick={() => handleAskComplaint("I purchased a substandard item with a questionable ISI mark. Can you guide me step-by-step through drafting a complaint?")}
            variant="outline"
            className="h-10 px-5 rounded-full text-xs font-semibold gap-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#024DA1] dark:text-blue-400" />
            <span>{t("common.askMithra")}</span>
          </Button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("visual-guide")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "visual-guide"
              ? "bg-[#024DA1] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>ISI Mark Spotter (Real vs Fake)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("grievance-steps")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "grievance-steps"
              ? "bg-[#024DA1] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>4-Step Grievance Procedure</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("penalties")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "penalties"
              ? "bg-[#024DA1] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Statutory Penalties (BIS Act 2016)</span>
        </button>
      </div>

      {/* Visual Guide Tab */}
      {activeTab === "visual-guide" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genuine Mark Card */}
            <Card className="border-emerald-200/90 dark:border-emerald-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GENUINE ISI MARK SPECIMEN</span>
                </span>
                <Badge variant="success" className="text-[10px] font-bold">
                  Legal &amp; Verified
                </Badge>
              </div>

              {/* Graphical representation */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center space-y-2 font-mono">
                <div className="text-xs text-[#024DA1] dark:text-blue-400 font-bold tracking-wider">IS 16102 (Part 1)</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white py-2 tracking-widest">
                  [ ISI ]
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">CM/L - 9512345678</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Standard Number at Top: </strong>
                    Must cite exact IS number, e.g. IS 16102 for LED bulbs or IS 269 for cement.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Iconic ISI Monogram: </strong>
                    Mandated geometric proportion with exact lettering.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">7 or 8-Digit License Number (CM/L): </strong>
                    Unique manufacturer license code traceable in the BIS national registry.
                  </div>
                </div>
              </div>
            </Card>

            {/* Counterfeit / Fake Mark Card */}
            <Card className="border-rose-200/90 dark:border-rose-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>COMMON COUNTERFEIT WARNING SIGNS</span>
                </span>
                <Badge variant="danger" className="text-[10px] font-bold">
                  Illegal Misuse
                </Badge>
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
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">No CM/L License Number: </strong>
                    An ISI mark without a 7 or 8 digit CM/L number below it is always fake and unauthorized.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Missing Standard Code: </strong>
                    Without the IS code at the top, consumers cannot determine what standard was claimed.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Distorted Proportions: </strong>
                    Distorted lines, blurry prints, or sticker-overlays over non-certified items.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Grievance Steps Tab */}
      {activeTab === "grievance-steps" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              4-Step Grievance Redressal Procedure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How to report substandard goods or unauthorized use of the Standard Mark under BIS Act 2016:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] dark:text-blue-400 block">Step 01</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gather Evidence</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Photograph the product packaging, batch number, bill/cash memo, and clear view of the stamp.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] dark:text-blue-400 block">Step 02</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">File Online via BIS Care</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download the official BIS Care mobile app or lodge complaint on the national portal.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] dark:text-blue-400 block">Step 03</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enforcement Raid</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                BIS Vigilance wing conducts investigation, testing, and search &amp; seizure operations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#024DA1] dark:text-blue-400 block">Step 04</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Statutory Redressal</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Prosecution under Section 29, license revocation, and consumer compensation.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Statutory Rights / Penalties Tab */}
      {activeTab === "penalties" && (
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#024DA1] dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Statutory Consumer Legal Rights (BIS Act, 2016)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 29: Penalties for Misuse of Standard Mark</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Any person who deceives the public with unauthorized ISI mark or falsely represents compliance faces
                imprisonment up to <strong className="text-slate-900 dark:text-white">2 years</strong>, or a fine not less than <strong className="text-slate-900 dark:text-white">₹2,00,000</strong>, extending
                up to 10 times the value of goods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 30: Compensation to Consumers</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Where goods bearing the Standard Mark fail to conform to the relevant standard, the licensee or seller
                is liable to compensate the consumer, replace the product, or refund the purchase amount in full.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Action footer */}
      <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#024DA1] text-white flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Need help drafting an official complaint letter?</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Mithra AI can generate a formatted complaint letter referencing relevant BIS clauses.</p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => handleAskComplaint("Draft a formal complaint letter to BIS regarding a substandard electrical product with an unauthorized ISI mark.")}
          className="bg-[#024DA1] hover:bg-[#023A79] text-white text-xs font-semibold rounded-xl px-4 gap-2 shrink-0 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Draft with Mithra AI</span>
        </Button>
      </Card>
    </div>
  );
}

export default ConsumerView;
