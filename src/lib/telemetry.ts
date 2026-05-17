// Temporary isolation user for rewiring phase
export const DEBUG_USER_ID = "test-user-123";

type TelemetryEvent = 
  | "mutex_conflict"
  | "version_mismatch"
  | "transport_failure"
  | "request_timeout"
  | "request_aborted"
  | "session_created"
  | "session_resumed"
  | "session_invalidated"
  | "crisis_escalated"
  | "fallback_used"
  | "turn_completed";

interface TelemetryPayload {
  event: TelemetryEvent;
  session_id?: string;
  message_id?: string;
  runtime_state?: string;
  latency_ms?: number;
  generation_id?: number;
  error?: string;
  [key: string]: any;
}

export const telemetry = {
  debug: (payload: TelemetryPayload) => {
    console.debug("[THERAPY_RUNTIME]", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  },
  warn: (payload: TelemetryPayload) => {
    console.warn("[THERAPY_RUNTIME_WARN]", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  },
  error: (payload: TelemetryPayload) => {
    console.error("[THERAPY_RUNTIME_ERROR]", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }
};
