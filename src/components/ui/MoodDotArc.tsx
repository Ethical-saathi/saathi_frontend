import { cn } from "@/lib/utils";
import { getMoodColor } from "./MoodDot";

interface MoodDotArcProps {
  openingMood: string;
  closingMood: string;
  className?: string;
}

export const MoodDotArc = ({ openingMood, closingMood, className }: MoodDotArcProps) => {
  return (
    <div className={cn("relative w-full h-[40px] mb-4", className)}>
      <svg className="absolute inset-x-0 inset-y-0 w-full h-full overflow-visible" viewBox="0 0 100 48" preserveAspectRatio="none">
        <path 
          d="M 4 24 Q 50 48 96 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-slate-200"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-1">
         {/* Left opening dot */}
        <div 
          className="w-6 h-6 rounded-full border-[3px] border-white shadow-sm shrink-0"
          style={{ backgroundColor: getMoodColor(openingMood) }}
        />
        {/* Right closing dot */}
        <div 
          className="w-6 h-6 rounded-full border-[3px] border-white shadow-sm shrink-0"
          style={{ backgroundColor: getMoodColor(closingMood) }}
        />
      </div>
    </div>
  );
};
