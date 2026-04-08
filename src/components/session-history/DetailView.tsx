import { SessionData } from "@/hooks/useSessionHistory";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { motion } from "framer-motion";

interface DetailViewProps {
  session: SessionData;
  onBack: () => void;
  className?: string;
}

export const DetailView = ({ session, onBack, className }: DetailViewProps) => {
  return (
    <div className={`w-full max-w-3xl mx-auto pb-12 ${className}`}>
      {/* Back Link */}
      <button 
        onClick={onBack}
        className="text-[14px] text-teal-700 font-medium mb-[32px] hover:text-teal-900 transition-colors focus:outline-none flex items-center gap-2"
      >
        &larr; Back to journey
      </button>

      {/* Session Header */}
      <div className="mb-[48px]">
        <p className="text-[13px] text-slate-500 mb-2 uppercase tracking-widest">{session.date}</p>
        <h1 className="text-[32px] md:text-[40px] font-normal text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          {session.title}
        </h1>
      </div>

      {/* Full Transcript */}
      <div className="flex flex-col">
        {session.transcript.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
          >
            <p 
              className={`mb-[16px] ${
                msg.sender === "saathi" 
                  ? "text-[16px] font-normal text-slate-600 leading-[1.8]" 
                  : "text-[16px] font-medium text-slate-800 leading-[1.8]"
              }`}
            >
              {msg.text}
            </p>
            {msg.hasBreakAfter && (
              <div className="w-24 h-px bg-slate-200 my-[32px] mx-auto rounded-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Closing Session Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: session.transcript.length * 0.1 + 0.2, duration: 0.8 }}
        className="mt-[48px] clay-panel bg-white/40 backdrop-blur-md border border-white/60 p-8 mb-[48px]"
      >
        <h3 className="text-[20px] font-medium text-slate-800 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          {session.title}
        </h3>
        <p className="text-[15px] leading-[1.7] text-slate-600 mb-6 font-medium whitespace-pre-wrap max-w-[90%]">
          {session.summary}
        </p>
        <div className="bg-white/30 rounded-2xl p-4 border border-white/50 inline-block w-full max-w-[400px]">
          <MoodDotArc 
            openingMood={session.openingMood}
            closingMood={session.closingMood}
          />
        </div>
      </motion.div>
    </div>
  );
};
