import { motion } from "framer-motion";
import { BookmarkPlus } from "lucide-react";

interface PauseNotificationProps {
  onSave: () => void;
}

export const PauseNotification = ({ onSave }: PauseNotificationProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute bottom-[80px] left-1/2 -translate-x-1/2 lg:left-[calc(50%+130px)] lg:-translate-x-1/2 w-fit min-w-[300px] z-30 pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md border border-[#E6E2DA] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-2xl p-4 flex items-center justify-between gap-6 cursor-pointer hover:bg-white transition-colors group" onClick={onSave}>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-slate-800 tracking-tight">
            Still there? We can pick this up anytime.
          </span>
          <span className="text-[12px] text-slate-500 font-medium mt-0.5">
            Click here when you are ready to continue.
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center group-hover:bg-[#EAF0EC] group-hover:text-teal-700 transition-colors text-slate-400 shrink-0">
          <BookmarkPlus size={16} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
};
