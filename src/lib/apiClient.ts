import { telemetry } from "./telemetry";
import { supabase } from "./supabaseClient";


// ==========================================
// ERROR TAXONOMY
// ==========================================
export class MutexConflictError extends Error {
  constructor() { super("Processing in progress"); this.name = "MutexConflictError"; }
}
export class VersionMismatchError extends Error {
  constructor() { super("Session version mismatch"); this.name = "VersionMismatchError"; }
}
export class TimeoutError extends Error {
  constructor() { super("Request timed out"); this.name = "TimeoutError"; }
}
export class BackendFailureError extends Error {
  constructor(message: string) { super(message); this.name = "BackendFailureError"; }
}
export class NetworkDisconnectError extends Error {
  constructor() { super("Network disconnected"); this.name = "NetworkDisconnectError"; }
}

// ==========================================
// STRICT TYPED CONTRACTS
// ==========================================
export interface ChatRequest {
  session_id: string;
  message_id: string;
  message: string;
  session_version: number;
}

export interface ChatResponse {
  response_id: string;
  session_id: string;
  session_version: number;
  response: string;
  response_type: "STANDARD" | "CRISIS_ESCALATION" | "SYSTEM_NUDGE" | "SESSION_INVALIDATED";
  emotional_state: string;
  fallback_used: boolean;
  timestamp: string;
}

export interface SessionCreateRequest {
  user_id: string;
  intention: string;
  mood: string;
}

export interface SessionResponse {
  session_id: string;
  session_version: number;
  goal: string;
  status: "ACTIVE" | "COMPLETED" | "LOCKED";
  created_at: string;
}

export interface HistoryTurn {
  id: string;
  turn_number: number;
  user_message: string;
  assistant_response: string;
  emotional_state: string;
  timestamp: string;
}

// ==========================================
// TRANSPORT ABSTRACTION
// ==========================================
interface RequestOptions {
  method: string;
  body?: any;
  signal?: AbortSignal;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` 
  : "http://127.0.0.1:8000/api/v1";

class RESTTransportAdapter {
  // We track generation_id explicitly to discard stale delayed responses
  private currentGenerationId: number = 0;

  public incrementGeneration() {
    this.currentGenerationId++;
    return this.currentGenerationId;
  }

  public getGenerationId() {
    return this.currentGenerationId;
  }

  private async fetchWithTimeout(url: string, options: RequestOptions, timeoutMs: number = 60000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    // If an external signal was provided, link it
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        if (options.signal?.aborted) {
          throw new Error("Aborted"); // Silently discard
        }
        throw new TimeoutError();
      }
      if (!window.navigator.onLine) {
        throw new NetworkDisconnectError();
      }
      throw new NetworkDisconnectError(); // Fetch throws TypeError on network fail
    }
  }

  public async request<T>(endpoint: string, options: RequestOptions, retryCount = 0): Promise<{ data: T, generationId: number }> {
    const MAX_RETRIES = 1;
    const reqGenerationId = this.currentGenerationId;
    const startTime = Date.now();

    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, options);
      
      const latency = Date.now() - startTime;

      if (response.status === 409) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail?.includes("processing") || errorData.detail?.includes("locked")) {
          telemetry.debug({ event: "mutex_conflict", latency_ms: latency, generation_id: reqGenerationId });
          throw new MutexConflictError();
        }
        telemetry.warn({ event: "version_mismatch", latency_ms: latency, generation_id: reqGenerationId });
        throw new VersionMismatchError();
      }

      if (!response.ok) {
        if (response.status >= 500) {
          throw new BackendFailureError(`Backend returned ${response.status}`);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return { data, generationId: reqGenerationId };

    } catch (error: any) {
      if (error instanceof TimeoutError || error instanceof NetworkDisconnectError || error instanceof BackendFailureError) {
        if (retryCount < MAX_RETRIES && !options.signal?.aborted) {
          telemetry.warn({ event: "transport_failure", error: error.name, retry_attempt: retryCount + 1 });
          // Exponential backoff
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, retryCount)));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
      }
      throw error;
    }
  }
}

const transport = new RESTTransportAdapter();

// ==========================================
// API CLIENT EXPORTS
// ==========================================
export const apiClient = {
  getGenerationId: () => transport.getGenerationId(),
  incrementGeneration: () => transport.incrementGeneration(),

  checkHealth: async (signal?: AbortSignal) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${baseUrl}/health`, { method: 'GET', signal });
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  },

  createSession: async (userId: string, goal: string, initialMood: string, signal?: AbortSignal): Promise<SessionResponse> => {
    const payload: SessionCreateRequest = { 
      user_id: userId,
      intention: goal, 
      mood: initialMood 
    };
    const { data, generationId } = await transport.request<SessionResponse>('/therapy/session/create', { 
      method: 'POST', 
      body: payload,
      signal
    });
    
    // Discard if generation shifted during request
    if (generationId !== transport.getGenerationId()) {
      throw new Error("Stale Response: Generation shifted");
    }

    telemetry.debug({ event: "session_created", session_id: data.session_id });
    return data;
  },

  sendMessage: async (req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> => {
    const { data, generationId } = await transport.request<ChatResponse>('/chat/message', {
      method: 'POST',
      body: req,
      signal
    });

    if (generationId !== transport.getGenerationId()) {
      throw new Error("Stale Response: Generation shifted");
    }

    telemetry.debug({ 
      event: "turn_completed", 
      session_id: data.session_id, 
      runtime_state: data.response_type,
      fallback_used: data.fallback_used
    });

    return data;
  },

  fetchHistory: async (sessionId: string, signal?: AbortSignal): Promise<HistoryTurn[]> => {
    const { data, generationId } = await transport.request<HistoryTurn[]>(`/chat/session/${sessionId}/history`, {
      method: 'GET',
      signal
    });

    if (generationId !== transport.getGenerationId()) {
      throw new Error("Stale Response: Generation shifted");
    }

    return data;
  },

  endSession: async (sessionId: string, durationMinutes: number = 30, signal?: AbortSignal): Promise<any> => {
    const { data } = await transport.request<any>('/therapy/session/end', {
      method: 'POST',
      body: { session_id: sessionId, user_id: "placeholder", duration_minutes: durationMinutes },
      signal
    });
    return data;
  },

  fetchSessions: async (signal?: AbortSignal): Promise<any> => {
    const { data } = await transport.request<any>('/therapy/session/all', {
      method: 'GET',
      signal
    });
    return data;
  }
};
