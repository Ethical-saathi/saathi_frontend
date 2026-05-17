import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Flag, TrendingUp } from "lucide-react";
import { VADTrendGraph, type VADTrendPoint } from "@/components/session/VADTrendGraph";

// ── MOCK DATA ──
const MOCK_TREND_DATA: VADTrendPoint[] = [
  { session: "S1", valence: 0.35, arousal: 0.65, dominance: 0.30 },
  { session: "S2", valence: 0.38, arousal: 0.60, dominance: 0.35 },
  { session: "S3", valence: 0.42, arousal: 0.58, dominance: 0.40 },
  { session: "S4", valence: 0.40, arousal: 0.62, dominance: 0.38 },
  { session: "S5", valence: 0.48, arousal: 0.52, dominance: 0.45 },
  { session: "S6", valence: 0.52, arousal: 0.48, dominance: 0.50 },
  { session: "S7", valence: 0.55, arousal: 0.45, dominance: 0.55 },
  { session: "S8", valence: 0.50, arousal: 0.50, dominance: 0.52 },
  { session: "S9", valence: 0.58, arousal: 0.42, dominance: 0.58 },
  { session: "S10", valence: 0.62, arousal: 0.40, dominance: 0.62 },
  { session: "S11", valence: 0.65, arousal: 0.38, dominance: 0.65 },
  { session: "S12", valence: 0.68, arousal: 0.35, dominance: 0.70 },
];

const MOCK_NOTICES = [
  "You mention \"work stress\" in 7 of 12 sessions",
  "Your energy spikes every Monday morning",
  "Sessions about family show 30% higher sense of control",
  "Your mood has improved 89% since Session 1",
];

const MOCK_MILESTONES = [
  { session: 3, text: "First breakthrough: Identified anxiety triggers" },
  { session: 7, text: "Mid-program check-in: Mood improvement noted" },
  { session: 12, text: "Final session: Reflection on 3-month growth" },
];

const HistoryTrends = () => {
  const navigate = useNavigate();

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    return `${fmt(start)} — ${fmt(end)}`;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 text-[14px] mb-8 transition-colors hover:opacity-80"
            style={{ color: "var(--saathi-text-mid)" }}
          >
            <ArrowLeft size={16} />
            Back to History
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: "var(--saathi-coral)" }} />
            <h1
              className="text-[28px] font-medium"
              style={{ color: "var(--saathi-text-dark)" }}
            >
              Your 3-Month Journey
            </h1>
          </div>
          <p
            className="text-[14px]"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            {dateRange}
          </p>
        </motion.div>

        {/* VAD Trend Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="saathi-card p-6 mb-6"
        >
          <p
            className="text-[12px] font-medium uppercase tracking-wider mb-5"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            Emotional Trends Over Time
          </p>
          <VADTrendGraph data={MOCK_TREND_DATA} height={280} />
        </motion.div>

        {/* Saathi Noticed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="saathi-card p-6 mb-6"
          style={{ background: "var(--saathi-coral-muted)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(232,100,58,0.15)" }}
            >
              <Sparkles size={16} style={{ color: "var(--saathi-coral)" }} />
            </div>
            <p
              className="text-[12px] font-medium uppercase tracking-widest"
              style={{ color: "var(--saathi-coral)" }}
            >
              Saathi Noticed
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_NOTICES.map((notice, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] leading-[1.6]"
                style={{ color: "var(--saathi-text-dark)" }}
              >
                <span
                  className="text-[12px] shrink-0 mt-0.5"
                  style={{ color: "var(--saathi-coral)" }}
                >
                  💡
                </span>
                {notice}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="saathi-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Flag size={16} style={{ color: "var(--saathi-coral)" }} />
            <p
              className="text-[13px] font-medium"
              style={{ color: "var(--saathi-text-mid)" }}
            >
              Key Moments
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[11px] top-2 bottom-2 w-[2px] rounded-full"
              style={{ background: "var(--saathi-border)" }}
            />

            <div className="flex flex-col gap-5">
              {MOCK_MILESTONES.map((milestone, i) => (
                <button
                  key={i}
                  onClick={() =>
                    navigate(`/history/session_${100 + milestone.session}`)
                  }
                  className="flex items-start gap-4 text-left group transition-colors"
                >
                  {/* Dot */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-200 group-hover:scale-110"
                    style={{
                      background: "var(--saathi-coral)",
                      boxShadow: "0 2px 8px rgba(232,100,58,0.3)",
                    }}
                  >
                    <span className="text-white text-[10px] font-medium">
                      {milestone.session}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-0.5">
                    <p
                      className="text-[12px] font-medium mb-0.5"
                      style={{ color: "var(--saathi-text-soft)" }}
                    >
                      Session {milestone.session}
                    </p>
                    <p
                      className="text-[14px] leading-[1.6] group-hover:underline"
                      style={{ color: "var(--saathi-text-mid)" }}
                    >
                      {milestone.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryTrends;
