import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Target } from "lucide-react";
import { useSession, type SessionMood } from "@/hooks/useSession";
import { useAuth } from "@/components/auth/AuthProvider";

const MOOD_OPTIONS: { id: SessionMood; emoji: string; label: string }[] = [
  { id: "Struggling", emoji: "😞", label: "Struggling" },
  { id: "Anxious", emoji: "😟", label: "Anxious" },
  { id: "Okay", emoji: "😐", label: "Okay" },
  { id: "Alright", emoji: "🙂", label: "Alright" },
  { id: "Good", emoji: "😊", label: "Good" },
];

const SessionPrep = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const {
    sessionNumber,
    totalSessions,
    weeksElapsed,
    totalWeeks,
    sessionsRemaining,
    lastSessionSummary,
    lastSessionDate,
    setSessionGoal,
    setSessionMood,
    startSession,
  } = useSession();

  const [selectedMood, setSelectedMood] = useState<SessionMood | null>(null);
  const [intention, setIntention] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const displayName = useMemo(() => {
    return (
      userProfile?.first_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "there"
    );
  }, [user, userProfile]);

  const handleStartSession = async () => {
    try {
      setIsStarting(true);
      if (selectedMood) setSessionMood(selectedMood);
      setSessionGoal(intention);
      
      const sessionId = await startSession(intention, selectedMood || "Okay");
      
      navigate("/session/active", {
        state: {
          sessionId,
          userName: displayName,
          mood: selectedMood || "Okay",
          intention,
          isReturningUser: !!lastSessionSummary,
          contextLine: lastSessionSummary,
        },
      });
    } catch (err) {
      console.error("Failed to start session:", err);
      setIsStarting(false);
      // Fallback UI or toast could go here
    }
  };

  // Redirect if no sessions remaining
  if (sessionsRemaining <= 0) {
    navigate("/home", { replace: true });
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Session Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-3"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium"
            style={{
              background: "var(--saathi-coral-muted)",
              color: "var(--saathi-coral)",
            }}
          >
            <Target size={13} />
            Session {sessionNumber} of {totalSessions}
          </div>
          <span
            className="text-[12px]"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            <Clock size={12} className="inline mr-1" style={{ marginTop: -2 }} />
            Week {weeksElapsed} of {totalWeeks}
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10"
        >
          <h1
            className="text-[28px] md:text-[32px] font-medium mb-2"
            style={{ color: "var(--saathi-text-dark)" }}
          >
            Welcome back,{" "}
            <span style={{ color: "var(--saathi-coral)" }}>{displayName}</span>
          </h1>
          <p
            className="text-[15px]"
            style={{
              color: "var(--saathi-text-mid)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            Take a moment to set your intention before we begin.
          </p>
        </motion.div>

        {/* Mood Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="saathi-card p-6 mb-6"
        >
          <p
            className="text-[13px] font-medium mb-4"
            style={{ color: "var(--saathi-text-mid)" }}
          >
            How are you feeling right now?
          </p>
          <div className="flex flex-wrap justify-center sm:justify-between gap-x-2 gap-y-4">
            {MOOD_OPTIONS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className="flex flex-col items-center gap-1.5 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] transition-all duration-200"
                    style={{
                      border: isSelected
                        ? "2px solid var(--saathi-coral)"
                        : "1.5px solid var(--saathi-border)",
                      background: isSelected
                        ? "var(--saathi-coral-muted)"
                        : "transparent",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {m.emoji}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: isSelected
                        ? "var(--saathi-text-dark)"
                        : "var(--saathi-text-soft)",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Intention Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="saathi-card p-6 mb-6"
        >
          <label
            className="text-[13px] font-medium block mb-3"
            style={{ color: "var(--saathi-text-mid)" }}
          >
            What do you want to work on today?
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="e.g., 'I want to talk about my anxiety at work' or 'I'm feeling overwhelmed and need to process something'"
            rows={4}
            className="saathi-textarea"
          />
        </motion.div>

        {/* Last Session Recap */}
        {lastSessionSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="saathi-card p-6 mb-8"
            style={{ background: "rgba(245,237,216,0.3)" }}
          >
            <p
              className="text-[12px] font-medium uppercase tracking-wider mb-3"
              style={{ color: "var(--saathi-text-soft)" }}
            >
              Last Session{lastSessionDate ? ` — ${lastSessionDate}` : ""}
            </p>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ color: "var(--saathi-text-mid)" }}
            >
              {lastSessionSummary}
            </p>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={handleStartSession}
            disabled={isStarting}
            className="saathi-btn-coral w-full disabled:opacity-50"
          >
            {isStarting ? "Preparing Session..." : "Start Session →"}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="saathi-btn-outline w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionPrep;
