import { SessionData } from "@/hooks/useSessionHistory";
import { MoodArcOverall } from "@/components/ui/MoodArcOverall";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { getMoodColor, MoodDot } from "@/components/ui/MoodDot";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";

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
      <div className={`flex flex-col items-center justify-center h-full min-h-[400px] ${className}`}>
        <p className="text-[18px] text-slate-400 mb-6">Your journey is just beginning.</p>
        <button
          onClick={() => navigate("/chat")}
          className="bg-[#5BA8A0] text-white text-[15px] font-medium px-6 py-3.5 rounded-xl transition-transform active:scale-[0.98] hover:bg-[#4E938C]"
        >
          Talk to Saathi
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-[40px]">
        <h1 className="text-[28px] font-normal text-slate-800 tracking-tight">Your journey with Saathi</h1>
        <p className="text-[15px] text-slate-500 leading-[1.6] mt-2">
          You've had {totalCount} conversations since {firstSessionMonth}
        </p>
      </div>

      {/* Overall Mood Arc */}
      <MoodArcOverall sessions={sessions} />

      {/* Session Cards with Month Separators */}
      <div className="flex flex-col">
        {sortedMonths.map((month, monthIndex) => (
          <div key={month}>
            {/* Month Separator */}
            <h2 
              className={`text-[12px] font-medium text-slate-500 tracking-[0.04em] mb-4 
              ${monthIndex === 0 ? "" : "mt-8"}`}
            >
              {month}
            </h2>
            
            {/* Session Cards */}
            <div className="flex flex-col gap-6">
              {groupedSessions[month].map((session) => (
                <div 
                  key={session.id}
                  className="clay-card border-l-[2px] p-5 relative group"
                  style={{ borderLeftColor: getMoodColor(session.closingMood) }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-[#C0625A] opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[13px] text-slate-500">{session.date}</span>
                    <MoodDot mood={session.closingMood} size={10} />
                  </div>
                  
                  <h3 className="text-[16px] font-medium text-slate-800 mb-0.5">
                    {session.title}
                  </h3>
                  
                  {getSessionDuration(session.transcript) ? (
                    <p className="text-[12px] text-slate-400 mb-3 font-medium">
                      {getSessionDuration(session.transcript)} min session
                    </p>
                  ) : (
                    <div className="mb-2" />
                  )}
                  
                  <p className="text-[14px] leading-[1.7] text-slate-500 mb-4 whitespace-pre-wrap">
                    {session.summary}
                  </p>
                  
                  <MoodDotArc 
                    openingMood={session.openingMood}
                    closingMood={session.closingMood}
                    className="mb-4"
                  />
                  
                  <button 
                    onClick={() => onSelectSession(session.id)}
                    className="text-[13px] text-slate-500 hover:text-slate-800 hover:underline transition-colors duration-150 ease-in-out text-left focus:outline-none font-medium flex items-center gap-1 group py-2 pr-2"
                  >
                    Read full session <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Insight from Saathi Component */}
        {sessions.length >= 3 && (
          <div className="mt-8 clay-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={24} className="text-[#B45309]" />
              <h3 className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">Insight from Saathi</h3>
            </div>
            <p className="text-[14px] text-slate-800 leading-[1.6] mb-3">
              "Saathi noticed you tend to experience higher stress early in the month, followed by calmer reflective sessions. Taking preemptive breaks around the 5th could help balance this pattern."
            </p>
            <button className="text-[12px] text-slate-500 hover:text-slate-700 underline underline-offset-2">
              Was this helpful?
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="clay-panel p-6 max-w-sm w-full relative">
            <button 
              onClick={() => setSessionToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-[18px] font-medium text-slate-800 mb-2 mt-1">Delete Session?</h3>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this session from your history? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setSessionToDelete(null)}
                className="text-[13px] px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteSession(sessionToDelete);
                  setSessionToDelete(null);
                }}
                className="bg-[#C0625A] text-white text-[13px] px-5 py-2 font-medium rounded-xl hover:bg-[#A9554E] transition-colors"
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
