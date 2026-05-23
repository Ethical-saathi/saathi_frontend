import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Award, Activity } from "lucide-react";

export const SessionBudgetWidget = ({ sessionCount = 0 }: { sessionCount?: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="saathi-card p-6 mb-6"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Leaf size={18} style={{ color: "var(--saathi-coral)" }} />
          <p
            className="text-[14px] font-medium"
            style={{ color: "var(--saathi-text-dark)" }}
          >
            Therapeutic Progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Completed Sessions */}
        <div className="flex flex-col gap-1 p-4 rounded-xl" style={{ background: "var(--saathi-bg-cream)" }}>
          <div className="flex items-center gap-1.5 mb-1 text-[12px] uppercase tracking-wide" style={{ color: "var(--saathi-text-soft)" }}>
            <Award size={14} />
            <span>Completed</span>
          </div>
          <span className="text-[28px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
            {sessionCount}
          </span>
          <span className="text-[12px]" style={{ color: "var(--saathi-text-soft)" }}>
            Reflection sessions
          </span>
        </div>

        {/* Status / Streak */}
        <div className="flex flex-col gap-1 p-4 rounded-xl" style={{ background: "var(--saathi-bg-cream)" }}>
          <div className="flex items-center gap-1.5 mb-1 text-[12px] uppercase tracking-wide" style={{ color: "var(--saathi-text-soft)" }}>
            <Activity size={14} />
            <span>Pace</span>
          </div>
          <span className="text-[20px] font-medium mt-1" style={{ color: "var(--saathi-text-dark)" }}>
            Active
          </span>
          <span className="text-[12px] mt-1" style={{ color: "var(--saathi-text-soft)" }}>
            Keep up the momentum
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/session/prep")}
        className="saathi-btn-coral w-full font-medium"
      >
        Start Reflection Session
      </button>
    </motion.div>
  );
};
