"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Upload, Camera, Stamp, Search, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SAMPLE_HUIDS = [
  { huid: "AA123456", expected: "✅ Valid — 22K Gold, Sri Lakshmi Jewellers, Chennai" },
  { huid: "BB789012", expected: "✅ Valid — 18K Gold, Tanishq Bandra, Mumbai" },
  { huid: "DD901234", expected: "❌ Invalid — Not found in registry" },
];

export default function HallmarkPage() {
  const [huid, setHuid] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyHUID = async (huidVal: string = huid.trim()) => {
    if (!huidVal) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/hallmark/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ huid: huidVal }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ answer: "⚠️ Backend unavailable. Please ensure the server is running.", abstained: true });
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
      setResult({ answer: "⚠️ Photo OCR failed. Please enter HUID manually.", abstained: true });
    } finally {
      setIsLoading(false);
    }
  };

  const isVerified = result?.verified === true;
  const isFraud = result?.verified === false;

  return (
    <div className="min-h-screen bg-grid" style={{ background: "var(--surface-0)" }}>
      {/* Ambient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ background: "rgba(10,12,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <Link href="/"><button className="btn-icon w-8 h-8"><ChevronLeft size={16} /></button></Link>
          <Stamp size={20} style={{ color: "var(--saffron)" }} />
          <span className="text-white font-bold">Hallmark Verification</span>
        </div>
        <Link href="/chat"><button className="btn-ghost py-1.5 px-3 text-xs">Open Chat</button></Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">
            Verify Gold & Silver <span className="gradient-text">Hallmark</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Enter a HUID or photograph the hallmark stamp to instantly verify authenticity.
          </p>
        </div>

        {/* Photo upload area */}
        <div
          className="rounded-2xl border-2 border-dashed p-8 text-center mb-6 cursor-pointer transition-all"
          style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith("image/")) handlePhoto(f);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--saffron)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = ""; }} />

          {photoPreview ? (
            <div className="relative inline-block">
              <img src={photoPreview} alt="Hallmark" className="max-h-48 rounded-xl mx-auto" />
              <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--error)", color: "white" }}
                onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); setResult(null); }}>
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <Camera size={40} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-white font-semibold mb-1">Photograph the hallmark stamp</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Drag & drop or click to upload • Supports JPG, PNG, HEIC
              </p>
            </>
          )}
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>or enter HUID manually</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* HUID input */}
        <div className="flex gap-3 mb-4">
          <input
            className="input-bis flex-1 font-mono text-lg tracking-widest uppercase"
            placeholder="AA123456"
            value={huid}
            onChange={(e) => setHuid(e.target.value.toUpperCase().slice(0, 8))}
            onKeyDown={(e) => e.key === "Enter" && verifyHUID()}
            maxLength={8}
          />
          <button className="btn-primary px-6" onClick={() => verifyHUID()} disabled={isLoading || !huid}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={16} /> Verify</>}
          </button>
        </div>

        {/* Sample HUIDs */}
        <div className="mb-8">
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Try these demo HUIDs:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_HUIDS.map(({ huid: h, expected }) => (
              <button key={h} onClick={() => { setHuid(h); verifyHUID(h); }}
                className="text-xs px-3 py-1.5 rounded-lg font-mono transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                title={expected}>
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-6 fade-in ${isVerified ? "badge-valid" : isFraud ? "badge-invalid" : ""}`}
            style={{
              background: isVerified ? "rgba(34,197,94,0.07)" : isFraud ? "rgba(239,68,68,0.07)" : "var(--surface-2)",
              border: `1px solid ${isVerified ? "rgba(34,197,94,0.3)" : isFraud ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
            }}>
            <div className="flex items-center gap-3 mb-4">
              {isVerified ? (
                <CheckCircle size={24} style={{ color: "var(--success)" }} />
              ) : isFraud ? (
                <AlertTriangle size={24} style={{ color: "var(--error)" }} />
              ) : (
                <Stamp size={24} style={{ color: "var(--saffron)" }} />
              )}
              <span className="font-bold text-white text-lg">
                {isVerified ? "✅ Authentic Hallmark" : isFraud ? "❌ Possible Fraud" : "ℹ️ Hallmark Info"}
              </span>
            </div>
            <div className="prose-bis">
              <ReactMarkdownWrapper content={result.answer} />
            </div>
          </div>
        )}

        {/* Info card */}
        <div className="mt-8 glass p-5">
          <h3 className="text-white font-semibold mb-3">About BIS Hallmarking</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { mark: "🔺", label: "BIS Logo", desc: "Triangle mark" },
              { mark: "916", label: "Purity Code", desc: "e.g. 22K gold" },
              { mark: "AA1234", label: "HUID", desc: "6-char unique ID" },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                <div className="text-xl font-bold mb-1" style={{ color: "var(--saffron)" }}>{m.mark}</div>
                <div className="text-xs font-semibold text-white">{m.label}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            Mandatory for gold jewellery ≥14K since June 2021. BIS helpline: 1800-11-4000
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline ReactMarkdown wrapper (avoids import issues)
function ReactMarkdownWrapper({ content }: { content: string }) {
  // Simple renderer for this page
  return (
    <div
      className="prose-bis whitespace-pre-wrap"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br/>")
          .replace(/#{1,3}\s+(.*?)(<br\/>|$)/g, "<h3 class='text-white font-bold mt-3 mb-1'>$1</h3>")
          .replace(/`(.*?)`/g, "<code>$1</code>")
          .replace(/\[S\d+\]/g, ""),
      }}
    />
  );
}
