"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SchemesView } from "@/components/views/SchemesView";

export default function SchemesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="flex-1">
        <SchemesView />
      </main>
      <Footer />
    </div>
  );
}
