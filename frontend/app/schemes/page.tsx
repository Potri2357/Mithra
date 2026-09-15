"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { SchemesView } from "@/components/views/SchemesView";
import { useLanguage } from "@/context/LanguageContext";

export default function SchemesPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <StandaloneBar title={t("nav.schemes")} subtitle="Certification Pathways · BIS" />
      <main className="flex-1">
        <SchemesView />
      </main>
      <Footer />
    </div>
  );
}
