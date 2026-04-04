import { motion } from "framer-motion";

export const SummaryOverlay = ({ isReturningUser = false }: { isReturningUser?: boolean }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-colors duration-400">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-8 flex flex-col"
      >
        <span className="text-[12px] font-semibold tracking-wider text-slate-400 uppercase mb-6 text-center">
          Session with Saathi — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>

        <p className="text-[16px] leading-[1.7] text-slate-700 mb-8 font-medium">
          Today you talked about feeling overwhelmed with work and finding it hard to switch off. Toward the end, things felt a little lighter and more manageable.
        </p>

        {/* Minimal Mood Arc */}
        <div className="w-full h-[60px] relative mb-10 flex items-center justify-center">
          <svg className="absolute w-[80%] h-full top-0 left-[10%] overflow-visible pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path 
              d="M 0 20 Q 50 0 100 20" 
              fill="none" 
              stroke="#E6E2DA" 
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          {/* Start Mood (e.g. high distress -> mild stress) */}
          <div className="absolute left-[8%] top-[12px] w-4 h-4 rounded-full bg-[#E8B84B] shadow-[0_0_10px_rgba(232,184,75,0.4)]" />
          {/* End Mood (e.g. calm) */}
          <div className="absolute right-[8%] top-[12px] w-4 h-4 rounded-full bg-[#7DC98A] shadow-[0_0_10px_rgba(125,201,138,0.4)]" />
        </div>

        <div className="w-full p-5 bg-[#FAF8F5] rounded-[16px] mb-8 text-center border border-black/5">
          <p className="text-[15px] font-semibold text-slate-800 italic" style={{ fontFamily: "var(--font-serif)" }}>
            What's one small thing you can do for yourself today?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full gap-3">
          {isReturningUser ? (
            <button 
              onClick={() => window.location.href = '/home'}
              className="flex-1 py-3.5 bg-[#5BA8A0] text-white rounded-[14px] font-semibold text-[14px] hover:bg-[#4d918a] transition-colors"
            >
              Return to Home Screen
            </button>
          ) : (
            <>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 py-3.5 bg-transparent border border-slate-200 text-slate-600 rounded-[14px] font-medium text-[14px] hover:bg-slate-50 transition-colors"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="flex-1 py-3.5 bg-[#5BA8A0] text-white rounded-[14px] font-semibold text-[14px] hover:bg-[#4d918a] transition-colors"
              >
                Save My Progress
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
