import { Shield, Lock, Heart, XCircle } from "lucide-react";
import { useState } from "react";

interface ConsentCardProps {
  onNext: () => void;
}

export const ConsentCard = ({ onNext }: ConsentCardProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white/60 flex items-center justify-center mx-auto mb-4 shrink-0">
        <Shield className="w-8 h-8 text-teal-600 drop-shadow-sm" strokeWidth={1.5} />
      </div>

      <h2 
        className="text-[24px] sm:text-[32px] font-semibold text-center text-slate-800 mb-5 leading-snug tracking-[-1px] shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Before we begin &mdash; a few things you should <span className="italic text-teal-700 font-normal" style={{ fontFamily: "var(--font-serif)" }}>know</span>
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Lock className="w-5 h-5 text-[#5BA8A0] opacity-70 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[15px] leading-relaxed text-slate-600 font-medium">
            What you share here stays private. We do not sell your data.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <Heart className="w-5 h-5 text-[#5BA8A0] opacity-70 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[15px] leading-relaxed text-slate-600 font-medium">
            MindEase is a supportive space. For emergencies, please contact a medical professional.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <XCircle className="w-5 h-5 text-[#5BA8A0] opacity-70 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[15px] leading-relaxed text-slate-600 font-medium">
            You can stop or delete your data at any time.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group mb-6 w-fit mx-auto transition-opacity hover:opacity-80 shrink-0">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-[#5BA8A0] checked:border-[#5BA8A0] transition-colors cursor-pointer"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <Shield className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
        </div>
        <span className="text-[15px] text-slate-700 font-medium select-none">
          I understand and I'm ready to begin
        </span>
      </label>

      <button
        onClick={onNext}
        disabled={!agreed}
        className="w-full sm:w-[80%] mx-auto clay-button bg-gradient-to-r from-teal-400 to-emerald-400 text-white text-[16px] py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
      >
        Let's begin
      </button>
    </div>
  );
};
