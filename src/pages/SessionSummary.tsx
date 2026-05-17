import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, BookOpen, Lightbulb, Home } from "lucide-react";
import { VADMiniChart, type VADDataPoint } from "@/components/session/VADMiniChart";

// ── MOCK DATA ──
const generateMockVAD = (): VADDataPoint[] => [
  { turn: 1, valence: 0.32, arousal: 0.71, dominance: 0.28 },
  { turn: 2, valence: 0.29, arousal: 0.68, dominance: 0.31 },
  { turn: 3, valence: 0.35, arousal: 0.62, dominance: 0.35 },
  { turn: 4, valence: 0.41, arousal: 0.55, dominance: 0.42 },
  { turn: 5, valence: 0.48, arousal: 0.50, dominance: 0.48 },
  { turn: 6, valence: 0.52, arousal: 0.45, dominance: 0.55 },
  { turn: 7, valence: 0.58, arousal: 0.42, dominance: 0.60 },
  { turn: 8, valence: 0.63, arousal: 0.38, dominance: 0.62 },
  { turn: 9, valence: 0.67, arousal: 0.35, dominance: 0.68 },
  { turn: 10, valence: 0.72, arousal: 0.33, dominance: 0.71 },
];

const MOCK_INSIGHTS = [
  "Your anxiety appears to stem from uncertainty, not a lack of ability.",
  "You showed strong emotional regulation in the second half of the session.",
  "Connecting your feelings to specific triggers helped reduce arousal levels.",
];

const MOCK_HOMEWORK =
  "Before your next session, try writing down three things that went well each day — even small ones. Notice how it feels to name them.";

const SessionSummary = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const state = location.state as any;

  const vadData = useMemo(() => generateMockVAD(), []);

  // Compute averages
  const avgValence = useMemo(
    () => vadData.reduce((s, d) => s + d.valence, 0) / vadData.length,
    [vadData]
  );
  const avgArousal = useMemo(
    () => vadData.reduce((s, d) => s + d.arousal, 0) / vadData.length,
    [vadData]
  );
  const avgDominance = useMemo(
    () => vadData.reduce((s, d) => s + d.dominance, 0) / vadData.length,
    [vadData]
  );

  // Duration from state or fallback
  const duration = useMemo(() => {
    if (state?.startTime) {
      return Math.max(1, Math.floor((Date.now() - state.startTime) / 60000));
    }
    return 35; // fallback mock
  }, [state?.startTime]);

  const sessionNum = state?.sessionNumber || 5;

  const moodLabel = (val: number) => {
    if (val >= 0.65) return "Positive";
    if (val >= 0.45) return "Neutral";
    if (val >= 0.3) return "Low";
    return "Very Low";
  };

  const energyLabel = (val: number) => {
    if (val >= 0.6) return "High";
    if (val >= 0.4) return "Moderate";
    return "Low";
  };

  const controlLabel = (val: number) => {
    if (val >= 0.6) return "Strong";
    if (val >= 0.4) return "Moderate";
    return "Low";
  };

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Completion Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--saathi-coral-muted)" }}
          >
            <CheckCircle2
              size={32}
              strokeWidth={1.5}
              style={{ color: "var(--saathi-coral)" }}
            />
          </div>
          <h1
            className="text-[26px] font-medium mb-2"
            style={{ color: "var(--saathi-text-dark)" }}
          >
            Session {sessionNum} Complete
          </h1>
          <p
            className="text-[14px]"
            style={{
              color: "var(--saathi-text-soft)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            {duration} minutes · Well done for showing up.
          </p>
        </motion.div>

        {/* VAD Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="saathi-card p-6 mb-6"
        >
          <p
            className="text-[12px] font-medium uppercase tracking-wider mb-4"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            Your Emotional Journey Today
          </p>

          {/* Chart */}
          <div className="mb-5">
            <VADMiniChart data={vadData} height={140} showTooltip showAxes />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-5">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-[2px] rounded-full"
                style={{ background: "var(--saathi-coral)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--saathi-text-soft)" }}
              >
                Mood
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-[2px] rounded-full"
                style={{ background: "var(--saathi-moderate)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--saathi-text-soft)" }}
              >
                Energy
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-[2px] rounded-full"
                style={{ background: "var(--saathi-calm)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--saathi-text-soft)" }}
              >
                Control
              </span>
            </div>
          </div>

          {/* VAD Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Overall Mood",
                sub: "(Valence)",
                value: moodLabel(avgValence),
                num: avgValence,
                color: "var(--saathi-coral)",
              },
              {
                label: "Energy",
                sub: "(Arousal)",
                value: energyLabel(avgArousal),
                num: avgArousal,
                color: "var(--saathi-moderate)",
              },
              {
                label: "Control",
                sub: "(Dominance)",
                value: controlLabel(avgDominance),
                num: avgDominance,
                color: "var(--saathi-calm)",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "var(--saathi-bg)",
                  border: "1px solid var(--saathi-border)",
                }}
              >
                <p
                  className="text-[11px] font-medium mb-1"
                  style={{ color: "var(--saathi-text-soft)" }}
                >
                  {metric.label}
                </p>
                <p
                  className="text-[18px] font-medium"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--saathi-text-soft)" }}
                >
                  avg {metric.num.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="saathi-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} style={{ color: "var(--saathi-coral)" }} />
            <p
              className="text-[13px] font-medium"
              style={{ color: "var(--saathi-text-mid)" }}
            >
              Key Takeaways
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_INSIGHTS.map((insight, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3 text-[14px] leading-[1.7]"
                style={{
                  background: "var(--saathi-bg)",
                  border: "1px solid var(--saathi-border)",
                  color: "var(--saathi-text-mid)",
                }}
              >
                {insight}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Homework */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="saathi-card p-6 mb-8"
          style={{ background: "rgba(245,237,216,0.3)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} style={{ color: "var(--saathi-coral)" }} />
            <p
              className="text-[13px] font-medium"
              style={{ color: "var(--saathi-text-mid)" }}
            >
              For Next Time
            </p>
          </div>
          <p
            className="text-[14px] leading-[1.7]"
            style={{
              color: "var(--saathi-text-mid)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            {MOCK_HOMEWORK}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => navigate("/home")}
            className="saathi-btn-coral w-full flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Back to Dashboard
          </button>
          <button
            onClick={() =>
              navigate(`/history/${sessionId || "session_103"}`)
            }
            className="saathi-btn-outline w-full flex items-center justify-center gap-2"
          >
            <ArrowRight size={16} />
            View Full Transcript
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionSummary;
