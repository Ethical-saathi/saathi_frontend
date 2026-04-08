import { Shield, Lock, Heart, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ConsentCardProps {
  onNext: () => void;
}

export const ConsentCard = ({ onNext }: ConsentCardProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col w-full items-center">
      {/* Top Icon */}
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 shrink-0">
        <Shield className="w-6 h-6 text-[#5BA8A0]" strokeWidth={1.5} />
      </div>

      {/* Headline */}
      <h2 
        className="text-[22px] sm:text-[26px] font-semibold text-slate-800 mb-8 text-center leading-snug shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Before we begin &mdash; a few things you should know
      </h2>

      {/* Three Soft Points */}
      <div className="flex flex-col gap-5 w-full mb-8">
        <div className="flex items-start gap-4">
          <div className="pt-1 shrink-0">
            <Lock className="w-5 h-5 text-[#5BA8A0] opacity-80" strokeWidth={2} />
          </div>
          <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            What you share here stays private. We do not sell your data.
          </p>
        </div>

        <div className="flex items-start gap-4">
          <div className="pt-1 shrink-0">
            <Heart className="w-5 h-5 text-[#5BA8A0] opacity-80" strokeWidth={2} />
          </div>
          <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            MindEase is a supportive space. For emergencies, please contact a medical professional.
          </p>
        </div>

        <div className="flex items-start gap-4">
          <div className="pt-1 shrink-0">
            <Trash2 className="w-5 h-5 text-[#5BA8A0] opacity-80" strokeWidth={2} />
          </div>
          <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            You can stop or delete your data at any time.
          </p>
        </div>
      </div>

      {/* Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group mb-8 w-full transition-opacity hover:opacity-80 shrink-0 select-none">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-[#5BA8A0] checked:border-[#5BA8A0] transition-colors cursor-pointer"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <CheckCircle2 className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
        </div>
        <span className="text-[15px] sm:text-[16px] text-slate-700 font-medium">
          I understand and I'm ready to begin
        </span>
      </label>

      {/* Action Button */}
      <div className="w-full shrink-0">
        <button
          onClick={onNext}
          disabled={!agreed}
          className="clay-button w-full bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed py-3.5 text-[16px] rounded-full"
        >
          Let's begin
        </button>
      </div>
    </div>
  );
};
