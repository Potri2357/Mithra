import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Bulletproof answer sanitizer and JSON unwrapper for all assistant responses.
 * Guarantees that raw JSON envelopes, markdown code blocks, or structured dictionaries
 * are always converted to clean, human-readable Markdown prose.
 */
export function unwrapCleanAnswer(data: any): { answer: string; citations?: any[]; follow_ups?: string[] } {
  if (!data) return { answer: "" };
  let raw: any = typeof data === "string" ? data : (data.answer ?? data.response ?? data.content ?? data.text ?? data.message ?? data);
  let citations = data.citations || [];
  let follow_ups = data.follow_ups || [];
  let follow_up = data.follow_up;

  function formatDictOrList(val: any): string {
    if (Array.isArray(val)) {
      return val.map((item) => (typeof item === "object" && item !== null ? formatDictOrList(item) : `- ${item}`)).join("\n");
    }
    if (typeof val === "object" && val !== null) {
      return Object.entries(val)
        .map(([k, v]) => {
          const title = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          if (typeof v === "object" && v !== null) {
            return `### ${title}\n${formatDictOrList(v)}`;
          }
          return `- **${title}:** ${v}`;
        })
        .join("\n");
    }
    return String(val ?? "");
  }

  function recursivelyUnwrap(val: any): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
      for (const k of ["answer", "response", "result", "content", "text", "message", "explanation", "summary", "recommendation", "recommendations", "output", "details"]) {
        if (val[k]) {
          const unwrapped = recursivelyUnwrap(val[k]);
          if (unwrapped.trim()) return unwrapped;
        }
      }
      return formatDictOrList(val);
    }

    let str = String(val).trim();
    // Strip thinking tags
    str = str.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // Check for markdown code fences with JSON
    const fenceMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const candidateStr = fenceMatch ? fenceMatch[1].trim() : str;

    try {
      const parsed = JSON.parse(candidateStr);
      if (parsed) {
        if (typeof parsed === "object") {
          if (parsed.citations && (!citations || citations.length === 0)) citations = parsed.citations;
          if (parsed.follow_ups && (!follow_ups || follow_ups.length === 0)) follow_ups = parsed.follow_ups;
          if (parsed.follow_up && !follow_up) follow_up = parsed.follow_up;
          return recursivelyUnwrap(parsed);
        }
        return recursivelyUnwrap(parsed);
      }
    } catch {
      // Regex fallback for { ... }
      const braceMatch = str.match(/(\{[\s\S]*\})/);
      if (braceMatch) {
        try {
          const parsed = JSON.parse(braceMatch[1].trim());
          if (parsed && typeof parsed === "object") {
            if (parsed.citations && (!citations || citations.length === 0)) citations = parsed.citations;
            if (parsed.follow_ups && (!follow_ups || follow_ups.length === 0)) follow_ups = parsed.follow_ups;
            if (parsed.follow_up && !follow_up) follow_up = parsed.follow_up;
            return recursivelyUnwrap(parsed);
          }
        } catch {
          // Key pattern regex
          const keyMatch = str.match(/"(?:answer|response|content|message|text|summary|explanation)"\s*:\s*"((?:\\.|[^"\\])*)"/);
          if (keyMatch && keyMatch[1].length > 1) {
            try {
              return JSON.parse(`"${keyMatch[1]}"`);
            } catch {
              return keyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
            }
          }
        }
      }
    }

    if (str.startsWith("```")) {
      str = str.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    }
    return str.trim();
  }

  const finalAnswer = recursivelyUnwrap(raw) || "Official BIS Advisory.";
  return { answer: finalAnswer, citations, follow_ups: Array.isArray(follow_ups) ? follow_ups : (follow_up ? [follow_up] : []) };
}
