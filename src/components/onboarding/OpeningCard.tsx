import { Hand } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OpeningCardProps {
  onNext: (name: string, mood: string | null) => void;
  onSkip: () => void;
}

const MOODS = ["Struggling", "Anxious", "Okay", "Alright", "Good"];

export const OpeningCard = ({ onNext, onSkip }: OpeningCardProps) => {
  const [name, setName] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleNext = () => {
    if (name.trim().length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    // Proceed if name is valid. If mood is missing, it passes null. (Prompt says activates if name > 0 AND mood selected)
    // Actually the prompt says: "Right: 'Next ->' button - activates only when name has at least 1 character AND a mood is selected"
    if (name.trim().length > 0 && mood) {
      onNext(name.trim(), mood);
    } else if (name.trim().length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  const isNextActive = name.trim().length > 0 && mood !== null;

  return (
    <div className="flex flex-col w-full items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white/60 flex items-center justify-center mx-auto mb-4 shrink-0">
        <Hand className="w-8 h-8 text-teal-600 drop-shadow-sm" strokeWidth={1.5} />
      </div>

      <h2 
        className="text-[24px] sm:text-[32px] font-semibold text-slate-800 mb-5 leading-snug tracking-[-1px] shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Before we begin &mdash; what should we <span className="italic text-teal-700 font-normal" style={{ fontFamily: "var(--font-serif)" }}>call you?</span>
      </h2>

      <input
        type="text"
        placeholder="Your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn(
          "w-full sm:w-[80%] clay-input text-slate-800 text-center text-[18px] py-4 mb-5 placeholder:text-slate-400 shrink-0",
          shake && "animate-shake-horizontal"
        )}
      />

      <div
        className={cn(
          "w-full flex flex-col items-center transition-opacity duration-300 ease-in-out shrink-0",
          name.length > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <p className="text-[17px] text-slate-600 mb-4 font-medium">
          And how are you feeling right now?
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mb-6 w-full sm:w-[90%]">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-300 ease-in-out clay-button",
                mood === m
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"
                  : "bg-white text-slate-600 hover:text-teal-600"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between w-full mt-4">
        <button
          onClick={onSkip}
          className="text-[14px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleNext}
          className={cn(
            "flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-300 clay-button",
            isNextActive
              ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-white"
              : "opacity-50 grayscale cursor-not-allowed"
          )}
        >
          Next <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
