"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandaloneBar from "@/components/StandaloneBar";
import { ConsumerView } from "@/components/views/ConsumerView";
import { useLanguage } from "@/context/LanguageContext";

export default function ConsumerPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <StandaloneBar title={t("nav.consumer")} subtitle={t("nav.consumerSubtitle")} />
      <main className="flex-1">
        <ConsumerView />
      </main>
      <Footer />
    </div>
  );
}
