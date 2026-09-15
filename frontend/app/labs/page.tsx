"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { LabsView } from "@/components/views/LabsView";
import { useLanguage } from "@/context/LanguageContext";

export default function LabsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <StandaloneBar title={t("nav.labs")} subtitle={t("nav.labsSubtitle")} />
      <main className="flex-1">
        <LabsView />
      </main>
      <Footer />
    </div>
  );
}
