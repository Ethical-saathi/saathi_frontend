import { useState } from "react";
import { X, Phone } from "lucide-react";

interface InlineCrisisOverlayProps {
  onDismiss: () => void;
}

const CRISIS_NUMBERS = [
  {
    name: "iCall",
    number: "9152987821",
    description: "Psychosocial helpline",
  },
  {
    name: "Vandrevala Foundation",
    number: "18602662345",
    description: "24/7 mental health support",
  },
  {
    name: "Emergency",
    number: "112",
    description: "National emergency number",
  },
];

export const InlineCrisisOverlay = ({ onDismiss }: InlineCrisisOverlayProps) => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="w-6 shrink-0 mr-2.5" />
      <div
        className="max-w-[85%] rounded-2xl p-5 relative"
        style={{
          background: "rgba(226, 75, 74, 0.06)",
          border: "1px solid rgba(226, 75, 74, 0.15)",
        }}
      >
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          <X size={14} />
        </button>

        <p
          className="text-[15px] font-medium mb-1 leading-snug"
          style={{ color: "var(--saathi-text-dark)" }}
        >
          I hear you.
        </p>
        <p
          className="text-[14px] mb-4 leading-relaxed"
          style={{ color: "var(--saathi-text-mid)" }}
        >
          You don't have to go through this alone. If you need to talk to someone right now:
        </p>

        <div className="flex flex-col gap-2.5">
          {CRISIS_NUMBERS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/60"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid var(--saathi-border)",
              }}
            >
              <Phone
                size={16}
                style={{ color: "var(--saathi-crisis)" }}
                strokeWidth={2}
              />
              <div>
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "var(--saathi-text-dark)" }}
                >
                  {c.name}
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "var(--saathi-text-soft)" }}
                >
                  {c.description} · {c.number}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
