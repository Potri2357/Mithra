import { createClient } from "@/utils/supabase/client";

export interface Citation {
  id: string;
  text: string;
  source: string;
  page?: string;
}

export interface Message {
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
  language?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  projectId?: string | null;
}

const MAX_SESSIONS = 30;

/**
 * Returns user-scoped localStorage key so accounts never share chats locally.
 */
export function getStorageKey(userId: string | null | undefined): string {
  if (userId) {
    return `mithra-sessions-${userId}`;
  }
  return "mithra-sessions-guest";
}

/**
 * Loads sessions from the user's isolated local cache.
 */
export function getLocalSessions(userId: string | null | undefined): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves sessions to the user's isolated local cache.
 */
export function saveLocalSessions(userId: string | null | undefined, sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(userId);
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // Storage quota or disabled — ignore
  }
}

/**
 * Fetches the user's chat sessions directly from Supabase, protected by RLS.
 * Falls back cleanly to local user cache if offline or if table is being created.
 */
export async function fetchUserSessions(
  supabase: ReturnType<typeof createClient>,
  userId: string | null | undefined
): Promise<ChatSession[]> {
  // If not logged in, return guest sessions
  if (!userId) {
    return getLocalSessions(null);
  }

  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("id, title, messages, project_id, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(MAX_SESSIONS);

    if (error) {
      // Table doesn't exist yet or network issue — use account local cache
      return getLocalSessions(userId);
    }

    if (data && Array.isArray(data)) {
      const remoteSessions: ChatSession[] = data.map((row: {
        id: string;
        title: string;
        messages: unknown;
        project_id?: string | null;
        created_at: string;
      }) => ({
        id: row.id,
        title: row.title || "Consultation",
        createdAt: new Date(row.created_at).getTime(),
        messages: (row.messages as Message[]) || [],
        projectId: row.project_id || undefined,
      }));

      // Cache locally for this user
      saveLocalSessions(userId, remoteSessions);
      return remoteSessions;
    }
  } catch (err) {
    console.warn("Could not fetch remote chat sessions:", err);
  }

  return getLocalSessions(userId);
}

/**
 * Persists a chat session to the current account in Supabase and local cache.
 */
export async function persistUserSession(
  supabase: ReturnType<typeof createClient>,
  userId: string | null | undefined,
  session: ChatSession
): Promise<void> {
  // 1. Immediately update user-scoped local cache
  const existing = getLocalSessions(userId);
  const idx = existing.findIndex((s) => s.id === session.id);
  const updated = idx >= 0 ? existing.map((s) => (s.id === session.id ? session : s)) : [session, ...existing];
  saveLocalSessions(userId, updated);

  // 2. If logged in, sync with Supabase
  if (userId) {
    try {
      await supabase.from("chat_sessions").upsert(
        {
          id: session.id,
          user_id: userId,
          title: session.title,
          project_id: session.projectId || null,
          messages: session.messages,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } catch (err) {
      console.warn("Could not sync chat session to Supabase:", err);
    }
  }
}

/**
 * Removes a chat session from the current account in Supabase and local cache.
 */
export async function removeUserSession(
  supabase: ReturnType<typeof createClient>,
  userId: string | null | undefined,
  sessionId: string
): Promise<void> {
  // 1. Update local cache
  const existing = getLocalSessions(userId);
  const filtered = existing.filter((s) => s.id !== sessionId);
  saveLocalSessions(userId, filtered);

  // 2. Delete from Supabase
  if (userId) {
    try {
      await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", userId);
    } catch (err) {
      console.warn("Could not delete chat session from Supabase:", err);
    }
  }
}
