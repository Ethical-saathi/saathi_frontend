import { ChatMessage } from "@/hooks/useChat";

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar: boolean;
}

export const MessageBubble = ({ message, showAvatar }: MessageBubbleProps) => {
  const isSaathi = message.sender === "saathi";

  return (
    <div className={`flex w-full mb-1 ${isSaathi ? "justify-start" : "justify-end"}`}>
      {/* Saathi dot prefix */}
      {isSaathi && (
        <div className="w-6 shrink-0 mr-2.5 mt-3 flex justify-center">
          {showAvatar && (
            <div
              className="w-2 h-2 rounded-full saathi-dot-breathe"
              style={{ backgroundColor: "var(--saathi-coral)" }}
            />
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[72%] px-5 py-3.5 text-[15px] leading-[1.7]"
        style={
          isSaathi
            ? {
                background: "var(--saathi-bg-card)",
                color: "var(--saathi-text-dark)",
                border: "1px solid var(--saathi-border)",
                borderRadius: "18px 18px 18px 4px",
              }
            : {
                background: "var(--saathi-coral)",
                color: "#FFFFFF",
                borderRadius: "18px 18px 4px 18px",
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
};
