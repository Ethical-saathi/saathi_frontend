import { CloudRain, Wind, Meh, Smile, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OpeningCardProps {
  onNext: (name: string, mood: string | null) => void;
  onSkip: () => void;
}

const MOODS = [
  { id: "struggling", label: "Struggling", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { id: "anxious", label: "Anxious", icon: Wind, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
  { id: "okay", label: "Okay, I think", icon: Meh, color: "text-slate-500", bg: "bg-slate-50 border-slate-200 hover:bg-slate-100" },
  { id: "alright", label: "Alright", icon: Smile, color: "text-rose-500", bg: "bg-rose-50 border-rose-200 hover:bg-rose-100" },
  { id: "good", label: "Pretty good", icon: Sun, color: "text-amber-500", bg: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
];

export const OpeningCard = ({ onNext }: OpeningCardProps) => {
  const [name, setName] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleNext = () => {
    if (name.trim().length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (name.trim().length > 0 && mood) {
      onNext(name.trim(), mood);
    } else if (name.trim().length > 0) {
       // if they didn't select a mood, make the mood section shake
       setShake(true);
       setTimeout(() => setShake(false), 400);
    }
  };

  const isNextActive = name.trim().length > 0 && mood !== null;

  return (
    <div className="flex flex-col w-full items-center text-center max-w-[600px] mx-auto p-4">
      {/* Top soft text */}
      <h3 className="text-[14px] font-medium text-slate-400 mb-6 tracking-wide uppercase">
        This is just between us.
      </h3>

      {/* Main Question */}
      <h2 
        className="text-[28px] sm:text-[36px] font-semibold text-slate-800 mb-8 leading-snug tracking-[-1px] shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What should we call you?
      </h2>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Just your first name is fine"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn(
          "w-full sm:w-[75%] bg-transparent border-b-2 border-slate-300 focus:border-[#F4845F] text-slate-800 text-center text-[22px] sm:text-[26px] py-3 mb-10 placeholder:text-slate-300 outline-none transition-colors",
          shake && name.trim().length === 0 && "animate-shake-horizontal border-red-300"
        )}
      />

      {/* Emotion Selection (Fades in gently) */}
      <div
        className={cn(
          "w-full flex flex-col items-center transition-all duration-700 ease-in-out shrink-0",
          name.length > 0 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <p className="text-[18px] sm:text-[20px] text-slate-600 mb-8 font-medium">
          And how are you feeling right now, <span className="text-[#F4845F] capitalize">{name.trim()}</span>?
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 w-full">
          {MOODS.map((m) => {
            const Icon = m.icon;
            const isSelected = mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={cn(
                  "flex flex-col items-center gap-3 transition-all duration-300 ease-out group",
                  shake && name.trim().length > 0 && !mood ? "animate-shake-horizontal" : ""
                )}
              >
                <div 
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                    m.bg,
                    isSelected ? "ring-4 ring-[#F4845F]/30 scale-110 shadow-md border-transparent" : "grayscale-[50%] hover:scale-105"
                  )}
                >
                  <Icon className={cn("w-8 h-8 sm:w-10 sm:h-10 transition-colors", m.color, isSelected ? "" : "opacity-70")} strokeWidth={1.5} />
                </div>
                <span className={cn(
                  "text-[14px] sm:text-[15px] font-medium transition-colors",
                  isSelected ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"
                )}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn(
        "flex w-full sm:w-[60%] shrink-0 transition-all duration-700 delay-100",
        name.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <button
          onClick={handleNext}
          className={cn(
            "clay-button w-full py-4 rounded-full text-[18px] font-semibold transition-all duration-500",
            isNextActive
              ? "bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
