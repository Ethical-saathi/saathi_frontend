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
        // Show next line after 0.8 seconds
        setTimeout(() => {
          setShowSetup(true);
        }, 800);
      }
    }, 80);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <div className="flex flex-col flex-1 w-full items-center justify-center min-h-[300px]">
      {/* Ripple Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8 shrink-0">
        {/* Core center dot */}
        <div className="absolute w-4 h-4 bg-[#5BA8A0] rounded-full z-10" />
        
        {/* Concentric expanding ripples */}
        <div className="absolute w-12 h-12 border-2 border-[#5BA8A0]/60 rounded-full animate-ripple-expand" style={{ animationDelay: "0s" }} />
        <div className="absolute w-12 h-12 border-2 border-[#5BA8A0]/40 rounded-full animate-ripple-expand" style={{ animationDelay: "0.6s" }} />
        <div className="absolute w-12 h-12 border-2 border-[#5BA8A0]/20 rounded-full animate-ripple-expand" style={{ animationDelay: "1.2s" }} />
      </div>

      <div className="text-center h-20 flex flex-col items-center gap-4">
        <h2 
          className="text-[22px] sm:text-[26px] font-semibold text-slate-800 min-h-[32px] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {displayedText}
          <span className="animate-pulse opacity-50 ml-1 text-teal-400">|</span>
        </h2>

        <div
          className={`transition-opacity duration-600 ease-in-out ${
            showSetup ? "opacity-100" : "opacity-0"
          }`}
        >
          <p 
            className="text-[17px] text-slate-500 font-medium italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Setting up your space...
          </p>
        </div>
      </div>
    </div>
  );
};
