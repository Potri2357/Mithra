"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/MaterialIcon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    title: "Find Indian Standard (IS)",
    desc: "Search IS number & QCO by product name",
    query: "Which Indian Standard (IS number) applies to my product?",
    icon: "library_books",
    color: "text-[#0052CC] dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60",
  },
  {
    title: "Certification Schemes",
    desc: "Compare ISI Mark Scheme I vs CRS Scheme II",
    query: "Explain the difference between ISI Mark Scheme I and CRS Scheme II",
    icon: "verified",
    color: "text-[#059669] dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
  },
  {
    title: "Verify Hallmark & HUID",
    desc: "Decode 6-character gold hallmark authenticity",
    query: "How do I verify a 6-digit gold hallmark HUID code?",
    icon: "workspace_premium",
    color: "text-[#D97706] dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
  },
  {
    title: "Accredited Testing Labs",
    desc: "Locate NABL & BIS testing facilities nearby",
    query: "Find accredited laboratories for testing LED lamps or electrical items",
    icon: "biotech",
    color: "text-[#7C3AED] dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
  },
];

const RECENT_THREADS = [
  "LED bulb certification",
  "Gold hallmark HUID check",
  "Packaged drinking water ISI",
];

function ConfidenceBadge({ confidence, abstained }: { confidence?: "High" | "Medium" | "Unverified"; abstained?: boolean }) {
  if (abstained || confidence === "Unverified") {
    return (
      <span className="confidence-badge confidence-badge-abstained">
        <MaterialIcon name="gpp_bad" size={14} filled />
        <span>Unverified — Abstained from guessing</span>
      </span>
    );
  }
  if (confidence === "Medium") {
    return (
      <span className="confidence-badge confidence-badge-medium">
        <MaterialIcon name="warning" size={14} filled />
        <span>Medium Confidence</span>
      </span>
    );
  }
  return (
    <span className="confidence-badge confidence-badge-high">
      <MaterialIcon name="check_circle" size={14} filled />
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Set initial sidebar state based on screen width on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoMode, setPhotoMode] = useState<"product" | "hallmark">("product");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const initialQuerySentRef = useRef(false);

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
            message: query,
            language: langCode,
            context: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
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
                    "Mithra could not reach the backend service. Please check that the server is active on `" +
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
    if (initialQuery && !initialQuerySentRef.current) {
      const timer = setTimeout(() => {
        if (!initialQuerySentRef.current) {
          initialQuerySentRef.current = true;
          sendMessage(initialQuery);
        }
      }, 250);
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
      content: `[Photo submitted: ${mode === "product" ? "Product for standard classification" : "Hallmark stamp for HUID OCR"}]`,
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
                content: "Image analysis could not be completed. Please enter the product or HUID details manually.",
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
      className="mithra-chat-shell flex h-screen text-[var(--color-text-body)] overflow-hidden relative"
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
        <div className="absolute inset-0 z-50 bg-[var(--blue-700)]/92 border-2 border-dashed border-[var(--blue-200)] flex flex-col items-center justify-center pointer-events-none text-white">
          <MaterialIcon name="upload_file" size={50} className="text-white mb-3" />
          <h2 className="text-xl font-bold">Drop image for Mithra analysis</h2>
          <p className="text-xs text-[var(--blue-100)] mt-1">Product photos and hallmark stamps are supported</p>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ── Collapsible Left Sidebar (ChatGPT style with history & portal links) ── */}
      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 w-[275px] transition-all duration-200 lg:relative ${
          sidebarOpen
            ? "translate-x-0 lg:w-[275px]"
            : "-translate-x-full lg:w-0 lg:overflow-hidden lg:border-r-0 lg:p-0"
        }`}
      >
        <div className="flex flex-col h-full p-3 justify-between">
          <div className="space-y-4">
            <div className="sidebar-brand">
              <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
                <div className="brand-mark">
                  <Image src="/bis_logo.png" alt="BIS Logo" width={28} height={28} className="object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-[16px] text-[var(--color-text-primary)] block leading-tight">
                    Mithra
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-semibold truncate block">Bureau of Indian Standards</span>
                </div>
              </Link>
              <button
                className="btn-icon w-8 h-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <MaterialIcon name="chevron_left" size={20} />
              </button>
            </div>

            {/* + New Chat Button (Section 3.3) */}
            <button
              onClick={clearChat}
              className="new-chat-button"
            >
              <MaterialIcon name="add" size={17} className="text-[var(--blue-600)]" />
              <span>New Chat</span>
            </button>

            {/* Navigation links */}
            <nav className="sidebar-nav">
              <span className="sidebar-section-label">
                Assistant
              </span>
              <Link
                href="/"
                className="sidebar-link font-bold text-[#0052CC] bg-blue-50/80 dark:bg-blue-950/50 dark:text-blue-300"
              >
                <MaterialIcon name="chat" size={16} />
                <span>Mithra AI</span>
              </Link>

              <span className="sidebar-section-label mt-3">
                Portals &amp; Tools
              </span>
              <Link
                href="/standards"
                className="sidebar-link"
              >
                <MaterialIcon name="library_books" size={16} />
                <span>Standards Directory</span>
              </Link>
              <Link
                href="/schemes"
                className="sidebar-link"
              >
                <MaterialIcon name="verified" size={16} />
                <span>Certification Schemes</span>
              </Link>
              <Link
                href="/hallmark"
                className="sidebar-link"
              >
                <MaterialIcon name="workspace_premium" size={16} />
                <span>Hallmark &amp; HUID</span>
              </Link>
              <Link
                href="/labs"
                className="sidebar-link"
              >
                <MaterialIcon name="biotech" size={16} />
                <span>Accredited Labs</span>
              </Link>
              <Link
                href="/consumer"
                className="sidebar-link"
              >
                <MaterialIcon name="health_and_safety" size={16} />
                <span>Consumer Redressal</span>
              </Link>
            </nav>

            <div className="recent-block">
              <span className="sidebar-section-label">Recent</span>
              {RECENT_THREADS.map((thread) => (
                <button key={thread} type="button" onClick={() => sendMessage(thread)} className="recent-link">
                  <span>{thread}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Session tools */}
          <div className="sidebar-tools">
            <button
              onClick={exportTranscript}
              disabled={messages.length === 0}
              className="sidebar-tool-button"
            >
              <MaterialIcon name="download" size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="sidebar-tool-button danger"
            >
              <MaterialIcon name="delete" size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="chat-header flex items-center justify-between px-4 sm:px-6 py-2.5 flex-shrink-0 min-h-[58px]">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                className="btn-icon w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                title="Open sidebar"
              >
                <MaterialIcon name="menu" size={20} />
              </button>
            )}

            {!sidebarOpen ? (
              <div className="flex items-center gap-2.5">
                <div className="brand-mark">
                  <Image src="/bis_logo.png" alt="BIS Logo" width={26} height={26} className="object-contain" />
                </div>
                <div>
                  <h1 className="text-[var(--color-text-primary)] font-extrabold text-[15px] leading-tight flex items-center gap-2">
                    <span>Mithra</span>
                    <span className="status-pill">
                      <span className="status-dot" />
                      Verified mode
                    </span>
                  </h1>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    BIS standards intelligence
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="status-pill">
                  <span className="status-dot" />
                  Verified mode
                </span>
                <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline font-medium">
                  BIS standards intelligence · Grounded RAG
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={clearChat}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#0052CC] bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors cursor-pointer"
                title="Start New Chat"
              >
                <MaterialIcon name="add" size={15} />
                <span>New Chat</span>
              </button>
            )}

            <button
              onClick={cycleLang}
              className="language-button"
              aria-label="Switch Language"
              title="Switch Language (EN / हिं / த)"
            >
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Language:</span>
              <span className="active-lang">{currentLang}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="btn-icon w-8.5 h-8.5"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle dark/light mode"
            >
              <MaterialIcon name={theme === "light" ? "dark_mode" : "light_mode"} size={17} />
            </button>

            {isSpeaking && (
              <button
                className="btn-icon w-8.5 h-8.5 text-[var(--blue-600)]"
                onClick={() => {
                  audioRef.current?.pause();
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeaking(false);
                }}
                aria-label="Stop audio speech playback"
              >
                <MaterialIcon name="volume_off" size={17} />
              </button>
            )}
          </div>
        </header>

        {/* Message Thread (Section 3.3 & 4) */}
        <main className="message-thread flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            /* ── Empty State ── */
            <div className="empty-state">
              {/* Greeting */}
              <div className="empty-hero animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto p-2.5">
                  <Image src="/bis_logo.png" alt="BIS Logo" width={44} height={44} className="object-contain" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0052CC] dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300">
                    <MaterialIcon name="verified" size={14} />
                    <span>Mithra AI · Official BIS Compliance Assistant</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    How can I assist your compliance today?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Ask any question regarding 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, or gold hallmark verification.
                  </p>
                </div>
              </div>

              {/* Quick-Start Grid */}
              <div className="quick-start-grid">
                {QUICK_START_CARDS.map((card, i) => (
                  <button
                    key={card.title}
                    onClick={() => sendMessage(card.query)}
                    className="quick-start-card group animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    type="button"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${card.bg} ${card.color}`}>
                      <MaterialIcon name={card.icon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0052CC] dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {card.desc}
                      </p>
                    </div>
                    <MaterialIcon
                      name="arrow_forward"
                      size={16}
                      className="text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${msg.role === "user" ? "message-row-user" : "message-row-assistant"} bubble-enter`}
              >
                {/* Chat Bubble */}
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
                  {msg.role === "assistant" && (
                    <div className="assistant-meta">
                      <div className="flex items-center gap-2">
                        <div className="assistant-mark">
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
                    <div className="abstention-notice">
                      <div className="flex items-center gap-2">
                        <MaterialIcon name="gpp_bad" size={18} className="flex-shrink-0" filled />
                        <span>Need official clarification? Consult the National Consumer Helpline: <strong>1800-11-4000</strong></span>
                      </div>
                      <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline flex items-center gap-1">
                        <span>BIS Portal</span>
                        <MaterialIcon name="open_in_new" size={13} />
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
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[var(--blue-700)] dark:text-blue-300 bg-[var(--blue-50)] dark:bg-blue-950/50 hover:bg-[var(--blue-100)] dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <MaterialIcon name="library_books" size={16} className="text-[var(--blue-600)] dark:text-[var(--blue-400)]" />
                          <span>Grounded Sources ({msg.citations.length} Verified Citations)</span>
                        </div>
                        <MaterialIcon name={expandedSources[msg.id] ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={18} />
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
                                <MaterialIcon name="open_in_new" size={15} />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions & Follow-up Row */}
                  {msg.role === "assistant" && !msg.isLoading && (
                    <div className="message-actions">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <MaterialIcon name="check" size={15} className="text-[var(--color-success)]" />
                              <span className="text-[var(--color-success)] font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <MaterialIcon name="content_copy" size={15} />
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
                          <MaterialIcon name="volume_up" size={15} />
                          <span>{isSpeaking ? "Speaking..." : "Listen"}</span>
                        </button>
                      </div>

                      {msg.follow_up && (
                        <button
                          onClick={() => sendMessage(msg.follow_up)}
                          className="text-[var(--blue-600)] hover:underline font-semibold flex items-center gap-1 text-left"
                        >
                          <MaterialIcon name="auto_awesome" size={14} />
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
        <footer className="composer-footer">
          <div className="composer-wrap">
            {/* Speech transcript banner */}
            {speechTranscript !== null && (
              <div className="speech-banner">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[var(--red-500)] animate-ping flex-shrink-0" />
                  <span className="font-semibold flex-shrink-0">Transcribed:</span>
                  <span className="italic truncate">&quot;{speechTranscript}&quot;</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => sendMessage(input)} className="app-primary-button py-1 px-3 text-xs min-h-[28px] rounded-lg">
                    Send
                  </button>
                  <button onClick={() => { setSpeechTranscript(null); setInput(""); }} className="btn-icon w-7 h-7">
                    <MaterialIcon name="close" size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Main input row */}
            <div className="composer">
              <div className="composer-input-row">
                <input
                  type="text"
                  className="composer-input"
                  placeholder="Ask Mithra about standards, schemes, labs, or HUID verification..."
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

                <button
                  className="send-button"
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  {isLoading ? <MaterialIcon name="progress_activity" size={18} className="animate-spin" /> : <MaterialIcon name="send" size={18} />}
                </button>
              </div>

              <div className="composer-tools">
                <button
                  className="composer-tool"
                  onClick={() => setShowPhotoUpload(true)}
                  title="Upload photo"
                  aria-label="Upload photo of product or hallmark"
                >
                  <MaterialIcon name="photo_camera" size={18} />
                  <span>Photo</span>
                </button>

                <button
                  onClick={toggleVoiceRecording}
                  className={`composer-tool primary ${isRecording ? "recording" : ""}`}
                  title={isRecording ? "Stop recording" : "Record voice"}
                  aria-label={isRecording ? "Stop recording" : "Record voice inquiry"}
                >
                  {isRecording ? (
                    <div className="flex items-center gap-0.5 h-5">
                      {[0,1,2,3,4].map((i) => <div key={i} className="waveform-bar" />)}
                    </div>
                  ) : (
                  <MaterialIcon name="mic" size={18} />
                  )}
                  <span>{isRecording ? "Listening" : "Speak"}</span>
                </button>
              </div>
            </div>

            <p className="composer-disclaimer">
              Grounded answers with citations where available. Verify critical compliance decisions with BIS.
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
            className="photo-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--color-text-primary)] font-bold text-base">Capture Image for BIS Analysis</h3>
              <button className="btn-icon w-8 h-8" onClick={() => setShowPhotoUpload(false)}>
                <MaterialIcon name="close" size={18} />
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
                  <MaterialIcon name="memory" size={20} />
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
                  <MaterialIcon name="workspace_premium" size={20} />
                </div>
                <div className="text-sm font-bold">Hallmark Stamp</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Laser HUID OCR verification</div>
              </button>
            </div>

            {/* Hallmark scanning guide overlay preview */}
            {photoMode === "hallmark" && (
              <div className="mb-4 p-4 rounded-xl bg-[var(--gray-50)] border border-[var(--color-border)] text-center space-y-2">
                <span className="text-xs font-semibold text-[var(--blue-600)] uppercase block">
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
              className="app-primary-button w-full justify-center text-sm"
            >
              <MaterialIcon name="upload_file" size={18} />
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
          <MaterialIcon name="progress_activity" size={38} className="animate-spin text-[var(--blue-600)]" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
