"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Gem,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  ArrowRight,
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
import { useLanguage } from "@/context/LanguageContext";
import { useMiniChat } from "@/context/MiniChatContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface VerificationResult {
  answer: string;
  verified?: boolean | null;
  huid?: string;
  details?: {
    valid: boolean;
    metal?: string;
    purity?: string;
    ahc?: string;
    city?: string;
  };
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
  const { t } = useLanguage();
  const miniChat = useMiniChat();
  const [huid, setHuid] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPurity, setSelectedPurity] = useState(PURITY_STANDARDS[2]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = (query: string) => {
    if (onAskMithra) {
      onAskMithra(query);
    } else {
      miniChat.openChat(query);
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
        answer: "Photo analysis unavailable. Please check your connection or backend service.",
        abstained: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Structured detail extractor for verified certificates
  const parsedDetails = (() => {
    if (!result) return null;
    if (result.details) {
      return {
        metal: result.details.metal || "Gold",
        purity: result.details.purity || "22K (916)",
        ahc: result.details.ahc || "BIS Recognized Centre",
        city: result.details.city || "India",
      };
    }
    if (!result.answer) return null;
    const metalMatch = result.answer.match(/\|\s*\*\*Metal\*\*\s*\|\s*([^|\n]+)\|/i);
    const purityMatch = result.answer.match(/\|\s*\*\*Purity\*\*\s*\|\s*([^|\n]+)\|/i);
    const ahcMatch = result.answer.match(/\|\s*\*\*Assaying Centre[^|]*\*\*\s*\|\s*([^|\n]+)\|/i);
    const cityMatch = result.answer.match(/\|\s*\*\*City\*\*\s*\|\s*([^|\n]+)\|/i);
    if (metalMatch || purityMatch || ahcMatch) {
      return {
        metal: metalMatch ? metalMatch[1].trim() : "Gold",
        purity: purityMatch ? purityMatch[1].trim() : "22K (916)",
        ahc: ahcMatch ? ahcMatch[1].trim() : "BIS Recognized Centre",
        city: cityMatch ? cityMatch[1].trim() : "India",
      };
    }
    return null;
  })();

  const commentaryMarkdown = (() => {
    if (!result?.answer) return "";
    if (parsedDetails && result.verified === true) {
      return result.answer
        .replace(/^##\s+.*$/gm, "")
        .replace(/^\*\*HUID:\*\*.*$/gm, "")
        .replace(/^\|[^\n]+\|\n?/gm, "")
        .trim();
    }
    return result.answer;
  })();

  const markdownComponents = {
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xs">
        <table className="w-full text-left border-collapse text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-[11px] uppercase tracking-wider">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="hover:bg-slate-500/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-3.5 py-2 text-xs">
        {children}
      </td>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1.5 flex items-center gap-1.5">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-2.5 mb-1">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="my-1.5 leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </p>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-slate-900 dark:text-white">
        {children}
      </strong>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-[#0052CC] dark:text-blue-300 font-mono text-[11px] font-semibold border border-blue-200 dark:border-blue-900/60">
        {children}
      </code>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-4 space-y-1 my-2 text-slate-700 dark:text-slate-300">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-4 space-y-1 my-2 text-slate-700 dark:text-slate-300">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
    em: ({ children }: any) => (
      <em className="text-slate-500 dark:text-slate-400 italic text-[11px] block mt-2">
        {children}
      </em>
    ),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <Badge variant="warning" className="px-3 py-1 gap-1.5 font-bold shadow-2xs">
          <Award className="w-3.5 h-3.5" />
          <span>{t("hallmark.badge")}</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {t("hallmark.heading")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          {t("hallmark.subheading")}
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
        <Card className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between overflow-hidden">
          {result ? (
            <div className="space-y-4">
              {/* State A: Verified Genuine */}
              {result.verified === true && (
                <div className="space-y-3.5">
                  <div className="rounded-2xl p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-4">
                    {/* Header with Title and HUID Chip */}
                    <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-emerald-200/80 dark:border-emerald-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-2xs shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              BIS Certified Authentic Hallmark
                            </h3>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Central Assaying &amp; Hallmarking Registry (AHC)
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-bold tracking-wide shrink-0">
                        {result.huid || huid}
                      </span>
                    </div>

                    {/* Specification Chips */}
                    {parsedDetails && (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs shadow-2xs">
                          <Gem className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Metal:</span>
                          <strong className="text-slate-900 dark:text-white font-bold">{parsedDetails.metal}</strong>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs shadow-2xs">
                          <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Purity:</span>
                          <strong className="text-slate-900 dark:text-white font-mono font-bold">{parsedDetails.purity}</strong>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs shadow-2xs">
                          <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                          <span className="text-slate-500 dark:text-slate-400 font-medium">AHC:</span>
                          <strong className="text-slate-900 dark:text-white font-bold">{parsedDetails.ahc}</strong>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span className="text-slate-500 dark:text-slate-400 font-medium">City:</span>
                          <strong className="text-slate-900 dark:text-white font-bold">{parsedDetails.city}</strong>
                        </div>
                      </div>
                    )}

                    {/* 3-Mark Checklist Chips */}
                    <div className="pt-2.5 border-t border-emerald-200/80 dark:border-emerald-800/80 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        BIS Standard Triangle
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Purity Stamp
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        6-Digit HUID
                      </span>
                    </div>
                  </div>

                  {commentaryMarkdown && (
                    <div className="text-xs leading-relaxed bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {commentaryMarkdown}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {/* State B: Not Verified / Potential Fraud */}
              {result.verified === false && (
                <div className="space-y-3.5">
                  <div className="rounded-2xl p-5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-4">
                    {/* Header with Title and HUID Chip */}
                    <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-rose-200/80 dark:border-rose-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-700 flex items-center justify-center text-rose-700 dark:text-rose-300 shadow-2xs shrink-0">
                          <ShieldAlert className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              HUID Not Registered — Potential Fraud
                            </h3>
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Record not found in the national BIS database
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700 text-xs font-mono font-bold tracking-wide shrink-0">
                        {result.huid || huid}
                      </span>
                    </div>

                    {/* Status & Warning Chips */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-semibold">
                        ❌ Not in Central Registry
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
                        ⚠️ Suspect Counterfeit
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-mono font-semibold">
                        📞 Helpline: 1800-11-4000
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p>
                        Under the BIS Act 2016, selling unhallmarked or counterfeit gold jewellery is a punishable statutory offence.
                      </p>
                    </div>

                    {/* Quick Link to Complaint Drafter */}
                    <div className="pt-2 border-t border-rose-200/80 dark:border-rose-800/80">
                      <Link
                        href="/tools/complaint-drafter"
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-500" />
                          <span>Draft Official BIS Grievance via Complaint Drafter</span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  <div className="text-xs leading-relaxed bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {result.answer}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* State C: General Registry Guidance (verified === null) */}
              {result.verified === null && (
                <div className="space-y-3.5">
                  <div className="rounded-2xl p-5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 space-y-3">
                    <div className="flex items-center gap-3 pb-2.5 border-b border-blue-200/80 dark:border-blue-800/80">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">BIS Registry Guidance</h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Central Hallmarking Advisory</span>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {result.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {result.follow_up && (
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleAsk(result.follow_up || "")}
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
