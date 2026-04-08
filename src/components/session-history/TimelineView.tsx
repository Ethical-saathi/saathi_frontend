import { SessionData } from "@/hooks/useSessionHistory";
import { MoodArcOverall } from "@/components/ui/MoodArcOverall";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { getMoodColor, MoodDot } from "@/components/ui/MoodDot";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Trash2, X } from "lucide-react";
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
  if (diffMinutes <= 0) return 1;
  return diffMinutes;
};

export const TimelineView = ({
  sessions,
  totalCount,
  firstSessionMonth,
  onSelectSession,
  onDeleteSession,
  className
}: TimelineViewProps) => {
  const navigate = useNavigate();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.monthGroup]) acc[session.monthGroup] = [];
    acc[session.monthGroup].push(session);
    return acc;
  }, {} as Record<string, SessionData[]>);

  const sortedMonths = Array.from(new Set(sessions.map(s => s.monthGroup)));

  if (sessions.length === 0 || sessions.length === 1) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center h-full min-h-[400px] ${className}`}
      >
        <p className="text-[20px] text-slate-500 mb-8 italic" style={{ fontFamily: "var(--font-serif)" }}>
          Your journey is just beginning.
        </p>
        <button
          onClick={() => navigate("/chat")}
          className="blob-btn breathing-slow text-white text-[16px] font-medium px-8 py-4 "
        >
          Begin a Conversation →
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto relative z-10 ${className}`}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-[36px] font-normal text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Your journey with <span className="italic text-teal-800" style={{ fontFamily: "var(--font-serif)" }}>Saathi.</span>
        </h1>
        <p className="text-[16px] text-slate-500 leading-[1.6] mt-2">
          You've had {totalCount} conversations since {firstSessionMonth}
        </p>
      </motion.div>

      {/* Overall Mood Arc */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
        <MoodArcOverall sessions={sessions} />
      </motion.div>

      {/* Session Cards with Month Separators */}
      <div className="flex flex-col">
        {sortedMonths.map((month, monthIndex) => (
          <motion.div 
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (monthIndex * 0.1), duration: 0.8 }}
          >
            {/* Month Separator */}
            <h2 
              className={`text-[12px] font-medium text-slate-500 tracking-widest uppercase mb-6 
              ${monthIndex === 0 ? "" : "mt-12"}`}
            >
              {month}
            </h2>
            
            {/* Session Cards */}
            <div className="flex flex-col gap-6">
              {groupedSessions[month].map((session, i) => (
                <div 
                  key={session.id}
                  className="clay-panel bg-white/40 backdrop-blur-md border border-white/60 p-6 relative group transition-all duration-300 hover:bg-white/60 hover:shadow-xl hover:shadow-[#5BA8A0]/5"
                >
                  <div 
                    className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-md opacity-70"
                    style={{ backgroundColor: getMoodColor(session.closingMood) }}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                    }}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-[#C0625A] hover:bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] text-slate-500 tracking-wide">{session.date}</span>
                    <MoodDot mood={session.closingMood} size={10} />
                  </div>
                  
                  <h3 className="text-[18px] font-medium text-slate-800 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {session.title}
                  </h3>
                  
                  {getSessionDuration(session.transcript) ? (
                    <p className="text-[13px] text-teal-700/80 mb-4 font-medium italic " style={{ fontFamily: "var(--font-serif)" }}>
                      {getSessionDuration(session.transcript)} min session
                    </p>
                  ) : (
                    <div className="mb-3" />
                  )}
                  
                  <p className="text-[15px] leading-[1.7] text-slate-600 mb-6 whitespace-pre-wrap max-w-[90%]">
                    {session.summary}
                  </p>
                  
                  <div className="mb-6 bg-white/30 rounded-2xl p-4 border border-white/50 inline-block w-full max-w-[400px]">
                    <MoodDotArc 
                      openingMood={session.openingMood}
                      closingMood={session.closingMood}
                    />
                  </div>
                  
                  <button 
                    onClick={() => onSelectSession(session.id)}
                    className="text-[14px] text-teal-700 hover:text-teal-900 transition-colors duration-150 ease-in-out text-left focus:outline-none font-medium flex items-center gap-1 group py-2 w-fit inline-flex"
                  >
                    Read full session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Insight from Saathi Component */}
        {sessions.length >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 clay-panel bg-[#FFFAF7]/50 backdrop-blur-md border border-[#F4845F]/20 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F4845F]/10 flex items-center justify-center">
                 <Sparkles size={18} className="text-[#F4845F]" />
              </div>
              <h3 className="text-[13px] font-medium text-[#F4845F] uppercase tracking-widest">Saathi Noticed</h3>
            </div>
            <p className="text-[16px] text-slate-800 leading-[1.6] mb-4 italic" style={{ fontFamily: "var(--font-serif)" }}>
              "You tend to experience higher stress early in the month, followed by calmer reflective sessions. Taking preemptive breaks around the 5th could help balance this pattern."
            </p>
            <button className="text-[13px] text-slate-500 hover:text-[#F4845F] underline underline-offset-4 decoration-[#F4845F]/30 hover:decoration-[#F4845F] transition-all w-fit">
              Was this helpful?
            </button>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md transition-opacity">
          <div className="clay-panel bg-white/90 p-8 max-w-sm w-full relative">
            <button 
              onClick={() => setSessionToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-[20px] font-medium text-slate-800 mb-3" style={{ fontFamily: "var(--font-heading)" }}>Delete Session?</h3>
            <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to permanently delete this session from your history? <br/><br/>This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setSessionToDelete(null)}
                className="text-[14px] px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteSession(sessionToDelete);
                  setSessionToDelete(null);
                }}
                className="bg-[#C0625A] text-white text-[14px] px-6 py-2.5 font-medium rounded-xl hover:bg-[#A9554E] hover:shadow-lg transition-all"
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
