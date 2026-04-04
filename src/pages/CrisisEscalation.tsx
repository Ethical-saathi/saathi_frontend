import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaathiAvatar } from "@/components/chat/SaathiAvatar";

interface LocationState {
  entryPoint?: "escalation" | "help";
  sessionId?: string;
}

export const CrisisEscalation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  
  const entryPoint = state?.entryPoint || "escalation";
  const sessionId = state?.sessionId || "session_123";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is less than 560px for the exact breakpoint specified
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 560);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleContinue = () => {
    if (entryPoint === "escalation") {
      navigate("/chat", { state: { sessionId, escalationReturn: true } });
    } else {
      // If from help, normally navigate to chat or go back to help
      navigate("/chat", { state: { sessionId } });
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .crisis-content-container {
          animation: fadeInUp 500ms ease-out forwards;
        }

        .ripple-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 40px;
        }

        .ripple-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #5BA8A0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .ripple-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 80px; height: 80px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #5BA8A0;
          opacity: 0;
          animation: rippleExpand 2.4s ease-out infinite;
        }

        .ripple-ring:nth-child(2) { animation-delay: 0s; }
        .ripple-ring:nth-child(3) { animation-delay: 0.8s; }
        .ripple-ring:nth-child(4) { animation-delay: 1.6s; }

        @keyframes rippleExpand {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.75); opacity: 0; }
        }
      `}</style>
      
      <div 
        className="flex flex-col items-center justify-center min-h-[100dvh] w-full bg-[#F5F0E8] overflow-x-hidden"
        style={{ fontFamily: "'Inter', 'DM Sans', var(--font-heading), sans-serif" }}
      >
        <div className="crisis-content-container w-full max-w-[560px] mx-auto p-[24px]">
          
          {/* RIPPLE ANIMATION */}
          <div className="ripple-container">
            <div className="ripple-ring"></div>
            <div className="ripple-ring"></div>
            <div className="ripple-ring"></div>
            <div className="ripple-center">
              <SaathiAvatar size={40} />
            </div>
          </div>

          {/* HEADINGS */}
          <h1 className="text-[26px] md:text-[26px] max-sm:text-[22px] font-medium text-slate-800 text-center leading-[1.4] mb-[16px]">
            You reached out. That takes courage.
          </h1>
          
          <p className="text-[16px] max-sm:text-[15px] font-normal text-slate-500 text-center leading-[1.7] max-w-[440px] mx-auto mb-[40px]">
            Saathi has noticed you might be going through something really difficult right now. You deserve real human support.
          </p>

          {/* TWO OPTION CARDS */}
          <div className={cn(
            "flex w-full gap-[16px]",
            isMobile ? "flex-col" : "flex-row"
          )}>
            
            {/* Card 1: Call Now */}
            <div className="flex-1 bg-[#F1F8F6] border-[2px] border-[#A6D4CB] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-[24px] flex flex-col items-center text-center gap-[12px]">
              <h2 className="text-[15px] font-semibold text-slate-800">
                iCall — Free, confidential counseling
              </h2>
              <p className="text-[22px] font-medium text-slate-800">
                9152987821
              </p>
              
              <div className="flex flex-col items-center mt-1 w-full">
                <a 
                  href="tel:9152987821"
                  className="flex items-center justify-center gap-[8px] bg-[#5BA8A0] text-white rounded-[12px] px-[24px] py-[14px] text-[14px] font-medium w-full max-w-[200px] hover:bg-[#4a8e87] transition-all duration-150 ease-out hover:scale-[1.04]"
                >
                  <Phone size={16} strokeWidth={1.5} />
                  Call now
                </a>
                <span className="text-[12px] text-slate-500 mt-2 md:block hidden">
                  Call 9152987821
                </span>
              </div>

              <p className="text-[12px] text-slate-500 mt-1">
                Monday to Saturday, 8am to 10pm
              </p>
            </div>

            {/* Card 2: Stay with Saathi */}
            <div className="flex-1 bg-white border border-slate-200 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-[24px] flex flex-col items-center text-center justify-between gap-[12px]">
              <div className="flex flex-col items-center gap-[12px] w-full">
                <h2 className="text-[15px] font-normal text-slate-800">
                  I'd like to keep talking to Saathi
                </h2>
                {/* Spacer to align buttons roughly visually */}
                <div className="h-[22px] md:block hidden" />
              </div>

              <div className="flex flex-col items-center w-full gap-[12px]">
                <button 
                  onClick={handleContinue}
                  className="bg-white border text-slate-800 border-black/[0.12] rounded-[12px] px-[24px] py-[12px] text-[14px] font-medium hover:bg-black/[0.02] transition-colors w-full max-w-[200px]"
                >
                  Continue conversation
                </button>
                <p className="text-[12px] text-slate-500">
                  Saathi will stay with you
                </p>
              </div>
            </div>

          </div>

          {/* EMERGENCY LINE */}
          <div className="mt-[32px] text-center">
            <p className="text-[12px] text-slate-500">
              If this is an emergency, please call <a href="tel:112" className="text-slate-500 hover:underline">112</a>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default CrisisEscalation;
