"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight,
  Camera,
  Award,
  Search,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Calculator,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

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
        answer: "⚠️ Verification server unavailable. Please ensure the backend is running.",
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
        answer: "⚠️ Photo OCR could not identify hallmark stamp. Please enter HUID manually.",
        abstained: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#024DA1] border border-blue-200 text-xs font-semibold">
            <ShieldCheck size={13} />
            <span>Mandatory Hallmark Verification (IS 1417)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Gold &amp; Silver <span className="text-[#024DA1]">Hallmark Authenticator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
            <div>
              <label
                htmlFor="huid-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Enter 6-Character HUID Code
              </label>
              <div className="flex gap-2">
                <input
                  id="huid-input"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 uppercase font-mono tracking-widest text-sm sm:text-base outline-none focus:border-blue-400 focus:bg-white transition-all"
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
                  className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 flex-shrink-0 transition-colors"
                  onClick={() => verifyHUID()}
                  disabled={isLoading || !huid.trim()}
                  aria-label="Verify HUID"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Search size={15} />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Test Codes */}
            <div>
              <span className="text-xs text-slate-500 block mb-2 font-medium">Quick Test Codes:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_HUIDS.map((s) => (
                  <button
                    key={s.huid}
                    onClick={() => {
                      setHuid(s.huid);
                      verifyHUID(s.huid);
                    }}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-[#024DA1] transition-colors"
                  >
                    <strong>{s.huid}</strong> • {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Dropzone */}
            <div
              className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
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
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Uploaded hallmark specimen"
                    className="max-h-32 rounded-lg object-contain mb-2 border border-slate-200 bg-white"
                  />
                  <p className="text-xs text-slate-500 font-medium">Click to upload another photo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#024DA1] flex items-center justify-center mb-2">
                    <Camera size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-900">Upload Hallmark Stamp Photo</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automatic OCR extracts stamp characters</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Verification Findings or Guidance */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs min-h-[360px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  {result.verified === true ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E8A5F] border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : result.verified === false ? (
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-[#970C12] border border-red-200 flex items-center justify-center">
                      <ShieldAlert size={20} />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <AlertTriangle size={20} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Registry Response: {huid}</h3>
                    <span className="text-[11px] text-slate-500">Central Hallmarking Register</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {result.answer}
                </div>

                {result.follow_up && (
                  <div className="pt-3 border-t border-slate-100">
                    <Link href={`/chat?q=${encodeURIComponent(result.follow_up)}`}>
                      <button className="text-xs font-bold text-[#024DA1] hover:underline flex items-center gap-1">
                        <span>{result.follow_up}</span>
                        <ChevronRight size={13} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#024DA1] flex items-center justify-center mx-auto mb-3">
                  <Award size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Awaiting Inspection Input</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Type a 6-character HUID or select one of the test codes above to run validation against BIS registries.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Consumer Helpline: <strong>1800-11-4000</strong></span>
              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-[#024DA1] font-bold"
              >
                <span>BIS Portal</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Visual Guide: Mandatory 3 Marks */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Anatomy of Mandatory 3-Piece Hallmark
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Under BIS Act 2016, genuine hallmarked gold articles must bear all three distinct laser-etched stamps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#024DA1] border border-blue-200 flex items-center justify-center mb-2.5 font-black text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">BIS Triangle Logo</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                The official triangular Bureau of Indian Standards hallmark logo certifying compliance with
                national standard IS 1417.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-2.5 font-black text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Purity &amp; Fineness Stamp</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Indicates gold purity grade, e.g. <strong>22K916</strong> (91.6% pure),{" "}
                <strong>18K750</strong> (75.0%), or <strong>14K585</strong> (58.5%).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mb-2.5 font-black text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">6-Digit HUID Code</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                A unique alphanumeric identifier laser-etched at the Assaying &amp; Hallmarking Centre
                (AHC), traceable in the national database.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Gold Purity Calculator */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-[#024DA1]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Official BIS Gold Fineness Reference Table</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {PURITY_STANDARDS.map((p) => {
              const isSelected = selectedPurity.karat === p.karat;
              return (
                <button
                  key={p.karat}
                  onClick={() => setSelectedPurity(p)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-[#024DA1] border-[#024DA1] text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <div className="text-xs font-black">{p.karat}</div>
                  <div className="text-[11px] font-mono font-semibold opacity-90">{p.fineness}</div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#024DA1] uppercase tracking-wide">
                Grade {selectedPurity.karat} (BIS Fineness {selectedPurity.fineness})
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedPurity.purity} Gold Content
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">{selectedPurity.desc}</p>
            </div>
            <Link
              href={`/chat?q=${encodeURIComponent(`What is the hallmarking requirement for ${selectedPurity.karat} gold?`)}`}
            >
              <button className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs flex-shrink-0 transition-colors">
                <span>Ask About {selectedPurity.karat}</span>
                <ChevronRight size={13} />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
