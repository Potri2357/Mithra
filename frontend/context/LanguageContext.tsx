"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SupportedLanguage, getTranslation } from "@/lib/i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  cycleLanguage: () => void;
  t: (key: string) => string;
  langLabel: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "EN",
  hi: "हिं",
  ta: "த",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mithra-lang") as SupportedLanguage | null;
      if (saved && (saved === "en" || saved === "hi" || saved === "ta")) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("mithra-lang", lang);
    }
  }, []);

  const cycleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      let next: SupportedLanguage = "en";
      if (prev === "en") next = "hi";
      else if (prev === "hi") next = "ta";
      else next = "en";

      if (typeof window !== "undefined") {
        localStorage.setItem("mithra-lang", next);
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => {
      return getTranslation(key, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        cycleLanguage,
        t,
        langLabel: LANGUAGE_LABELS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en" as SupportedLanguage,
      setLanguage: () => {},
      cycleLanguage: () => {},
      t: (key: string) => key,
      langLabel: "EN",
    };
  }
  return context;
}
