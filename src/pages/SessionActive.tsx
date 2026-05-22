import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { SessionChatArea } from "@/components/session/SessionChatArea";
import { PauseNotification } from "@/components/chat/PauseNotification";

const SessionActive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const { sessionGoal, sessionStartTime, activeSessionId, endSession } = useSession();
  const chatState = useChat(activeSessionId);

  // Track whether we already triggered crisis routing to prevent double-fire
  const crisisTriggeredRef = useRef(false);

  // ── FIX #2: CRISIS SHORTCUT ──
  // Watch emotionalState from useChat. If backend/perception hits "high_distress"
  // (Gate 7 — Crisis), force-route to /escalation, bypassing /session/summary.
  // Safety ALWAYS overrides the summary phase.
  useEffect(() => {
    if (chatState.emotionalState === "high_distress" && !crisisTriggeredRef.current) {
      crisisTriggeredRef.current = true;

      // Clean up session context (don't leave stale active session)
      endSession();

      // Force-route to escalation with session context for continuity
      const sessionId = activeSessionId || state?.sessionId || crypto.randomUUID();
      navigate("/escalation", {
        replace: true,
        state: {
          entryPoint: "crisis_gate",
          sessionId,
          userName: state?.userName || "Friend",
          mood: state?.mood || null,
          fromActiveSession: true,
        },
      });
    }
  }, [chatState.emotionalState, endSession, activeSessionId, navigate, state]);

  const handleEndSession = useCallback(() => {
    endSession();
    const id = activeSessionId || state?.sessionId || "summary";
    navigate(`/session/summary/${id}`, {
      state: {
        sessionId: id,
        goal: sessionGoal || state?.intention || "",
        startTime: sessionStartTime,
        mood: state?.mood || "Okay",
        userName: state?.userName || "Friend",
      },
    });
  }, [navigate, endSession, activeSessionId, sessionGoal, sessionStartTime, state]);

  return (
    <>
      <SessionChatArea
        messages={chatState.messages}
        isTyping={chatState.runtimeState === "WAITING_FOR_RESPONSE" || chatState.runtimeState === "SENDING"}
        runtimeState={chatState.runtimeState}
        inputValue={chatState.inputValue}
        setInputValue={chatState.setInputValue}
        sendMessage={chatState.sendMessage}
        emotionalState={chatState.emotionalState}
        sessionGoal={sessionGoal || state?.intention || ""}
        sessionStartTime={sessionStartTime || Date.now()}
        onEndSession={handleEndSession}
      />

      {/* Idle pause notification */}
      {chatState.showPauseNotification && (
        <PauseNotification onSave={() => console.log("Pause acknowledged")} />
      )}
    </>
  );
};

export default SessionActive;
