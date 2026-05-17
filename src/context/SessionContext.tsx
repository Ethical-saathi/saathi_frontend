import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ── CONSTANTS (MVP: fixed values, configurable later) ──
const TOTAL_SESSIONS = 24;
const TOTAL_WEEKS = 12;
const SESSIONS_PER_WEEK = 3;

// ── LOCALSTORAGE KEY ──
const STORAGE_KEY = "saathi_active_session";

// ── TYPES ──
export type SessionMood = "Struggling" | "Anxious" | "Okay" | "Alright" | "Good";

interface PersistedSession {
  sessionId: string;
  startTime: number;
  goal: string;
  mood: SessionMood | null;
  sessionNumber: number;
  sessionsUsedThisWeek: number;
}

export interface SessionContextValue {
  // Arc progress
  sessionNumber: number;
  sessionVersion: number;
  totalSessions: number;
  weeksElapsed: number;
  totalWeeks: number;

  // Weekly budget
  sessionsUsedThisWeek: number;
  sessionsRemaining: number;
  sessionsPerWeek: number;
  daysUntilReset: number;

  // Active session state
  sessionGoal: string;
  sessionMood: SessionMood | null;
  sessionStartTime: number | null;
  isSessionActive: boolean;
  activeSessionId: string | null;

  // Last session recap
  lastSessionSummary: string | null;
  lastSessionDate: string | null;

  // Actions
  setSessionGoal: (goal: string) => void;
  setSessionMood: (mood: SessionMood) => void;
  startSession: (goal: string, initialMood: string) => Promise<string>; // returns sessionId
  endSession: () => void;
}

// ── HELPERS ──
function calculateDaysUntilMonday(): number {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
  if (day === 0) return 1;
  if (day === 1) return 7;
  return 8 - day;
}

function loadPersistedSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedSession;
    // Validate the session isn't stale (>4 hours = likely abandoned)
    const MAX_SESSION_AGE_MS = 4 * 60 * 60 * 1000;
    if (Date.now() - data.startTime > MAX_SESSION_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistSession(data: PersistedSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — degrade gracefully
  }
}

function clearPersistedSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

// ── CONTEXT ──
export const SessionContext = createContext<SessionContextValue | null>(null);

// ── PROVIDER ──
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // FIX #1: Rehydrate from localStorage on mount (mid-session persistence)
  const persisted = loadPersistedSession();

  const [sessionNumber, setSessionNumber] = useState(
    persisted?.sessionNumber ?? 5
  );
  const [sessionVersion, setSessionVersion] = useState(0);
  const [sessionsUsedThisWeek, setSessionsUsedThisWeek] = useState(
    persisted?.sessionsUsedThisWeek ?? 1
  );
  const [weeksElapsed] = useState(3);

  const [sessionGoal, setSessionGoal] = useState(persisted?.goal ?? "");
  const [sessionMood, setSessionMood] = useState<SessionMood | null>(
    persisted?.mood ?? null
  );
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(
    persisted?.startTime ?? null
  );
  const [isSessionActive, setIsSessionActive] = useState(!!persisted);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    persisted?.sessionId ?? null
  );

  const [lastSessionSummary] = useState<string | null>(
    "You talked about work pressure and feeling like you're falling behind. Toward the end you mentioned wanting to take a small break this weekend."
  );
  const [lastSessionDate] = useState<string | null>("March 16");

  const sessionsRemaining = SESSIONS_PER_WEEK - sessionsUsedThisWeek;
  const daysUntilReset = calculateDaysUntilMonday();

  // Persist active session state to localStorage whenever it changes
  useEffect(() => {
    if (isSessionActive && activeSessionId && sessionStartTime) {
      persistSession({
        sessionId: activeSessionId,
        startTime: sessionStartTime,
        goal: sessionGoal,
        mood: sessionMood,
        sessionNumber,
        sessionsUsedThisWeek,
      });
    }
  }, [
    isSessionActive,
    activeSessionId,
    sessionStartTime,
    sessionGoal,
    sessionMood,
    sessionNumber,
    sessionsUsedThisWeek,
  ]);

  const startSession = useCallback(async (goal: string, initialMood: string) => {
    // 1. Call API to authoritative creation
    const { apiClient } = await import("@/lib/apiClient");
    
    try {
      const response = await apiClient.createSession(goal, initialMood);
      
      const id = response.session_id;
      setIsSessionActive(true);
      setActiveSessionId(id);
      setSessionStartTime(Date.now());
      setSessionNumber((prev) => prev + 1);
      setSessionsUsedThisWeek((prev) => prev + 1);
      setSessionVersion(response.session_version);
      
      return id;
    } catch (err) {
      console.error("Failed to start canonical session", err);
      throw err;
    }
  }, []);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
    setActiveSessionId(null);
    setSessionStartTime(null);
    setSessionGoal("");
    setSessionMood(null);
    clearPersistedSession();
  }, []);

  const value: SessionContextValue = {
    sessionNumber,
    sessionVersion,
    totalSessions: TOTAL_SESSIONS,
    weeksElapsed,
    totalWeeks: TOTAL_WEEKS,
    sessionsUsedThisWeek,
    sessionsRemaining,
    sessionsPerWeek: SESSIONS_PER_WEEK,
    daysUntilReset,
    sessionGoal,
    sessionMood,
    sessionStartTime,
    isSessionActive,
    activeSessionId,
    lastSessionSummary,
    lastSessionDate,
    setSessionGoal,
    setSessionMood,
    startSession,
    endSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
