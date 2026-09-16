"use client";

import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, ShieldCheck, X } from "lucide-react";

export interface CitationItem {
  id: string;
  source: string;
  text?: string;
  page?: string;
  url?: string;
}

interface SourceBadgeInfo {
  displayName: string;
  fullTitle: string;
  bg: string;
  letter: string;
  shape: "square" | "circle";
  iconType: "bis" | "fssai" | "hallmark" | "qco" | "letter";
  url: string;
}

export function getSourceBadgeInfo(rawSource?: string, rawUrl?: string): SourceBadgeInfo {
  const source = (rawSource || "").trim();
  const lower = source.toLowerCase();

  // FSSAI
  if (lower.includes("fssai")) {
    return {
      displayName: "FSSAI",
      fullTitle: source || "Food Safety and Standards Authority of India (FSSAI)",
      bg: "#E65100",
      letter: "F",
      shape: "square",
      iconType: "fssai",
      url: rawUrl || "https://www.fssai.gov.in",
    };
  }

  // Decanter
  if (lower.includes("decanter")) {
    return {
      displayName: "Decanter",
      fullTitle: source || "Decanter Magazine & Spirits Guide",
      bg: "#242424",
      letter: "D",
      shape: "square",
      iconType: "letter",
      url: rawUrl || "https://www.decanter.com",
    };
  }

  // WebMD
  if (lower.includes("webmd")) {
    return {
      displayName: "WebMD",
      fullTitle: source || "WebMD Health & Medical Reference",
      bg: "#0066CC",
      letter: "W",
      shape: "circle",
      iconType: "letter",
      url: rawUrl || "https://www.webmd.com",
    };
  }

  // NIAAA
  if (lower.includes("niaaa")) {
    return {
      displayName: "NIAAA",
      fullTitle: source || "National Institute on Alcohol Abuse and Alcoholism (NIAAA)",
      bg: "#00695C",
      letter: "N",
      shape: "circle",
      iconType: "letter",
      url: rawUrl || "https://www.niaaa.nih.gov",
    };
  }

  // CDC
  if (lower.includes("cdc")) {
    return {
      displayName: "CDC",
      fullTitle: source || "Centers for Disease Control and Prevention (CDC)",
      bg: "#0B3B60",
      letter: "CDC",
      shape: "square",
      iconType: "letter",
      url: rawUrl || "https://www.cdc.gov",
    };
  }

  // WHO
  if (lower.includes("who") || lower.includes("world health")) {
    return {
      displayName: "WHO",
      fullTitle: source || "World Health Organization",
      bg: "#0288D1",
      letter: "W",
      shape: "circle",
      iconType: "letter",
      url: rawUrl || "https://www.who.int",
    };
  }

  // Quality Control Orders (QCO)
  if (lower.includes("qco") || lower.includes("quality control order")) {
    const qcoMatch = source.match(/QCO\s*(?:\d{4})?/i);
    return {
      displayName: qcoMatch ? qcoMatch[0].toUpperCase() : "BIS QCO",
      fullTitle: source || "Mandatory Quality Control Order (QCO)",
      bg: "#15803D",
      letter: "Q",
      shape: "square",
      iconType: "qco",
      url: rawUrl || "https://www.bis.gov.in",
    };
  }

  // Hallmark / HUID
  if (lower.includes("hallmark") || lower.includes("huid")) {
    return {
      displayName: "Hallmark",
      fullTitle: source || "BIS Hallmarking & HUID Guidelines",
      bg: "#B45309",
      letter: "H",
      shape: "square",
      iconType: "hallmark",
      url: rawUrl || "https://www.manakonline.in",
    };
  }

  // Specific Indian Standard (e.g. IS 14543 : 2024, IS 15820)
  const isMatch = source.match(/\bIS\s*(\d+)(?:\s*[:\-]\s*(\d{4}))?/i);
  if (isMatch) {
    const isNum = `IS ${isMatch[1]}`;
    return {
      displayName: isNum,
      fullTitle: source,
      bg: "#004B87",
      letter: "IS",
      shape: "square",
      iconType: "bis",
      url: rawUrl || `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails`,
    };
  }

  // Generic BIS / Indian Standards
  if (lower.includes("bis") || lower.includes("indian standard") || lower.includes("manak")) {
    return {
      displayName: "BIS",
      fullTitle: source || "Bureau of Indian Standards",
      bg: "#004B87",
      letter: "BIS",
      shape: "square",
      iconType: "bis",
      url: rawUrl || "https://www.bis.gov.in",
    };
  }

  // Clean fallback label
  const words = source.split(/[\s,:\-_/]+/).filter(Boolean);
  const firstWord = words[0] || "Source";
  const label = firstWord.length > 12 ? firstWord.slice(0, 10) + "…" : firstWord;
  const initial = (firstWord[0] || "S").toUpperCase();

  return {
    displayName: label,
    fullTitle: source || "Verified Official Record",
    bg: "#475569",
    letter: initial,
    shape: "square",
    iconType: "letter",
    url: rawUrl || (source.startsWith("http") ? source : "https://www.bis.gov.in"),
  };
}

