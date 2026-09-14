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
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section className="border-b border-slate-800/80 bg-gradient-to-b from-[#0B1324] to-[#060B14] py-12 px-6">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#024DA1]/15 border border-[#024DA1]/40 text-[#5FA5F9] text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Mandatory Hallmark Verification (IS 1417)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              National Gold &amp; Silver{" "}
              <span className="text-[#5FA5F9]">Hallmark Authenticator</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Verify 6-character alphanumeric Hallmark Unique Identification (HUID) codes against Bureau
              registries, or upload a photo of the jewellery hallmark stamp.
            </p>
          </div>
        </section>

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

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          {/* ── Two Column Verification Station ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Input Form */}
            <div className="bis-panel p-6 sm:p-8 space-y-6">
              <div>
                <label
                  htmlFor="huid-input"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Enter 6-Character HUID Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="huid-input"
                    type="text"
                    className="input-bis uppercase font-mono tracking-widest text-base"
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
                    className="btn-primary flex-shrink-0 px-5"
                    onClick={() => verifyHUID()}
                    disabled={isLoading || !huid.trim()}
                    aria-label="Verify HUID"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Search size={16} />
                        <span>Verify</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Codes */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Test Codes:</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_HUIDS.map((s) => (
                    <button
                      key={s.huid}
                      onClick={() => {
                        setHuid(s.huid);
                        verifyHUID(s.huid);
                      }}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:border-[#024DA1] hover:text-white transition-colors"
                    >
                      {s.huid} • {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Dropzone */}
              <div
                className="rounded-xl border-2 border-dashed border-slate-700/80 bg-[#0B1324] p-6 text-center cursor-pointer hover:border-[#024DA1] transition-colors"
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
                      className="max-h-32 rounded-lg object-contain mb-2 border border-slate-700"
                    />
                    <p className="text-xs text-slate-400">Click to upload another photo</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera size={24} className="text-[#3B82F6] mb-2" />
                    <p className="text-sm font-semibold text-white">Upload Hallmark Photo</p>
                    <p className="text-xs text-slate-400 mt-1">Automatic OCR extracts stamp characters</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Verification Findings or Guidance */}
            <div className="bis-panel p-6 sm:p-8 min-h-[360px] flex flex-col justify-between">
              {result ? (
                <div className="space-y-4 fade-in" aria-live="polite">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    {result.verified === true ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : result.verified === false ? (
                      <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-[#EC171F]">
                        <ShieldAlert size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                        <AlertTriangle size={18} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white">Registry Response: {huid}</h3>
                      <span className="text-xs text-slate-400">Central Hallmarking Register</span>
                    </div>
                  </div>

                  <div className="prose-bis text-slate-300 text-xs sm:text-sm">
                    <p className="whitespace-pre-line leading-relaxed">{result.answer}</p>
                  </div>

                  {result.follow_up && (
                    <div className="pt-3 border-t border-slate-800">
                      <Link href={`/chat?q=${encodeURIComponent(result.follow_up)}`}>
                        <button className="text-xs font-semibold text-[#5FA5F9] hover:text-white transition-colors flex items-center gap-1">
                          <span>{result.follow_up}</span>
                          <ChevronRight size={13} />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 my-auto">
                  <Award size={40} className="text-[#024DA1] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Awaiting Inspection Input</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Type a 6-character HUID or select one of the demo codes above to run validation.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>National Consumer Helpline: 1800-11-4000</span>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-[#5FA5F9]"
                >
                  <span>BIS Portal</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* ── Visual Guide: Mandatory 3 Marks of Genuine Hallmarking ───── */}
          <section className="bis-panel p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Anatomy of Mandatory 3-Piece Hallmark
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Under BIS Act 2016, genuine hallmarked gold articles must bear all three distinct laser-etched stamps:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl bg-[#0B1324] border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-[#024DA1]/20 border border-[#024DA1]/50 flex items-center justify-center text-[#5FA5F9] mb-3 font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-white mb-1">BIS Triangle Logo</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The official triangular Bureau of Indian Standards hallmark logo certifying compliance with
                  national standard IS 1417.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B1324] border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-[#EC171F]/20 border border-[#EC171F]/50 flex items-center justify-center text-[#FCA5A5] mb-3 font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Purity &amp; Fineness Stamp</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Indicates gold purity grade, e.g. <strong>22K916</strong> (91.6% pure),{" "}
                  <strong>18K750</strong> (75.0%), or <strong>14K585</strong> (58.5%).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B1324] border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-3 font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-white mb-1">6-Digit HUID Code</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A unique alphanumeric identifier laser-etched at the Assaying &amp; Hallmarking Centre
                  (AHC), traceable in the national database.
                </p>
              </div>
            </div>
          </section>

          {/* ── Interactive Gold Purity Calculator ───────────────────────── */}
          <section className="bis-panel p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <Calculator size={20} className="text-[#5FA5F9]" />
              <h3 className="text-xl font-bold text-white">Official BIS Gold Fineness Reference Table</h3>
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
                        ? "bg-[#024DA1] border-[#3B82F6] text-white shadow-md"
                        : "bg-[#0B1324] border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-sm font-black">{p.karat}</div>
                    <div className="text-xs font-mono font-semibold opacity-90">{p.fineness}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-[#0B1324] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#5FA5F9] uppercase tracking-wide">
                  Grade {selectedPurity.karat} (BIS Fineness {selectedPurity.fineness})
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {selectedPurity.purity} Gold Content
                </h4>
                <p className="text-xs text-slate-400 mt-1">{selectedPurity.desc}</p>
              </div>
              <Link
                href={`/chat?q=${encodeURIComponent(`What is the hallmarking requirement for ${selectedPurity.karat} gold?`)}`}
              >
                <button className="btn-primary text-xs py-2 px-3 self-start sm:self-auto flex-shrink-0">
                  Ask About {selectedPurity.karat}
                  <ChevronRight size={13} />
                </button>
              </Link>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
