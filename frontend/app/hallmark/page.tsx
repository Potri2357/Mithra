"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface VerificationResult {
  answer: string;
  verified?: boolean | null;
  citations?: Array<{ id: string; text: string; source: string }>;
  follow_up?: string;
  abstained?: boolean;
}

const SAMPLE_HUIDS = [
  { huid: "AA123456", label: "22K Gold (Valid Demo)" },
  { huid: "BB789012", label: "18K Jewellery (Valid Demo)" },
  { huid: "DD901234", label: "Unregistered (Negative Test)" },
];

const PURITY_STANDARDS = [
  { karat: "24K", fineness: "999", purity: "99.9% Pure", desc: "Gold coins, bars, bullion" },
  { karat: "23K", fineness: "958", purity: "95.8% Pure", desc: "High-grade bespoke articles" },
  { karat: "22K", fineness: "916", purity: "91.6% Pure", desc: "Most common Indian bridal jewellery" },
  { karat: "20K", fineness: "833", purity: "83.3% Pure", desc: "Traditional studded ornaments" },
  { karat: "18K", fineness: "750", purity: "75.0% Pure", desc: "Diamond and gemstone rings" },
  { karat: "14K", fineness: "585", purity: "58.5% Pure", desc: "Daily wear & lightweight modern pieces" },
  { karat: "9K", fineness: "375", purity: "37.5% Pure", desc: "Export and affordable fashion items" },
];

export default function HallmarkPage() {
  const [huid, setHuid] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPurity, setSelectedPurity] = useState(PURITY_STANDARDS[2]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyHUID = async (huidVal: string = huid.trim()) => {
    if (!huidVal) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/hallmark/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ huid: huidVal.toUpperCase() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        answer: "Verification server unavailable. Please ensure the backend is running.",
        abstained: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoto = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("language", "en");
      const res = await fetch(`${API_URL}/api/photo/hallmark`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.huid) setHuid(data.huid);
      setResult(data);
    } catch {
      setResult({
        answer: "Photo OCR could not identify hallmark stamp. Please enter HUID manually.",
        abstained: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-page font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Hero Header */}
        <div className="space-y-3 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-900/60 text-xs font-bold text-[#D97706] dark:text-amber-400">
            <MaterialIcon name="workspace_premium" size={15} />
            <span>Precious Metals Authentication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Gold &amp; Silver <span className="text-[#0052CC] dark:text-blue-400">Hallmark Authenticator</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Verify 6-character alphanumeric Hallmark Unique Identification (HUID) codes against Bureau
            registries, or upload a photo of the jewellery hallmark stamp.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handlePhoto(f);
            e.target.value = "";
          }}
        />

        {/* Two Column Verification Station */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Input Form */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <label
                htmlFor="huid-input"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5"
              >
                Enter 6-Character HUID Code
              </label>
              <div className="flex gap-2">
                <input
                  id="huid-input"
                  type="text"
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full uppercase font-mono text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/10"
                  placeholder="e.g. AA1234"
                  maxLength={8}
                  value={huid}
                  onChange={(e) => setHuid(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") verifyHUID();
                  }}
                  aria-label="HUID alphanumeric code"
                />
                <button
                  className="h-11 px-6 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold flex-shrink-0 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  onClick={() => verifyHUID()}
                  disabled={isLoading || !huid.trim()}
                  aria-label="Verify HUID"
                >
                  {isLoading ? (
                    <MaterialIcon name="progress_activity" size={18} className="animate-spin" />
                  ) : (
                    <>
                      <MaterialIcon name="search" size={17} />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Test Codes Chips */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">Quick Test Codes:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_HUIDS.map((s) => (
                  <button
                    key={s.huid}
                    onClick={() => {
                      setHuid(s.huid);
                      verifyHUID(s.huid);
                    }}
                    className="query-chip font-mono text-xs"
                  >
                    <strong>{s.huid}</strong> • {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Dropzone */}
            <div
              className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 p-6 text-center cursor-pointer hover:border-[#0052CC] hover:bg-blue-50/20 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handlePhoto(f);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
            >
              {photoPreview ? (
                <div className="space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Hallmark" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-[#0052CC] dark:text-blue-400">Click to upload another photo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052CC] dark:text-blue-400 flex items-center justify-center mx-auto">
                    <MaterialIcon name="photo_camera" size={20} />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Snap or Drop Jewellery Stamp Photo
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automated OCR identifies HUID codes directly from physical laser engravings.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Verification Output */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.verified ? "bg-emerald-50 text-[#059669]" : "bg-rose-50 text-rose-600"}`}>
                    <MaterialIcon name={result.verified ? "verified" : "gpp_bad"} size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registry Result: {huid}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Central Assaying Register</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {result.answer}
                </div>

                {result.follow_up && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/chat?q=${encodeURIComponent(result.follow_up)}`}>
                      <button className="text-xs font-bold text-[#0052CC] dark:text-blue-400 hover:underline flex items-center gap-1">
                        <span>{result.follow_up}</span>
                        <MaterialIcon name="chevron_right" size={15} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#0052CC] dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <MaterialIcon name="workspace_premium" size={26} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Awaiting Inspection Input</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Type a 6-character HUID or select one of the test codes to verify against national BIS registries.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Helpline: <strong className="text-slate-900 dark:text-white font-mono">1800-11-4000</strong></span>
              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-[#0052CC] dark:text-blue-400 font-bold"
              >
                <span>BIS National Registry</span>
                <MaterialIcon name="open_in_new" size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Visual Guide: Mandatory 3 Marks */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Anatomy of Mandatory 3-Piece Hallmark
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Under BIS Act 2016, genuine hallmarked gold articles must bear all three distinct laser-etched stamps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052CC] dark:text-blue-300 flex items-center justify-center mb-3 font-black text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">BIS Triangle Logo</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The official triangular Bureau of Indian Standards hallmark logo certifying compliance with
                national standard IS 1417.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 font-black text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">Purity &amp; Fineness Stamp</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Indicates gold purity grade, e.g. <strong className="text-slate-900 dark:text-white font-mono">22K916</strong> (91.6% pure),{" "}
                <strong className="text-slate-900 dark:text-white font-mono">18K750</strong> (75.0%), or <strong className="text-slate-900 dark:text-white font-mono">14K585</strong> (58.5%).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3 font-black text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">6-Digit HUID Code</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A unique alphanumeric identifier laser-etched at the Assaying &amp; Hallmarking Centre
                (AHC), traceable in the national database.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Gold Purity Calculator */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <MaterialIcon name="calculate" size={20} className="text-[#0052CC] dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Official BIS Gold Fineness Reference Table</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {PURITY_STANDARDS.map((p) => {
              const isSelected = selectedPurity.karat === p.karat;
              return (
                <button
                  key={p.karat}
                  onClick={() => setSelectedPurity(p)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0052CC] border-[#0052CC] text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                  }`}
                >
                  <div className="text-xs font-black">{p.karat}</div>
                  <div className="text-[11px] font-mono font-semibold opacity-90">{p.fineness}</div>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#0052CC] dark:text-blue-300 uppercase tracking-wide">
                Grade {selectedPurity.karat} (BIS Fineness {selectedPurity.fineness})
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedPurity.purity} Gold Content
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{selectedPurity.desc}</p>
            </div>
            <Link
              href={`/chat?q=${encodeURIComponent(`What is the hallmarking requirement for ${selectedPurity.karat} gold?`)}`}
            >
              <button className="h-9 px-4 rounded-full bg-[#0052CC] text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                <span>Ask About {selectedPurity.karat}</span>
                <MaterialIcon name="chevron_right" size={15} />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
