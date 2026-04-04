import { Save, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestSaveOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSave: () => void;
}

export const GuestSaveOverlay = ({ isVisible, onDismiss, onSave }: GuestSaveOverlayProps) => {
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
                You've been chatting for a while.
              </h3>
              <p className="text-[14px] text-slate-600 leading-snug mt-1 max-w-[90%]">
                Save your progress to securely continue this conversation and access your session history anytime.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <button 
                onClick={onSave}
                className="flex flex-1 items-center justify-center gap-2 bg-[#5BA8A0] text-white rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-[#4a8e87] transition-colors"
              >
                <Save size={16} strokeWidth={1.5} />
                Save && Continue
              </button>
              <button 
                onClick={onDismiss}
                className="flex-[0.7] bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-slate-50 transition-colors"
              >
                Not right now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
