"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Mic,
  Camera,
  Volume2,
  VolumeX,
  BookOpen,
  X,
  Upload,
  Loader2,
  Copy,
  Check,
  Award,
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Download,
  Trash2,
  Home,
  Menu,
  Cpu,
  FileText,
  Layers,
  Scale,
  Sun,
  Moon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  confidence?: "High" | "Medium" | "Unverified";
  follow_up?: string;
  audioUrl?: string;
  isLoading?: boolean;
}

const QUICK_START_CARDS = [
  {
    title: "Find my standard",
    desc: "Identify which IS number applies to your product",
    query: "Which Indian Standard (IS number) applies to my product?",
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-[#024DA1]",
  },
  {
    title: "Understand a scheme",
    desc: "Compare ISI Mark, CRS, and FMCS certification paths",
    query: "Explain the difference between ISI Mark Scheme I and CRS Scheme II",
    icon: Award,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Verify a hallmark",
    desc: "Check 6-character HUID code against BIS registry",
    query: "How do I verify a 6-digit gold hallmark HUID code?",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Find a lab near me",
    desc: "Locate NABL & BIS accredited testing facilities",
    query: "Find accredited laboratories for testing LED lamps or electrical items",
    icon: FlaskConical,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "File a complaint",
    desc: "Report fake ISI marks or substandard products",
    query: "How do I file a consumer complaint against a fake ISI marked product?",
    icon: ShieldAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    title: "Ask anything",
    desc: "Any compliance, testing, or regulatory question",
    query: "What are the latest Quality Control Orders (QCO) issued by BIS?",
    icon: Sparkles,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

function ConfidenceBadge({ confidence, abstained }: { confidence?: "High" | "Medium" | "Unverified"; abstained?: boolean }) {
  if (abstained || confidence === "Unverified") {
    return (
      <span className="confidence-badge confidence-badge-abstained">
        <ShieldAlert size={13} />
        <span>Unverified — Abstained from guessing</span>
      </span>
    );
  }
  if (confidence === "Medium") {
    return (
      <span className="confidence-badge confidence-badge-medium">
        <AlertTriangle size={13} />
        <span>Medium Confidence</span>
      </span>
    );
  }
  return (
    <span className="confidence-badge confidence-badge-high">
      <CheckCircle2 size={13} />
      <span>Verified High Confidence</span>
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2" aria-label="Assistant is analyzing query">
      {[0, 1, 2].map((i) => (
        <div key={i} className="typing-dot w-2.5 h-2.5 rounded-full bg-[var(--blue-400)]" />
      ))}
    </div>
  );
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventInstance) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEventInstance {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [currentLang, setCurrentLang] = useState<"EN" | "हिं" | "த">("EN");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("mithra-theme") || localStorage.getItem("maanak-theme")) as "light" | "dark" | null;
      return saved || "light";
    }
    return "light";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoMode, setPhotoMode] = useState<"product" | "hallmark">("product");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("mithra-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const cycleLang = () => {
    const order: Array<"EN" | "हिं" | "த"> = ["EN", "हिं", "த"];
    const next = order[(order.indexOf(currentLang) + 1) % order.length];
    setCurrentLang(next);
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: query,
      };

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setInput("");
      setSpeechTranscript(null);
      setIsLoading(true);

      try {
        const langCode = currentLang === "हिं" ? "hi" : currentLang === "த" ? "ta" : "en";
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            language: langCode,
            history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Determine confidence: if abstained -> Unverified, if citations >= 1 -> High, else Medium
        const confidence = data.abstained ? "Unverified" : (data.citations && data.citations.length > 0) ? "High" : "Medium";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content: data.answer,
                  citations: data.citations,
                  intent: data.intent,
                  abstained: data.abstained,
                  confidence,
                  follow_up: data.follow_up,
                  isLoading: false,
                }
              : m
          )
        );

        // Auto-expand sources if citations exist
        if (data.citations && data.citations.length > 0) {
          setExpandedSources((prev) => ({ ...prev, [aiMsg.id]: true }));
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content:
                    "⚠️ Unable to reach the Mithra backend service. Please check that the server is active on `" +
                    API_URL +
                    "`.",
                  isLoading: false,
                  abstained: true,
                  confidence: "Unverified",
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [input, currentLang, isLoading, messages]
  );

  // Auto-send initial query passed via URL
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => sendMessage(initialQuery), 250);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, sendMessage]);

  // Voice recording with live transcript verification before send (Section 3.4)
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const win = typeof window !== "undefined" ? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }) : null;
    if (win && (win.SpeechRecognition || win.webkitSpeechRecognition)) {
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRec) return;
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = currentLang === "हिं" ? "hi-IN" : currentLang === "த" ? "ta-IN" : "en-IN";

      rec.onstart = () => {
        setIsRecording(true);
        setSpeechTranscript("");
      };

      rec.onresult = (event: SpeechRecognitionEventInstance) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setSpeechTranscript(transcript);
        setInput(transcript);
      };

      rec.onerror = () => {
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } else {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }
  };

  // Photo upload handler
  const handlePhotoUpload = async (file: File, mode: "product" | "hallmark") => {
    setShowPhotoUpload(false);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📷 [Photo submitted: ${mode === "product" ? "Product for Standard Classification" : "Hallmark Stamp for HUID OCR"}]`,
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
      fd.append("language", currentLang === "हिं" ? "hi" : "en");

      const endpoint = mode === "hallmark" ? "/api/photo/hallmark" : "/api/photo/product";
      const res = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let content = data.answer || data.error || "Analysis complete.";
      if (data.classification) {
        const c = data.classification;
        content = `### Visual Product Identification\n\n**Detected:** ${c.product_name} (${c.category}) — ${Math.round(
          (c.confidence || 0) * 100
        )}% match\n\n---\n\n${content}`;
      }
      if (data.huid) {
        content = `### Hallmark HUID OCR Detected\n\n**HUID Code:** \`${data.huid}\`\n\n---\n\n${content}`;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? {
                ...m,
                content,
                citations: data.citations,
                confidence: data.abstained ? "Unverified" : "High",
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
                content: "⚠️ Image analysis could not be completed. Please enter details manually.",
                confidence: "Unverified",
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (window.confirm("Start a new consultation session? This will clear current conversation history.")) {
      setMessages([]);
      setInput("");
      setSpeechTranscript(null);
    }
  };

  const exportTranscript = () => {
    const txt = messages
      .map(
        (m) =>
          `[${m.role === "user" ? "USER" : "MITHRA"}]\n${m.content}\n${
            m.citations?.length ? `Sources: ${m.citations.map((c) => c.source).join(", ")}\n` : ""
          }\n`
      )
      .join("\n---\n\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mithra-Consultation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex h-screen bg-[var(--color-background)] text-[var(--color-text-body)] overflow-hidden relative"
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
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} className="hidden" />

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

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-[var(--blue-600)]/90 border-2 border-dashed border-[var(--blue-200)] flex flex-col items-center justify-center pointer-events-none text-white">
          <Upload size={48} className="text-white mb-3" />
          <h2 className="text-xl font-bold">Drop Image for Instant BIS Inspection</h2>
          <p className="text-xs text-[var(--blue-100)] mt-1">Supports product photos or hallmark stamps</p>
        </div>
      )}

      {/* ── Collapsible Left Sidebar (ChatGPT style with history & portal links) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-1 border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Image src="/bis_logo.png" alt="BIS Logo" width={28} height={28} className="object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-[15px] text-[var(--color-text-primary)] block leading-tight">
                    Mithra
                  </span>
                  <span className="text-[10px] text-[var(--red-700)] font-semibold tracking-wide">Bureau of Indian Standards</span>
                </div>
              </Link>
              <button className="btn-icon w-8 h-8 lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* + New Chat Button (Section 3.3) */}
            <button
              onClick={clearChat}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--blue-50)] hover:border-[var(--blue-300)] transition-colors"
            >
              <Plus size={15} className="text-[var(--blue-600)]" />
              <span>New Conversation</span>
            </button>

            {/* Navigation links */}
            <nav className="space-y-0.5 pt-1">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-3 block mb-1">
                Portal Modules
              </span>
              <Link
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <Home size={14} />
                <span>Home Portal</span>
              </Link>
              <Link
                href="/standards"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <FileText size={14} />
                <span>Standards Directory</span>
              </Link>
              <Link
                href="/schemes"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <Layers size={14} />
                <span>Certification Schemes</span>
              </Link>
              <Link
                href="/hallmark"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <Award size={14} />
                <span>Hallmark &amp; HUID</span>
              </Link>
              <Link
                href="/labs"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <FlaskConical size={14} />
                <span>Accredited Labs</span>
              </Link>
              <Link
                href="/consumer"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-body)] rounded-lg hover:bg-[var(--blue-50)] hover:text-[var(--blue-600)] transition-colors"
              >
                <Scale size={14} />
                <span>Consumer Redressal</span>
              </Link>
            </nav>
          </div>

          {/* Session tools */}
          <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
            <button
              onClick={exportTranscript}
              disabled={messages.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[var(--color-text-body)] bg-[var(--color-surface-subtle)] hover:bg-[var(--blue-50)] rounded-lg border border-[var(--color-border)] disabled:opacity-40"
            >
              <Download size={14} />
              <span>Export Consultation</span>
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="btn-destructive w-full text-xs py-2 disabled:opacity-40"
            >
              <Trash2 size={14} />
              <span>Clear Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              className="btn-icon w-9 h-9 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1 border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Image src="/bis_logo.png" alt="BIS Logo" width={26} height={26} className="object-contain" />
              </div>
              <div>
                <h1 className="text-[var(--color-text-primary)] font-extrabold text-[15px] leading-tight flex items-center gap-2">
                  <span>Mithra</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </h1>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  BIS Intelligence • 22,000+ Standards
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={cycleLang}
              className="btn-ghost text-xs font-semibold px-2.5 py-1 min-h-0 h-8"
              aria-label="Switch Language"
            >
              <span>{currentLang}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] ml-0.5">▾</span>
            </button>

            <button
              onClick={toggleTheme}
              className="btn-icon w-8 h-8"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {isSpeaking && (
              <button
                className="btn-icon w-8 h-8 text-[var(--blue-600)]"
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

        {/* Message Thread (Section 3.3 & 4) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            /* ── Empty State ── */
            <div className="max-w-2xl mx-auto px-2 pt-8 pb-6 space-y-8">
              {/* Greeting */}
              <div className="text-center space-y-3 animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] p-2 border border-[var(--color-border)] flex items-center justify-center mx-auto shadow-sm">
                  <Image src="/bis_logo.png" alt="BIS Logo" width={44} height={44} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                    Namaste! How can I help you today?
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md mx-auto leading-relaxed">
                    Ask about Indian Standards, BIS certification, gold HUID verification,
                    or accredited testing labs — in English, Hindi, or Tamil.
                  </p>
                </div>
              </div>

              {/* Quick-Start Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {QUICK_START_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      onClick={() => sendMessage(card.query)}
                      className="quick-start-card group animate-fade-up"
                      style={{ animationDelay: `${i * 0.06}s` }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`w-9 h-9 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{card.title}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} bubble-enter`}
              >
                {/* Chat Bubble */}
                <div className={`max-w-3xl ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant w-full"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--color-border)]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white p-0.5 border border-[var(--color-border)] flex items-center justify-center">
                          <Image src="/bis_logo.png" alt="BIS" width={18} height={18} className="object-contain" />
                        </div>
                        <span className="font-bold text-xs text-[var(--color-text-primary)]">Mithra</span>
                      </div>
                      <ConfidenceBadge confidence={msg.confidence} abstained={msg.abstained} />
                    </div>
                  )}

                  {msg.isLoading ? (
                    <TypingIndicator />
                  ) : (
                    <div className="prose-bis text-[var(--color-text-body)]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Abstention human contact notice (Section 3.3) */}
                  {msg.abstained && !msg.isLoading && (
                    <div className="mt-4 p-3.5 rounded-lg bg-[var(--red-50)] border border-[var(--red-200)] text-[var(--red-700)] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className="flex-shrink-0" />
                        <span>Need official clarification? Consult the National Consumer Helpline: <strong>1800-11-4000</strong></span>
                      </div>
                      <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline flex items-center gap-1">
                        <span>BIS Portal</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  {/* Sources Strip: Collapsible panel under message (Section 3.3 & 4) */}
                  {msg.citations && msg.citations.length > 0 && !msg.isLoading && (
                    <div className="sources-strip">
                      <button
                        onClick={() =>
                          setExpandedSources((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[var(--blue-700)] bg-[var(--blue-50)] hover:bg-[var(--blue-100)] transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={14} className="text-[var(--blue-600)]" />
                          <span>Grounded Sources ({msg.citations.length} Verified Citations)</span>
                        </div>
                        {expandedSources[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {expandedSources[msg.id] && (
                        <div>
                          {msg.citations.map((c, i) => (
                            <div key={i} className="sources-strip-row">
                              <div className="flex items-start gap-2 max-w-[85%]">
                                <span className="citation-chip">{i + 1}</span>
                                <div>
                                  <div className="font-semibold text-xs text-[var(--color-text-primary)]">
                                    {c.source || "Official BIS Record"}
                                  </div>
                                  <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                    {c.text}
                                  </div>
                                </div>
                              </div>
                              <a
                                href="https://www.bis.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--blue-600)] hover:underline flex-shrink-0 p-1"
                                title="Open official reference"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions & Follow-up Row */}
                  {msg.role === "assistant" && !msg.isLoading && (
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[var(--color-border)] text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={13} className="text-[var(--color-success)]" />
                              <span className="text-[var(--color-success)] font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              const clean = msg.content
                                .replace(/\[S\d+\]/g, "")
                                .replace(/[#*_`]/g, "")
                                .replace(/https?:\/\/\S+/g, "");
                              const utt = new SpeechSynthesisUtterance(clean);
                              utt.lang = currentLang === "हिं" ? "hi-IN" : "en-IN";
                              utt.onstart = () => setIsSpeaking(true);
                              utt.onend = () => setIsSpeaking(false);
                              utt.onerror = () => setIsSpeaking(false);
                              window.speechSynthesis.speak(utt);
                            }
                          }}
                          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          <Volume2 size={13} />
                          <span>{isSpeaking ? "Speaking..." : "Listen"}</span>
                        </button>
                      </div>

                      {msg.follow_up && (
                        <button
                          onClick={() => sendMessage(msg.follow_up)}
                          className="text-[var(--blue-600)] hover:underline font-semibold flex items-center gap-1 text-left"
                        >
                          <Sparkles size={12} />
                          <span>{msg.follow_up}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* ── Input Bar ── */}
        <footer className="px-4 py-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Speech transcript banner */}
            {speechTranscript !== null && (
              <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[var(--blue-50)] border border-[var(--blue-200)] text-xs text-[var(--blue-700)]">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[var(--red-500)] animate-ping flex-shrink-0" />
                  <span className="font-semibold flex-shrink-0">Transcribed:</span>
                  <span className="italic truncate">&quot;{speechTranscript}&quot;</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => sendMessage(input)} className="btn-primary py-1 px-3 text-xs min-h-[28px] rounded-lg">
                    Send
                  </button>
                  <button onClick={() => { setSpeechTranscript(null); setInput(""); }} className="btn-icon w-7 h-7">
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Main input row */}
            <div className="flex items-center gap-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-3 py-2 shadow-sm focus-within:border-[var(--blue-400)] focus-within:shadow-blue-sm transition-all duration-200">
              {/* Photo */}
              <button
                className="btn-photo flex-shrink-0"
                style={{ width: '38px', height: '38px' }}
                onClick={() => setShowPhotoUpload(true)}
                title="Upload photo"
                aria-label="Upload photo of product or hallmark"
              >
                <Camera size={17} />
              </button>

              {/* Voice */}
              <button
                onClick={toggleVoiceRecording}
                className={`btn-voice flex-shrink-0 ${isRecording ? "recording" : ""}`}
                style={{ width: '38px', height: '38px' }}
                title={isRecording ? "Stop recording" : "Record voice"}
                aria-label={isRecording ? "Stop recording" : "Record voice inquiry"}
              >
                {isRecording ? (
                  <div className="flex items-center gap-0.5 h-5">
                    {[0,1,2,3,4].map((i) => <div key={i} className="waveform-bar" />)}
                  </div>
                ) : (
                  <Mic size={17} />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                className="flex-1 bg-transparent text-[var(--color-text-primary)] text-sm placeholder-[var(--color-text-muted)] outline-none py-2 min-h-[36px]"
                placeholder="Type a question, or use voice / photo above..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
              />

              {/* Send Button */}
              <button
                className="btn-primary flex-shrink-0 rounded-xl px-4 min-h-0 h-9 text-sm"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>

            <p className="text-center text-xs text-[var(--color-text-muted)] opacity-60">
              Responses are grounded in official BIS records. Always verify critical compliance decisions with a registered BIS officer.
            </p>
          </div>
        </footer>
      </div>

      {/* ── Photo Upload & Hallmark Guide Overlay Dialog (Section 3.4) ── */}
      {showPhotoUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setShowPhotoUpload(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--color-text-primary)] font-bold text-base">Capture Image for BIS Analysis</h3>
              <button className="btn-icon w-8 h-8" onClick={() => setShowPhotoUpload(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setPhotoMode("product")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  photoMode === "product"
                    ? "bg-[var(--blue-50)] border-[var(--blue-600)] text-[var(--blue-900)]"
                    : "border-[var(--color-border)] text-[var(--color-text-body)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--blue-100)] text-[var(--blue-600)] flex items-center justify-center mb-2">
                  <Cpu size={18} />
                </div>
                <div className="text-sm font-bold">Product Photo</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Classify applicable Indian Standard</div>
              </button>

              <button
                onClick={() => setPhotoMode("hallmark")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  photoMode === "hallmark"
                    ? "bg-[var(--blue-50)] border-[var(--blue-600)] text-[var(--blue-900)]"
                    : "border-[var(--color-border)] text-[var(--color-text-body)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--blue-100)] text-[var(--blue-600)] flex items-center justify-center mb-2">
                  <Award size={18} />
                </div>
                <div className="text-sm font-bold">Hallmark Stamp</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Laser HUID OCR verification</div>
              </button>
            </div>

            {/* Hallmark scanning guide overlay preview */}
            {photoMode === "hallmark" && (
              <div className="mb-4 p-4 rounded-xl bg-[var(--gray-50)] border border-[var(--color-border)] text-center space-y-2">
                <span className="text-xs font-semibold text-[var(--blue-600)] uppercase tracking-wider block">
                  Hallmark Stamp Guide
                </span>
                <div className="relative border-2 border-dashed border-[var(--blue-400)] rounded-lg p-3 bg-white/60">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-[var(--color-text-muted)]">
                    <div className="border border-[var(--blue-200)] p-1 rounded">1. BIS △ Logo</div>
                    <div className="border border-[var(--blue-200)] p-1 rounded">2. Purity (e.g. 22K916)</div>
                    <div className="border border-[var(--blue-200)] p-1 rounded">3. 6-Digit HUID</div>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-2">
                    Position your jewellery hallmark stamp inside this guide frame
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary w-full justify-center text-sm"
            >
              <Upload size={16} />
              <span>Choose Photo or Take Picture</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[var(--color-background)]">
          <Loader2 size={36} className="animate-spin text-[var(--blue-600)]" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
