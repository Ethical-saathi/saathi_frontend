import { SessionData } from "@/hooks/useSessionHistory";
import { MoodDotArc } from "@/components/ui/MoodDotArc";

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
        className="text-[13px] text-[#5BA8A0] mb-[24px] hover:underline focus:outline-none flex items-center gap-1"
      >
        &larr; Back to journey
      </button>

      {/* Session Header */}
      <div className="mb-[32px]">
        <p className="text-[13px] text-slate-500 mb-1">{session.date}</p>
        <h1 className="text-[22px] font-normal text-slate-800">{session.title}</h1>
      </div>

      {/* Full Transcript */}
      <div className="flex flex-col">
        {session.transcript.map((msg, idx) => (
          <div key={idx}>
            <p 
              className={`mb-[16px] ${
                msg.sender === "saathi" 
                  ? "text-[15px] font-normal text-slate-500 leading-[1.8]" 
                  : "text-[15px] font-medium text-slate-800 leading-[1.8]"
              }`}
            >
              {msg.text}
            </p>
            {msg.hasBreakAfter && (
              <div className="w-full h-px bg-black/[0.06] my-[24px]" />
            )}
          </div>
        ))}
      </div>

      {/* Closing Session Summary Card */}
      <div className="mt-[40px] clay-card p-5 mb-[48px]">
        <h3 className="text-[16px] font-medium text-slate-800 mb-2">
          {session.title}
        </h3>
        <p className="text-[14px] leading-[1.7] text-slate-500 mb-4 whitespace-pre-wrap">
          {session.summary}
        </p>
        <MoodDotArc 
          openingMood={session.openingMood}
          closingMood={session.closingMood}
          className="mb-0" // bottom margin 0 inside card
        />
      </div>
    </div>
  );
};
