import { useState } from "react";
import { MoreHorizontal, LogOut, Download, AlertCircle } from "lucide-react";
import { SaathiAvatar } from "./SaathiAvatar";
import { LedMoodIndicator } from "./LedMoodIndicator";

interface TopBarProps {
  mood: string;
  confidence: number;
  onEndSession: () => void;
}

export const TopBar = ({ mood, confidence, onEndSession }: TopBarProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="h-[48px] w-full flex items-center justify-between px-6 shrink-0 relative z-20">
      
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Abstract Avatar */}
        <SaathiAvatar size={28} />
        
        <div className="flex flex-col justify-center">
          <span className="text-[15px] font-medium text-slate-800 leading-none">Saathi</span>
          <span className="text-[11px] font-medium text-slate-400 mt-1">Here with you</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* LED Mood Indicator — inline beside the menu button */}
        <LedMoodIndicator mood={mood} confidence={confidence} />

        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-slate-500 hover:text-slate-800"
          >
            <MoreHorizontal size={24} />
          </button>
          
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-[12px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-300 whitespace-nowrap z-50 pointer-events-none">
            Session options
          </div>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                <button 
                  onClick={() => { setShowOptions(false); onEndSession(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <LogOut size={14} className="opacity-70" />
                  End Session
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                  <Download size={14} className="opacity-70" />
                  Export Conversation
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <AlertCircle size={14} className="opacity-70" />
                  Report an issue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
