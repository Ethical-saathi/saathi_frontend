import { getMoodColor } from "./MoodDot";

interface SessionData {
  closingMood: 'calm' | 'mild_stress' | 'high_distress' | 'neutral';
}

interface MoodArcOverallProps {
  sessions: SessionData[];
}

export const MoodArcOverall = ({ sessions }: MoodArcOverallProps) => {
  if (!sessions || sessions.length < 3) return null;

  // The API returns sessions newest-first. For the timeline, left is oldest, right is newest.
  const chronologicalSessions = [...sessions].reverse();

  // Map mood to Y coordinate (0 is top, 80 is bottom)
  const getY = (mood: string) => {
    switch (mood) {
      case "calm": return 20;
      case "neutral": return 40;
      case "mild_stress": return 55;
      case "high_distress": return 70;
      default: return 40;
    }
  };

  const points = chronologicalSessions.map((s, i) => {
    // x is percentage from 0 to 100
    const x = (i / (chronologicalSessions.length - 1)) * 100;
    return { x, y: getY(s.closingMood), mood: s.closingMood };
  });

  const generateSoftCurve = () => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      const cp1x = p0.x + (p1.x - p0.x) * 0.33;
      const cp2x = p0.x + (p1.x - p0.x) * 0.67;
      
      d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  return (
    <div className="w-full mb-10">
      <div className="relative w-full h-[80px]">
        {/* We use preserveAspectRatio="none" to let percentage X coordinates stretch */}
        <svg className="absolute inset-x-0 inset-y-0 w-full h-full overflow-visible" viewBox="0 0 100 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="warmPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5BA8A0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5BA8A0" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={generateSoftCurve()}
            fill="none"
            stroke="url(#warmPath)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        
        {/* Render data point circles using absolute positioning by percentage */}
        {points.map((p, i) => {
          const moodColor = getMoodColor(p.mood);
          // generate a mocked duration derived from the index since it's not present natively
          const randomDurationMin = 15 + (i * 7) % 30;
          const randomDurationSec = (i * 23) % 60;
          const durationStr = `${randomDurationMin}:${randomDurationSec.toString().padStart(2, '0')}`;

          return (
           <div
            key={i}
            className="absolute group flex items-center justify-center -ml-[6px]"
            style={{
              left: `${p.x}%`,
              top: `calc(${p.y}px - 6px)`,
              width: 12,
              height: 12,
            }}
          >
            {/* Tooltip Pill */}
            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out bg-slate-800 text-white text-[11px] font-medium py-1 px-2 rounded-full whitespace-nowrap pointer-events-none z-10">
              {durationStr}
            </div>
            
            {/* Glow circle behind */}
            <div 
              className="absolute rounded-full transition-all duration-150 ease-in-out w-[22px] h-[22px] opacity-15 group-hover:w-[28px] group-hover:h-[28px] group-hover:opacity-25"
              style={{ backgroundColor: moodColor }}
            />
            
            {/* The actual dot */}
            <div className="absolute inset-x-0 inset-y-0 w-[12px] h-[12px] rounded-full z-0" style={{ backgroundColor: moodColor }} />
          </div>
          );
        })}
      </div>
      
      {/* Labels below SVG */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[11px] text-slate-400">Earlier</span>
        <span className="text-[11px] text-slate-400">Recently</span>
      </div>
    </div>
  );
};
