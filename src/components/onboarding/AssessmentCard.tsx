import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AssessmentCardProps {
  question: string;
  onNext: (answer: string) => void;
  onSkip: () => void;
}

export const AssessmentCard = ({
  question,
  onNext,
  onSkip,
}: AssessmentCardProps) => {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    // Auto-resize logic
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleContinue = () => {
    if (answer.trim().length > 0) {
      onNext(answer.trim());
    } else {
      onSkip(); // If empty, treat as skip as per open-ended flow
    }
  };

  return (
    <div className="flex flex-col w-full text-left max-w-[650px] mx-auto pt-6 px-4 pb-20">
      <h2 
        className="text-[26px] sm:text-[34px] font-semibold text-slate-800 mb-10 leading-[1.3] text-center"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {question}
      </h2>

      <div className="w-full relative mb-12">
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={handleInput}
          placeholder="Take your time. Write as much or as little as feels right..."
          className="w-full text-[18px] sm:text-[22px] leading-relaxed text-slate-700 bg-transparent border-0 border-b-2 border-slate-300 focus:border-[#F4845F] focus:ring-0 resize-none min-h-[60px] p-0 transition-colors placeholder:text-slate-400 placeholder:font-normal font-medium overflow-hidden outline-none"
          rows={1}
        />
      </div>

      <div className="flex flex-col items-center w-full mt-auto">
        <button
          onClick={handleContinue}
          className={cn(
            "clay-button w-full sm:w-[60%] bg-gradient-to-r from-rose-400 to-orange-400 text-white font-semibold flex items-center justify-center py-4 rounded-full text-[17px] transition-all duration-300",
            answer.trim().length > 0 ? "hover:-translate-y-1 hover:shadow-lg opacity-100" : "opacity-90 grayscale-[20%]"
          )}
        >
          Continue
        </button>
        
        <button
          onClick={onSkip}
          className="mt-6 text-[14px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
        >
          You can skip this if you're not ready
        </button>
      </div>
    </div>
  );
};
