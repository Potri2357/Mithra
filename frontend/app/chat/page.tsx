"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  ShieldCheck,
  Award,
  FlaskConical,
  ShieldAlert,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Moon,
  Sun,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Download,
  X,
  Loader2,
  Camera,
  Mic,
  Cpu,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,

  Upload,
  Hammer,
  Calculator,
  Scale,
  MessageSquare,
  FolderKanban,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BisLoadingIndicator } from "@/components/BisLoadingIndicator";
import { MithraLogo } from "@/components/MithraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useLanguage } from "@/context/LanguageContext";
import { useProjects } from "@/context/ProjectContext";
import {
  getWorkspaceName,
  getWorkspaceDesc,
  getWorkspaceScheme,
  getWorkspaceCategory,
  getQuickStartCards,
  getWorkspaceGemStarters,
} from "@/lib/workspaceHelpers";

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
  follow_ups?: string[];
  audioUrl?: string;
  isLoading?: boolean;
}

const QUICK_START_CARDS = [
  {
    title: "Find Indian Standard (IS)",
    desc: "Search IS number & QCO by product name",
    query: "Which Indian Standard (IS number) applies to my product?",
    icon: BookOpen,
    color: "text-[#0052CC] dark:text-[#E6E4DD]",
    bg: "bg-blue-50 dark:bg-[#2B2A26]",
  },
  {
    title: "Certification Schemes",
    desc: "Compare ISI Mark Scheme I vs CRS Scheme II",
    query: "Explain the difference between ISI Mark Scheme I and CRS Scheme II",
    icon: ShieldCheck,
    color: "text-[#059669] dark:text-[#E6E4DD]",
    bg: "bg-emerald-50 dark:bg-[#2B2A26]",
  },
  {
    title: "Verify Hallmark & HUID",
    desc: "Decode 6-character gold hallmark authenticity",
    query: "How do I verify a 6-digit gold hallmark HUID code?",
    icon: Award,
    color: "text-[#D97706] dark:text-[#E6E4DD]",
    bg: "bg-amber-50 dark:bg-[#2B2A26]",
  },
  {
    title: "Accredited Testing Labs",
    desc: "Locate NABL & BIS testing facilities nearby",
    query: "Find accredited laboratories for testing LED lamps or electrical items",
    icon: FlaskConical,
    color: "text-[#7C3AED] dark:text-[#E6E4DD]",
    bg: "bg-purple-50 dark:bg-[#2B2A26]",
  },
];

// ─── Chat Session Types ──────────────────────────────────────────────────────
interface ChatSession {
  id: string;
  title: string;       // first user message, truncated
  createdAt: number;
  messages: Message[];
  projectId?: string | null;
}

const SESSIONS_KEY = "mithra-sessions";
const MAX_SESSIONS = 20;

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  try {
    // Keep newest MAX_SESSIONS only
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
  } catch { /* storage full — ignore */ }
}

function upsertSession(sessions: ChatSession[], session: ChatSession): ChatSession[] {
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    const updated = [...sessions];
    updated[idx] = session;
    return updated;
  }
  return [session, ...sessions];
}

