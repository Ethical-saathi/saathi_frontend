import { ElementType, useEffect, useRef, useState } from "react";

interface QuestionCardProps {
  icon: ElementType;
  question: string;
  isLastCard?: boolean;
  onNext: (answer: string) => void;
  onSkip: () => void;
}

export const QuestionCard = ({
  icon: Icon,
  question,
  isLastCard = false,
  onNext,
  onSkip,
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Scroll into view on mobile keyboard open (rudimentary approach via focus)
  const handleFocus = () => {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  return (
    <div className="flex flex-col w-full items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white/60 flex items-center justify-center mx-auto mb-4 shrink-0">
        <Icon className="w-8 h-8 text-teal-600 drop-shadow-sm" strokeWidth={1.5} />
      </div>

      <h2 
        className="text-[20px] sm:text-[24px] font-semibold text-slate-800 mb-5 leading-snug tracking-[-0.5px] max-w-[90%] shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {question}
      </h2>

      <div className="w-full relative mb-6">
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={handleInput}
          onFocus={handleFocus}
          placeholder="Write whatever feels natural..."
          className="w-full min-h-[100px] clay-input resize-none overflow-hidden rounded-3xl py-4 text-[16px] text-slate-700 placeholder:text-slate-400"
          style={{ lineHeight: 1.6 }}
        />
      </div>

      {isLastCard && (
        <p className="text-[12px] text-slate-400 mb-6 font-medium">
          By continuing you agree to our{" "}
          <a href="#" target="_blank" className="underline hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" target="_blank" className="underline hover:text-slate-600 transition-colors">
            Terms of Use
          </a>
        </p>
      )}

      <div className="flex items-center justify-between w-full">
        <button
          onClick={onSkip}
          className="text-[14px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={() => onNext(answer)}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-300 clay-button bg-gradient-to-r from-teal-400 to-emerald-400 text-white"
        >
          Next <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
