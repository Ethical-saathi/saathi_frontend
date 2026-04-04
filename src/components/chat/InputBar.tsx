import { KeyboardEvent, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";

interface InputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export const InputBar = ({ value, onChange, onSend }: InputBarProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "24px"; // reset
    const newHeight = Math.min(el.scrollHeight, 24 * 4); // Max ~4 lines
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
    <div className="sticky bottom-0 w-full min-h-[64px] bg-[#FAF8F5] pb-4 pt-2 px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] z-20 flex items-end">
      <div className="w-full bg-white rounded-2xl border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex items-end p-2 px-4 transition-colors focus-within:border-teal-200 focus-within:shadow-[0_4px_12px_rgba(91,168,160,0.05)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say anything..."
          rows={1}
          className="w-full bg-transparent resize-none outline-none text-[15px] text-slate-800 placeholder:text-slate-400 py-2 no-scrollbar leading-[24px]"
        />
        <div className="pl-3 pb-1 shrink-0">
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(52,211,153,0.3)] transition-all duration-150 ease-out disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.04] hover:bg-teal-600 active:scale-95"
          >
            <SendHorizontal size={16} strokeWidth={2.5} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
