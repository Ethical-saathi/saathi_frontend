import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  apiClient, 
  MutexConflictError, 
  VersionMismatchError, 
  TimeoutError, 
  NetworkDisconnectError,
  ChatResponse,
  HistoryTurn
} from "@/lib/apiClient";
import { telemetry } from "@/lib/telemetry";

export type SenderType = "saathi" | "user";
export type EmotionalState = "calm" | "mild_stress" | "high_distress" | "neutral";

export type DeliveryState = "PENDING" | "SENT" | "CONFIRMED" | "FAILED" | "RETRYABLE";
export type StreamingState = "NONE" | "STREAMING" | "COMPLETE";

export enum SessionRuntimeState {
  IDLE = "IDLE",
  SENDING = "SENDING",
  WAITING_FOR_RESPONSE = "WAITING_FOR_RESPONSE",
  LOCKED = "LOCKED",
  CRISIS_ESCALATED = "CRISIS_ESCALATED",
  RESYNC_REQUIRED = "RESYNC_REQUIRED",
  EXPIRED = "EXPIRED",
  RECONNECTING = "RECONNECTING"
}

export interface ChatMessage {
  id: string; // Idempotency key
  sender: SenderType;
  text: string; 
  content_chunks?: string[];
  timestamp: Date;
  delivery_state?: DeliveryState;
  streaming_state?: StreamingState;
  origin: "CANONICAL" | "OPTIMISTIC"; // Prevents ghost turns
}

export interface SessionHistoryItem {
  id: string;
  date: string;
  summary: string;
  isActive: boolean;
}

