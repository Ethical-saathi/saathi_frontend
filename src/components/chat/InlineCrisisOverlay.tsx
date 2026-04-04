import { Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InlineCrisisOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  onEscalate: () => void;
}

export const InlineCrisisOverlay = ({ isVisible, onDismiss, onEscalate }: InlineCrisisOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mx-4 my-2 p-4 bg-[#F1F8F6] border-2 border-[#A6D4CB] rounded-2xl shadow-sm relative overflow-hidden"
          style={{ fontFamily: "'Inter', 'DM Sans', var(--font-heading), sans-serif" }}
        >
          <div className="flex flex-col gap-3 relative z-10">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-800">
                You reached out. That takes courage.
              </h3>
              <p className="text-[14px] text-slate-600 leading-snug mt-1 max-w-[90%]">
                Saathi noticed you might be going through something really difficult right now. You deserve real human support.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <button 
                onClick={onEscalate}
                className="flex flex-1 items-center justify-center gap-2 bg-[#5BA8A0] text-white rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-[#4a8e87] transition-colors"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
                Get support now
              </button>
              <a 
                href="tel:9152987821"
                className="flex flex-1 items-center justify-center gap-2 bg-white border border-[#5BA8A0] text-[#5BA8A0] rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-[#f0faf8] transition-colors"
              >
                <Phone size={16} strokeWidth={1.5} />
                Call iCall
              </a>
              <button 
                onClick={onDismiss}
                className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-slate-50 transition-colors"
              >
                Continue chatting
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-1">
              If this is an emergency, please call 112 immediately.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
