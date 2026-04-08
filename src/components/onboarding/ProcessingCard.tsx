import { useEffect, useState } from "react";

interface ProcessingCardProps {
  userName: string;
}

export const ProcessingCard = ({ userName }: ProcessingCardProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const fullText = `Thank you for sharing that, ${userName}.`;

  useEffect(() => {
    let currentIndex = 0;
    const words = fullText.split(" ");
    
    // Typewriter effect per word
    const intervalId = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText(words.slice(0, currentIndex + 1).join(" "));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        // Show next line after 2 seconds
        setTimeout(() => {
          setShowSetup(true);
        }, 2000);
      }
    }, 150);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <div className="flex flex-col w-full h-[100dvh] items-center justify-center relative -mt-10">
      {/* Ripple Animation */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-10 shrink-0">
        {/* Core center dot */}
        <div className="absolute w-4 h-4 bg-[#5BA8A0] rounded-full z-10" />
        
        {/* Concentric expanding ripples */}
        <div className="absolute w-16 h-16 border-2 border-[#5BA8A0]/60 rounded-full animate-ripple-expand" style={{ animationDelay: "0s" }} />
        <div className="absolute w-16 h-16 border-2 border-[#5BA8A0]/40 rounded-full animate-ripple-expand" style={{ animationDelay: "0.8s" }} />
        <div className="absolute w-16 h-16 border-2 border-[#5BA8A0]/20 rounded-full animate-ripple-expand" style={{ animationDelay: "1.6s" }} />
      </div>

      <div className="text-center flex flex-col items-center gap-6">
        <h2 
          className="text-[24px] sm:text-[30px] font-semibold text-slate-800 tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {displayedText}
          {!showSetup && <span className="animate-pulse opacity-50 ml-1 text-[#5BA8A0]">|</span>}
        </h2>

        <div
          className={`transition-opacity duration-[1000ms] ease-in-out ${
            showSetup ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[18px] sm:text-[20px] text-slate-500 font-medium">
            We're getting your space ready.
          </p>
        </div>
      </div>
    </div>
  );
};