function ConfidenceBadge({ confidence, abstained }: { confidence?: "High" | "Medium" | "Unverified"; abstained?: boolean }) {
  if (abstained || confidence === "Unverified") {
    return (
      <span className="confidence-badge confidence-badge-abstained">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>Unverified — Abstained from guessing</span>
      </span>
    );
  }
  return null;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialViewParam = searchParams.get("view");

  // Redirect legacy /chat?view=... directly to the dedicated portal page
  useEffect(() => {
    if (
      initialViewParam === "standards" ||
      initialViewParam === "schemes" ||
      initialViewParam === "hallmark" ||
      initialViewParam === "labs" ||
      initialViewParam === "consumer"
    ) {
      router.replace(`/${initialViewParam}`);
    }
  }, [initialViewParam, router]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => crypto.randomUUID());
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState(initialQuery);
  const { language, cycleLanguage, langLabel, t } = useLanguage();
  const { projects, activeProject, activeProjectId, setActiveProject, createProject } = useProjects();
  const isDark = useDarkMode();
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Electrical & Electronics");
  const [newProjectScheme, setNewProjectScheme] = useState("Scheme I (ISI Mark)");
  const [newProjectStandards, setNewProjectStandards] = useState("");
  const [newProjectInstructions, setNewProjectInstructions] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const pinned = newProjectStandards
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const created = createProject({
      name: newProjectName.trim(),
      description: `Compliance workspace dedicated to ${newProjectScheme} for ${newProjectCategory}.`,
      category: newProjectCategory,
      scheme: newProjectScheme,
      instructions: newProjectInstructions.trim(),
      pinnedStandards: pinned,
      isStarred: false,
    });

    setActiveProject(created.id);
    setShowCreateProjectModal(false);
    setNewProjectName("");
    setNewProjectStandards("");
    setNewProjectInstructions("");
  };

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Record<string, boolean>>({});

  const toggleWorkspaceExpanded = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [projectId]: prev[projectId] === undefined ? false : !prev[projectId],
    }));
  };

  // Load sessions and saved theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    setSessions(loadSessions());
    const saved = (localStorage.getItem("mithra-theme") || localStorage.getItem("maanak-theme")) as "light" | "dark" | null;
    if (saved && (saved === "light" || saved === "dark")) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);

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
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [confirmClearChat, setConfirmClearChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const initialQuerySentRef = useRef(false);

  // Sync theme changes after mount
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("mithra-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // Ensure window is anchored at top and disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Scroll message thread to bottom ONLY when messages exist
  useEffect(() => {
    if (messages.length > 0 && threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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
        const langCode = language;
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            language: langCode,
            context: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            project_context: activeProject ? {
              name: activeProject.name,
              scheme: activeProject.scheme,
              instructions: activeProject.instructions,
              pinnedStandards: activeProject.pinnedStandards,
            } : null,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // ── Guard: detect raw JSON leaking as the answer ──────────────────────
        let safeAnswer: string = data.answer || "";
        const trimmed = safeAnswer.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.answer && typeof parsed.answer === "string") {
              // The model wrapped its answer in a JSON envelope — unwrap it
              safeAnswer = parsed.answer;
              if (!data.citations?.length && parsed.citations) data.citations = parsed.citations;
              if (!data.follow_ups?.length && parsed.follow_ups) data.follow_ups = parsed.follow_ups;
              if (!data.follow_up && parsed.follow_up) data.follow_up = parsed.follow_up;
            } else {
              safeAnswer = "I encountered an internal formatting error. Please try again.";
            }
          } catch {
            safeAnswer = "I encountered an internal formatting error. Please try again.";
          }
        }
        // ─────────────────────────────────────────────────────────────────────

        // Determine confidence: if abstained -> Unverified, if citations >= 1 -> High, else Medium
        const confidence: "High" | "Medium" | "Unverified" = data.abstained ? "Unverified" : (data.citations && data.citations.length > 0) ? "High" : "Medium";

        // Normalise follow_ups to always be a clean string[]
        const rawFollowUps: unknown = data.follow_ups;
        const safeFollowUps: string[] = Array.isArray(rawFollowUps)
          ? (rawFollowUps as unknown[]).filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          : data.follow_up
          ? [data.follow_up as string]
          : [];

        // Auto-save session to localStorage
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content: safeAnswer,
                  citations: data.citations,
                  intent: data.intent,
                  abstained: data.abstained,
                  confidence,
                  follow_up: safeFollowUps[0] ?? data.follow_up,
                  follow_ups: safeFollowUps,
                  isLoading: false,
                }
              : m
          );
          // Persist to localStorage
          const firstUserMsg = updated.find((m) => m.role === "user");
          if (firstUserMsg) {
            const session: ChatSession = {
              id: currentSessionId,
              title: firstUserMsg.content.slice(0, 50),
              createdAt: Date.now(),
              messages: updated,
              projectId: activeProjectId || undefined,
            };
            const existing = loadSessions();
            const next = upsertSession(existing, session);
            saveSessions(next);
            setSessions(next);
          }
          return updated;
        });

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
    [input, language, isLoading, messages, activeProject, activeProjectId, currentSessionId]
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
      rec.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-IN";

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
      fd.append("language", language);

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

  const clearChat = (targetProjectId?: string | null) => {
    // Save current session before clearing (if it has messages)
    if (messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (firstUserMsg) {
        const session: ChatSession = {
          id: currentSessionId,
          title: firstUserMsg.content.slice(0, 50),
          createdAt: Date.now(),
          messages,
          projectId: activeProjectId || undefined,
        };
        const existing = loadSessions();
        const next = upsertSession(existing, session);
        saveSessions(next);
        setSessions(next);
      }
    }
    // Start fresh session
    setMessages([]);
    setInput("");
    setSpeechTranscript(null);
    setCurrentSessionId(crypto.randomUUID());
    if (targetProjectId !== undefined) {
      setActiveProject(targetProjectId);
    }
  };

  const loadSession = (session: ChatSession) => {
    // Save current session first
    if (messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (firstUserMsg) {
        const current: ChatSession = {
          id: currentSessionId,
          title: firstUserMsg.content.slice(0, 50),
          createdAt: Date.now(),
          messages,
          projectId: activeProjectId || undefined,
        };
        const existing = loadSessions();
        const next = upsertSession(existing, current);
        saveSessions(next);
        setSessions(next);
      }
    }
    // Load the selected session
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setActiveProject(session.projectId || null);
    setInput("");
    setSpeechTranscript(null);
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = loadSessions();
    const next = existing.filter((s) => s.id !== sessionId);
    saveSessions(next);
    setSessions(next);
    // If deleting the active session, clear the chat
    if (sessionId === currentSessionId) {
      setMessages([]);
      setInput("");
      setCurrentSessionId(crypto.randomUUID());
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
      className="mithra-chat-shell fixed inset-0 flex text-[var(--color-text-body)] overflow-hidden"
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
        <div className="absolute inset-0 z-50 bg-[#024DA1]/90 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center pointer-events-none text-white">
          <Upload className="w-12 h-12 text-white mb-3" />
          <h2 className="text-xl font-bold">Drop image for Mithra analysis</h2>
          <p className="text-xs text-blue-100 mt-1">Product photos and hallmark stamps are supported</p>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ── Collapsible Left Sidebar (ChatGPT style with history & portal links) ── */}
      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 w-[275px] transition-all duration-200 lg:relative lg:h-full flex flex-col ${
          sidebarOpen
            ? "translate-x-0 lg:w-[275px]"
            : "-translate-x-full lg:w-0 lg:overflow-hidden lg:border-r-0 lg:p-0"
        }`}
      >
        {/* Pinned Top Brand Bar */}
        <div className="sidebar-brand flex items-center justify-between p-3 shrink-0 border-b border-slate-200/80 dark:border-[#34332E] bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md">
          <button
            type="button"
            onClick={() => clearChat()}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left bg-transparent border-0 cursor-pointer p-0 group"
            title="Mithra Home"
          >
            <MithraLogo size={32} darkMode={isDark} className="shadow-xs group-hover:scale-105 transition-transform shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-extrabold text-[15px] text-[var(--color-text-primary)] block leading-tight">
                Mithra
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] font-semibold truncate block">Bureau of Indian Standards</span>
            </div>
          </button>
          <button
            className="btn-icon w-8 h-8 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2B2A26] rounded-lg transition-colors flex items-center justify-center cursor-pointer shrink-0"
            onClick={() => setSidebarOpen(false)}
            title="Collapse sidebar"
            aria-label="Toggle sidebar"
          >
            <Hammer className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Middle Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0">
          {/* + New Chat Button (Section 3.3) */}
          <button
            onClick={() => clearChat(activeProjectId)}
            className="new-chat-button"
          >
            <Plus className="w-4 h-4 text-[#0052CC] dark:text-[#9C9A91]" />
            <span>{activeProject ? `New Chat · ${activeProject.name.split(" ")[0]}` : t("chat.newChat")}</span>
          </button>

          {/* Compliance Workspaces (Gemini Gems Style) */}
          <div className="sidebar-nav pt-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="sidebar-section-label flex items-center gap-1.5 text-slate-700 dark:text-[#D4D2C9] font-bold text-[11px] uppercase tracking-wider">
                <FolderKanban className="w-3.5 h-3.5 text-slate-500 dark:text-[#A8A69E]" />
                <span>{t("projects.workspaces") || "Workspaces"}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreateProjectModal(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 dark:bg-[#2B2A26] dark:hover:bg-[#34332E] dark:border-[#3D3B35] dark:text-[#E6E4DD] dark:hover:text-[#F5F4ED] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group"
                title={t("projects.createWorkspaceTitle") || "Create new compliance workspace"}
              >
                <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-[#9C9A91] group-hover:text-slate-800 dark:group-hover:text-[#F5F4ED] transition-colors" />
                <span>{t("projects.new") || "New"}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {projects.map((p) => {
                const isCurActive = activeProjectId === p.id;
                const isExpanded = expandedWorkspaces[p.id] ?? isCurActive;
                const workspaceSessions = sessions.filter((s) => s.projectId === p.id);
                const localizedName = getWorkspaceName(p, language);

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isCurActive
                        ? "bg-amber-500/10 border-amber-500/30 dark:bg-[#2B2A26]/80 dark:border-[#4A473E]"
                        : "bg-slate-50/50 border-slate-200/60 dark:bg-[#1E1D19]/40 dark:border-[#2C2A24]"
                    }`}
                  >
                    {/* Workspace Header */}
                    <div
                      onClick={() => {
                        if (!isCurActive) {
                          setActiveProject(p.id);
                        }
                        toggleWorkspaceExpanded(p.id);
                      }}
                      className="group flex items-center justify-between px-2.5 py-2 cursor-pointer select-none"
                      title={`${localizedName} — ${t("projects.openWorkspace") || "Click to open workspace"}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderKanban
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isCurActive
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-500 dark:text-[#A8A69E]"
                          }`}
                        />
                        <span
                          className={`truncate text-xs font-semibold ${
                            isCurActive
                              ? "text-amber-900 dark:text-[#F5F4ED]"
                              : "text-slate-800 dark:text-[#D4D2C9] group-hover:text-slate-950 dark:group-hover:text-white"
                          }`}
                        >
                          {localizedName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isCurActive && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                            {t("projects.active") || "Active"}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => toggleWorkspaceExpanded(p.id, e)}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Chats in this Workspace (Gem-style) */}
                    {isExpanded && (
                      <div className="px-2 pb-2 pt-0.5 border-t border-slate-200/40 dark:border-[#34332E]/60 space-y-1">
                        {/* New chat inside this workspace */}
                        <button
                          type="button"
                          onClick={() => clearChat(p.id)}
                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 dark:text-[#E6E4DD] dark:hover:text-white dark:hover:bg-[#34332E] transition-colors text-left cursor-pointer"
                        >
                          <Plus className="w-3 h-3 shrink-0" />
                          <span className="truncate">{t("projects.newChatInWorkspace") || "New chat in workspace"}</span>
                        </button>

                        {/* List of workspace chat sessions */}
                        {workspaceSessions.length === 0 ? (
                          <span className="text-[11px] text-slate-400 dark:text-[#8C8A82] px-2 py-1 block italic">
                            {t("projects.noChatsInWorkspace") || "No chats yet"}
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {workspaceSessions.map((session) => (
                              <div
                                key={session.id}
                                onClick={() => loadSession(session)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    loadSession(session);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                className={`recent-link cursor-pointer text-left w-full group flex items-center justify-between gap-1 pl-2 pr-1.5 py-1 rounded-md text-[11px] ${
                                  session.id === currentSessionId
                                    ? "bg-amber-500/20 text-amber-900 dark:bg-[#34332E] dark:text-[#F5F4ED] font-semibold"
                                    : "text-slate-700 dark:text-[#C4C2B9] hover:bg-slate-200/50 dark:hover:bg-[#2B2A26]"
                                }`}
                              >
                              <span className="truncate flex-1">{session.title}</span>
                                {deletingSessionId === session.id ? (
                                  <span className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id, e); setDeletingSessionId(null); }}
                                      className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                      title="Confirm delete"
                                      aria-label="Confirm delete"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); setDeletingSessionId(null); }}
                                      className="p-0.5 rounded text-slate-400 dark:text-[#9C9A91] hover:bg-slate-200/60 dark:hover:bg-[#34332E] transition-colors"
                                      title="Cancel"
                                      aria-label="Cancel delete"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ) : (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setDeletingSessionId(session.id); }}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 dark:text-[#9C9A91] hover:text-red-500 transition-opacity shrink-0"
                                  title="Delete chat"
                                  aria-label="Delete chat"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Portals */}
          <nav className="sidebar-nav">
            <span className="sidebar-section-label">
              <span>{t("nav.portals")}</span>
            </span>

            {/* Standards Directory */}
            <a
              href="/standards?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Indian Standards directory in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.standards")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* Certification Schemes */}
            <a
              href="/schemes?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Certification Schemes in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.schemes")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* Hallmark & HUID */}
            <a
              href="/hallmark?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Hallmark Verification in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Award className="w-4 h-4 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.hallmark")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* Accredited Labs */}
            <a
              href="/labs?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Accredited Labs in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FlaskConical className="w-4 h-4 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.labs")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* Consumer Redressal */}
            <a
              href="/consumer?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Consumer Redressal in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.consumer")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005EB8] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>
          </nav>

          {/* Interactive Tools */}
          <nav className="sidebar-nav pt-2 border-t border-slate-200/60 dark:border-[#34332E]">
            <span className="sidebar-section-label flex items-center gap-1 text-[#0052CC] dark:text-[#9C9A91]">
              <Sparkles className="w-3 h-3 text-[#0052CC] dark:text-[#9C9A91]" />
              <span>{t("nav.tools")}</span>
            </span>

            {/* Cost & Timeline Estimator */}
            <a
              href="/tools/cost-estimator?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Cost & Timeline Estimator in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calculator className="w-4 h-4 text-slate-400 group-hover:text-[#0052CC] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.estimator")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0052CC] dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* Guided Complaint Drafter */}
            <a
              href="/tools/complaint-drafter?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open Guided Complaint Drafter in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Scale className="w-4 h-4 text-slate-400 group-hover:text-rose-600 dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.complaintDrafter")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>

            {/* WhatsApp Simulator */}
            <a
              href="/tools/whatsapp?standalone=1"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link flex items-center justify-between group rounded-lg text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26] hover:text-slate-900 dark:hover:text-[#F5F4ED] transition-colors px-3 py-2 cursor-pointer"
              title="Open WhatsApp Assistant Simulator in new tab"
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] shrink-0" />
                <span className="truncate text-[13px] font-medium">{t("nav.whatsapp")}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:text-[#9C9A91] dark:group-hover:text-[#F5F4ED] transition-colors shrink-0" />
            </a>
          </nav>

          {/* General / Uncategorized Chats */}
          <div className="sidebar-nav pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="sidebar-section-label">
                <span>General Chats</span>
              </span>
              {activeProjectId && (
                <button
                  type="button"
                  onClick={() => clearChat(null)}
                  className="text-[10px] font-semibold text-blue-600 dark:text-[#D4D2C9] dark:hover:text-white hover:underline cursor-pointer"
                >
                  + New General
                </button>
              )}
            </div>

            {sessions.filter((s) => !s.projectId).length === 0 ? (
              <span className="text-xs text-slate-400 dark:text-[#8C8A82] px-3 py-1 block italic">
                {t("chat.noHistory")}
              </span>
            ) : (
              <div className="space-y-0.5">
                {sessions
                  .filter((s) => !s.projectId)
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          loadSession(session);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`recent-link cursor-pointer text-left w-full group flex items-center justify-between gap-1 ${
                        session.id === currentSessionId && !activeProjectId
                          ? "bg-blue-50 dark:bg-[#2B2A26] text-[#005EB8] dark:text-[#E6E4DD] font-semibold"
                          : ""
                      }`}
                    >
                      <span className="truncate flex-1 text-xs">{session.title}</span>
                      {deletingSessionId === session.id ? (
                        <span className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); deleteSession(session.id, e); setDeletingSessionId(null); }}
                            className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Confirm delete"
                            aria-label="Confirm delete"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setDeletingSessionId(null); }}
                            className="p-0.5 rounded text-slate-400 dark:text-[#9C9A91] hover:bg-slate-200/60 dark:hover:bg-[#34332E] transition-colors"
                            title="Cancel"
                            aria-label="Cancel delete"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDeletingSessionId(session.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 dark:text-[#9C9A91] hover:text-red-500 transition-opacity"
                        title="Delete session"
                        aria-label="Delete session"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Bottom Tools */}
        <div className="sidebar-tools shrink-0 p-3 border-t border-slate-200/80 dark:border-[#34332E] bg-white/95 dark:bg-[#181816]/95 flex items-center gap-2">
          <button
            onClick={exportTranscript}
            disabled={messages.length === 0}
            className="sidebar-tool-button flex-1"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-[#9C9A91]" />
            <span>Export</span>
          </button>
          {confirmClearChat ? (
            <span className="flex-1 flex items-center justify-center gap-1">
              <button
                onClick={() => { clearChat(); setConfirmClearChat(false); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors"
                title="Confirm clear"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>
              <button
                onClick={() => setConfirmClearChat(false)}
                className="w-8 py-1.5 flex items-center justify-center rounded-md text-slate-400 dark:text-[#9C9A91] hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ) : (
          <button
            onClick={() => setConfirmClearChat(true)}
            disabled={messages.length === 0}
            className="sidebar-tool-button danger flex-1"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-[#9C9A91]" />
            <span>Clear</span>
          </button>
          )}
        </div>
      </aside>

      {/* ── Main Chat Area (Clean canvas without header bar) ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Floating Sidebar Toggle (when sidebar collapsed) */}
        {!sidebarOpen && (
          <button
            className="absolute top-3.5 left-3.5 z-30 w-8 h-8 rounded-lg bg-white/80 dark:bg-[#21201C]/90 border border-slate-200 dark:border-[#34332E] text-slate-600 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED] hover:bg-slate-100 dark:hover:bg-[#2B2A26] backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            title="Expand sidebar"
          >
            <Hammer className="w-4 h-4" />
          </button>
        )}

        {/* Floating Top-Right Controls: Language & Theme */}
        <div className="absolute top-3.5 right-4 z-20 flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={cycleLanguage}
            className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg bg-white/80 dark:bg-[#21201C]/90 border border-slate-200 dark:border-[#34332E] text-xs font-semibold text-slate-700 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED] hover:bg-slate-100 dark:hover:bg-[#2B2A26] backdrop-blur-md transition-colors cursor-pointer shadow-xs"
            title={t("nav.switchLang")}
            aria-label={`Current language: ${langLabel}. Click to cycle.`}
          >
            <span className="text-[11px] font-bold text-[#005EB8] dark:text-[#E6E4DD]">{langLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-[#9C9A91]" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-lg bg-white/80 dark:bg-[#21201C]/90 border border-slate-200 dark:border-[#34332E] text-slate-600 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED] hover:bg-slate-100 dark:hover:bg-[#2B2A26] backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            title={mounted && theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
            aria-label="Toggle dark/light mode"
            suppressHydrationWarning
          >
            {mounted && theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#9C9A91]" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {messages.length > 0 && (
            <button
              onClick={exportTranscript}
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg bg-white/80 dark:bg-[#21201C]/90 border border-slate-200 dark:border-[#34332E] text-xs font-semibold text-slate-700 dark:text-[#9C9A91] hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors cursor-pointer shadow-xs"
              title="Export Consultation"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-[#9C9A91]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {isSpeaking && (
            <button
              className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-[#2B2A26] border border-blue-200 dark:border-[#34332E] text-blue-600 dark:text-[#9C9A91] hover:text-red-500 flex items-center justify-center cursor-pointer"
              onClick={() => {
                audioRef.current?.pause();
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
              }}
              aria-label="Stop audio speech playback"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Workspace Context Banner (ChatGPT & Claude Style) */}
        {activeProject && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 truncate">
              <FolderKanban className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold text-amber-900 dark:text-amber-200">{t("projects.activeWorkspace") || "Active Workspace"}:</span>
              <span className="font-semibold text-slate-800 dark:text-[#F5F4ED] truncate">{getWorkspaceName(activeProject, language)}</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                {getWorkspaceScheme(activeProject.scheme, language)}
              </span>
              <span className="hidden md:inline text-[11px] text-slate-500 dark:text-[#9C9A91]">
                ({activeProject.pinnedStandards.length} standards injected)
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/projects/${activeProject.id}`}
                className="font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>{t("projects.workspaces") || "Workspace"}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1 rounded hover:bg-amber-500/20 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                title={t("projects.exitWorkspace") || "Exit workspace context"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Chatbot Message Thread */}
        <main ref={threadRef} className="message-thread flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            /* ── Empty State ── */
            <div className="empty-state">
              {activeProject ? (
                /* ── Workspace Gem Empty Hero ── */
                <>
                  <div className="empty-hero animate-fade-up">
                    <div className="flex items-center justify-center mx-auto mb-3">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-[#2B2A26] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                        <FolderKanban className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>{t("projects.workspaceGem") || "WORKSPACE GEM"}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#2B2A26] text-slate-700 dark:text-[#E6E4DD]">
                          {getWorkspaceScheme(activeProject.scheme, language)}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {getWorkspaceName(activeProject, language)}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                        {getWorkspaceDesc(activeProject, language)}
                      </p>
                      {activeProject.pinnedStandards.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          {activeProject.pinnedStandards.map((std, idx) => (
                            <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#2B2A26] text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-[#3D3B35]">
                              {std}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Workspace Quick-Start Grid */}
                  <div className="quick-start-grid">
                    {getWorkspaceGemStarters(activeProject, language).map((card, i) => (
                      <button
                        key={card.title}
                        onClick={() => sendMessage(card.query)}
                        className="quick-start-card group animate-fade-up"
                        style={{ animationDelay: `${i * 0.05}s` }}
                        type="button"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${card.bg} ${card.color}`}>
                          <card.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0052CC] dark:group-hover:text-white transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {card.desc}
                          </p>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 dark:text-[#9C9A91] dark:group-hover:text-white"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                /* ── General Mithra Empty Hero ── */
                <>
                  <div className="empty-hero animate-fade-up">
                    <div className="flex items-center justify-center mx-auto mb-3">
                      <MithraLogo size={68} darkMode={isDark} className="shadow-lg shadow-sky-500/10 hover:scale-105 transition-transform" />
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0052CC] dark:bg-[#2B2A26] dark:border-[#3D3B35] dark:text-[#F5F4ED]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{t("chat.emptyHeroBadge")}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {t("chat.emptyHeroTitle")}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                        {t("chat.emptyHeroSubtitle")}
                      </p>
                    </div>
                  </div>

                  {/* Quick-Start Grid */}
                  <div className="quick-start-grid">
                    {getQuickStartCards(language).map((card, i) => (
                      <button
                        key={card.title}
                        onClick={() => sendMessage(card.query)}
                        className="quick-start-card group animate-fade-up"
                        style={{ animationDelay: `${i * 0.05}s` }}
                        type="button"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${card.bg} ${card.color}`}>
                          <card.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0052CC] dark:group-hover:text-white transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {card.desc}
                          </p>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 dark:text-[#9C9A91] dark:group-hover:text-white"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${msg.role === "user" ? "message-row-user" : "message-row-assistant"} bubble-enter`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="assistant-avatar select-none" title="Mithra AI Assistant">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#2B2A26] border border-blue-200/80 dark:border-[#3D3B35] shadow-xs flex items-center justify-center">
                      <MithraLogo size={20} darkMode={isDark} />
                    </div>
                  </div>
                )}

                {/* Chat Bubble */}
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
                  {msg.role === "assistant" && (
                    <div className="assistant-meta">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[var(--color-text-primary)]">
                          {activeProject ? getWorkspaceName(activeProject, language) : (t("brand.title") || "Mithra")}
                        </span>
                        {activeProject && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-[#342F24] dark:text-amber-300 font-medium">
                            {getWorkspaceScheme(activeProject.scheme, language)}
                          </span>
                        )}
                      </div>
                      <ConfidenceBadge confidence={msg.confidence} abstained={msg.abstained} />
                    </div>
                  )}

                  {msg.isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <BisLoadingIndicator size="lg" />
                    </div>
                  ) : (
                    <div className="prose-bis text-[var(--color-text-body)]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Abstention human contact notice (Section 3.3) */}
                  {msg.abstained && !msg.isLoading && (
                    <div className="abstention-notice">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Need official clarification? Consult the National Consumer Helpline: <strong>1800-11-4000</strong></span>
                      </div>
                      <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline flex items-center gap-1">
                        <span>BIS Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[var(--blue-700)] dark:text-[#F5F4ED] bg-[var(--blue-50)] dark:bg-[#252420] hover:bg-[var(--blue-100)] dark:hover:bg-[#2B2A26] transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[var(--blue-600)] dark:text-[var(--blue-400)]" />
                          <span>Grounded Sources ({msg.citations.length} Verified Citations)</span>
                        </div>
                        {expandedSources[msg.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                                <ExternalLink className="w-3.5 h-3.5" />
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
                              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                              <span className="text-[var(--color-success)] font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
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
                              utt.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-IN";
                              utt.onstart = () => setIsSpeaking(true);
                              utt.onend = () => setIsSpeaking(false);
                              utt.onerror = () => setIsSpeaking(false);
                              window.speechSynthesis.speak(utt);
                            }
                          }}
                          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeaking ? t("chat.speaking") : t("chat.listen")}</span>
                        </button>
                      </div>

                      {/* Suggested Follow-up Questions */}
                      {(() => {
                        // Build a clean, deduped list of follow-up questions
                        const raw: string[] = [
                          ...(Array.isArray(msg.follow_ups) ? msg.follow_ups : []),
                          ...(msg.follow_up && !(msg.follow_ups ?? []).includes(msg.follow_up) ? [msg.follow_up] : []),
                        ].filter((q): q is string => typeof q === "string" && q.trim().length > 0);
                        const followUps = [...new Set(raw)].slice(0, 3);
                        if (followUps.length === 0) return null;
                        return (
                          <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <Sparkles className="w-3 h-3 text-[#0052CC] dark:text-blue-400" />
                              <span>{t("chat.suggestedFollowups")}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {followUps.map((q, qIdx) => (
                                <button
                                  key={qIdx}
                                  type="button"
                                  onClick={() => sendMessage(q)}
                                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100/90 text-[#0052CC] dark:bg-[#2B2A26] dark:hover:bg-[#34332E] dark:text-[#F5F4ED] border border-blue-200/60 dark:border-[#3D3B35] transition-all text-left font-medium cursor-pointer shadow-2xs hover:scale-[1.01]"
                                >
                                  <span>{q}</span>
                                  <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="user-avatar select-none" title="You">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#005EB8] to-[#003B73] dark:from-blue-600 dark:to-indigo-700 text-white shadow-xs flex items-center justify-center font-bold">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
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
                    {t("common.submit")}
                  </button>
                  <button onClick={() => { setSpeechTranscript(null); setInput(""); }} className="btn-icon w-7 h-7">
                    <X className="w-3.5 h-3.5" />
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
                  placeholder={t("chat.composerPlaceholder")}
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
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              <div className="composer-tools">
                <button
                  className="composer-tool"
                  onClick={() => setShowPhotoUpload(true)}
                  title="Upload photo"
                  aria-label="Upload photo of product or hallmark"
                >
                  <Camera className="w-4 h-4" />
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
                    <Mic className="w-4 h-4" />
                  )}
                  <span>{isRecording ? "Listening" : "Speak"}</span>
                </button>
              </div>
            </div>

            <p className="composer-disclaimer">
              {t("common.disclaimer")}
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
              <button className="btn-icon w-8 h-8 cursor-pointer" onClick={() => setShowPhotoUpload(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setPhotoMode("product")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  photoMode === "product"
                    ? "bg-[var(--blue-50)] border-[var(--blue-600)] text-[var(--blue-900)]"
                    : "border-[var(--color-border)] text-[var(--color-text-body)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--blue-100)] text-[var(--blue-600)] flex items-center justify-center mb-2">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold">Product Photo</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Classify applicable Indian Standard</div>
              </button>

              <button
                onClick={() => setPhotoMode("hallmark")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  photoMode === "hallmark"
                    ? "bg-[var(--blue-50)] border-[var(--blue-600)] text-[var(--blue-900)]"
                    : "border-[var(--color-border)] text-[var(--color-text-body)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--blue-100)] text-[var(--blue-600)] flex items-center justify-center mb-2">
                  <Award className="w-5 h-5" />
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
              className="app-primary-button w-full justify-center text-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo or Take Picture</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Create New Project Modal (Inside Chatbot) ── */}
      {showCreateProjectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowCreateProjectModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#21201C] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#34332E] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#34332E] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Create New Compliance Workspace
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9C9A91]">
                    Pin dedicated standards & custom instructions to this chatbot workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateProjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2A26] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] uppercase tracking-wider mb-1.5">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solar Inverter IS 16221 Audit"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#181816] border border-slate-200 dark:border-[#34332E] text-xs sm:text-sm text-slate-900 dark:text-[#F5F4ED] outline-none focus:border-[#005EB8] focus:ring-1 focus:ring-[#005EB8]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] uppercase tracking-wider mb-1.5">
                    Certification Scheme
                  </label>
                  <select
                    value={newProjectScheme}
                    onChange={(e) => setNewProjectScheme(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#181816] border border-slate-200 dark:border-[#34332E] text-xs font-medium text-slate-900 dark:text-[#F5F4ED] outline-none cursor-pointer"
                  >
                    <option value="Scheme I (ISI Mark)">Scheme I (ISI Mark)</option>
                    <option value="Scheme II (CRS)">Scheme II (CRS)</option>
                    <option value="Scheme IV (Hallmark)">Scheme IV (Hallmark)</option>
                    <option value="FMCS (Foreign Mfrs)">FMCS (Foreign Mfrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] uppercase tracking-wider mb-1.5">
                    Sector / Category
                  </label>
                  <select
                    value={newProjectCategory}
                    onChange={(e) => setNewProjectCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#181816] border border-slate-200 dark:border-[#34332E] text-xs font-medium text-slate-900 dark:text-[#F5F4ED] outline-none cursor-pointer"
                  >
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Consumer Goods & Toys">Consumer Goods & Toys</option>
                    <option value="Precious Metals & Gold">Precious Metals & Gold</option>
                    <option value="Chemicals & Polymers">Chemicals & Polymers</option>
                    <option value="Automotive Components">Automotive Components</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] uppercase tracking-wider mb-1.5">
                  Pinned Indian Standards (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., IS 16221 (Part 2), IS 16169"
                  value={newProjectStandards}
                  onChange={(e) => setNewProjectStandards(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#181816] border border-slate-200 dark:border-[#34332E] text-xs text-slate-900 dark:text-[#F5F4ED] outline-none focus:border-[#005EB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] uppercase tracking-wider mb-1.5">
                  Custom Instructions for Mithra AI (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Focus on MSME 20% marking fee concessions and NABL accredited labs in Western Region..."
                  value={newProjectInstructions}
                  onChange={(e) => setNewProjectInstructions(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#181816] border border-slate-200 dark:border-[#34332E] text-xs text-slate-900 dark:text-[#F5F4ED] outline-none focus:border-[#005EB8] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#9C9A91] hover:bg-slate-100 dark:hover:bg-[#2B2A26] dark:hover:text-[#F5F4ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0052CC] hover:bg-[#0043a6] text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </form>
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
          <Loader2 className="w-9 h-9 animate-spin text-[var(--blue-600)]" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
