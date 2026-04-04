import { ChatArea } from "@/components/chat/ChatArea";
import { useChat } from "@/hooks/useChat";
import { PauseNotification } from "@/components/chat/PauseNotification";
import { SummaryOverlay } from "@/components/chat/SummaryOverlay";

export const Chat = () => {
  const chatState = useChat();

  return (
    <>
      <ChatArea chatState={chatState} />

      {/* Overlays */}
      {chatState.showPauseNotification && (
        <PauseNotification onSave={() => console.log('Navigate to signup')} />
      )}
      {chatState.showSummaryOverlay && (
        <SummaryOverlay isReturningUser={chatState.isReturningUser} />
      )}
    </>
  );
};

export default Chat;
