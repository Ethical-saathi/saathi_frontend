import { HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

interface CrisisOverlayProps {
  onDismiss: () => void;
}

export const CrisisOverlay = ({ onDismiss }: CrisisOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/15 backdrop-blur-[1px] transition-colors duration-400">
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#fdf5f3] flex items-center justify-center mb-6 shadow-sm border border-[#fae8e5]">
          <HeartHandshake className="w-8 h-8 text-[#d9968a]" strokeWidth={1.5} />
        </div>

        <h3 className="text-[22px] font-medium text-slate-800 mb-3 leading-snug">
          Friend, it sounds like things are really hard right now.
        </h3>
        
        <p className="text-[15px] text-slate-500 mb-8 leading-relaxed px-2">
          You don't have to face this alone. Talking to someone trained to help can make a difference.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => window.location.href = 'tel:9152987821'}
            className="w-full py-3.5 bg-gradient-to-br from-[#E8B84B]/90 to-[#d6a538] text-white rounded-[14px] font-semibold text-[15px] shadow-[0_4px_12px_rgba(232,184,75,0.3)] hover:shadow-[0_6px_16px_rgba(232,184,75,0.4)] transition-all hover:-translate-y-0.5"
          >
            Talk to someone now
          </button>
          <button 
            onClick={onDismiss}
            className="w-full py-3.5 bg-transparent border border-slate-200 text-slate-600 rounded-[14px] font-medium text-[15px] hover:bg-slate-50 transition-colors"
          >
            Stay here with Saathi
          </button>
        </div>
      </motion.div>
    </div>
  );
};
