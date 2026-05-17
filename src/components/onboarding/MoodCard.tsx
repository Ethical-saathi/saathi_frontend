import { useState } from "react";
import { CloudRain, Wind, Meh, Smile, Sun } from "lucide-react";
import type { OnboardingMood } from "@/hooks/useOnboarding";

interface MoodCardProps {
  userName: string;
  onNext: (mood: OnboardingMood) => void;
}

const MOODS: { id: OnboardingMood; label: string; icon: React.ElementType }[] = [
  { id: "struggling", label: "Struggling", icon: CloudRain },
  { id: "anxious", label: "Anxious", icon: Wind },
  { id: "okay", label: "Okay, I think", icon: Meh },
  { id: "alright", label: "Alright", icon: Smile },
  { id: "good", label: "Pretty good", icon: Sun },
];

export const MoodCard = ({ userName, onNext }: MoodCardProps) => {
  const [selected, setSelected] = useState<OnboardingMood | null>(null);

  return (
    <div className="flex flex-col items-center text-center w-full max-w-[520px] mx-auto">
      {/* Question */}
      <h2
        className="text-[20px] font-medium leading-snug mb-10"
        style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
      >
        And how are you feeling right now,{" "}
        <span style={{ color: "var(--saathi-coral)" }}>{userName}</span>?
      </h2>

      {/* 5 Emoji Buttons */}
      <div className="flex flex-wrap justify-center gap-5 mb-10">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className="flex flex-col items-center gap-2 transition-all duration-200"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  border: isSelected
                    ? "2px solid var(--saathi-coral)"
                    : "1.5px solid var(--saathi-border)",
                  background: isSelected ? "var(--saathi-coral-muted)" : "var(--saathi-bg-card)",
                  transform: isSelected ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  style={{
                    color: isSelected ? "var(--saathi-coral)" : "var(--saathi-text-soft)",
                  }}
                />
              </div>
              <span
                className="text-[12px] font-medium"
                style={{
                  color: isSelected ? "var(--saathi-text-dark)" : "var(--saathi-text-soft)",
                }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="saathi-btn-coral w-full"
        style={{ maxWidth: 320 }}
      >
        Continue
      </button>
    </div>
  );
};
