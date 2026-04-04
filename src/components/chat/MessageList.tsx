import { useEffect, useRef } from "react";
import { ChatMessage } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SaathiAvatar } from "./SaathiAvatar";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom smoothly when messages or typing status changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 py-4 no-scrollbar">
      <div className="flex flex-col">
        {messages.map((msg, index) => {
          // Determine if we should show the avatar (first message in a consecutive group from Saathi)
          const isFirstInGroup = index === 0 || messages[index - 1].sender !== msg.sender;
          const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender !== msg.sender;
          
          return (
            <div key={msg.id} className={isLastInGroup ? "mb-4" : ""}>
               <MessageBubble message={msg} showAvatar={isFirstInGroup} />
            </div>
          );
        })}

        {isTyping && (
          <div className="flex w-full mb-4 justify-start">
            <div className="w-8 shrink-0 mr-3 mt-1 flex justify-center">
              <SaathiAvatar size={24} />
            </div>
            
            <div 
              role="status"
              aria-label="Saathi is responding"
              className="bg-[#EAF0EC] rounded-[18px] rounded-tl-[4px] px-5 py-3.5 flex items-center gap-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-[44px]"
            >
              <div className="w-[4px] h-[4px] rounded-full bg-[#5BA8A0] opacity-20" style={{ animation: "saathi-pulse 1.2s ease-in-out infinite", animationDelay: "0s" }} />
              <div className="w-[4px] h-[4px] rounded-full bg-[#5BA8A0] opacity-20" style={{ animation: "saathi-pulse 1.2s ease-in-out infinite", animationDelay: "0.2s" }} />
              <div className="w-[4px] h-[4px] rounded-full bg-[#5BA8A0] opacity-20" style={{ animation: "saathi-pulse 1.2s ease-in-out infinite", animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
