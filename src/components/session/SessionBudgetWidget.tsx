import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";
import { useSession } from "@/hooks/useSession";

export const SessionBudgetWidget = () => {
  const navigate = useNavigate();
  const {
    sessionsRemaining,
    sessionsPerWeek,
    sessionsUsedThisWeek,
    daysUntilReset,
    sessionNumber,
    totalSessions,
    weeksElapsed,
    totalWeeks,
  } = useSession();

  const progressPercent = (sessionsUsedThisWeek / sessionsPerWeek) * 100;
  const isLocked = sessionsRemaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="saathi-card p-6 mb-6"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[13px] font-medium"
          style={{ color: "var(--saathi-text-mid)" }}
        >
          Your Sessions This Week
        </p>
        <span
          className="text-[11px] tracking-wide"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          Session {sessionNumber} of {totalSessions} · Week {weeksElapsed} of{" "}
          {totalWeeks}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 rounded-full mb-4 overflow-hidden"
        style={{ background: "var(--saathi-bg-cream)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "var(--saathi-coral)" }}
        />
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-2 mb-5">
        <span
          className="text-[28px] font-medium"
          style={{ color: "var(--saathi-text-dark)" }}
        >
          {sessionsRemaining}
        </span>
        <span
          className="text-[14px]"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          of {sessionsPerWeek} sessions remaining
        </span>
      </div>

      {/* CTA or Lockout */}
      {!isLocked ? (
        <button
          onClick={() => navigate("/session/prep")}
          className="saathi-btn-coral w-full"
        >
          Start Session →
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--saathi-bg-cream)" }}
          >
            <Lock
              size={20}
              style={{ color: "var(--saathi-text-soft)" }}
            />
          </div>
          <p
            className="text-[14px] font-medium text-center"
            style={{ color: "var(--saathi-text-mid)" }}
          >
            Next session available in {daysUntilReset} day
            {daysUntilReset !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => navigate("/escalation")}
            className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--saathi-crisis)" }}
          >
            <AlertTriangle size={14} />
            In crisis? Get help now
          </button>
        </div>
      )}

      {/* Reset info */}
      <p
        className="text-[11px] text-center mt-4"
        style={{ color: "var(--saathi-text-soft)" }}
      >
        Sessions reset every Monday
      </p>
    </motion.div>
  );
};
