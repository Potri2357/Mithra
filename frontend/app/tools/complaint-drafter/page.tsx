"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Scale, Sparkles } from "lucide-react";
import { ComplaintWizard } from "@/components/ComplaintWizard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintDrafterPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <StandaloneBar title={t("wizard.title")} subtitle={t("nav.complaintDrafterSubtitle")} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#005EB8] dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Tools</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{t("wizard.title")}</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300">
            <Scale className="w-3.5 h-3.5" />
            <span>Statutory Legal Redressal Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t("wizard.title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {t("wizard.subtitle")}
          </p>
        </div>

        {/* Complaint Wizard Component */}
        <ComplaintWizard />
      </main>

      <Footer />
    </div>
  );
}
