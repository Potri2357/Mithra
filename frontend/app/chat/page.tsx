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
  Globe,
  ChevronLeft,
  AlertCircle,
  BookOpen,
  X,
  Upload,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INTENT_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  standard_lookup: { label: "Standards Q&A", color: "badge-info", emoji: "📖" },
  recommend_standard: { label: "Standard Recommender", color: "badge-warning", emoji: "🎯" },
  scheme_guide: { label: "Certification Guidance", color: "badge-info", emoji: "🛡️" },
  hallmark_verify: { label: "Hallmark Verify", color: "badge-valid", emoji: "💎" },
  lab_finder: { label: "Lab Finder", color: "badge-info", emoji: "🔬" },
  consumer_query: { label: "Consumer Help", color: "badge-info", emoji: "👤" },
};

const SUGGESTIONS = [
  "I manufacture LED bulbs, which standard applies?",
  "How do I get ISI certification? Step by step",
  "Verify HUID AA123456",
  "Find testing labs for cables in Maharashtra",
  "What is the difference between ISI and CRS?",
  "मैं दबाव कुकर बनाता हूँ, क्या IS नंबर है?",
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
  return (
    <div
      className="fixed right-0 top-0 h-full w-80 z-50 flex flex-col"
      style={{
        background: "var(--surface-1)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: "var(--saffron-light)" }} />
          <span className="text-white font-semibold text-sm">Sources</span>
        </div>
        <button className="btn-icon w-7 h-7" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {citations.map((c, i) => (
          <div
            key={i}
            className="p-3 rounded-xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--saffron)", color: "white" }}
              >
                {i + 1}
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--saffron-light)" }}>
                {c.source || "BIS Source"}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {c.text?.slice(0, 200)}…
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: "var(--saffron)", animationDelay: `${i * 0.2}s` }}
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send initial query from landing page
  useEffect(() => {
    if (initialQuery) {
      setTimeout(() => sendMessage(initialQuery), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (text: string = input.trim()) => {
      if (!text || isLoading) return;
      setInput("");

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
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content:
                    "⚠️ Unable to reach the BIS AI backend. Please ensure the backend server is running at `" +
                    API_URL +
                    "`. Check the README for setup instructions.",
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
      alert("Microphone access denied. Please allow microphone access to use voice input.");
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
      content: "🎤 [Voice message]",
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

      // Update user message with transcript
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsg.id
            ? { ...m, content: `🎤 "${data.transcript || "Voice message"}"` }
            : m
        )
      );

      // Update AI message
      let audioUrl: string | undefined;
      if (data.audio_base64) {
        const ab = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
        const audioBlob = new Blob([ab], { type: "audio/wav" });
        audioUrl = URL.createObjectURL(audioBlob);
        // Auto-play
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
            ? { ...m, content: "⚠️ Voice processing failed. Please try again.", isLoading: false }
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
      content: `📸 [Photo uploaded — ${mode === "product" ? "Product classification" : "Hallmark verification"}]`,
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

      let content = data.answer || data.error || "Processing complete.";
      if (data.classification) {
        const c = data.classification;
        content = `**📸 Product Detected:** ${c.product_name} (${c.category})\n**Confidence:** ${Math.round((c.confidence || 0) * 100)}%\n\n---\n\n${content}`;
      }
      if (data.huid) {
        content = `**🔍 HUID Extracted:** \`${data.huid}\`\n\n---\n\n${content}`;
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
            ? { ...m, content: "⚠️ Photo processing failed. Please try again.", isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Hidden audio element for TTS playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsSpeaking(false)}
        style={{ display: "none" }}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handlePhotoUpload(f, photoMode);
          e.target.value = "";
        }}
      />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "var(--surface-1)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="btn-icon w-8 h-8">
              <ChevronLeft size={16} />
            </button>
          </Link>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C38)" }}
          >
            B
          </div>
          <div>
            <div className="text-white font-semibold text-sm">BIS Saathi</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              AI Assistant • {language === "hi" ? "हिंदी" : "English"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            className="btn-ghost py-1.5 px-3 text-xs gap-1.5"
            onClick={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
          >
            <Globe size={13} />
            {language === "en" ? "EN → हिंदी" : "HI → English"}
          </button>

          {/* TTS status */}
          {isSpeaking && (
            <button
              className="btn-icon w-8 h-8"
              onClick={() => {
                audioRef.current?.pause();
                setIsSpeaking(false);
              }}
            >
              <VolumeX size={14} />
            </button>
          )}
        </div>
      </header>

      {/* ── Messages ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center pt-12">
            <div className="text-5xl mb-4">🤝</div>
            <h2 className="text-xl font-bold text-white mb-2">नमस्ते! Hello!</h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Ask me anything about Indian Standards, BIS certification, hallmarking, or testing labs.
              I can also understand Hindi and process photos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--saffron)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--saffron-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
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
            <div
              className={`max-w-2xl w-full ${msg.role === "user" ? "ml-12" : "mr-12"}`}
            >
              {/* Intent badge for AI messages */}
              {msg.role === "assistant" && msg.intent && !msg.isLoading && (
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`intent-badge ${INTENT_CONFIG[msg.intent]?.color || "badge-info"}`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {INTENT_CONFIG[msg.intent]?.emoji} {INTENT_CONFIG[msg.intent]?.label}
                  </span>
                  {msg.abstained && (
                    <span className="intent-badge badge-warning" style={{ fontSize: "0.65rem" }}>
                      <AlertCircle size={10} /> Abstained
                    </span>
                  )}
                </div>
              )}

              <div className={msg.role === "user" ? "msg-user p-4" : "msg-ai p-5"}>
                {msg.isLoading ? (
                  <TypingIndicator />
                ) : msg.role === "user" ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="prose-bis">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Render [S1] citation markers as badges
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
                                    <span
                                      key={i}
                                      className="citation-badge"
                                      onClick={() =>
                                        msg.citations && setShowCitations(msg.citations)
                                      }
                                      title={msg.citations?.[idx]?.source || "Source"}
                                    >
                                      {match[1]}
                                    </span>
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

              {/* Citations + Audio row */}
              {msg.role === "assistant" && !msg.isLoading && (
                <div className="flex items-center gap-3 mt-2 px-1">
                  {msg.citations && msg.citations.length > 0 && (
                    <button
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: "var(--saffron-light)" }}
                      onClick={() => setShowCitations(msg.citations!)}
                    >
                      <BookOpen size={12} />
                      {msg.citations.length} source{msg.citations.length > 1 ? "s" : ""}
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}
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
                  >
                    <Volume2 size={12} />
                    {isSpeaking ? "Speaking..." : "Listen"}
                  </button>
                  {msg.follow_up && (
                    <button
                      className="text-xs transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onClick={() => sendMessage(msg.follow_up!)}
                    >
                      💡 {msg.follow_up}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Photo Upload Modal ─────────────────────────────────────────── */}
      {showPhotoUpload && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowPhotoUpload(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-t-3xl"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-4">Upload Photo</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["product", "hallmark"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPhotoMode(mode)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: photoMode === mode ? "var(--saffron-dim)" : "var(--surface-2)",
                    border: `1px solid ${photoMode === mode ? "var(--saffron)" : "var(--border)"}`,
                  }}
                >
                  <div className="text-2xl mb-2">{mode === "product" ? "📦" : "💍"}</div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: photoMode === mode ? "var(--saffron-light)" : "white" }}
                  >
                    {mode === "product" ? "Product Photo" : "Hallmark Stamp"}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {mode === "product"
                      ? "Get standard recommendation"
                      : "Verify HUID authenticity"}
                  </div>
                </button>
              ))}
            </div>
            <button
              className="btn-primary w-full justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Choose Photo
            </button>
          </div>
        </div>
      )}

      {/* ── Input Bar ─────────────────────────────────────────────────── */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ background: "var(--surface-1)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          {/* Photo button */}
          <button
            className="btn-icon flex-shrink-0"
            onClick={() => setShowPhotoUpload(true)}
            title="Upload photo"
          >
            <Camera size={18} />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              className="input-bis resize-none pr-4"
              rows={1}
              placeholder={
                language === "hi"
                  ? "हिंदी में पूछें या अंग्रेजी में..."
                  : "Ask about IS standards, certification, hallmarking..."
              }
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ minHeight: "46px", maxHeight: "160px" }}
            />
          </div>

          {/* Voice button */}
          <button
            className={`btn-record flex-shrink-0 ${isRecording ? "recording pulse-record" : ""}`}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send button */}
          <button
            className="btn-primary py-2.5 px-4 flex-shrink-0"
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>

        <p
          className="text-center text-xs mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          Informational only — verify with BIS for certification decisions • BIS Helpline: 1800-11-4000
        </p>
      </div>

      {/* ── Citation Side Panel ────────────────────────────────────────── */}
      {showCitations && (
        <CitationPanel citations={showCitations} onClose={() => setShowCitations(null)} />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center" style={{background:"var(--surface-0)"}}>
      <Loader2 size={32} className="animate-spin" style={{color:"var(--saffron)"}} />
    </div>}>
      <ChatContent />
    </Suspense>
  );
}
