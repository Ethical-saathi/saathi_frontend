import { useState } from "react";
import { Lock, Shield, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { KEY_TERMS } from "@/data/agreement";
import { AgreementDrawer } from "./AgreementDrawer";
import Logo from "@/components/landing/Logo";

interface ConsentCardProps {
  onNext: () => void;
}

export const ConsentCard = ({ onNext }: ConsentCardProps) => {
  const [agreed, setAgreed] = useState(false);
  const [showKeyTerms, setShowKeyTerms] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!agreed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="saathi-card p-8 md:p-10 flex flex-col items-center">
        {/* Logo + Wordmark */}
        <div className="flex items-center gap-2.5 mb-8">
          <Logo size={48} />
          <span
            className="text-[22px] font-medium"
            style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-serif)" }}
          >
            AI Saathi
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-[20px] font-medium text-center leading-snug mb-8"
          style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
        >
          Before we begin — a few things you should know
        </h2>

        {/* 3 Icon Rows */}
        <div className="flex flex-col gap-5 w-full mb-6">
          <div className="flex items-start gap-4">
            <div className="pt-0.5 shrink-0">
              <Lock className="w-5 h-5" style={{ color: "var(--saathi-coral)" }} strokeWidth={1.8} />
            </div>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
              What you share here stays private. We never sell your data.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="pt-0.5 shrink-0">
              <Shield className="w-5 h-5" style={{ color: "var(--saathi-coral)" }} strokeWidth={1.8} />
            </div>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
              Saathi is a supportive space. For emergencies, please contact a medical professional.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="pt-0.5 shrink-0">
              <Trash2 className="w-5 h-5" style={{ color: "var(--saathi-coral)" }} strokeWidth={1.8} />
            </div>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
              You can stop or delete your data at any time from Settings.
            </p>
          </div>
        </div>

        {/* Expandable Key Terms */}
        <button
          onClick={() => setShowKeyTerms(!showKeyTerms)}
          className="flex items-center gap-2 text-[13px] font-medium mb-4 transition-colors hover:opacity-80"
          style={{ color: "var(--saathi-text-mid)" }}
        >
          Key terms
          {showKeyTerms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showKeyTerms && (
          <div
            className="w-full rounded-xl p-4 mb-4 flex flex-col gap-2.5"
            style={{ background: "var(--saathi-coral-muted)" }}
          >
            {KEY_TERMS.map((term, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[14px] shrink-0">{term.emoji}</span>
                <span className="text-[12px] leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
                  {term.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Full Agreement Link */}
        <button
          onClick={() => setShowDrawer(true)}
          className="text-[13px] font-medium mb-8 transition-colors hover:opacity-80"
          style={{ color: "var(--saathi-coral)" }}
        >
          Read the full agreement →
        </button>

        {/* Layer 1 Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group mb-8 w-full select-none">
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="appearance-none w-[18px] h-[18px] rounded-[5px] border-2 transition-colors cursor-pointer"
              style={{
                borderColor: agreed ? "var(--saathi-coral)" : "var(--saathi-border-med)",
                backgroundColor: agreed ? "var(--saathi-coral)" : "transparent",
              }}
            />
            {agreed && (
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            )}
          </div>
          <span className="text-[13px] leading-relaxed" style={{ color: "var(--saathi-text-dark)" }}>
            I agree to the collection and processing of my personal data for core service delivery, quality monitoring, and legal compliance.
          </span>
        </label>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!agreed || isSubmitting}
          className="saathi-btn-coral w-full"
        >
          {isSubmitting ? "Saving…" : "Let's Begin"}
        </button>

        {/* Quiet Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-[13px] transition-colors hover:opacity-80"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          Not ready yet? That's okay →
        </button>
      </div>

      {/* Agreement Drawer */}
      <AgreementDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};
