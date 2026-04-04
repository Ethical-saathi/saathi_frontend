import { ChatMessage } from "@/hooks/useChat";
import { SaathiAvatar } from "./SaathiAvatar";

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar: boolean;
}

export const MessageBubble = ({ message, showAvatar }: MessageBubbleProps) => {
  const isSaathi = message.sender === "saathi";

  return (
    <div className={`flex w-full mb-1 ${isSaathi ? "justify-start" : "justify-end"}`}>
      
      {/* Saathi Context Avatar Space */}
      {isSaathi && (
        <div className="w-8 shrink-0 mr-3 mt-1 flex justify-center">
          {showAvatar && (
            <SaathiAvatar size={24} />
          )}
        </div>
      )}

      {/* Bubble */}
      <div 
        className={`max-w-[72%] px-5 py-3.5 text-[15px] leading-[1.7] text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
          isSaathi 
            ? "bg-[#EAF0EC] rounded-[18px] rounded-tl-[4px]" 
            : "bg-[#D6E8E6] rounded-[18px] rounded-tr-[4px]"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};
