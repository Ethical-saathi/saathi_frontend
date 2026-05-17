import { useState } from "react";
import { Shield } from "lucide-react";

interface SafetyContactCardProps {
  onComplete: (contact: { name: string; relationship: string; phone: string } | null) => void;
}

export const SafetyContactCard = ({ onComplete }: SafetyContactCardProps) => {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const hasContact = name.trim() || relationship.trim() || phone.trim();
      await onComplete(
        hasContact
          ? { name: name.trim(), relationship: relationship.trim(), phone: phone.trim() }
          : null
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-[480px] mx-auto">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
        style={{ background: "var(--saathi-coral-muted)" }}
      >
        <Shield size={22} style={{ color: "var(--saathi-coral)" }} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <h2
        className="text-[20px] font-medium leading-snug mb-3"
        style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
      >
        One last thing — just in case
      </h2>

      {/* Subtext */}
      <p
        className="text-[14px] leading-relaxed mb-8 max-w-[400px]"
        style={{ color: "var(--saathi-text-mid)" }}
      >
        If we're ever genuinely concerned for your safety, who should we reach?
      </p>

      {/* Fields */}
      <div className="flex flex-col gap-4 w-full mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact name"
          className="saathi-input"
        />
        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="Relationship (e.g. parent, friend)"
          className="saathi-input"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="saathi-input"
        />
      </div>

      {/* Skip note */}
      <p
        className="text-[12px] mb-8"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        All fields are optional — you can add this later in Settings.
      </p>

      {/* Final CTA */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="saathi-btn-coral w-full"
      >
        {isSubmitting ? "Saving…" : "Begin my journey with Saathi →"}
      </button>
    </div>
  );
};
