import { useState, useRef, useEffect } from "react";

interface QuestionCardProps {
  question: string;
  onNext: (answer: string) => void;
  onSkip: () => void;
}

export const QuestionCard = ({ question, onNext, onSkip }: QuestionCardProps) => {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "120px";
    const newHeight = Math.max(120, el.scrollHeight);
    el.style.height = `${newHeight}px`;
  }, [answer]);

  return (
    <div className="flex flex-col items-center text-center w-full max-w-[520px] mx-auto">
      {/* Question */}
      <h2
        className="text-[18px] font-medium leading-snug mb-8 max-w-[440px]"
        style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
      >
        {question}
      </h2>

      {/* Visible Textarea */}
      <textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Take your time. Write as much or as little as feels right..."
        className="saathi-textarea mb-8 w-full"
      />

      {/* Continue */}
      <button
        onClick={() => onNext(answer.trim() || "")}
        disabled={!answer.trim()}
        className="saathi-btn-coral w-full mb-4"
      >
        Continue
      </button>

      {/* Skip Link */}
      <button
        onClick={onSkip}
        className="text-[13px] transition-colors hover:opacity-80"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        You can skip this if you're not ready
      </button>
    </div>
  );
};