export const useChat = (providedSessionId?: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unsentMessageQueue, setUnsentMessageQueue] = useState<ChatMessage[]>([]);
  const [runtimeState, setRuntimeState] = useState<SessionRuntimeState>(SessionRuntimeState.IDLE);
  const [inputValue, setInputValue] = useState("");
  const [emotionalState, setEmotionalState] = useState<EmotionalState>("neutral");
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [showPauseNotification, setShowPauseNotification] = useState(false);
  const [showGuestSave, setShowGuestSave] = useState(false);
  
  // Track backend version directly within hook for authoritative sync
  const currentSessionVersionRef = useRef<number>(0);

  const [sessionHistory] = useState<SessionHistoryItem[]>([
    { id: "active", date: "Today", summary: "Current session", isActive: true },
  ]);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  const sessionId = providedSessionId || state?.sessionId;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setShowPauseNotification(false);
    idleTimerRef.current = setTimeout(() => {
      setShowPauseNotification(true);
    }, 480000);
  }, []);

  const fetchCanonicalHistory = useCallback(async () => {
    if (!sessionId) return false;
    try {
      setRuntimeState(SessionRuntimeState.RESYNC_REQUIRED);
      const { turns, session_version } = await apiClient.fetchHistory(sessionId);
      
      if (!turns || turns.length === 0) {
        setRuntimeState(SessionRuntimeState.IDLE);
        return false;
      }
      
      currentSessionVersionRef.current = session_version;
      
      const canonicalMessages: ChatMessage[] = [];
      turns.forEach((turn: HistoryTurn) => {
        canonicalMessages.push({
          id: `u-${turn.id}`,
          sender: "user",
          text: turn.user_message,
          timestamp: new Date(turn.timestamp),
          origin: "CANONICAL",
          delivery_state: "CONFIRMED"
        });
        canonicalMessages.push({
          id: `s-${turn.id}`,
          sender: "saathi",
          text: turn.assistant_response,
          timestamp: new Date(turn.timestamp),
          origin: "CANONICAL",
          delivery_state: "CONFIRMED"
        });
      });

      // Completely overwrite local state with backend projection
      setMessages(canonicalMessages);
      setRuntimeState(SessionRuntimeState.IDLE);

      // Replay unsent messages if any exist
      if (unsentMessageQueue.length > 0) {
        // Future: trigger replay logic
      }
      return true;

    } catch (err) {
      telemetry.error({ event: "version_mismatch", error: "Failed to resync history" });
      setRuntimeState(SessionRuntimeState.RECONNECTING);
      return false;
    }
  }, [sessionId, unsentMessageQueue]);

  // Initialization: Fetch history or display opening
  useEffect(() => {
    if (!sessionId) return;
    
    // Increment generation ID on fresh mount/sync
    apiClient.incrementGeneration();
    
    const initSession = async () => {
      let hasHistory = false;
      if (sessionId) {
        hasHistory = await fetchCanonicalHistory();
      }

      // If no messages exist after fetch attempt, create an optimistic opening
      if (!hasHistory && messages.length === 0) {
        const userName = state?.userName || "Friend";
        const mood = state?.mood || "okay";
        const intention = state?.intention || "";
        const isReturningUser = state?.isReturningUser || false;

        let firstMessageText = `Hi ${userName}. I've got your space ready. I noticed you're feeling ${mood.toLowerCase()} right now. How would you like to begin?`;
        if (intention) {
          firstMessageText = `Hi ${userName}. I see you want to work on "${intention.trim()}" today. I'm here to explore that with you — take your time, and start wherever feels right.`;
        } else if (isReturningUser) {
          firstMessageText = `Welcome back, ${userName}. How are things feeling today?`;
        }

        setMessages([{
          id: crypto.randomUUID(),
          sender: "saathi",
          text: firstMessageText,
          timestamp: new Date(),
          origin: "CANONICAL",
          delivery_state: "CONFIRMED",
          streaming_state: "COMPLETE"
        }]);
      }
    };

    initSession();
    
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleMutexConflict = useCallback(() => {
    setRuntimeState(SessionRuntimeState.LOCKED);
    telemetry.warn({ event: "mutex_conflict", session_id: sessionId });
    // Stub: implement polling backoff in future
    setTimeout(() => {
      if (runtimeState === SessionRuntimeState.LOCKED) {
        setRuntimeState(SessionRuntimeState.IDLE);
      }
    }, 3000);
  }, [sessionId, runtimeState]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const messageId = crypto.randomUUID();
    const userMsg: ChatMessage = {
      id: messageId,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
      delivery_state: "PENDING",
      origin: "OPTIMISTIC" // Temporary projection
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setRuntimeState(SessionRuntimeState.SENDING);
    resetIdleTimer();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setRuntimeState(SessionRuntimeState.WAITING_FOR_RESPONSE);
      
      const response = await apiClient.sendMessage(
        {
          session_id: sessionId,
          message_id: messageId,
          content: text.trim(),
          expected_version: currentSessionVersionRef.current
        },
        abortControllerRef.current.signal
      );

      // Successfully synced. Apply canonical response
      currentSessionVersionRef.current = response.session_version;
      
      const saathiMsg: ChatMessage = {
        id: response.response_id,
        sender: "saathi",
        text: response.response,
        timestamp: new Date(response.timestamp),
        delivery_state: "CONFIRMED",
        streaming_state: "COMPLETE",
        origin: "CANONICAL"
      };

      setMessages(prev => {
        // Upgrade the optimistic user message to canonical
        const mapped = prev.map(m => m.id === messageId ? { ...m, origin: "CANONICAL" as const, delivery_state: "CONFIRMED" as const } : m);
        return [...mapped, saathiMsg];
      });
      
      // Update states based on authoritative backend response
      const mappedMood = response.emotional_state as EmotionalState;
      if (["calm", "mild_stress", "high_distress", "neutral"].includes(mappedMood)) {
         setEmotionalState(mappedMood);
      }
      
      if (response.response_type === "CRISIS_ESCALATION") {
        setRuntimeState(SessionRuntimeState.CRISIS_ESCALATED);
        // Force navigate to escalation screen eventually if needed, or rely on overlay
      } else if (response.response_type === "SESSION_INVALIDATED") {
        setRuntimeState(SessionRuntimeState.EXPIRED);
      } else {
        setRuntimeState(SessionRuntimeState.IDLE);
      }

    } catch (error: any) {
      // Failed to sync
      if (error instanceof MutexConflictError) {
        // Strip the ghost user turn because it was blocked
        setMessages(prev => prev.filter(m => m.id !== messageId));
        handleMutexConflict();
      } else if (error instanceof VersionMismatchError) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        // Push user turn to unsent queue for replay after resync
        setUnsentMessageQueue(prev => [...prev, userMsg]);
        fetchCanonicalHistory();
      } else if (error instanceof TimeoutError || error instanceof NetworkDisconnectError) {
        // Move to retryable
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, delivery_state: "RETRYABLE" as const } : m));
        setUnsentMessageQueue(prev => [...prev, userMsg]);
        setRuntimeState(SessionRuntimeState.IDLE);
      } else if (error.message === "Stale Response: Generation shifted") {
        // Silently discard, the UI has already moved on via resync/reconnect
      } else if (error.message === "Aborted") {
        // Cancelled by user action
      } else {
        // Generic failure
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, delivery_state: "FAILED" as const } : m));
        setRuntimeState(SessionRuntimeState.IDLE);
      }
    }
  }, [sessionId, resetIdleTimer, handleMutexConflict, fetchCanonicalHistory]);

  const endSession = useCallback(() => {
    setShowSummaryOverlay(true);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    runtimeState,
    inputValue,
    setInputValue,
    emotionalState,
    sessionHistory,
    sendMessage,
    endSession,
    showSummaryOverlay,
    setShowSummaryOverlay,
    showPauseNotification,
    setShowPauseNotification,
    showGuestSave,
    setShowGuestSave,
    resetIdleTimer,
    userName: state?.userName || "Friend",
    isReturningUser: !!state?.isReturningUser
  };
};
