import { TopBar } from "@/components/chat/TopBar";
import { InputBar } from "@/components/chat/InputBar";
import { MessageList } from "@/components/chat/MessageList";
import { useChat, type EmotionalState } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { GuestSaveOverlay } from "@/components/chat/GuestSaveOverlay";
import { useNavigate } from "react-router-dom";

/** Maps the legacy 4-state `EmotionalState` to the new 14-mood palette */
const MOOD_MAP: Record<EmotionalState, string> = {
  calm: "calm",
  mild_stress: "anxious",
  high_distress: "seeking help",
  neutral: "unknown",
};

/** Default confidence for each legacy state (>= 0.70 enables pulse) */
const CONFIDENCE_MAP: Record<EmotionalState, number> = {
  calm: 0.85,
  mild_stress: 0.80,
  high_distress: 0.90,
  neutral: 0.0,
};

interface ChatAreaProps {
  chatState: ReturnType<typeof useChat>;
}

export const ChatArea = ({ chatState }: ChatAreaProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Direct mapping — no hook involved
  const mood = MOOD_MAP[chatState.emotionalState] ?? "unknown";
  const confidence = CONFIDENCE_MAP[chatState.emotionalState] ?? 0;

  return (
    <div
      className="flex flex-col flex-1 h-full w-full relative transition-colors duration-500"
      style={{ 
        backgroundColor: theme,
        paddingTop: 'var(--sidebar-logo-offset, 24px)' 
      }}
    >
      <TopBar 
        mood={mood}
        confidence={confidence}
        onEndSession={chatState.endSession} 
      />
      
      <MessageList 
        messages={chatState.messages} 
        isTyping={chatState.isTyping} 
      />
      
      <GuestSaveOverlay 
        isVisible={chatState.showGuestSave}
        onDismiss={() => chatState.setShowGuestSave(false)}
        onSave={() => navigate("/auth", { state: { view: "signup" } })}
      />

      <InputBar 
        value={chatState.inputValue}
        onChange={chatState.setInputValue}
        onSend={() => chatState.sendMessage(chatState.inputValue)}
      />
    </div>
  );
};
