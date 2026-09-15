"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, ShieldCheck, Smartphone } from "lucide-react";
import { WhatsAppSimulator } from "@/components/WhatsAppSimulator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppToolPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#005EB8] dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Tools</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">WhatsApp Assistant Simulator</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-300">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tier-2 Multi-Channel Distribution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Mithra on <span className="text-emerald-600 dark:text-emerald-400">WhatsApp</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Experience Mithra directly within a WhatsApp conversational channel. Check QCOs, verify gold HUID stamps,
            and get instant compliance assistance with live backend responses.
          </p>
        </div>

        {/* WhatsApp Simulator Component */}
        <WhatsAppSimulator />
      </main>

      <Footer />
    </div>
  );
}
