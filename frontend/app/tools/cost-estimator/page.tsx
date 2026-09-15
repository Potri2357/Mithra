"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import { CostEstimator } from "@/components/CostEstimator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function CostEstimatorPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#005EB8] dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Tools</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{t("calc.title")}</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0052CC] dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Compliance Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t("calc.title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {t("calc.subtitle")}
          </p>
        </div>

        {/* Cost Estimator Tool Component */}
        <CostEstimator />
      </main>

      <Footer />
    </div>
  );
}
