import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [typingDuration, setTypingDuration] = useState(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll on new messages or typing change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Track how long typing has been active for slow API fallback
  useEffect(() => {
    if (isTyping) {
      setTypingDuration(0);
      typingTimerRef.current = setInterval(() => {
        setTypingDuration((d) => d + 1);
      }, 1000);
    } else {
      setTypingDuration(0);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isTyping]);

  return (
    <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 py-4 no-scrollbar">
      <div className="flex flex-col">
        {messages.map((msg, index) => {
          const isFirstInGroup = index === 0 || messages[index - 1].sender !== msg.sender;
          const isLastInGroup =
            index === messages.length - 1 || messages[index + 1].sender !== msg.sender;

          return (
            <div key={msg.id} className={isLastInGroup ? "mb-4" : ""}>
              <MessageBubble message={msg} showAvatar={isFirstInGroup} />
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex w-full mb-4 justify-start">
            <div className="w-6 shrink-0 mr-2.5 mt-3 flex justify-center">
              <div
                className="w-2 h-2 rounded-full saathi-dot-breathe"
                style={{ backgroundColor: "var(--saathi-coral)" }}
              />
            </div>

            <div className="flex flex-col">
              <div
                role="status"
                aria-label="Saathi is responding"
                className="rounded-[18px] rounded-tl-[4px] px-5 py-3.5 flex items-center gap-[6px] h-[44px]"
                style={{
                  background: "var(--saathi-bg-card)",
                  border: "1px solid var(--saathi-border)",
                }}
              >
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{
                      backgroundColor: "var(--saathi-coral)",
                      animation: "saathi-pulse 1.2s ease-in-out infinite",
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>

              {/* Slow API fallback */}
              {typingDuration >= 8 && (
                <p
                  className="text-[12px] mt-1.5 pl-2"
                  style={{ color: "var(--saathi-text-soft)", fontFamily: "var(--font-app)" }}
                >
                  Taking a moment to think…
                </p>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
