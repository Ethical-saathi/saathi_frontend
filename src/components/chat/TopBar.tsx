import { useState } from "react";
import { MoreHorizontal, LogOut, Download, AlertCircle } from "lucide-react";

interface TopBarProps {
  mood: string;
  confidence: number;
  onEndSession: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  calm: "var(--saathi-calm)",
  neutral: "var(--saathi-moderate)",
  mild_stress: "var(--saathi-moderate)",
  high_distress: "var(--saathi-crisis)",
};

export const TopBar = ({ mood, confidence, onEndSession }: TopBarProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const moodColor = MOOD_COLORS[mood] || "var(--saathi-calm)";

  return (
    <div
      className="h-[56px] w-full flex items-center justify-between px-6 shrink-0 relative z-20"
      style={{ borderBottom: "1px solid var(--saathi-border)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Saathi dot */}
        <div
          className="w-2 h-2 rounded-full saathi-dot-breathe"
          style={{ backgroundColor: "var(--saathi-coral)" }}
        />

        <div className="flex flex-col justify-center">
          <span
            className="text-[15px] font-medium leading-none"
            style={{ color: "var(--saathi-text-dark)" }}
          >
            Saathi
          </span>
          <span
            className="text-[11px] mt-1"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            Here with you
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* VAD Indicator */}
        <div className="relative group">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: moodColor,
              boxShadow: `0 0 6px ${moodColor}`,
            }}
          />
          <div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[11px] font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-300 whitespace-nowrap z-50 pointer-events-none"
            style={{
              background: "var(--saathi-text-dark)",
              color: "#fff",
            }}
          >
            Emotional state: {mood.replace("_", " ")}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            <MoreHorizontal size={20} />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-[180px] rounded-xl py-1.5 z-20"
                style={{
                  background: "var(--saathi-bg-card)",
                  border: "1px solid var(--saathi-border)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                }}
              >
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-gray-50"
                  style={{ color: "var(--saathi-text-mid)" }}>
                  <Download size={14} className="opacity-70" />
                  Export Conversation
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-gray-50"
                  style={{ color: "var(--saathi-text-mid)" }}>
                  <AlertCircle size={14} className="opacity-70" />
                  Report an issue
                </button>
                <button
                  onClick={() => { setShowOptions(false); onEndSession(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-red-50"
                  style={{ color: "var(--saathi-crisis)" }}
                >
                  <LogOut size={14} className="opacity-70" />
                  End Session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
