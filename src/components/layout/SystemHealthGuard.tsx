import { useState, useEffect, useRef, type ReactNode } from "react";
import { apiClient } from "@/lib/apiClient";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

/**
 * SystemHealthGuard — Checks backend health with Render cold-start awareness.
 *
 * Key behaviour:
 *  - On first mount, waits up to 90s for the backend to respond (Render free tier cold start).
 *  - While waiting (isChecking = true), renders children normally — no blocking screen.
 *  - Only shows the "offline" screen AFTER a confirmed failed response.
 *  - "Try Reconnecting" waits up to 90s again before declaring failure.
 *  - Polls every 60s once healthy to detect outages.
 */
export const SystemHealthGuard = ({ children }: { children: ReactNode }) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const checkHealth = async () => {
    // Cancel any previous in-flight check
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsChecking(true);

    try {
      // 90 second timeout to survive Render cold starts
      const timeoutId = setTimeout(() => controller.abort(), 90_000);
      const healthy = await apiClient.checkHealth(controller.signal);
      clearTimeout(timeoutId);

      if (!controller.signal.aborted) {
        setIsHealthy(healthy);
        setIsChecking(false);
      }
    } catch {
      if (!controller.signal.aborted) {
        setIsHealthy(false);
        setIsChecking(false);
      }
    }
  };

  const handleReconnect = () => {
    setAttemptCount(c => c + 1);
    checkHealth();
  };

  useEffect(() => {
    checkHealth();
    // Poll every 60s once initial check done
    const interval = setInterval(checkHealth, 60_000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, []);

  // While initial check is running, render children (don't block)
  // The session will gracefully fail if they try to chat before backend is up
  if (isChecking && isHealthy === null) {
    return <>{children}</>;
  }

  // Confirmed offline — show blocking screen
  if (isHealthy === false) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--saathi-bg)] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-amber-100">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            {isChecking
              ? <Wifi className="text-amber-400 w-8 h-8 animate-pulse" />
              : <AlertTriangle className="text-amber-500 w-8 h-8" />
            }
          </div>
          <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
            {isChecking ? "Waking up the system…" : "System Temporarily Offline"}
          </h2>
          <p className="text-[15px] text-gray-600 mb-2 leading-relaxed">
            {isChecking
              ? "Our backend is starting up. This can take up to 60 seconds on first load. Please wait…"
              : "The Saathi backend is currently unreachable. We pause sessions during outages to protect your therapeutic continuity."
            }
          </p>
          {!isChecking && attemptCount > 0 && (
            <p className="text-xs text-gray-400 mb-6">
              Attempt {attemptCount} — backend may need a moment to wake up.
            </p>
          )}
          {!isChecking && (
            <button
              onClick={handleReconnect}
              disabled={isChecking}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              Try Reconnecting
            </button>
          )}
          {isChecking && (
            <div className="w-full bg-amber-50 rounded-xl py-3 px-4 mt-4">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-sm text-amber-700">Checking connection…</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
