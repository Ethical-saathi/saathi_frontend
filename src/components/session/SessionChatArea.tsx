import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { MessageList } from "@/components/chat/MessageList";
import { InputBar } from "@/components/chat/InputBar";
import { SessionNudge } from "@/components/session/SessionNudge";
import { Clock, LogOut, Target } from "lucide-react";
import { type ChatMessage, type EmotionalState, SessionRuntimeState } from "@/hooks/useChat";

interface SessionChatAreaProps {
  messages: ChatMessage[];
  isTyping: boolean;
  runtimeState?: SessionRuntimeState;
  inputValue: string;
  setInputValue: (val: string) => void;
  sendMessage: (text: string) => void;
  emotionalState: EmotionalState;
  sessionGoal: string;
  sessionStartTime: number;
  onEndSession: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  calm: "var(--saathi-calm)",
  neutral: "var(--saathi-moderate)",
  mild_stress: "var(--saathi-moderate)",
  high_distress: "var(--saathi-crisis)",
};

export const SessionChatArea = ({
  messages,
  isTyping,
  runtimeState = SessionRuntimeState.IDLE,
  inputValue,
  setInputValue,
  sendMessage,
  emotionalState,
  sessionGoal,
  sessionStartTime,
  onEndSession,
}: SessionChatAreaProps) => {
  const theme = useTheme();
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [dismissedNudges, setDismissedNudges] = useState<Set<number>>(new Set());

  // Timer: update every 30 seconds
  useEffect(() => {
    const update = () => {
      const mins = Math.floor((Date.now() - sessionStartTime) / 60000);
      setElapsedMinutes(mins);
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  }, [inputValue, sendMessage]);

  const formatTime = (mins: number) => {
    if (mins < 1) return "just started";
    if (mins === 1) return "1 minute";
    return `${mins} minutes`;
  };

  const moodColor = MOOD_COLORS[emotionalState] || "var(--saathi-calm)";

  // Determine which nudges to show
  const nudgeThresholds = [
    { min: 45, type: "info" as const },
    { min: 60, type: "info" as const },
    { min: 90, type: "wind-down" as const },
  ];

  const activeNudge = nudgeThresholds
    .filter((n) => elapsedMinutes >= n.min && !dismissedNudges.has(n.min))
    .pop();

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ background: theme || "var(--saathi-bg)" }}
    >
      {/* Session Header (sticky) */}
      <div
        className="h-[56px] w-full flex items-center justify-between px-6 shrink-0 relative z-20"
        style={{ borderBottom: "1px solid var(--saathi-border)" }}
      >
        {/* Left: Session info */}
        <div className="flex items-center gap-4">
          {/* Breathing dot */}
          <div
            className="w-2 h-2 rounded-full saathi-dot-breathe"
            style={{ backgroundColor: moodColor, boxShadow: `0 0 6px ${moodColor}` }}
          />

          {/* Timer */}
          <div className="flex items-center gap-1.5">
            <Clock size={13} style={{ color: "var(--saathi-text-soft)" }} />
            <span
              className="text-[13px] font-medium"
              style={{ color: "var(--saathi-text-dark)" }}
            >
              {formatTime(elapsedMinutes)}
            </span>
          </div>

          {/* Goal pill */}
          {sessionGoal && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] max-w-[240px] truncate"
              style={{
                background: "var(--saathi-coral-muted)",
                color: "var(--saathi-coral)",
              }}
            >
              <Target size={11} />
              <span className="truncate">{sessionGoal}</span>
            </div>
          )}
        </div>

        {/* Right: End Session */}
        <button
          onClick={onEndSession}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 hover:scale-[1.02]"
          style={{
            color: "var(--saathi-text-mid)",
            border: "1px solid var(--saathi-border)",
            background: "var(--saathi-bg-card)",
          }}
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">End Session</span>
        </button>
      </div>

      {/* Time Nudges */}
      {activeNudge && (
        <SessionNudge
          type={activeNudge.type}
          minutes={elapsedMinutes}
          onDismiss={() =>
            setDismissedNudges((prev) => new Set(prev).add(activeNudge.min))
          }
        />
      )}

      {/* CRISIS ESCALATION OVERLAY */}
      {runtimeState === SessionRuntimeState.CRISIS_ESCALATED && (
        <div className="w-full bg-[var(--saathi-crisis)] text-white px-6 py-4 flex flex-col gap-2 relative z-30 shadow-lg">
          <div className="flex items-center gap-2 font-semibold">
            <Target size={16} />
            <span>Support Intervention Active</span>
          </div>
          <p className="text-[13px] opacity-90">
            I'm pausing our normal conversation because your safety is the priority right now. 
            Please use the grounding resources below, or contact emergency support.
          </p>
          <div className="flex gap-3 mt-2">
            <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors">
              Call Helpline
            </button>
            <button className="px-4 py-1.5 bg-white text-[var(--saathi-crisis)] rounded-md text-sm font-medium transition-colors shadow-sm">
              Grounding Exercises
            </button>
          </div>
        </div>
      )}

      {/* Message area (reuse existing) */}
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Input (reuse existing) */}
      <InputBar 
        value={inputValue} 
        onChange={setInputValue} 
        onSend={handleSend}
        disabled={runtimeState === SessionRuntimeState.CRISIS_ESCALATED || runtimeState === SessionRuntimeState.LOCKED || runtimeState === SessionRuntimeState.SENDING}
      />
    </div>
  );
};
