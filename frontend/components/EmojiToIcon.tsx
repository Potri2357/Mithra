"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Pin,
  MapPin,
  Lightbulb,
  Search,
  ShieldCheck,
  ShieldAlert,
  ClipboardCheck,
  FileText,
  Landmark,
  Building2,
  Factory,
  FlaskConical,
  Scale,
  Tag,
  Package,
  Coins,
  CreditCard,
  Phone,
  Globe,
  Clock,
  Calendar,
  Star,
  Sparkles,
  Lock,
  Link2,
  Target,
  User,
  Users,
  MessageSquare,
  HelpCircle,
  Zap,
  BookOpen,
  Award,
  FileCheck,
} from "lucide-react";

interface EmojiDefinition {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  label: string;
}

export const EMOJI_ICON_MAP: Record<string, EmojiDefinition> = {
  // Success / Verification / Done
  "✅": { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Verified" },
  "✔": { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Check" },
  "☑": { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Completed" },
  "✓": { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Check" },

  // Error / Invalid / Rejection
  "❌": { icon: XCircle, className: "text-rose-600 dark:text-rose-400", label: "Invalid / Not Found" },
  "✖": { icon: XCircle, className: "text-rose-600 dark:text-rose-400", label: "Cross" },
  "❎": { icon: XCircle, className: "text-rose-600 dark:text-rose-400", label: "Rejected" },
  "🚫": { icon: XCircle, className: "text-rose-600 dark:text-rose-400", label: "Prohibited" },

  // Warnings / Alerts
  "⚠️": { icon: AlertTriangle, className: "text-amber-500 dark:text-amber-400", label: "Warning" },
  "⚠": { icon: AlertTriangle, className: "text-amber-500 dark:text-amber-400", label: "Warning" },
  "🚨": { icon: ShieldAlert, className: "text-rose-500 dark:text-rose-400", label: "Alert" },

  // Info / Questions
  "ℹ️": { icon: Info, className: "text-blue-500 dark:text-blue-400", label: "Information" },
  "ℹ": { icon: Info, className: "text-blue-500 dark:text-blue-400", label: "Information" },
  "❓": { icon: HelpCircle, className: "text-blue-500 dark:text-blue-400", label: "Question" },
  "❔": { icon: HelpCircle, className: "text-blue-500 dark:text-blue-400", label: "Help" },

  // Pins & Locations
  "📌": { icon: Pin, className: "text-indigo-500 dark:text-indigo-400", label: "Key Requirement" },
  "📍": { icon: MapPin, className: "text-rose-500 dark:text-rose-400", label: "Location" },

  // Tips / Ideas
  "💡": { icon: Lightbulb, className: "text-amber-500 dark:text-amber-300", label: "Tip" },
  "⚡": { icon: Zap, className: "text-amber-500 dark:text-amber-400", label: "Tatkal / Fast-track" },

  // Search & Inspection
  "🔍": { icon: Search, className: "text-blue-600 dark:text-blue-400", label: "Standards Search" },
  "🔎": { icon: Search, className: "text-blue-600 dark:text-blue-400", label: "Inspect" },

  // Standards / Certification / Security
  "🛡️": { icon: ShieldCheck, className: "text-emerald-600 dark:text-emerald-400", label: "Certified / Protected" },
  "🛡": { icon: ShieldCheck, className: "text-emerald-600 dark:text-emerald-400", label: "Certified" },
  "🏆": { icon: Award, className: "text-amber-500 dark:text-amber-400", label: "Accredited" },
  "🥇": { icon: Award, className: "text-amber-500 dark:text-amber-400", label: "Gold Standard" },
  "🔒": { icon: Lock, className: "text-slate-600 dark:text-slate-400", label: "Secure" },

  // Documents & Checklists
  "📋": { icon: ClipboardCheck, className: "text-slate-600 dark:text-slate-300", label: "Checklist" },
  "📄": { icon: FileText, className: "text-slate-600 dark:text-slate-300", label: "Document" },
  "📝": { icon: FileText, className: "text-slate-600 dark:text-slate-300", label: "Application" },
  "📑": { icon: FileText, className: "text-slate-600 dark:text-slate-300", label: "Clauses" },
  "📜": { icon: BookOpen, className: "text-slate-600 dark:text-slate-300", label: "Regulation" },

  // Organizations & Facilities
  "🏛️": { icon: Landmark, className: "text-amber-700 dark:text-amber-400", label: "Official BIS Body" },
  "🏛": { icon: Landmark, className: "text-amber-700 dark:text-amber-400", label: "Official BIS Body" },
  "🏢": { icon: Building2, className: "text-slate-600 dark:text-slate-400", label: "Regional Office" },
  "🏭": { icon: Factory, className: "text-slate-600 dark:text-slate-400", label: "Manufacturing Facility" },
  "🔬": { icon: FlaskConical, className: "text-purple-600 dark:text-purple-400", label: "Recognized Laboratory" },

  // Law, Rules & Codes
  "⚖️": { icon: Scale, className: "text-blue-600 dark:text-blue-400", label: "Legal / BIS Act" },
  "⚖": { icon: Scale, className: "text-blue-600 dark:text-blue-400", label: "Legal / BIS Act" },
  "🏷️": { icon: Tag, className: "text-teal-600 dark:text-teal-400", label: "Standard Code / IS" },
  "🏷": { icon: Tag, className: "text-teal-600 dark:text-teal-400", label: "Standard Code / IS" },
  "📦": { icon: Package, className: "text-amber-700 dark:text-amber-400", label: "Product Sample" },

  // Fees & Finance
  "💰": { icon: Coins, className: "text-amber-600 dark:text-amber-400", label: "Fee / Cost" },
  "💳": { icon: CreditCard, className: "text-blue-600 dark:text-blue-400", label: "Online Payment" },
  "🪙": { icon: Coins, className: "text-amber-500 dark:text-amber-400", label: "Gold / Silver Purity" },

  // Contact & Channels
  "📞": { icon: Phone, className: "text-emerald-600 dark:text-emerald-400", label: "Helpline: 1800-11-4000" },
  "☎️": { icon: Phone, className: "text-emerald-600 dark:text-emerald-400", label: "Helpline" },
  "🌐": { icon: Globe, className: "text-blue-500 dark:text-blue-400", label: "Official Portal" },
  "🔗": { icon: Link2, className: "text-blue-500 dark:text-blue-400", label: "Link" },
  "💬": { icon: MessageSquare, className: "text-blue-500 dark:text-blue-400", label: "Support Query" },

  // Time & Deadlines
  "🕒": { icon: Clock, className: "text-slate-500 dark:text-slate-400", label: "Timeline" },
  "⏱️": { icon: Clock, className: "text-slate-500 dark:text-slate-400", label: "Turnaround Time" },
  "📅": { icon: Calendar, className: "text-slate-500 dark:text-slate-400", label: "QCO Enforcement Date" },
  "⏳": { icon: Clock, className: "text-slate-500 dark:text-slate-400", label: "Pending Scrutiny" },

  // Ratings & Highlights
  "⭐": { icon: Star, className: "text-amber-400 fill-amber-400", label: "Rating" },
  "🌟": { icon: Sparkles, className: "text-amber-400 fill-amber-400", label: "Key Feature" },
  "✨": { icon: Sparkles, className: "text-amber-400 fill-amber-400", label: "Compliance Highlight" },
  "🎯": { icon: Target, className: "text-rose-500 dark:text-rose-400", label: "Scope of Standard" },
  "🚀": { icon: Sparkles, className: "text-indigo-500 dark:text-indigo-400", label: "Startup Scheme" },

  // Users & Consumers
  "👤": { icon: User, className: "text-slate-500 dark:text-slate-400", label: "Applicant" },
  "👥": { icon: Users, className: "text-slate-500 dark:text-slate-400", label: "Consumers" },
};

// Regex matching any known emojis or extended pictographic symbols
const EMOJI_REGEX_STR = Object.keys(EMOJI_ICON_MAP)
  .sort((a, b) => b.length - a.length)
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const KNOWN_EMOJI_REGEX = new RegExp(`(${EMOJI_REGEX_STR})`, "g");

/**
 * Transforms a raw string containing emojis into an array of React elements
 * where emojis are replaced with crisp, colored Lucide vector icons.
 */
export function transformEmojiString(text: string): React.ReactNode {
  if (!text) return text;

  const parts = text.split(KNOWN_EMOJI_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, idx) => {
    const match = EMOJI_ICON_MAP[part];
    if (match) {
      const IconComponent = match.icon;
      return (
        <span
          key={`emoji-icon-${idx}`}
          className="inline-flex items-center justify-center align-middle mx-0.5 relative top-[-1px] transition-transform hover:scale-110"
          title={match.label}
          aria-label={match.label}
        >
          <IconComponent className={`w-4 h-4 shrink-0 inline ${match.className}`} />
        </span>
      );
    }
    return part;
  });
}

/**
 * Recursively inspects React children and replaces any string emojis with Lucide icons.
 */
export function replaceEmojisWithIcons(node: React.ReactNode): React.ReactNode {
  if (node === null || node === undefined) return node;

  if (typeof node === "string") {
    return transformEmojiString(node);
  }

  if (typeof node === "number" || typeof node === "boolean") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{replaceEmojisWithIcons(child)}</React.Fragment>
    ));
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    if (node.props && node.props.children) {
      return React.cloneElement(node, undefined, replaceEmojisWithIcons(node.props.children));
    }
  }

  return node;
}

/**
 * Specifically transforms an array of ReactNode, preserving array type for element arrays.
 */
export function replaceEmojisInNodeList(nodes: React.ReactNode[]): React.ReactNode[] {
  return nodes.map((node) => replaceEmojisWithIcons(node));
}
