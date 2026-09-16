"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ArrowLeft,
  Search,
  ExternalLink,
  Bot,
  User,
  Copy,
  Check,
  Trash2,
  FileText,
  Award,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { MithraLogo } from "@/components/MithraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";
import { EliteCitationPill, CitationItem } from "@/components/EliteCitationPill";

interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot" | "assistant";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  citations?: CitationItem[];
  quickReplies?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INITIAL_MESSAGES: WhatsAppMessage[] = [
  {
    id: "1",
    sender: "assistant",
    text: "Namaste! 🙏 Welcome to *Mithra* — the official AI Assistant for the Bureau of Indian Standards (BIS), Government of India.\n\nI can help you with:\n• Checking mandatory Quality Control Orders (*QCOs*)\n• Indian Standards (*IS specifications*)\n• ISI Mark, CRS & FMCS certification pathways\n• 6-digit Gold Hallmark *HUID* verification\n• Statutory fee estimates & complaint drafting\n\nHow can I help you today?",
    time: "10:00 AM",
    status: "read",
    quickReplies: [
      "Check IS 14543 (Water)",
      "Verify Gold HUID: AA123456",
      "Is ISI mark mandatory for toys?",
      "Calculate MSME certification fee",
    ],
  },
];

// Helper to format inline elements: bold, italic, code, URLs, phone numbers, IS codes, citations
function formatInlineText(
  text: string,
  citations?: CitationItem[],
  renderedIds?: Set<string>
): React.ReactNode[] {
  // Regex to match special tokens:
  // 1: URLs
  // 2: Helpline phone numbers (1800-11-4000 etc.)
  // 3: Indian Standards (e.g. IS 14543, IS 16221, IS 9873)
  // 4: Double or single asterisks for bold (**bold** or *bold*)
  // 5: Underscores for italic (_italic_)
  // 6: Strikethrough (~strikethrough~)
  // 7: Inline code (`code`)
  // 8: Inline citations ([S1], [1], [S1, S2], etc.)
  const regex = /(https?:\/\/[^\s)]+)|(\b1800[-\s]?\d{2,3}[-\s]?\d{4}\b|\b1915\b)|(\bIS\s*(?:\d{3,5}(?:\s*\(Part\s*\d+\))?|ISO\s*\d{4,5})\b)|(\*\*[^*]+\*\*|\*[^*\n]+\*)|(_[^_\n]+_)|(~[^~\n]+~)|(`[^`\n]+`)|((?:\[S?\d+\](?:\s*\[S?\d+\])*|\[S?\d+(?:\s*,\s*S?\d+)+\])(?!\())/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    const key = `inline-${match.index}`;

    if (match[1]) {
      // URL
      nodes.push(
        <a
          key={key}
          href={matchedStr}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#027EB5] dark:text-[#53bdeb] underline font-medium hover:opacity-80 inline-flex items-center gap-0.5 break-all"
        >
          <span>{matchedStr}</span>
          <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
        </a>
      );
    } else if (match[2]) {
      // Helpline
      nodes.push(
        <a
          key={key}
          href={`tel:${matchedStr.replace(/\D/g, "")}`}
          className="text-[#027EB5] dark:text-[#53bdeb] font-semibold underline hover:opacity-80 inline-flex items-center gap-0.5"
          title="Call Helpline"
        >
          <Phone className="w-2.5 h-2.5 inline shrink-0" />
          <span>{matchedStr}</span>
        </a>
      );
    } else if (match[3]) {
      // Indian Standard Code
      nodes.push(
        <span
          key={key}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded font-mono font-bold text-[11px] bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 shadow-2xs"
        >
          {matchedStr}
        </span>
      );
    } else if (match[4]) {
      // Bold (*text* or **text**)
      const inner = matchedStr.startsWith("**")
        ? matchedStr.slice(2, -2)
        : matchedStr.slice(1, -1);
      nodes.push(
        <strong key={key} className="font-bold text-slate-950 dark:text-white">
          {inner}
        </strong>
      );
    } else if (match[5]) {
      // Italic (_text_)
      const inner = matchedStr.slice(1, -1);
      nodes.push(
        <em key={key} className="italic">
          {inner}
        </em>
      );
    } else if (match[6]) {
      // Strikethrough (~text~)
      const inner = matchedStr.slice(1, -1);
      nodes.push(
        <del key={key} className="line-through text-slate-400">
          {inner}
        </del>
      );
    } else if (match[7]) {
      // Inline Code (`code`)
      const inner = matchedStr.slice(1, -1);
      nodes.push(
        <code
          key={key}
          className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[11px] text-emerald-800 dark:text-emerald-300"
        >
          {inner}
        </code>
      );
    } else if (match[8]) {
      // Citation token: [S1], [1], [S1, S2], etc.
      const rawIds = matchedStr.match(/S?\d+/g) || [];
      if (renderedIds) {
        rawIds.forEach((id) => {
          renderedIds.add(id);
          const clean = id.replace(/^S/i, "");
          renderedIds.add(clean);
          renderedIds.add(`S${clean}`);
        });
      }
      nodes.push(
        <EliteCitationPill key={key} ids={rawIds} citations={citations} />
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes;
}

// Full message block renderer for WhatsApp
function FormattedWhatsAppMessage({
  text,
  citations,
}: {
  text: string;
  citations?: CitationItem[];
}) {
  const lines = text.split("\n");
  const renderedIds = new Set<string>();

  const renderedLines = lines.map((line, idx) => {
    const trimmed = line.trim();

    // Empty line spacer
    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }

    // Section header (### or ## or #)
    if (trimmed.startsWith("### ")) {
      return (
        <div
          key={idx}
          className="font-bold text-xs sm:text-sm text-[#075E54] dark:text-emerald-400 mt-2 mb-1"
        >
          {formatInlineText(trimmed.replace(/^###\s+/, ""), citations, renderedIds)}
        </div>
      );
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      return (
        <div
          key={idx}
          className="font-extrabold text-sm text-[#075E54] dark:text-emerald-400 mt-2.5 mb-1 pb-0.5 border-b border-emerald-500/20"
        >
          {formatInlineText(trimmed.replace(/^#{1,2}\s+/, ""), citations, renderedIds)}
        </div>
      );
    }

    // Bullet list (•, -, *, +)
    const bulletMatch = trimmed.match(/^([•\-\*\+])\s+(.+)$/);
    if (bulletMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 select-none text-[12px] leading-tight">
            •
          </span>
          <span className="flex-1">
            {formatInlineText(bulletMatch[2], citations, renderedIds)}
          </span>
        </div>
      );
    }

    // Numbered list (1. 2. 3.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
          <span className="text-[#075E54] dark:text-emerald-400 font-bold shrink-0 select-none text-[11px] min-w-[14px]">
            {numMatch[1]}.
          </span>
          <span className="flex-1">
            {formatInlineText(numMatch[2], citations, renderedIds)}
          </span>
        </div>
      );
    }

    // Standard paragraph line
    return (
      <div key={idx} className="leading-relaxed">
        {formatInlineText(line, citations, renderedIds)}
      </div>
    );
  });

  // Citations not placed inline
  const unrenderedCitations = (citations || []).filter((c, idx) => {
    const rawId = c.id || `S${idx + 1}`;
    const cleanId = rawId.replace(/^S/i, "");
    return (
      !renderedIds.has(rawId) &&
      !renderedIds.has(cleanId) &&
      !renderedIds.has(`S${cleanId}`)
    );
  });

  return (
    <div className="space-y-1 font-sans text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-100 break-words">
      {renderedLines}

      {/* Unrendered citations shown cleanly as inline pills */}
      {unrenderedCitations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
          {unrenderedCitations.map((c, i) => (
            <EliteCitationPill
              key={i}
              ids={[c.id || `S${i + 1}`]}
              citations={citations}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface WhatsAppSimulatorProps {
  /** If true, makes the simulator fill the window viewport height comfortably (ideal for standalone tab) */
  fullHeight?: boolean;
}

export function WhatsAppSimulator({ fullHeight = false }: WhatsAppSimulatorProps) {
  const { t, language } = useLanguage();
  const isDark = useDarkMode();

  const getInitialMessages = (): WhatsAppMessage[] => [
    {
      id: "1",
      sender: "bot",
      text: t("whatsapp.welcome"),
      time: "10:00 AM",
      status: "read",
      quickReplies: [
        t("whatsapp.qr1"),
        t("whatsapp.qr2"),
        t("whatsapp.qr3"),
        t("whatsapp.qr4"),
      ],
    },
  ];

  const [messages, setMessages] = useState<WhatsAppMessage[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync welcome message when language changes if only the initial message is in chat
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "1") {
        return getInitialMessages();
      }
      return prev;
    });
  }, [language]);

  // Autofocus input on mount and keep it focused
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: WhatsAppMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: getTimeString(),
      status: "read",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowAttachments(false);
    setLoading(true);

    try {
      // Call Mithra Backend API
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          language: language,
          context: messages.slice(-4).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();

      const botReplyText = data.answer || "I received your query. Let me look up the BIS database.";

      const botMsg: WhatsAppMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReplyText,
        time: getTimeString(),
        status: "read",
        citations: data.citations,
        quickReplies: data.follow_ups && data.follow_ups.length > 0 ? data.follow_ups : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: WhatsAppMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Official BIS Advisory:\n• For authoritative verification, contact the National Consumer Helpline at *1800-11-4000*.\n• Access the official Bureau of Indian Standards portal at https://www.bis.gov.in.\n• All mandatory QCOs are legally binding under the *BIS Act 2016*.",
        time: getTimeString(),
        status: "read",
        quickReplies: ["Check IS 14543 (Water)", "Verify Gold HUID: AA123456", "Nearest BIS lab"],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      // Keep autofocus active
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages(getInitialMessages());
    setShowMenu(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const copyTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.time}] ${m.sender === "user" ? "You" : "Mithra"}: ${m.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(transcript);
    setShowMenu(false);
    alert(t("whatsapp.transcriptCopied"));
  };

  const sampleAttachments = [
    {
      title: "Gold Hallmark Stamp (HUID)",
      desc: "Simulate photo upload of 6-digit laser hallmark stamp",
      icon: Award,
      query: "Verify gold hallmark: 22K916 with 6-digit alphanumeric HUID code AA123456. Is it genuine and BIS certified?",
    },
    {
      title: "Packaged Drinking Water (IS 14543)",
      desc: "Check mandatory ISI certification scheme requirements",
      icon: FileText,
      query: "Is ISI certification mandatory for packaged drinking water under IS 14543? What are the microbiological testing parameters?",
    },
    {
      title: "Toy Safety Quality Control Order",
      desc: "Verify mandatory toys QCO under IS 9873",
      icon: ShieldCheck,
      query: "Which Indian Standards apply to non-electric and electric toys under the Toys Safety QCO 2020?",
    },
  ];

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-300 dark:border-[#2A3942] bg-[#EFEAE2] dark:bg-[#0c1317] flex flex-col relative animate-fadeIn ${
        fullHeight ? "h-[calc(100vh-5rem)] min-h-[550px]" : "h-[750px] max-h-[85vh]"
      }`}
    >
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] dark:bg-[#202c33] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            href="/chat"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
            title="Back to Web Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative shrink-0">
            <MithraLogo
              size={38}
              darkMode={isDark}
              className="rounded-full bg-white dark:bg-[#2B2A26] p-0.5 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075E54] dark:border-[#202c33]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h2 className="font-bold text-sm sm:text-base leading-tight truncate">
                Mithra BIS Assistant
              </h2>
              <span
                className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0"
                title="Official Verified WhatsApp Business Account"
              >
                ✓
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 dark:text-[#8696A0] truncate">
              {t("whatsapp.officialAccount")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-emerald-100 shrink-0">
          <Link
            href="/tools/cost-estimator?standalone=1"
            className="hidden sm:inline-flex text-xs bg-emerald-700/70 dark:bg-slate-700/70 hover:bg-emerald-600/90 px-2.5 py-1 rounded-full text-white font-medium items-center gap-1 transition-colors"
          >
            <span>{t("nav.estimator")}</span>
          </Link>
          <Link
            href="/tools/complaint-drafter?standalone=1"
            className="hidden sm:inline-flex text-xs bg-emerald-700/70 dark:bg-slate-700/70 hover:bg-emerald-600/90 px-2.5 py-1 rounded-full text-white font-medium items-center gap-1 transition-colors"
          >
            <span>{t("nav.complaintDrafter")}</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* WhatsApp Options Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#233138] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-slate-800 dark:text-slate-100 text-xs font-medium">
                <button
                  type="button"
                  onClick={copyTranscript}
                  className="w-full px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#182229] flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{t("whatsapp.copyTranscript")}</span>
                </button>
                <button
                  type="button"
                  onClick={clearChat}
                  className="w-full px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#182229] text-red-600 dark:text-red-400 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t("whatsapp.clearConversation")}</span>
                </button>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#182229] flex items-center gap-2.5 text-left transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{t("whatsapp.officialPortal")}</span>
                </a>
                <a
                  href="tel:1800114000"
                  className="w-full px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#182229] flex items-center gap-2.5 text-left transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("whatsapp.callHelpline")}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Message Canvas */}
      <div
        onClick={() => {
          if (showMenu) setShowMenu(false);
          if (showAttachments) setShowAttachments(false);
        }}
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-[radial-gradient(#202c33_1px,transparent_1px)] bg-[size:18px_18px]"
      >
        {/* Encryption notice banner */}
        <div className="flex justify-center my-1">
          <span className="text-[11px] bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] px-3.5 py-1.5 rounded-lg shadow-2xs text-center max-w-md font-sans leading-relaxed border border-[#E9D8A6]/70 dark:border-slate-800 flex items-center gap-1.5">
            <span>{t("whatsapp.encryptionNotice")}</span>
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col group ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 shadow-xs relative leading-relaxed transition-all ${
                msg.sender === "user"
                  ? "bg-[#D9FDD3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-xs"
                  : "bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/50 dark:border-transparent"
              }`}
            >
              {/* Copy action on hover */}
              <button
                type="button"
                onClick={() => copyText(msg.id, msg.text)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 transition-opacity cursor-pointer"
                title={t("whatsapp.copy")}
                aria-label={t("whatsapp.copy")}
              >
                {copiedId === msg.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Formatted Message Body with inline citations */}
              <FormattedWhatsAppMessage text={msg.text} citations={msg.citations} />

              {/* Timestamp & checkmark */}
              <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-500 dark:text-[#8696A0]">
                <span>{msg.time}</span>
                {msg.sender === "user" && (
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline" />
                )}
              </div>
            </div>

            {/* Quick Reply Pills */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                {msg.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleSendMessage(qr);
                    }}
                    className="text-[11px] font-medium bg-white/95 hover:bg-white text-[#075E54] dark:bg-[#202c33] dark:text-emerald-300 dark:hover:bg-[#2a3942] px-3 py-1.5 rounded-full shadow-xs border border-emerald-300/60 dark:border-emerald-700/40 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span>{qr}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#202c33] px-4 py-2.5 rounded-2xl rounded-tl-xs w-fit shadow-xs border border-slate-200/50 dark:border-transparent">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{t("whatsapp.typing")}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Attachments Drawer */}
      {showAttachments && (
        <div className="bg-white dark:bg-[#202c33] border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 animate-slideDown shadow-lg z-30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              {t("whatsapp.simulateAttachment")}
            </span>
            <button
              type="button"
              onClick={() => setShowAttachments(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              {t("whatsapp.close")}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleAttachments.map((att, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(att.query)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#075E54] dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <att.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                    {att.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {att.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Input Toolbar */}
      <div className="bg-[#F0F2F5] dark:bg-[#202c33] px-2.5 sm:px-3.5 py-2.5 flex items-center gap-2 border-t border-slate-200 dark:border-[#2A3942] shrink-0 z-20">
        <button
          type="button"
          onClick={() => {
            setInput((prev) => prev + " 🙏 ");
            inputRef.current?.focus();
          }}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-[#8696A0] dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer"
          title="Insert emoji"
          aria-label="Insert emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowAttachments((prev) => !prev)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            showAttachments
              ? "bg-emerald-500 text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-[#8696A0] dark:hover:text-slate-200"
          }`}
          title="Attach document or hallmark stamp"
          aria-label="Attach document or hallmark stamp"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex-1 flex items-center"
        >
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="w-full h-10 px-4 rounded-xl bg-white dark:bg-[#2a3942] text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-[#8696A0] outline-none border border-slate-200/80 dark:border-transparent focus:border-emerald-500 shadow-2xs"
            placeholder={t("whatsapp.placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </form>

        {input.trim() ? (
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer shrink-0"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSendMessage("What is the mandatory BIS certification scheme for packaged drinking water?")}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-[#8696A0] dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer shrink-0"
            title="Simulate Voice Query: Packaged Drinking Water IS 14543"
            aria-label="Simulate Voice Query"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
