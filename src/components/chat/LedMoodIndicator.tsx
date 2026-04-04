import { useMemo } from "react";

/**
 * Premium LED Mood Indicator — a realistic, hardware-style LED
 * that glows with the user's current emotional mood color.
 *
 * Visual: radial gradient core + dark bezel + inner gloss + outer glow + breathing pulse.
 */

/* ── Mood → Color Map (MindEase Self-Care Palette) ── */
const MOOD_COLORS: Record<string, { hex: string; label: string }> = {
  calm:          { hex: "#8C9EA6", label: "Rest" },
  hopeful:       { hex: "#A8BEC8", label: "Hope" },
  sad:           { hex: "#8EAFC0", label: "A Break" },
  anxious:       { hex: "#C08080", label: "Reassurance" },
  angry:         { hex: "#D09088", label: "Laughter" },
  healing:       { hex: "#C09850", label: "Healing" },
  lonely:        { hex: "#6B8A78", label: "Company" },
  tired:         { hex: "#B5B89A", label: "Advice" },
  loved:         { hex: "#D8B0A8", label: "Forgiveness" },
  grateful:      { hex: "#CCC89A", label: "Care" },
  "seeking help": { hex: "#F0C0C8", label: "Help" },
  patient:       { hex: "#D4A98A", label: "Patience" },
  unknown:       { hex: "#6B6B6B", label: "Offline" },
};

const OFFLINE_COLOR = "#6B6B6B";

/* ── Inline styles for pseudo-elements (React can't do ::after inline) ── */
const LED_STYLES = `
  .led-indicator {
    position: relative;
  }
  .led-indicator::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2.5px;
    width: 4px;
    height: 3px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(255,255,255,0.75) 0%,
      rgba(255,255,255,0.15) 60%,
      transparent 100%
    );
    pointer-events: none;
  }
  @keyframes led-breathe {
    0%,100% {
      box-shadow:
        0 0 3px 1px var(--mood-glow),
        inset 0 0 2px rgba(255,255,255,0.15);
    }
    50% {
      box-shadow:
        0 0 7px 3px var(--mood-glow),
        0 0 12px 4px var(--mood-glow),
        inset 0 0 2px rgba(255,255,255,0.15);
    }
  }
`;

interface LedMoodIndicatorProps {
  mood: string;
  confidence: number;
}

export const LedMoodIndicator = ({ mood, confidence }: LedMoodIndicatorProps) => {
  const { color, isOffline, shouldPulse } = useMemo(() => {
    const entry = MOOD_COLORS[mood];
    const hex = entry?.hex ?? OFFLINE_COLOR;
    const off = mood === "unknown" || !entry;
    const pulse = !off && confidence >= 0.70;
    return { color: hex, isOffline: off, shouldPulse: pulse };
  }, [mood, confidence]);

  /* Lighten the core center of the LED for the radial gradient */
  const coreBright = lightenHex(color, 50);

  return (
    <>
      <style>{LED_STYLES}</style>
      <div
        className="led-indicator shrink-0"
        title={MOOD_COLORS[mood]?.label ?? "Offline"}
        style={{
          /* CSS custom properties for dynamic updates */
          "--mood-color": color,
          "--mood-glow": `${color}80`, /* ~50% opacity */

          width: 13,
          height: 13,
          borderRadius: "50%",

          /* Dark bezel */
          border: "1.5px solid #1a1a1a",

          /* Radial gradient core */
          background: isOffline
            ? color
            : `radial-gradient(circle at 40% 38%, ${coreBright} 0%, ${color} 60%, ${darkenHex(color, 30)} 100%)`,

          /* Outer glow + inset highlight */
          boxShadow: isOffline
            ? "none"
            : `0 0 5px 2px var(--mood-glow), inset 0 0 2px rgba(255,255,255,0.15)`,

          /* Smooth transitions between mood changes */
          transition: "all 0.8s ease",

          /* Breathing pulse when confident */
          animation: shouldPulse ? "led-breathe 2.4s ease-in-out infinite" : "none",
        } as React.CSSProperties}
      />
    </>
  );
};

/* ── Color manipulation helpers ── */

/** Lighten a hex color by `amount` (0–255 per channel). */
function lightenHex(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Darken a hex color by `amount` (0–255 per channel). */
function darkenHex(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default LedMoodIndicator;
