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
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { MithraLogo } from "@/components/MithraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";

interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  citations?: Array<{ id: string; text: string; source: string }>;
  quickReplies?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INITIAL_MESSAGES: WhatsAppMessage[] = [
  {
    id: "1",
    sender: "bot",
    text: "Namaste! 🙏 Welcome to *Mithra* — the official AI Assistant for the Bureau of Indian Standards (BIS), Government of India.\n\nI can help you with:\n• Checking mandatory Quality Control Orders (QCOs)\n• Indian Standards (IS specifications)\n• ISI Mark, CRS & FMCS certification pathways\n• 6-digit Gold Hallmark HUID verification\n• Statutory fee estimates & complaint drafting\n\nHow can I help you today?",
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

export function WhatsAppSimulator() {
  const { t, language } = useLanguage();
  const isDark = useDarkMode();
  const [messages, setMessages] = useState<WhatsAppMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    setLoading(true);

    try {
      // Direct call to Mithra Backend API
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

      let botReplyText = data.answer || "I received your query. Let me look up the BIS database.";
      
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
        text: "Official BIS advisory: For authoritative verification, you can contact the National Consumer Helpline at 1800-11-4000 or visit https://www.bis.gov.in.",
        time: getTimeString(),
        status: "read",
        quickReplies: ["File a complaint", "Find nearest BIS office"],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800 bg-[#ECE5DD] dark:bg-[#0c1317] flex flex-col h-[750px] animate-fadeIn">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] dark:bg-[#202c33] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            title="Back to Web Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative">
            <MithraLogo size={40} darkMode={isDark} className="rounded-full bg-white dark:bg-[#2B2A26] p-0.5 shadow-sm" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54] dark:border-[#202c33]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm sm:text-base leading-tight">Mithra BIS Assistant</h2>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold" title="Official Verified WhatsApp Business Account">
                ✓
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 dark:text-slate-400">
              Official Business Account · Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-emerald-100">
          <Link
            href="/tools/cost-estimator"
            className="hidden sm:inline-flex text-xs bg-emerald-700/60 dark:bg-slate-700/60 hover:bg-emerald-600/80 px-2.5 py-1 rounded-full text-white font-medium items-center gap-1 transition-colors"
          >
            <span>Fee Tool</span>
          </Link>
          <Link
            href="/tools/complaint-drafter"
            className="hidden sm:inline-flex text-xs bg-emerald-700/60 dark:bg-slate-700/60 hover:bg-emerald-600/80 px-2.5 py-1 rounded-full text-white font-medium items-center gap-1 transition-colors"
          >
            <span>Complaint Tool</span>
          </Link>
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Message Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-[radial-gradient(#222e35_1px,transparent_1px)] bg-[size:16px_16px]">
        {/* Encryption notice banner */}
        <div className="flex justify-center my-2">
          <span className="text-[11px] bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] px-3 py-1.5 rounded-lg shadow-xs text-center max-w-md font-sans leading-relaxed border border-[#E9D8A6] dark:border-slate-800">
            🔒 Messages are end-to-end encrypted. Grounded in authoritative BIS regulations.
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-[13px] shadow-sm relative leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#D9FDD3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-none"
                  : "bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-transparent"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans break-words">
                {msg.text}
              </div>

              {/* Citations block if any */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#0052CC] dark:text-blue-400">
                    BIS Sources:
                  </div>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      [{c.id}] {c.source}
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp & checkmark */}
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{msg.time}</span>
                {msg.sender === "user" && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                )}
              </div>
            </div>

            {/* Quick Reply Pills */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                {msg.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(qr)}
                    className="text-[11px] font-medium bg-white/90 hover:bg-white text-emerald-800 dark:bg-slate-800/90 dark:text-emerald-300 dark:hover:bg-slate-750 px-3 py-1.5 rounded-full shadow-xs border border-emerald-300/60 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span>{qr}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#202c33] px-4 py-2.5 rounded-2xl rounded-tl-none w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Mithra is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* WhatsApp Input Toolbar */}
      <div className="bg-[#F0F2F5] dark:bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
          title="Smileys"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
          title="Attach document or hallmark image"
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
            type="text"
            className="w-full h-10 px-4 rounded-xl bg-white dark:bg-[#2a3942] text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder:text-slate-400 outline-none border border-slate-200 dark:border-transparent focus:border-emerald-500"
            placeholder="Type a message (e.g. Check IS 14543 or verify HUID)..."
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
            className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSendMessage("What is the mandatory certification scheme for packaged drinking water?")}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
            title="Simulate Voice / Quick query"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
