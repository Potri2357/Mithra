"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HallmarkView } from "@/components/views/HallmarkView";

export default function HallmarkPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="flex-1">
        <HallmarkView />
      </main>
      <Footer />
    </div>
  );
}
