import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, BookOpen, Home, ArrowRight } from "lucide-react";
import { VADMiniChart } from "@/components/session/VADMiniChart";
import { apiClient } from "@/lib/apiClient";

const SessionSummary = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const state = location.state as any;

  const [summaryData, setSummaryData] = useState<any>(state?.summaryPayload || null);
  const [loading, setLoading] = useState(!state?.summaryPayload);

  // Fetch canonical backend data if not present or to reconcile
  useEffect(() => {
    if (!sessionId) return;
    apiClient.fetchSession(sessionId)
      .then(data => {
        setSummaryData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load canonical session:", err);
        setLoading(false);
      });
  }, [sessionId]);

  const arc = Array.isArray(summaryData?.emotional_arc) ? summaryData.emotional_arc : [];
  const hasArcData = arc.length > 0;
  
  const vadData = hasArcData ? arc.map(a => ({
    turn: a.turn_index,
    valence: a.valence,
    arousal: a.arousal,
    dominance: a.dominance
  })) : [];

  const legacyInsights = summaryData?.key_insights || [];
  const activeThemes = summaryData?.active_themes || [];
  const copingPatterns = summaryData?.coping_patterns || [];
  const openLoops = summaryData?.open_loops || [];
  const reflectiveSummary = summaryData?.reflective_summary || summaryData?.summary_text || "";
  
  const homework = summaryData?.homework || "No specific homework for today. Just rest.";
  const duration = summaryData?.duration_minutes || 30;
  const sessionNum = summaryData?.session_number || 1;

  const avgValence = hasArcData 
    ? arc.reduce((acc, curr) => acc + curr.valence, 0) / arc.length 
    : (summaryData?.vad_valence_avg ?? 0);
  const avgArousal = hasArcData 
    ? arc.reduce((acc, curr) => acc + curr.arousal, 0) / arc.length 
    : (summaryData?.vad_arousal_avg ?? 0);
  const avgDominance = hasArcData 
    ? arc.reduce((acc, curr) => acc + curr.dominance, 0) / arc.length 
    : (summaryData?.vad_dominance_avg ?? 0);

  const moodLabel = (val: number) => {
    if (val === 0) return "Insufficient data";
    if (val >= 0.65) return "Elevated tone";
    if (val >= 0.45) return "Neutral flow";
    if (val >= 0.3) return "Reflective";
    return "Lower emotional tone detected";
  };

  const energyLabel = (val: number) => {
    if (val === 0) return "Insufficient data";
    if (val >= 0.6) return "Higher energy";
    if (val >= 0.4) return "Steady pacing";
    return "Subdued energy";
  };

  const controlLabel = (val: number) => {
    if (val === 0) return "Insufficient data";
    if (val >= 0.6) return "Grounded";
    if (val >= 0.4) return "Processing";
    return "Overwhelmed / Seeking anchor";
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto w-full pb-20 flex items-center justify-center">
        <p className="text-gray-500">Loading your canonical session summary...</p>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="flex-1 overflow-y-auto w-full pb-20 flex items-center justify-center">
        <p className="text-red-500">Failed to load session data.</p>
      </div>
    );
  }

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
            Conversation Emotional Flow
          </p>

          {/* Chart */}
          {vadData.length > 0 ? (
            <div className="mb-5">
              <VADMiniChart data={vadData} height={140} showTooltip showAxes />
            </div>
          ) : (
            <div className="mb-5 py-8 text-center text-sm italic" style={{ color: "var(--saathi-text-soft)" }}>
              Not enough turn data to graph the emotional flow.
            </div>
          )}

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
                  className={`font-medium ${metric.value === "Insufficient data" ? "text-[12px] leading-tight mt-1" : "text-[18px]"}`}
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

        {/* Reflective Continuity */}
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
              Reflective Continuity Summary
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            {reflectiveSummary && (
              <p className="text-[14px] leading-[1.7]" style={{ color: "var(--saathi-text-mid)" }}>
                {reflectiveSummary}
              </p>
            )}

            {activeThemes.length > 0 && (
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider mb-2 mt-2" style={{ color: "var(--saathi-text-soft)" }}>
                  Recurring Themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeThemes.map((theme: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[12px]" style={{ background: "rgba(224, 116, 92, 0.1)", color: "var(--saathi-coral)" }}>
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {copingPatterns.length > 0 && (
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider mb-2 mt-2" style={{ color: "var(--saathi-text-soft)" }}>
                  Historical Coping
                </p>
                <div className="flex flex-wrap gap-2">
                  {copingPatterns.map((pattern: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[12px]" style={{ background: "rgba(100, 163, 142, 0.1)", color: "var(--saathi-calm)" }}>
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {openLoops.length > 0 && (
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider mb-2 mt-2" style={{ color: "var(--saathi-text-soft)" }}>
                  Open Loops
                </p>
                <ul className="list-disc pl-5 text-[13px]" style={{ color: "var(--saathi-text-mid)" }}>
                  {openLoops.map((loop: string, i: number) => (
                    <li key={i}>{loop}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legacy Fallback */}
            {legacyInsights.length > 0 && activeThemes.length === 0 && (
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-[12px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--saathi-text-soft)" }}>
                  Key Takeaways (Legacy)
                </p>
                {legacyInsights.map((insight: string, i: number) => (
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
            )}
            
            {!reflectiveSummary && legacyInsights.length === 0 && (
              <p className="text-gray-500 italic text-sm">No specific reflections generated.</p>
            )}
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
            {homework}
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
              navigate(`/history/session/${sessionId}`)
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
