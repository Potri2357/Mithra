"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Mic,
  MicOff,
  Camera,
  Volume2,
  VolumeX,
  Languages,
  AlertCircle,
  BookOpen,
  X,
  Upload,
  Loader2,
  Copy,
  Check,
  Award,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Download,
  Trash2,
  Home,
  Menu,
  Cpu,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface IntentMeta {
  label: string;
  badgeClass: string;
}

const INTENT_CONFIG: Record<string, IntentMeta> = {
  standard_lookup: { label: "Standards Q&A", badgeClass: "badge-info" },
  recommend_standard: { label: "Standard Recommender", badgeClass: "badge-warning" },
  scheme_guide: { label: "Certification Schemes", badgeClass: "badge-info" },
  hallmark_verify: { label: "Hallmark Verification", badgeClass: "badge-valid" },
  lab_finder: { label: "Laboratory Directory", badgeClass: "badge-info" },
  consumer_query: { label: "Consumer Protection", badgeClass: "badge-info" },
};

const SUGGESTIONS = [
  "I manufacture LED bulbs, which standard applies?",
  "How do I get ISI certification? Step-by-step process",
  "Verify HUID AA123456",
  "Find testing labs for cables in Maharashtra",
  "What is the difference between ISI mark and CRS?",
  "मैं दबाव कुकर बनाता हूँ, क्या IS नंबर लागू होता है?",
];

interface Citation {
  id: string;
  text: string;
  source: string;
  page?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  intent?: string;
  abstained?: boolean;
  follow_up?: string;
  audioUrl?: string;
  isLoading?: boolean;
}

