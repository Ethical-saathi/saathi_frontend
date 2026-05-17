import { useTheme } from "@/hooks/useTheme";
import { TopBar } from "./TopBar";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { useChat, SessionRuntimeState } from "@/hooks/useChat";

export const ChatArea = ({ chatState }: { chatState: any }) => {
  const theme = useTheme();
  const {
    messages,
    runtimeState,
    inputValue,
    setInputValue,
    emotionalState,
    sendMessage,
    endSession,
  } = chatState;

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ background: theme || "var(--saathi-bg)" }}
    >
      <TopBar
        mood={emotionalState}
        confidence={0.8}
        onEndSession={endSession}
      />
      
      {/* CRISIS ESCALATION OVERLAY */}
      {runtimeState === SessionRuntimeState.CRISIS_ESCALATED && (
        <div className="w-full bg-[var(--saathi-crisis)] text-white px-6 py-4 flex flex-col gap-2 relative z-30 shadow-lg">
          <div className="flex items-center gap-2 font-semibold">
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

      <MessageList 
        messages={messages} 
        isTyping={runtimeState === SessionRuntimeState.WAITING_FOR_RESPONSE || runtimeState === SessionRuntimeState.SENDING} 
      />
      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={runtimeState === SessionRuntimeState.CRISIS_ESCALATED || runtimeState === SessionRuntimeState.LOCKED || runtimeState === SessionRuntimeState.SENDING}
      />
    </div>
  );
};
