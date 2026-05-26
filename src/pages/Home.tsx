import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useHome, MoodType } from "@/hooks/useHome";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { SessionBudgetWidget } from "@/components/session/SessionBudgetWidget";

const MOOD_OPTIONS: { id: MoodType; emoji: string; label: string }[] = [
  { id: "Struggling", emoji: "😞", label: "Struggling" },
  { id: "Anxious", emoji: "😟", label: "Anxious" },
  { id: "Okay", emoji: "😐", label: "Okay" },
  { id: "Alright", emoji: "🙂", label: "Alright" },
  { id: "Good", emoji: "😊", label: "Good" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const sessionId = "current";
  const { homeData, isLoading, submitMoodCheckin } = useHome(sessionId);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [dismissedInsight, setDismissedInsight] = useState(false);

  useEffect(() => {
    import("@/lib/posthog").then(({ captureEvent }) => {
      captureEvent('page_viewed', { page: 'home' });
    });
  }, []);

  const displayName = useMemo(() => {
    return (
      userProfile?.first_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      ""
    );
  }, [user, userProfile]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    submitMoodCheckin(mood);
  };

  // Skeleton loading
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="saathi-skeleton h-10 w-96 mb-4" />
          <div className="saathi-skeleton h-5 w-72 mb-12" />
          <div className="saathi-skeleton h-40 w-full mb-8 rounded-3xl" />
          <div className="saathi-skeleton h-32 w-full mb-8 rounded-3xl" />
          <div className="saathi-skeleton h-28 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const isFirstTime = !homeData?.lastSession;

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <h1
              className="text-[28px] md:text-[32px] font-medium"
              style={{ color: "var(--saathi-text-dark)" }}
            >
              {greeting}{displayName ? `, ` : ""}<span style={{ color: "var(--saathi-coral)" }}>{displayName}</span>
            </h1>
            <div
              className="w-2.5 h-2.5 rounded-full saathi-dot-breathe shrink-0 mt-1"
              style={{ backgroundColor: "var(--saathi-calm)" }}
            />
          </div>

          {homeData?.contextLine && (
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--saathi-text-soft)" }}>
              {homeData.contextLine}
            </p>
          )}

          {isFirstTime && (
            <p className="text-[16px] mt-2" style={{ color: "var(--saathi-text-mid)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
              Your journey starts here.
            </p>
          )}
        </motion.div>

        {/* Mood Check-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="saathi-card p-6 mb-6"
        >
          <p className="text-[13px] font-medium mb-4" style={{ color: "var(--saathi-text-mid)" }}>
            How are you feeling right now?
          </p>
          <div className="flex flex-wrap justify-center sm:justify-between gap-x-2 gap-y-4">
            {MOOD_OPTIONS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className="flex flex-col items-center gap-1.5 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] transition-all duration-200"
                    style={{
                      border: isSelected
                        ? "2px solid var(--saathi-coral)"
                        : "1.5px solid var(--saathi-border)",
                      background: isSelected ? "var(--saathi-coral-muted)" : "transparent",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {m.emoji}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: isSelected ? "var(--saathi-text-dark)" : "var(--saathi-text-soft)",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Session Metrics Widget */}
        <SessionBudgetWidget sessionCount={homeData?.sessionCount || 0} />

        {/* Last Session Card */}
        {homeData?.lastSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="saathi-card p-6 mb-6"
          >
            <p className="text-[12px] font-medium uppercase tracking-wider mb-3" style={{ color: "var(--saathi-text-soft)" }}>
              Last Session — {homeData.lastSession.date}
            </p>
            <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--saathi-text-mid)" }}>
              {homeData.lastSession.summary}
            </p>
            <div
              className="rounded-xl p-4 inline-block"
              style={{ background: "rgba(245,237,216,0.4)", border: "1px solid var(--saathi-border)" }}
            >
              <MoodDotArc
                openingMood={homeData.lastSession.openingMood}
                closingMood={homeData.lastSession.closingMood}
              />
            </div>
          </motion.div>
        )}

        {/* Saathi Noticed Card */}
        {homeData?.insight && !dismissedInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="saathi-card p-6"
            style={{ background: "var(--saathi-coral-muted)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(232,100,58,0.15)" }}
              >
                <Sparkles size={16} style={{ color: "var(--saathi-coral)" }} />
              </div>
              <p className="text-[12px] font-medium uppercase tracking-widest" style={{ color: "var(--saathi-coral)" }}>
                Saathi Noticed
              </p>
            </div>
            <p
              className="text-[15px] leading-[1.7] mb-4"
              style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              "{homeData.insight}"
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDismissedInsight(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
                style={{ border: "1px solid var(--saathi-border)" }}
                title="Helpful"
              >
                <Heart size={14} style={{ color: "var(--saathi-coral)" }} />
              </button>
              <button
                onClick={() => setDismissedInsight(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
                style={{ border: "1px solid var(--saathi-border)" }}
                title="Dismiss"
              >
                <X size={14} style={{ color: "var(--saathi-text-soft)" }} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
