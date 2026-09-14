"use client";

import { useState, useRef } from "react";
import {
  Search,
  Award,
  Sparkles,
  Camera,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Loader2,
  Calculator,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

export const PURITY_STANDARDS = [
  { karat: "24K", fineness: "999", purity: "99.9% Pure", desc: "Gold coins, bars, bullion" },
  { karat: "23K", fineness: "958", purity: "95.8% Pure", desc: "High-grade bespoke articles" },
  { karat: "22K", fineness: "916", purity: "91.6% Pure", desc: "Most common Indian bridal jewellery" },
  { karat: "20K", fineness: "833", purity: "83.3% Pure", desc: "Traditional studded ornaments" },
  { karat: "18K", fineness: "750", purity: "75.0% Pure", desc: "Diamond and gemstone rings" },
  { karat: "14K", fineness: "585", purity: "58.5% Pure", desc: "Daily wear & lightweight modern pieces" },
  { karat: "9K", fineness: "375", purity: "37.5% Pure", desc: "Export and affordable fashion items" },
];

interface HallmarkViewProps {
  onAskMithra?: (query: string) => void;
}

export function HallmarkView({ onAskMithra }: HallmarkViewProps) {
  const [huid, setHuid] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPurity, setSelectedPurity] = useState(PURITY_STANDARDS[2]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = (query: string) => {
    if (onAskMithra) {
      onAskMithra(query);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <Badge variant="warning" className="px-3 py-1 gap-1.5 font-bold shadow-2xs">
          <Award className="w-3.5 h-3.5" />
          <span>Precious Metals Authentication</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Gold &amp; Silver <span className="text-[#024DA1] dark:text-blue-400">Hallmark Authenticator</span>
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
        <Card className="p-6 sm:p-8 space-y-5">
          <div>
            <label
              htmlFor="huid-input"
              className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5"
            >
              Enter 6-Character HUID Code
            </label>
            <div className="flex gap-2.5">
              <Input
                id="huid-input"
                type="text"
                className="h-11 px-4 bg-slate-50 dark:bg-slate-800 uppercase font-mono text-sm sm:text-base tracking-wider"
                placeholder="e.g. AA1234"
                maxLength={8}
                value={huid}
                onChange={(e) => setHuid(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyHUID();
                }}
                aria-label="HUID alphanumeric code"
              />
              <Button
                type="button"
                className="h-11 px-6 rounded-xl bg-[#024DA1] hover:bg-[#023A79] text-white text-xs font-bold shrink-0 gap-2 shadow-xs cursor-pointer"
                onClick={() => verifyHUID()}
                disabled={isLoading || !huid.trim()}
                aria-label="Verify HUID"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Test Codes Chips */}
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5 font-medium">Quick Test Codes:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_HUIDS.map((s) => (
                <button
                  key={s.huid}
                  type="button"
                  onClick={() => {
                    setHuid(s.huid);
                    verifyHUID(s.huid);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 font-mono text-xs cursor-pointer transition-colors"
                >
                  <strong>{s.huid}</strong> • {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Dropzone */}
          <div
            className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-5 text-center cursor-pointer hover:border-[#024DA1] hover:bg-blue-50/20 transition-all"
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
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-xs relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Hallmark" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#024DA1] dark:text-blue-400">Click to upload another photo</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#024DA1] dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Camera className="w-4 h-4" />
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
        </Card>

        {/* Right: Verification Output */}
        <Card className="p-5 sm:p-6 min-h-[340px] flex flex-col justify-between">
          {result ? (
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${result.verified ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400"}`}>
                  {result.verified ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
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
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onAskMithra && onAskMithra(result.follow_up || "")}
                    className="text-xs font-bold text-[#024DA1] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer text-left"
                  >
                    <span>{result.follow_up}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 my-auto">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#024DA1] dark:text-blue-400 flex items-center justify-center mx-auto mb-2.5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Awaiting Inspection Input</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Type a 6-character HUID or select one of the test codes to verify against national BIS registries.
              </p>
            </div>
          )}

          <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Helpline: <strong className="text-slate-900 dark:text-white font-mono">1800-11-4000</strong></span>
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-[#024DA1] dark:text-blue-400 font-bold"
            >
              <span>BIS National Registry</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>
      </div>

      {/* Visual Guide: Mandatory 3 Marks */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Anatomy of Mandatory 3-Piece Hallmark
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Under BIS Act 2016, genuine hallmarked gold articles must bear all three distinct laser-etched stamps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-[#024DA1] dark:text-blue-300 flex items-center justify-center mb-2.5 font-black text-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">BIS Triangle Logo</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The official triangular Bureau of Indian Standards hallmark logo certifying compliance with
              national standard IS 1417.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5 font-black text-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Purity &amp; Fineness Stamp</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Indicates gold purity grade, e.g. <strong className="text-slate-900 dark:text-white font-mono">22K916</strong> (91.6% pure),{" "}
              <strong className="text-slate-900 dark:text-white font-mono">18K750</strong> (75.0%), or <strong className="text-slate-900 dark:text-white font-mono">14K585</strong> (58.5%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2.5 font-black text-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">6-Digit HUID Code</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A unique alphanumeric identifier laser-etched at the Assaying &amp; Hallmarking Centre
              (AHC), traceable in the national database.
            </p>
          </div>
        </div>
      </Card>

      {/* Interactive Gold Purity Reference */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#024DA1] dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Official BIS Gold Fineness Reference Table</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {PURITY_STANDARDS.map((p) => {
            const isSelected = selectedPurity.karat === p.karat;
            return (
              <button
                key={p.karat}
                type="button"
                onClick={() => setSelectedPurity(p)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#024DA1] border-[#024DA1] text-white shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                }`}
              >
                <div className="text-xs font-black">{p.karat}</div>
                <div className="text-[11px] font-mono font-semibold opacity-90">{p.fineness}</div>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#024DA1] dark:text-blue-300 uppercase tracking-wide">
              Grade {selectedPurity.karat} (BIS Fineness {selectedPurity.fineness})
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {selectedPurity.purity} Gold Content
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{selectedPurity.desc}</p>
          </div>
          <Button
            type="button"
            onClick={() => handleAsk(`What is the hallmarking requirement for ${selectedPurity.karat} gold?`)}
            size="sm"
            className="bg-[#024DA1] hover:bg-[#023A79] text-white text-xs font-semibold rounded-full px-4 gap-1.5 shrink-0 shadow-xs"
          >
            <span>Ask About {selectedPurity.karat}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default HallmarkView;
