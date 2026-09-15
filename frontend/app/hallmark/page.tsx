"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { HallmarkView } from "@/components/views/HallmarkView";
import { useLanguage } from "@/context/LanguageContext";

export default function HallmarkPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <StandaloneBar title={t("nav.hallmark")} subtitle="Gold Hallmark & HUID Verification · BIS" />
      <main className="flex-1">
        <HallmarkView />
      </main>
      <Footer />
    </div>
  );
}
