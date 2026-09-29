"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLanguage } from "./LanguageContext";
import { unwrapCleanAnswer } from "@/lib/utils";
import type { CitationItem } from "@/components/EliteCitationPill";

export interface MiniChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: CitationItem[];
  follow_ups?: string[];
  confidence?: "High" | "Medium" | "Unverified";
  abstained?: boolean;
  isLoading?: boolean;
  timestamp: string;
}

interface MiniChatContextType {
  isOpen: boolean;
  isMinimized: boolean;
  messages: MiniChatMessage[];
  isLoading: boolean;
  openChat: (initialQuery?: string) => Promise<void>;
  closeChat: () => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
}

const MiniChatContext = createContext<MiniChatContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const STORAGE_KEY = "mithra_mini_chat_history";

function getTimeString(): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date());
}

export function MiniChatProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MiniChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save session when messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  const executeQuery = useCallback(
    async (queryText: string, currentHistory: MiniChatMessage[]) => {
      const cleanQuery = queryText.trim();
      if (!cleanQuery) return;

      const userMsgId = `user-${Date.now()}`;
      const aiMsgId = `ai-${Date.now() + 1}`;
      const time = getTimeString();

      const userMsg: MiniChatMessage = {
        id: userMsgId,
        role: "user",
        content: cleanQuery,
        timestamp: time,
      };

      const aiPlaceholder: MiniChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        isLoading: true,
        timestamp: time,
      };

      setMessages([...currentHistory, userMsg, aiPlaceholder]);
      setIsLoading(true);

      try {
        const contextPayload = currentHistory.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: cleanQuery,
            language: language || "en",
            context: contextPayload,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const unwrapped = unwrapCleanAnswer(data);
        const safeAnswer = unwrapped.answer || "I have analyzed your query from the Bureau of Indian Standards database.";
        const citations = (unwrapped.citations?.length ? unwrapped.citations : data.citations) || [];

        const rawFollowUps = unwrapped.follow_ups?.length ? unwrapped.follow_ups : data.follow_ups;
        const safeFollowUps: string[] = Array.isArray(rawFollowUps)
          ? rawFollowUps.filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          : data.follow_up
          ? [data.follow_up as string]
          : [];

        const confidence: "High" | "Medium" | "Unverified" = data.abstained
          ? "Unverified"
          : citations.length > 0
          ? "High"
          : "Medium";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content: safeAnswer,
                  citations,
                  follow_ups: safeFollowUps.slice(0, 3),
                  confidence,
                  abstained: Boolean(data.abstained),
                  isLoading: false,
                }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content:
                    "Official BIS Advisory:\n\n• For authoritative regulatory verification, consult the National Consumer Helpline at **1800-11-4000**.\n• Access the official Bureau of Indian Standards portal at https://www.bis.gov.in.\n• All mandatory Quality Control Orders (QCOs) are legally enforceable under the *BIS Act 2016*.",
                  confidence: "Unverified",
                  abstained: true,
                  isLoading: false,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [language]
  );

  const openChat = useCallback(
    async (initialQuery?: string) => {
      setIsOpen(true);
      setIsMinimized(false);

      if (initialQuery && initialQuery.trim()) {
        await executeQuery(initialQuery, messages);
      }
    },
    [executeQuery, messages]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      await executeQuery(text, messages);
    },
    [executeQuery, messages]
  );

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <MiniChatContext.Provider
      value={{
        isOpen,
        isMinimized,
        messages,
        isLoading,
        openChat,
        closeChat,
        toggleChat,
        toggleMinimize,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </MiniChatContext.Provider>
  );
}

export function useMiniChat(): MiniChatContextType {
  const context = useContext(MiniChatContext);
  if (!context) {
    throw new Error("useMiniChat must be used within a MiniChatProvider");
  }
  return context;
}
