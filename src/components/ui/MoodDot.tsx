import { cn } from "@/lib/utils";

export const getMoodColor = (mood?: string) => {
  switch (mood) {
    case "calm": return "#7DC98A";
    case "mild_stress": return "#E8B84B";
    case "high_distress": return "#D97070";
    case "neutral": default: return "#BBBBBB";
  }
};

interface MoodDotProps {
  mood?: string;
  size?: number; // default 10
  className?: string;
}

export const MoodDot = ({ mood, size = 10, className }: MoodDotProps) => {
  return (
    <div
      className={cn("rounded-full", className)}
      style={{
        backgroundColor: getMoodColor(mood),
        width: size,
        height: size,
      }}
    />
  );
};
