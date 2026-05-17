import { useState } from "react";

interface Layer2ConsentCardProps {
  onComplete: (agreed: boolean) => void;
}

export const Layer2ConsentCard = ({ onComplete }: Layer2ConsentCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChoice = async (agreed: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onComplete(agreed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="saathi-card p-8 md:p-10 flex flex-col items-center text-center">
      {/* Heading */}
      <h2
        className="text-[22px] font-medium leading-snug mb-3"
        style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
      >
        One small optional choice
      </h2>

      {/* Subheading */}
      <p
        className="text-[14px] mb-8"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        This has absolutely no effect on your experience
      </p>

      {/* Description */}
      <div
        className="w-full rounded-xl p-5 mb-8"
        style={{
          background: "var(--saathi-coral-muted)",
          border: "1px solid var(--saathi-border)",
        }}
      >
        <p
          className="text-[14px] leading-[1.8]"
          style={{ color: "var(--saathi-text-mid)", fontFamily: "var(--font-app)" }}
        >
          To help make Saathi better for everyone, we can use your anonymised
          conversation data to improve our AI models. Your personal identity is
          never attached to this data, and choosing not to participate won't
          change your experience in any way.
        </p>
      </div>

      {/* Two Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={() => handleChoice(true)}
          disabled={isSubmitting}
          className="saathi-btn-outline flex-1"
        >
          Yes, happy to help
        </button>
        <button
          onClick={() => handleChoice(false)}
          disabled={isSubmitting}
          className="saathi-btn-coral flex-1"
        >
          No thanks
        </button>
      </div>

      {/* Reassurance */}
      <p
        className="mt-6 text-[12px]"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        Both choices lead to the same experience. You can change this anytime in Settings.
      </p>
    </div>
  );
};
