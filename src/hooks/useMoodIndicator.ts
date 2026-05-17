import { useState, useEffect, useRef, useCallback } from "react";
import type { EmotionalState } from "./useChat";

/**
 * useMoodIndicator — Connects to a mood backend (WebSocket → REST fallback)
 * and returns a `{ mood, confidence }` pair for the LED indicator.
 *
 * When no backend is available (current mock setup), it maps the legacy
 * `emotionalState` from `useChat` to the new 14-mood palette.
 */

interface MoodPayload {
  mood: string;
  confidence: number;
}

/** Maps the legacy 4-state `EmotionalState` to the new 14-mood palette */
const LEGACY_MAP: Record<EmotionalState, string> = {
  calm: "calm",
  mild_stress: "anxious",
  high_distress: "seeking help",
  neutral: "unknown",
};

/** Default confidence for each legacy state (>= 0.70 enables pulse) */
const LEGACY_CONFIDENCE: Record<EmotionalState, number> = {
  calm: 0.85,
  mild_stress: 0.80,
  high_distress: 0.90,
  neutral: 0.0,
};

const WS_URL = "ws://localhost:8080/mood";
const REST_URL = "/api/mood/current";
const POLL_INTERVAL = 5_000;
const TIMEOUT_MS = 10_000;

/**
 * Set this to `true` when a real mood backend is deployed.
 * While `false`, the hook skips all network calls and uses
 * the legacy emotionalState mapping directly.
 */
const BACKEND_ENABLED = false;

export const useMoodIndicator = (fallbackState: EmotionalState) => {
  const [backendMood, setBackendMood] = useState<string>("unknown");
  const [backendConfidence, setBackendConfidence] = useState<number>(0);
  const [backendConnected, setBackendConnected] = useState(false);

  const lastReceivedRef = useRef<number>(Date.now());
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePayload = useCallback((payload: MoodPayload) => {
    setBackendMood(payload.mood);
    setBackendConfidence(payload.confidence);
    setBackendConnected(true);
    lastReceivedRef.current = Date.now();
  }, []);

  /* ── Timeout checker — go offline if no backend updates in 10s ── */
  useEffect(() => {
    if (!BACKEND_ENABLED || !backendConnected) return;

    timeoutRef.current = setInterval(() => {
      if (Date.now() - lastReceivedRef.current > TIMEOUT_MS) {
        setBackendConnected(false);
      }
    }, 2_000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [backendConnected]);

  /* ── WebSocket → REST polling (only when BACKEND_ENABLED) ── */
  useEffect(() => {
    if (!BACKEND_ENABLED) return;

    let cancelled = false;
    let failCount = 0;

    const connectWS = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const data: MoodPayload = JSON.parse(event.data);
            if (data.mood) handlePayload(data);
          } catch { /* ignore */ }
        };

        ws.onopen = () => {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        };

        ws.onerror = () => ws.close();

        ws.onclose = () => {
          if (!cancelled) startPolling();
        };
      } catch {
        if (!cancelled) startPolling();
      }
    };

    const startPolling = () => {
      if (pollRef.current) return;

      const poll = async () => {
        try {
          const res = await fetch(REST_URL);
          if (!res.ok) throw new Error("non-2xx");
          const data: MoodPayload = await res.json();
          if (data.mood) handlePayload(data);
          failCount = 0;
        } catch {
          failCount++;
          if (failCount >= 2 && pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setBackendConnected(false);
          }
        }
      };

      poll();
      pollRef.current = setInterval(poll, POLL_INTERVAL);
    };

    connectWS();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [handlePayload]);

  /* ── Return backend data when connected, otherwise map legacy state ── */
  if (BACKEND_ENABLED && backendConnected) {
    return { mood: backendMood, confidence: backendConfidence };
  }

  return {
    mood: LEGACY_MAP[fallbackState],
    confidence: LEGACY_CONFIDENCE[fallbackState],
  };
};

export default useMoodIndicator;