function SourceBadgeIcon({ info }: { info: SourceBadgeInfo }) {
  if (info.iconType === "bis") {
    return (
      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#004B87] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
        </svg>
      </span>
    );
  }

  if (info.iconType === "fssai") {
    return (
      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#E65100] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <span className="text-[8px] font-black tracking-tighter leading-none">F</span>
      </span>
    );
  }

  if (info.iconType === "hallmark") {
    return (
      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#B45309] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
          <path d="M12 2l9 17H3L12 2zm0 4.2L6.2 17h11.6L12 6.2z" />
        </svg>
      </span>
    );
  }

  if (info.iconType === "qco") {
    return (
      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[3]" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (info.shape === "circle") {
    return (
      <span
        style={{ backgroundColor: info.bg }}
        className="w-3.5 h-3.5 rounded-full text-white flex items-center justify-center shrink-0 font-black text-[9px] leading-none shadow-2xs"
      >
        {info.letter}
      </span>
    );
  }

  return (
    <span
      style={{ backgroundColor: info.bg }}
      className={`w-3.5 h-3.5 rounded-[3px] text-white flex items-center justify-center shrink-0 font-black leading-none shadow-2xs ${
        info.letter.length > 2 ? "text-[7px]" : "text-[8px]"
      }`}
    >
      {info.letter}
    </span>
  );
}

export interface EliteCitationPillProps {
  ids: string[];
  citations?: CitationItem[];
}

export function EliteCitationPill({ ids, citations = [] }: EliteCitationPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Match citation objects from provided IDs
  const matchedCitations: CitationItem[] = [];
  for (const rawId of ids) {
    const cleanId = rawId.trim();
    const num = parseInt(cleanId.replace(/^S/i, ""), 10);

    // 1. Try exact or normalized ID match
    let found = citations.find(
      (c) =>
        c.id === cleanId ||
        c.id === `S${cleanId}` ||
        c.id.replace(/^S/i, "") === cleanId.replace(/^S/i, "")
    );

    // 2. If not found, try 1-based index match
    if (!found && !isNaN(num) && citations[num - 1]) {
      found = citations[num - 1];
    }

    if (found && !matchedCitations.some((m) => m.id === found!.id && m.source === found!.source)) {
      matchedCitations.push(found);
    } else if (!found) {
      matchedCitations.push({
        id: cleanId,
        source: cleanId.startsWith("S") ? `BIS Source ${cleanId.replace(/^S/i, "")}` : cleanId,
        text: "Official grounded reference.",
      });
    }
  }

  const primaryCitation = matchedCitations[0] || {
    id: ids[0] || "1",
    source: "Official BIS Record",
  };
  const extraCount = matchedCitations.length - 1;
  const primaryBadge = getSourceBadgeInfo(primaryCitation.source, primaryCitation.url);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPinned(false);
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPinned(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block align-baseline mx-0.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The Sleek Citation Pill */}
      <button
        type="button"
        onClick={handleClick}
        title={primaryBadge.fullTitle}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-tight leading-none cursor-pointer select-none transition-all duration-150 align-baseline ${
          isOpen
            ? "bg-[#2E2C27] dark:bg-[#34322C] border-[#555246] dark:border-[#5E5B4F] text-white shadow-xs"
            : "bg-[#F1F3F5] hover:bg-[#E5E8EC] border border-[#D3D7DD] text-[#344054] hover:text-[#1D2939] dark:bg-[#23221E] dark:hover:bg-[#2A2924] dark:border-[#3C3A33] dark:hover:border-[#4E4C43] dark:text-[#D4D2C9] dark:hover:text-white"
        }`}
        aria-expanded={isOpen}
      >
        <SourceBadgeIcon info={primaryBadge} />
        <span className="truncate max-w-[120px]">{primaryBadge.displayName}</span>
        {extraCount > 0 && (
          <span className="text-[10px] text-slate-500 dark:text-[#9A988F] font-normal leading-none">
            +{extraCount}
          </span>
        )}
      </button>

      {/* Floating Grounding Context Popover */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-72 sm:w-84 max-w-[calc(100vw-36px)] p-3 rounded-xl bg-white dark:bg-[#1E1D19] border border-slate-200/90 dark:border-[#3E3C35] text-slate-800 dark:text-[#EDECE6] shadow-xl text-left pointer-events-auto"
          style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.22))" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#2C2A24]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#1C2C21] px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>Verified Source</span>
              </span>
              {matchedCitations.length > 1 && (
                <span className="text-[10px] text-slate-400 dark:text-[#88867E]">
                  ({matchedCitations.length} cited records)
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setIsPinned(false);
                setIsOpen(false);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-[#88867E] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2C2A24] transition-colors"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Citations List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2C2A24] mt-2 space-y-2">
            {matchedCitations.map((cit, idx) => {
              const info = getSourceBadgeInfo(cit.source, cit.url);
              return (
                <div key={idx} className={idx > 0 ? "pt-2" : ""}>
                  <div className="flex items-start gap-1.5">
                    <SourceBadgeIcon info={info} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {info.fullTitle}
                      </div>
                      {cit.page && (
                        <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                          Clause / Ref: {cit.page}
                        </div>
                      )}
                    </div>
                  </div>

                  {cit.text && (
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-[#C5C3BA] mt-1.5 italic pl-2 border-l-2 border-slate-300 dark:border-[#4B4940] line-clamp-4">
                      &ldquo;{cit.text}&rdquo;
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-end">
                    <a
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--blue-600)] dark:text-blue-400 hover:underline"
                    >
                      <span>Open official reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Popover Arrow Indicator */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#1E1D19] border-r border-b border-slate-200/90 dark:border-[#3E3C35] rotate-45" />
        </div>
      )}
    </span>
  );
}

/**
 * Preprocesses markdown text to replace bracketed citation markers like:
 * [S1], [S2], [1], [2], [S1][S2], [S1, S2], [1, 2]
 * into markdown link syntax: [cite:S1](citation:S1)
 * so ReactMarkdown can render them as sleek EliteCitationPill components.
 */
export function prepareContentWithCitations(
  content: string,
  citations?: CitationItem[]
): {
  processedContent: string;
  renderedIds: Set<string>;
} {
  if (!content) return { processedContent: "", renderedIds: new Set() };

  const renderedIds = new Set<string>();

  // Match citation patterns:
  // [S1], [S2], [1], [2], [S1][S2], [S1, S2], [1, 2]
  // not followed by '(' (which would mean it's a markdown link [text](url))
  const citationRegex = /(?:\s*)((?:\[S?\d+\](?:\s*\[S?\d+\])*|\[S?\d+(?:\s*,\s*S?\d+)+\]))(?!\()/g;

  const processedContent = content.replace(citationRegex, (_full, match) => {
    const rawIds = match.match(/S?\d+/g) || [];
    if (rawIds.length === 0) return match;

    rawIds.forEach((id: string) => {
      renderedIds.add(id);
      const clean = id.replace(/^S/i, "");
      renderedIds.add(clean);
      renderedIds.add(`S${clean}`);
    });

    return ` [cite:${rawIds.join(",")}](citation:${rawIds.join(",")}) `;
  });

  return { processedContent, renderedIds };
}
