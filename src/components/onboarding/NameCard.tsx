import { useState, KeyboardEvent } from "react";

interface NameCardProps {
  onNext: (name: string) => void;
}

export const NameCard = ({ onNext }: NameCardProps) => {
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onNext(name.trim());
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-[480px] mx-auto">
      {/* Top label */}
      <p
        className="text-[12px] font-medium tracking-[0.15em] uppercase mb-8"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        This is just between us
      </p>

      {/* Question */}
      <h2
        className="text-[20px] font-medium leading-snug mb-10"
        style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-app)" }}
      >
        What should we call you?
      </h2>

      {/* Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your name or nickname"
        autoFocus
        className={`saathi-input text-center text-[18px] mb-10 ${
          shake ? "animate-shake-horizontal" : ""
        }`}
        style={{ maxWidth: 320 }}
      />

      {/* Continue */}
      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="saathi-btn-coral w-full"
        style={{ maxWidth: 320 }}
      >
        Continue
      </button>
    </div>
  );
};
