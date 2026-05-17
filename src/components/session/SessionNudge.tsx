import { motion, AnimatePresence } from "framer-motion";
import { Info, Wind } from "lucide-react";
import { useState } from "react";

interface SessionNudgeProps {
  type: "info" | "wind-down";
  minutes: number;
  onDismiss: () => void;
}

export const SessionNudge = ({ type, minutes, onDismiss }: SessionNudgeProps) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(onDismiss, 300);
  };

  const config = {
    info: {
      icon: Info,
      bg: "var(--saathi-bg-cream)",
      border: "var(--saathi-border)",
      color: "var(--saathi-text-mid)",
      message: `You've been in session for ${minutes} minutes. Saathi can help you wrap up when you're ready.`,
    },
    "wind-down": {
      icon: Wind,
      bg: "var(--saathi-coral-muted)",
      border: "var(--saathi-coral-light)",
      color: "var(--saathi-coral)",
      message: `This has been a deep session (${minutes} min). Let's create a summary to carry forward.`,
    },
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-4 mb-3 rounded-2xl px-5 py-3.5 flex items-start gap-3 cursor-pointer"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
          }}
          onClick={handleDismiss}
        >
          <Icon
            size={16}
            className="shrink-0 mt-0.5"
            style={{ color: c.color }}
          />
          <p
            className="text-[13px] leading-[1.6] flex-1"
            style={{ color: c.color, fontFamily: "var(--font-app)" }}
          >
            {c.message}
          </p>
          <span
            className="text-[11px] shrink-0 mt-0.5"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            dismiss
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