function CitationPanel({
  citations,
  onClose,
}: {
  citations: Citation[];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <aside
      className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 flex flex-col bg-[#0F172A] border-l border-slate-800 shadow-2xl"
      aria-label="Source Citations Panel"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#141E33]">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-orange-400" />
          <h2 className="text-white font-bold text-sm">Grounded Sources ({citations.length})</h2>
        </div>
        <button
          className="btn-icon w-8 h-8 rounded-lg text-slate-400 hover:text-white"
          onClick={onClose}
          aria-label="Close citations panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {citations.map((c, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#141E33] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-orange-600 text-white flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-xs font-semibold text-orange-400 truncate">
                {c.source || "Official BIS Record"}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5" aria-label="Assistant is analyzing query">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full bg-orange-500"
        />
      ))}
    </div>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCitations, setShowCitations] = useState<Citation[] | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoMode, setPhotoMode] = useState<"product" | "hallmark">("product");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = (text: string, id: string) => {
    const cleanText = text.replace(/\[S\d+\]/g, "");
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportTranscript = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? "Citizen / Inquirer" : "BIS Saathi Assistant"}\n\n${m.content}\n\n`
      )
      .join("---\n\n");
    const blob = new Blob([`# BIS Saathi Consultation Transcript\n\n${transcript}`], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BIS_Consultation_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (window.confirm("Start a new consultation session? Current thread will be cleared.")) {
      setMessages([]);
    }
  };

  const sendMessage = useCallback(
    async (text: string = input.trim()) => {
      if (!text || isLoading) return;
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
      }

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, language }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content: data.answer,
                  citations: data.citations,
                  intent: data.intent,
                  abstained: data.abstained,
                  follow_up: data.follow_up,
                  isLoading: false,
                }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content:
                    "⚠️ Unable to reach the BIS AI backend service. Please check that the server is active on `" +
                    API_URL +
                    "`.",
                  isLoading: false,
                  abstained: true,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [input, language, isLoading]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send initial query passed via URL
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => sendMessage(initialQuery), 250);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, sendMessage]);

  // Escape key for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPhotoUpload(false);
        setShowCitations(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendVoice(blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch {
      alert("Microphone permission was denied. Please allow audio access in browser settings.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendVoice = async (blob: Blob) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "🎤 [Transcribing voice inquiry...]",
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("audio", blob, "recording.webm");
      fd.append("language", language);

      const res = await fetch(`${API_URL}/api/voice`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsg.id
            ? { ...m, content: `🎤 "${data.transcript || "Audio query"}"` }
            : m
        )
      );

      let audioUrl: string | undefined;
      if (data.audio_base64) {
        const ab = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
        const audioBlob = new Blob([ab], { type: "audio/wav" });
        audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsSpeaking(true);
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? {
                ...m,
                content: data.answer,
                citations: data.citations,
                intent: data.intent,
                abstained: data.abstained,
                audioUrl,
                isLoading: false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, content: "⚠️ Voice query processing encountered an error. Please try text input.", isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File, mode: "product" | "hallmark") => {
    setShowPhotoUpload(false);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📸 [Image submitted for ${mode === "product" ? "product identification" : "hallmark HUID OCR"}]`,
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("language", language);

      const endpoint = mode === "hallmark" ? "/api/photo/hallmark" : "/api/photo/product";
      const res = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let content = data.answer || data.error || "Analysis complete.";
      if (data.classification) {
        const c = data.classification;
        content = `**Visual Analysis:** ${c.product_name} (${c.category}) — ${Math.round((c.confidence || 0) * 100)}% match\n\n---\n\n${content}`;
      }
      if (data.huid) {
        content = `**Detected HUID:** \`${data.huid}\`\n\n---\n\n${content}`;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? {
                ...m,
                content,
                citations: data.citations,
                isLoading: false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, content: "⚠️ Image analysis could not be completed. Please enter details manually.", isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen bg-[#090D16] text-slate-100 overflow-hidden relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
          handlePhotoUpload(file, "product");
        }
      }}
    >
      <audio
        ref={audioRef}
        onEnded={() => setIsSpeaking(false)}
        className="hidden"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handlePhotoUpload(f, photoMode);
          e.target.value = "";
        }}
      />

      {/* ── Drag and Drop Overlay ──────────────────────────────────────── */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-orange-950/80 border-2 border-dashed border-orange-500 flex flex-col items-center justify-center pointer-events-none">
          <Upload size={48} className="text-orange-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Drop Image for Instant BIS Inspection</h2>
          <p className="text-xs text-orange-300 mt-1">Supports product photos or hallmark stamps</p>
        </div>
      )}

      {/* ── Collapsible Left Sidebar ───────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-slate-800 transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#C2410C] flex items-center justify-center font-bold text-white text-xs border border-orange-500/30">
                  B
                </div>
                <span className="font-bold text-sm text-white">BIS Saathi</span>
              </div>
              <button
                className="btn-icon w-7 h-7 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Home size={15} />
                <span>Home Portal</span>
              </Link>
              <Link
                href="/hallmark"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Award size={15} />
                <span>Hallmark &amp; HUID</span>
              </Link>
              <Link
                href="/labs"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <FlaskConical size={15} />
                <span>Accredited Labs</span>
              </Link>
            </nav>

            {/* Category quick filters */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 block">
                Advisory Modes
              </span>
              {[
                { label: "Standards Q&A", query: "What does IS 16102 cover?" },
                { label: "Certification Schemes", query: "How do I get ISI mark certification?" },
                { label: "Hallmark Authenticity", query: "Verify HUID AA123456" },
                { label: "Lab Locations", query: "Find electrical testing labs in Delhi" },
                { label: "Consumer Complaints", query: "How to report fake ISI marked products?" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => sendMessage(item.query)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-orange-400 hover:bg-slate-800/60 rounded-md transition-colors truncate"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session tools */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={exportTranscript}
              disabled={messages.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 disabled:opacity-40"
            >
              <Download size={14} />
              <span>Export Consultation</span>
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-lg border border-red-950 disabled:opacity-40"
            >
              <Trash2 size={14} />
              <span>Clear Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* ── Top App Bar ──────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-5 py-3.5 bg-[#0F172A] border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="btn-icon w-8 h-8 rounded-lg lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={16} />
            </button>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight flex items-center gap-2">
                <span>BIS Saathi Intelligence</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
              </h1>
              <div className="text-xs text-slate-400">
                Grounded on 22,000+ Indian Standards • {language === "hi" ? "हिंदी" : "English"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-ghost py-1.5 px-3 text-xs gap-1.5"
              onClick={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
              aria-label="Toggle language between English and Hindi"
            >
              <Languages size={14} className="text-orange-400" />
              <span className="font-semibold">{language === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {isSpeaking && (
              <button
                className="btn-icon w-8 h-8 text-orange-400"
                onClick={() => {
                  audioRef.current?.pause();
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeaking(false);
                }}
                aria-label="Stop audio speech playback"
              >
                <VolumeX size={15} />
              </button>
            )}
          </div>
        </header>

        {/* ── Message Thread ───────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto text-center pt-10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-950/60 border border-orange-800/60 flex items-center justify-center mx-auto mb-4 text-orange-400">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Bureau of Indian Standards Advisory
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
                Inquire about Indian Standards, mandatory certification schemes (ISI, CRS, FMCS),
                gold hallmark verification, or accredited testing facilities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-orange-500/60 hover:bg-[#141E33] transition-all text-xs text-slate-300 font-medium"
                    aria-label={`Ask suggestion: ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in`}
            >
              <div className={`max-w-2xl w-full ${msg.role === "user" ? "ml-8" : "mr-8"}`}>
                {/* Intent classification badge */}
                {msg.role === "assistant" && msg.intent && !msg.isLoading && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`intent-badge ${INTENT_CONFIG[msg.intent]?.badgeClass || "badge-info"}`}>
                      {INTENT_CONFIG[msg.intent]?.label || "BIS Standards"}
                    </span>
                    {msg.abstained && (
                      <span className="intent-badge badge-warning flex items-center gap-1">
                        <AlertCircle size={11} />
                        Source Abstention
                      </span>
                    )}
                  </div>
                )}

                <div className={msg.role === "user" ? "msg-user p-4" : "msg-ai p-5"}>
                  {msg.isLoading ? (
                    <TypingIndicator />
                  ) : msg.role === "user" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose-bis">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          text({ children }) {
                            const str = String(children);
                            const parts = str.split(/(\[S\d+\])/g);
                            if (parts.length === 1) return <>{children}</>;
                            return (
                              <>
                                {parts.map((part, i) => {
                                  const match = part.match(/\[S(\d+)\]/);
                                  if (match) {
                                    const idx = parseInt(match[1]) - 1;
                                    return (
                                      <button
                                        key={i}
                                        className="citation-badge"
                                        onClick={() =>
                                          msg.citations && setShowCitations(msg.citations)
                                        }
                                        title={msg.citations?.[idx]?.source || "View Citation"}
                                        aria-label={`Citation S${match[1]}: ${msg.citations?.[idx]?.source || "BIS Source"}`}
                                      >
                                        {match[1]}
                                      </button>
                                    );
                                  }
                                  return <span key={i}>{part}</span>;
                                })}
                              </>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Toolbar for AI responses */}
                {msg.role === "assistant" && !msg.isLoading && (
                  <div className="flex flex-wrap items-center gap-4 mt-2 px-1 text-xs">
                    {msg.citations && msg.citations.length > 0 && (
                      <button
                        className="flex items-center gap-1.5 font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                        onClick={() => setShowCitations(msg.citations!)}
                        aria-label={`View ${msg.citations.length} grounded sources`}
                      >
                        <BookOpen size={13} />
                        {msg.citations.length} cited source{msg.citations.length > 1 ? "s" : ""}
                      </button>
                    )}

                    <button
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      aria-label="Copy answer to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                      onClick={() => {
                        if (msg.audioUrl && audioRef.current) {
                          audioRef.current.src = msg.audioUrl;
                          audioRef.current.play();
                          setIsSpeaking(true);
                        } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
                          window.speechSynthesis.cancel();
                          const clean = msg.content
                            .replace(/\[S\d+\]/g, "")
                            .replace(/[#*_`]/g, "")
                            .replace(/https?:\/\/\S+/g, "");
                          const utt = new SpeechSynthesisUtterance(clean);
                          utt.lang = language === "hi" ? "hi-IN" : "en-IN";
                          utt.onstart = () => setIsSpeaking(true);
                          utt.onend = () => setIsSpeaking(false);
                          utt.onerror = () => setIsSpeaking(false);
                          window.speechSynthesis.speak(utt);
                        }
                      }}
                      title="Read answer aloud"
                      aria-label="Listen to answer"
                    >
                      <Volume2 size={13} />
                      {isSpeaking ? "Speaking..." : "Listen"}
                    </button>

                    {msg.follow_up && (
                      <button
                        className="text-slate-400 hover:text-orange-400 transition-colors text-left flex items-center gap-1"
                        onClick={() => sendMessage(msg.follow_up!)}
                        aria-label={`Follow up query: ${msg.follow_up}`}
                      >
                        <Sparkles size={12} className="text-orange-400 flex-shrink-0" />
                        <span>{msg.follow_up}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        {/* ── Photo Upload Dialog ──────────────────────────────────────── */}
        {showPhotoUpload && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowPhotoUpload(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-dialog-title"
          >
            <div
              className="w-full max-w-md p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="photo-dialog-title" className="text-white font-bold text-base">
                  Upload Image for BIS Analysis
                </h3>
                <button
                  className="btn-icon w-7 h-7"
                  onClick={() => setShowPhotoUpload(false)}
                  aria-label="Close photo upload dialog"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {(["product", "hallmark"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPhotoMode(mode)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      photoMode === mode
                        ? "bg-orange-950/40 border-orange-500/80 text-white"
                        : "bg-[#141E33] border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                    aria-pressed={photoMode === mode}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-orange-400 mb-2">
                      {mode === "product" ? <Cpu size={16} /> : <Award size={16} />}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {mode === "product" ? "Product Photo" : "Hallmark Stamp"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {mode === "product" ? "Standard category classification" : "HUID OCR verification"}
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="btn-primary w-full justify-center py-3"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Select photo from device"
              >
                <Upload size={16} />
                Select Photo from Device
              </button>
            </div>
          </div>
        )}

        {/* ── Input Bar with Waveform ──────────────────────────────────── */}
        <footer className="px-4 py-3.5 bg-[#0F172A] border-t border-slate-800 flex-shrink-0">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <button
              className="btn-icon flex-shrink-0 rounded-lg text-slate-300 hover:text-white"
              onClick={() => setShowPhotoUpload(true)}
              title="Upload photo for classification or OCR"
              aria-label="Upload photo"
            >
              <Camera size={18} />
            </button>

            {isRecording ? (
              /* Soundwave indicator while recording */
              <div className="flex-1 flex items-center justify-between px-4 py-3 bg-[#141E33] rounded-xl border border-red-500/50">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-semibold text-red-400">Listening to your query...</span>
                </div>
                <div className="flex items-center gap-1 h-6">
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                </div>
              </div>
            ) : (
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  className="input-bis resize-none pr-4 text-sm"
                  rows={1}
                  placeholder={
                    language === "hi"
                      ? "भारतीय मानकों या प्रमाणन के बारे में पूछें..."
                      : "Ask about IS standards, certification processes, or lab testing..."
                  }
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  style={{ minHeight: "46px", maxHeight: "140px" }}
                  aria-label="Inquiry input field"
                />
              </div>
            )}

            <button
              className={`btn-record flex-shrink-0 ${isRecording ? "recording" : "text-slate-300 hover:text-white"}`}
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Stop recording" : "Record voice query"}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              className="btn-primary py-2.5 px-4 flex-shrink-0 rounded-lg"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim() || isRecording}
              aria-label="Send query"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-2">
            Grounded by Bureau of Indian Standards databases • Official National Helpline: 1800-11-4000
          </p>
        </footer>

        {showCitations && (
          <CitationPanel citations={showCitations} onClose={() => setShowCitations(null)} />
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#090D16]">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
