"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  X,
  Minus,
  Maximize2,
  Send,
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
} from "lucide-react";
import { useMiniChat } from "@/context/MiniChatContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { BisLoadingIndicator } from "@/components/BisLoadingIndicator";
import { replaceEmojisWithIcons } from "@/components/EmojiToIcon";

export function MiniChatbot() {
  const pathname = usePathname();
  const router = useRouter();
  const isDark = useDarkMode();
  const { t, language } = useLanguage();
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    openChat,
    closeChat,
    toggleMinimize,
    sendMessage,
    clearChat,
  } = useMiniChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  // Suppress mini-chatbot on full chat pages
  if (pathname === "/chat" || pathname === "/") {
    return null;
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;
    setInput("");
    await sendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterQuestions = [
    "Check mandatory QCO status for my product",
    "How to get ISI mark (Scheme I) certification?",
    "Verify 6-digit Gold Hallmark HUID",
  ];

  // ── Render Minimized Pill Bar ──
  if (isOpen && isMinimized) {
    return (
      <div
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#1C1B17]/95 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 select-none"
        role="dialog"
        aria-label="Mithraa AI Chatbot minimized"
      >
        <button
          type="button"
          onClick={toggleMinimize}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0052CC] to-[#003B73] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0052CC] dark:group-hover:text-blue-400 transition-colors">
              Mithraa AI
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2">
          <button
            type="button"
            onClick={toggleMinimize}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Expand chat window"
            aria-label="Expand chat window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close chat"
            aria-label="Close chat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Render Floating Launcher Button When Closed ──
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => openChat()}
        className="fixed bottom-6 right-6 z-50 group cursor-pointer select-none"
        title="Ask Mithraa AI Assistant"
        aria-label="Open Mithraa AI Chatbot"
      >
        {/* Outer glow ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0052CC] to-[#003B73] opacity-30 scale-110 blur-md group-hover:opacity-50 group-hover:scale-125 transition-all duration-300" />
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#0052CC]/40 animate-ping" />
        {/* Main button */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#0052CC] via-[#0047B3] to-[#003B73] flex items-center justify-center shadow-2xl shadow-blue-900/40 group-hover:shadow-blue-900/60 group-hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border border-white/20">
          <Bot className="w-7 h-7 text-white drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
          {/* Online indicator */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm animate-pulse" />
        </div>
        {/* Tooltip label */}
        <div className="absolute bottom-full right-0 mb-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <div className="whitespace-nowrap bg-slate-900/95 dark:bg-white/10 backdrop-blur-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 shadow-xl flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Ask Mithraa
            <span className="text-emerald-400 text-[10px] font-bold">● Online</span>
          </div>
        </div>
      </button>
    );
  }

  // ── Render Full Floating Chatbot Window ──
  return (
    <aside
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[calc(100vw-24px)] sm:w-[410px] h-[min(600px,calc(100dvh-24px))] rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/98 dark:bg-[#1A1916]/98 backdrop-blur-2xl shadow-2xl shadow-slate-900/25 dark:shadow-black/70 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
      role="dialog"
      aria-label="Mithraa AI Chatbot Window"
    >
      {/* ── Header ── */}
      <header className="px-4 py-3 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0052CC] to-[#003B73] border border-blue-400/30 shadow-2xs flex items-center justify-center text-white">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
              <span>{t("brand.title") || "Mithraa AI"}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                BIS
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Official Standards Intelligence</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => {
              closeChat();
              router.push("/chat");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Open full chat interface"
            aria-label="Open full chat interface"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleMinimize}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Minimize"
            aria-label="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Messages Container ── */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5">
        {messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="h-full flex flex-col justify-center items-center text-center py-6 px-2 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-[#0052CC] dark:text-blue-400 shadow-xs">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Namaste! Welcome to Mithraa AI
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Directly ask questions about 22,000+ Indian Standards, mandatory QCOs, certification schemes, or gold hallmarking.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="w-full space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-left px-1">
                Suggested Prompts
              </span>
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50/80 dark:bg-white/[0.04] dark:hover:bg-blue-950/30 border border-slate-200/70 hover:border-[#0052CC]/40 dark:border-white/10 dark:hover:border-blue-400/40 text-slate-700 dark:text-[#E6E4DD] transition-all flex items-center justify-between gap-2 group cursor-pointer"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 text-[#0052CC] dark:text-blue-400 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Bot Avatar */}
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0052CC] to-[#003B73] border border-blue-400/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs text-white">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-xs px-3.5 py-2.5 bg-gradient-to-br from-[#005EB8] to-[#003B73] text-white text-xs sm:text-[13px] font-medium shadow-xs leading-relaxed break-words"
                    : "max-w-[90%] rounded-2xl rounded-bl-xs px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed shadow-xs space-y-2 min-w-0"
                }
              >
                {m.role === "assistant" && (
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                    <span className="font-bold text-[11px] text-[#0052CC] dark:text-blue-400">
                      Mithraa
                    </span>
                    {m.confidence && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          m.confidence === "High"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : m.confidence === "Medium"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {m.confidence} Confidence
                      </span>
                    )}
                  </div>
                )}

                {m.isLoading ? (
                  <div className="py-2 flex items-center justify-center">
                    <BisLoadingIndicator size="sm" />
                  </div>
                ) : (
                  <div className="prose-bis-compact break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-1.5 last:mb-0 leading-relaxed text-slate-800 dark:text-slate-100">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900 dark:text-white">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 mb-1.5 space-y-0.5 text-slate-700 dark:text-slate-200">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-4 mb-1.5 space-y-0.5 text-slate-700 dark:text-slate-200">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => <li className="leading-relaxed text-slate-700 dark:text-slate-200">{children}</li>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:opacity-80"
                          >
                            {children}
                          </a>
                        ),
                        code: ({ children }) => (
                          <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-blue-200 font-mono text-[11px]">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>

                    {/* Citations list if present */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Verified Sources ({m.citations.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {m.citations.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300"
                            >
                              {c.source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-up Prompts */}
                    {m.follow_ups && m.follow_ups.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-1.5 w-full">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-[#0052CC] dark:text-blue-400" />
                          <span>Suggested Follow-ups</span>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                          {m.follow_ups.map((fu, fIdx) => (
                            <button
                              key={fIdx}
                              type="button"
                              onClick={() => sendMessage(fu)}
                              className="followup-suggestion-card group text-left !p-2 !text-xs"
                            >
                              <span className="flex-1 min-w-0 break-words leading-snug">
                                {replaceEmojisWithIcons(fu)}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 text-slate-400 group-hover:text-[#0052CC] dark:group-hover:text-blue-400 transition-all mt-0.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {m.role === "user" && (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#005EB8] to-[#003B73] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <footer className="p-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] space-y-2">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={t("chat.composerPlaceholder") || "Ask Mithraa about BIS standards..."}
            className="flex-1 resize-none py-2 px-3 text-xs bg-white dark:bg-[#23221E] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-[#0052CC] dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs max-h-24 leading-normal"
          />

          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-all cursor-pointer shrink-0"
            title="Send query"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-0.5 select-none">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            BIS Act 2016 Compliant
          </span>
          <span>Press Enter ↵</span>
        </div>
      </footer>
    </aside>
  );
}
