import { KeyboardEvent, useEffect, useRef } from "react";
import { SendHorizontal, Mic } from "lucide-react";

interface InputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const InputBar = ({ value, onChange, onSend, disabled = false }: InputBarProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "24px";
    const newHeight = Math.min(el.scrollHeight, 24 * 4);
    el.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="sticky bottom-0 w-full min-h-[60px] pb-4 pt-2 px-6 flex items-end z-20"
      style={{
        background: "var(--saathi-bg)",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="w-full rounded-2xl flex items-end p-2 px-4 transition-colors"
        style={{
          background: "var(--saathi-bg-card)",
          border: "1px solid var(--saathi-border)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Processing..." : "Share what's on your mind…"}
          rows={1}
          className="w-full bg-transparent resize-none outline-none text-[15px] py-2 no-scrollbar leading-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: "var(--saathi-text-dark)",
            fontFamily: "var(--font-app)",
          }}
        />

        <div className="flex items-center gap-2 pl-2 pb-1 shrink-0">
          {/* Mic icon (future voice input) */}
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: "var(--saathi-text-soft)" }}
            title="Voice input (coming soon)"
          >
            <Mic size={16} strokeWidth={2} />
          </button>

          {/* Send */}
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-150 ease-out disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: "var(--saathi-coral)",
              boxShadow: value.trim()
                ? "0 2px 8px rgba(232, 100, 58, 0.3)"
                : "none",
            }}
          >
            <SendHorizontal size={16} strokeWidth={2.5} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
