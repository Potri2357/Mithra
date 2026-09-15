"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Clock,
  IndianRupee,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  Percent,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface CostEstimatorProps {
  onAskMithra?: (prompt: string) => void;
}

export function CostEstimator({ onAskMithra }: CostEstimatorProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [scheme, setScheme] = useState<"isi" | "crs" | "fmcs" | "hallmark">("isi");
  const [enterprise, setEnterprise] = useState<"micro" | "small" | "medium" | "startup" | "large">("small");
  const [complexity, setComplexity] = useState<"standard" | "high" | "minimal">("standard");

  const hasMsmeConcession = useMemo(() => {
    return enterprise === "micro" || enterprise === "small" || enterprise === "startup";
  }, [enterprise]);

  const estimate = useMemo(() => {
    let appFee = 1000;
    let auditFee = 14000;
    let baseMarkingFee = 45000;
    let testLow = 20000;
    let testHigh = 45000;
    let timelineDays = "30–45 Days";
    let currencySymbol = "₹";

    if (scheme === "crs") {
      appFee = 1000;
      auditFee = 0; // CRS has no physical factory audit
      baseMarkingFee = 25000;
      timelineDays = "20–30 Days";
      testLow = 25000;
      testHigh = 60000;
    } else if (scheme === "fmcs") {
      currencySymbol = "$";
      appFee = 1000;
      auditFee = 7000; // USD travel + inspection
      baseMarkingFee = 2000; // USD
      timelineDays = "6–9 Months";
      testLow = 1500;
      testHigh = 4000;
    } else if (scheme === "hallmark") {
      appFee = 0;
      auditFee = 0;
      baseMarkingFee = enterprise === "large" ? 7500 : 0;
      timelineDays = "2–5 Days";
      testLow = 0;
      testHigh = 0;
    }

    if (complexity === "high") {
      if (scheme === "fmcs") {
        testLow += 2000;
        testHigh += 3500;
      } else {
        testLow += 30000;
        testHigh += 75000;
      }
    } else if (complexity === "minimal") {
      if (scheme === "fmcs") {
        testLow = Math.max(800, testLow - 500);
      } else {
        testLow = Math.max(8000, testLow - 12000);
        testHigh = Math.max(15000, testHigh - 20000);
      }
    }

    // Apply 20% MSME concession on marking fee
    const markingFeeDiscount = (scheme !== "fmcs" && hasMsmeConcession) ? Math.round(baseMarkingFee * 0.20) : 0;
    const finalMarkingFee = baseMarkingFee - markingFeeDiscount;

    const totalMin = appFee + auditFee + finalMarkingFee + testLow;
    const totalMax = appFee + auditFee + finalMarkingFee + testHigh;

    return {
      currencySymbol,
      appFee,
      auditFee,
      baseMarkingFee,
      markingFeeDiscount,
      finalMarkingFee,
      testLow,
      testHigh,
      totalMin,
      totalMax,
      timelineDays,
    };
  }, [scheme, enterprise, complexity, hasMsmeConcession]);

  const handleConsult = () => {
    const prompt = `Can you break down the BIS licensing fee and testing requirements for a ${enterprise} enterprise applying for ${scheme.toUpperCase()} certification?`;
    if (onAskMithra) {
      onAskMithra(prompt);
    } else {
      router.push(`/chat?q=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0052CC] dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t("calc.title")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("schemes.calculatorTab")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("calc.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleConsult}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("common.askMithra")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scheme Picker */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t("calc.schemeSelect")}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "isi", label: "ISI Mark (Scheme I)", desc: "Domestic Manufacturing" },
              { id: "crs", label: "CRS (Scheme II)", desc: "IT, Electronics & Solar" },
              { id: "fmcs", label: "FMCS (Scheme IV)", desc: "Foreign Manufacturers" },
              { id: "hallmark", label: "Hallmarking (Scheme X)", desc: "Jewellers & AHCs" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScheme(s.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scheme === s.id
                    ? "border-[#0052CC] bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-[#0052CC]"
                    : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-bold text-xs">{s.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enterprise Scale */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t("calc.scaleSelect")}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "micro", label: "Micro Enterprise", badge: "20% Concession", desc: "< ₹1 Cr Turnover" },
              { id: "small", label: "Small Enterprise", badge: "20% Concession", desc: "₹1 - 10 Cr Turnover" },
              { id: "startup", label: "Startup / Women Entr.", badge: "20% Concession", desc: "DPIIT Recognized" },
              { id: "medium", label: "Medium Enterprise", badge: "Standard Fee", desc: "₹10 - 50 Cr Turnover" },
              { id: "large", label: "Large Scale Industry", badge: "Standard Fee", desc: "> ₹50 Cr Turnover" },
            ].map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEnterprise(e.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  enterprise === e.id
                    ? "border-[#0052CC] bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-[#0052CC]"
                    : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div>
                  <div className="font-bold text-xs">{e.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{e.desc}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    e.badge.includes("20%")
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {e.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Complexity & Timeline preview */}
        <div className="space-y-4">
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t("calc.testingComplexity")}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "minimal", label: "Minimal (Simple / Non-Destructive)", desc: "Pipes, structural, basic hardware" },
                { id: "standard", label: "Standard (Household / Electrical)", desc: "Cables, fans, packaged water, food" },
                { id: "high", label: "High Hazard (Chemical / Auto / Batteries)", desc: "Automotive, high-voltage, toys" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setComplexity(c.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    complexity === c.id
                      ? "border-[#0052CC] bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-[#0052CC]"
                      : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs">{c.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#0052CC] dark:text-blue-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("calc.timeline")}
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {estimate.timelineDays}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concession Alert Banner */}
      {hasMsmeConcession && scheme !== "fmcs" && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
          <Percent className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-xs font-semibold">
            {t("calc.msmeConcessionApplied")} (Saving ₹{estimate.markingFeeDiscount.toLocaleString("en-IN")})
          </div>
        </div>
      )}

      {/* Results & Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t("calc.breakdownTitle")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("calc.appFee")}</div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {estimate.currencySymbol}{estimate.appFee.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("calc.auditFee")}</div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {estimate.currencySymbol}{estimate.auditFee.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("calc.markingFee")}</div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {estimate.currencySymbol}{estimate.finalMarkingFee.toLocaleString("en-IN")}
            </div>
            {estimate.markingFeeDiscount > 0 && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                -₹{estimate.markingFeeDiscount.toLocaleString("en-IN")} (20% Off)
              </div>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("calc.testingFee")}</div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {estimate.currencySymbol}{estimate.testLow.toLocaleString("en-IN")} – {estimate.currencySymbol}{estimate.testHigh.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Total Outlay Banner */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700">
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {t("calc.totalOutlay")}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Includes statutory application, audit, marking fees, and mandatory sample testing.
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0052CC] dark:text-blue-400">
            {estimate.currencySymbol}{estimate.totalMin.toLocaleString("en-IN")} – {estimate.currencySymbol}{estimate.totalMax.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostEstimator;
