"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { StandardsView } from "@/components/views/StandardsView";
import { useLanguage } from "@/context/LanguageContext";

export default function StandardsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <StandaloneBar title={t("nav.standards")} subtitle={t("nav.standardsSubtitle")} />
      <main className="flex-1">
        <StandardsView />
      </main>
      <Footer />
    </div>
  );
}
