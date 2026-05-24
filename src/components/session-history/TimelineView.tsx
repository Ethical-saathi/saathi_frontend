import { SessionData } from "@/hooks/useSessionHistory";
import { MoodArcOverall } from "@/components/ui/MoodArcOverall";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Trash2, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface TimelineViewProps {
  sessions: SessionData[];
  totalCount: number;
  firstSessionMonth: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  className?: string;
}

const getSessionDuration = (transcript: any[]) => {
  if (!transcript || transcript.length < 2) return null;
  const t1 = transcript[0].timestamp;
  const t2 = transcript[transcript.length - 1].timestamp;
  if (!t1 || !t2) return null;
  const d1 = new Date(t1).getTime();
  const d2 = new Date(t2).getTime();
  const diffMinutes = Math.round((d2 - d1) / 60000);
  return diffMinutes <= 0 ? 1 : diffMinutes;
};

export const TimelineView = ({
  sessions,
  totalCount,
  firstSessionMonth,
  onSelectSession,
  onDeleteSession,
  className,
}: TimelineViewProps) => {
  const navigate = useNavigate();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.monthGroup]) acc[session.monthGroup] = [];
    acc[session.monthGroup].push(session);
    return acc;
  }, {} as Record<string, SessionData[]>);

  const sortedMonths = Array.from(new Set(sessions.map((s) => s.monthGroup)));

  // Empty state
  if (sessions.length <= 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}
      >
        <p
          className="text-[18px] mb-6"
          style={{ color: "var(--saathi-text-soft)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          No sessions yet. Start your first conversation.
        </p>
        <button onClick={() => navigate("/chat")} className="saathi-btn-coral">
          Begin a Conversation →
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`w-full relative z-10 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-[28px] font-medium mb-2" style={{ color: "var(--saathi-text-dark)" }}>
          Your journey with{" "}
          <span style={{ color: "var(--saathi-coral)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            Saathi.
          </span>
        </h1>
        <p className="text-[14px]" style={{ color: "var(--saathi-text-soft)" }}>
          You've had {totalCount} conversations since {firstSessionMonth}
        </p>
      </motion.div>

      {/* Removed MoodArcOverall per UX redesign */}

      {/* Session Cards */}
      <div className="flex flex-col">
        {sortedMonths.map((month, monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + monthIndex * 0.1, duration: 0.6 }}
          >
            {/* Month Separator */}
            <h2
              className={`text-[12px] font-medium tracking-widest uppercase mb-5 ${monthIndex === 0 ? "" : "mt-10"}`}
              style={{ color: "var(--saathi-text-soft)" }}
            >
              {month}
            </h2>

            <div className="flex flex-col gap-5 relative">
              {/* Subtle vertical timeline rail */}
              <div 
                className="absolute left-[24px] top-4 bottom-4 w-[2px] rounded-full" 
                style={{ background: "var(--saathi-border)", zIndex: -1 }} 
              />
              {groupedSessions[month].map((session) => (
                <div
                  key={session.id}
                  className="saathi-card p-6 relative group transition-all duration-200 hover:shadow-lg pl-16 cursor-pointer"
                  onClick={() => onSelectSession(session.id)}
                >
                  {/* Timeline dot */}
                  <div 
                    className="absolute left-4 top-8 w-4 h-4 rounded-full border-[3px] border-white"
                    style={{ background: "var(--saathi-coral)", boxShadow: "0 0 0 1px var(--saathi-border)" }}
                  />

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSessionToDelete(session.id); }}
                    className="absolute top-5 right-5 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                    style={{ color: "var(--saathi-text-soft)" }}
                    title="Delete session"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Header: Session Number & Tone Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[17px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
                      Session {session.sessionNumber}
                    </h3>
                    {session.sessionTone && (
                      <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ background: "rgba(232,100,58,0.1)", color: "var(--saathi-coral)" }}
                      >
                        {session.sessionTone}
                      </span>
                    )}
                  </div>
                  
                  {/* Date */}
                  <p className="text-[13px] mb-4" style={{ color: "var(--saathi-text-soft)" }}>
                    {session.date}
                  </p>

                  {/* Themes */}
                  {session.themes && session.themes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[12px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--saathi-text-soft)" }}>
                        Themes
                      </p>
                      <p className="text-[14px]" style={{ color: "var(--saathi-text-mid)" }}>
                        {session.themes.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Key Moment */}
                  {session.keyMoment && (
                    <div className="mb-5 p-3 rounded-xl" style={{ background: "var(--saathi-bg)", border: "1px solid var(--saathi-border)" }}>
                      <p className="text-[12px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--saathi-text-soft)" }}>
                        Key Moment
                      </p>
                      <p className="text-[14px] leading-relaxed" style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                        "{session.keyMoment}"
                      </p>
                    </div>
                  )}

                  <div
                    className="text-[13px] font-medium flex items-center gap-1 group/link transition-colors mt-2"
                    style={{ color: "var(--saathi-coral)" }}
                  >
                    Read full transcript{" "}
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Saathi Noticed */}
        {sessions.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 saathi-card p-6"
            style={{ background: "var(--saathi-coral-muted)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(232,100,58,0.15)" }}
              >
                <Sparkles size={16} style={{ color: "var(--saathi-coral)" }} />
              </div>
              <h3 className="text-[12px] font-medium uppercase tracking-widest" style={{ color: "var(--saathi-coral)" }}>
                Saathi Noticed
              </h3>
            </div>
            <p
              className="text-[15px] leading-[1.7] mb-4"
              style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              "You tend to experience higher stress early in the month, followed by calmer reflective sessions."
            </p>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
                style={{ border: "1px solid var(--saathi-border)" }}
              >
                <Heart size={14} style={{ color: "var(--saathi-coral)" }} />
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/60"
                style={{ border: "1px solid var(--saathi-border)" }}
              >
                <X size={14} style={{ color: "var(--saathi-text-soft)" }} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="saathi-card p-8 max-w-sm w-full relative">
            <button
              onClick={() => setSessionToDelete(null)}
              className="absolute top-4 right-4 transition-colors"
              style={{ color: "var(--saathi-text-soft)" }}
            >
              <X size={18} />
            </button>
            <h3 className="text-[18px] font-medium mb-3" style={{ color: "var(--saathi-text-dark)" }}>
              Delete Session?
            </h3>
            <p className="text-[14px] mb-6 leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
              Are you sure you want to permanently delete this session from your history?
              <br /><br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSessionToDelete(null)}
                className="text-[13px] px-4 py-2 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: "var(--saathi-text-mid)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => { onDeleteSession(sessionToDelete); setSessionToDelete(null); }}
                className="text-[13px] px-5 py-2 rounded-xl font-medium text-white"
                style={{ background: "var(--saathi-crisis)" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
