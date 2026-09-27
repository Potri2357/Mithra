"use client";

import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, ShieldCheck, X, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

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
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight leading-none cursor-pointer select-none transition-all duration-150 align-baseline backdrop-blur-md ${
          isOpen
            ? "bg-[#005EB8] text-white border-transparent shadow-[0_2px_8px_rgba(2,77,161,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
            : "bg-white/90 dark:bg-[#262521]/90 border border-slate-200/90 dark:border-[#383630] text-slate-800 dark:text-[#E6E4DD] shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#005EB8] dark:hover:border-[#4D8DF5] hover:text-[#005EB8] dark:hover:text-white hover:-translate-y-0.5 active:translate-y-0"
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
        <span
          className="glass-panel absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-72 sm:w-84 max-w-[calc(100vw-36px)] p-3.5 rounded-2xl text-slate-800 dark:text-[#EDECE6] text-left pointer-events-auto block animate-in fade-in zoom-in-95 duration-150"
          style={{ filter: "drop-shadow(0 16px 36px rgba(0,0,0,0.20))" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <span className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#2C2A24]">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#1C2C21] px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>Verified Source</span>
              </span>
              {matchedCitations.length > 1 && (
                <span className="text-[10px] text-slate-400 dark:text-[#88867E]">
                  ({matchedCitations.length} cited records)
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsPinned(false);
                setIsOpen(false);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-[#88867E] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2C2A24] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </span>

          {/* Citations List */}
          <span className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2C2A24] mt-2 space-y-2 block">
            {matchedCitations.map((cit, idx) => {
              const info = getSourceBadgeInfo(cit.source, cit.url);
              return (
                <span key={idx} className={`block ${idx > 0 ? "pt-2" : ""}`}>
                  <span className="flex items-start gap-1.5">
                    <SourceBadgeIcon info={info} />
                    <span className="min-w-0 flex-1 block">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block">
                        {info.fullTitle}
                      </span>
                      {cit.page && (
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5 block">
                          Clause / Ref: {cit.page}
                        </span>
                      )}
                    </span>
                  </span>

                  {cit.text && (
                    <span className="text-[11px] leading-relaxed text-slate-600 dark:text-[#C5C3BA] mt-1.5 italic pl-2 border-l-2 border-slate-300 dark:border-[#4B4940] line-clamp-4 block">
                      &ldquo;{cit.text}&rdquo;
                    </span>
                  )}

                  <span className="mt-2 flex items-center justify-end">
                    <a
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--blue-600)] dark:text-blue-400 hover:underline"
                    >
                      <span>Open official reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </span>
              );
            })}
          </span>

          {/* Popover Arrow Indicator */}
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#1E1D19] border-r border-b border-slate-200/90 dark:border-[#3E3C35] rotate-45 block" />
        </span>
      )}
    </span>
  );
}

/**
 * Preprocesses markdown text to replace all citation markers:
 * - [S1], [S2], [1], [2], [S1][S2], [S1, S2], [1, 2]
 * - [cite:S1], [cite: S1], [citation:S1]
 * - (cite:S1), (citation:S1)
 * - bare word cite:S1 or citation:S1
 * into clean markdown link syntax: [cite:S1](citation:S1)
 * while preserving already formatted markdown citation links.
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

  // 1. Collect any already-formatted markdown citation links [cite:S1](citation:S1)
  const existingLinkRegex = /\[(?:cite:)?([^\]]+)\]\(citation:([^\)]+)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = existingLinkRegex.exec(content)) !== null) {
    const rawIds = m[2].match(/S?\d+/g) || [];
    rawIds.forEach((id: string) => {
      renderedIds.add(id);
      const clean = id.replace(/^S/i, "");
      renderedIds.add(clean);
      renderedIds.add(`S${clean}`);
    });
  }

  // 2. Comprehensive citation regex matching:
  // - [cite: S1] or [citation: S1]
  // - (cite: S1) or (citation: S1)
  // - bare word \bcite:S1\b or \bcitation:S1\b
  // - [S1], [S2], [1], [2], [S1][S2], [S1, S2]
  // negative lookaheads avoid double-wrapping existing links or regular markdown links
  const citationRegex = /(?:\[(?:cite|citation):\s*([S?\d,\s]+)\]|\((?:cite|citation):\s*([S?\d,\s]+)\)|\b(?:cite|citation):\s*(S?\d+)\b|((?:\[S?\d+\](?:\s*\[S?\d+\])*|\[S?\d+(?:\s*,\s*S?\d+)+\])))(?!\]\((?:citation:|#citation-))(?!\()/gi;

  const processedContent = content.replace(citationRegex, (_full, p1, p2, p3, p4) => {
    const rawMatch = p1 || p2 || p3 || p4 || "";
    const rawIds = rawMatch.match(/S?\d+/g) || [];
    if (rawIds.length === 0) return _full;

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

/**
 * Modern, interactive Sources & References Panel (ChatGPT / Perplexity style)
 * Displays clickable source cards with badges, excerpt previews, and direct links to official BIS portals.
 */
export function SourcesPanel({
  citations = [],
  className = "",
}: {
  citations?: CitationItem[];
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className={`mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/10 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-[#004B87] dark:text-blue-300 text-[11px] font-bold group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#004B87] dark:text-blue-400" />
          <span>{citations.length} Verified {citations.length === 1 ? "Source" : "Sources"}</span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {isExpanded ? "Hide source documents" : "View official references & clauses"}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-auto" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-auto" />
        )}
      </button>

      {/* Expandable Sources Grid */}
      {isExpanded && (
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {citations.map((cit, idx) => {
            const badge = getSourceBadgeInfo(cit.source, cit.url);
            return (
              <a
                key={idx}
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between p-3 rounded-xl bg-slate-50/90 hover:bg-white dark:bg-[#1E1D19] dark:hover:bg-[#26241F] border border-slate-200/90 hover:border-blue-400/80 dark:border-[#38362E] dark:hover:border-blue-500/60 transition-all group/card shadow-2xs text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SourceBadgeIcon info={badge} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {badge.displayName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {cit.id || `S${idx + 1}`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 leading-snug">
                    {badge.fullTitle}
                  </div>
                  {cit.page && (
                    <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                      Clause / Ref: {cit.page}
                    </div>
                  )}
                  {cit.text && (
                    <p className="text-[11px] text-slate-600 dark:text-[#C5C3BA] mt-1.5 line-clamp-3 italic leading-relaxed pl-2 border-l-2 border-blue-400/60 dark:border-blue-500/50">
                      &ldquo;{cit.text}&rdquo;
                    </p>
                  )}
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-[#004B87] dark:text-blue-400 group-hover/card:underline">
                  <span>Open Official Document</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
