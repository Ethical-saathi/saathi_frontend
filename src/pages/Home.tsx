import { useState, useMemo, useEffect } from "react";
import { useHome, MoodType } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { getMoodColor } from "@/components/ui/MoodDot";
import { SaathiAvatar } from "@/components/chat/SaathiAvatar";
import { ArrowRight, Sparkles } from "lucide-react";

const MOOD_OPTIONS: { mood: MoodType; emoji: string }[] = [
  { mood: "Struggling", emoji: "😔" },
  { mood: "Anxious", emoji: "😰" },
  { mood: "Okay", emoji: "😐" },
  { mood: "Alright", emoji: "🙂" },
  { mood: "Good", emoji: "😊" },
];

export const Home = () => {
  const navigate = useNavigate();
  // Using a static session ID for demonstration
  const sessionId = "session_123";
  const { homeData, isLoading, submitMoodCheckin, sessionHistory } = useHome(sessionId);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodConfirmVisible, setMoodConfirmVisible] = useState(false);
  const [moodWidgetVisible, setMoodWidgetVisible] = useState(true);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setMoodConfirmVisible(true);
    submitMoodCheckin(mood);

    // Fade out and remove after 1500ms
    setTimeout(() => {
      setMoodConfirmVisible(false);
      setTimeout(() => setMoodWidgetVisible(false), 300); // Wait for fade out
    }, 1500);
  };

  const getGreeting = (name: string) => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}.`;
    if (hour < 17) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-16 pb-24">
          
          {/* Block 1: Greeting */}
          <div className="mb-8">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-3">
                <div className="h-8 bg-black/5 rounded-md w-64" />
                <div className="h-4 bg-black/5 rounded-md w-96 mt-2" />
              </div>
            ) : homeData ? (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <SaathiAvatar size={32} />
                  <h1 className="text-[28px] font-normal text-slate-800">
                    {getGreeting(homeData.userName)}
                  </h1>
                </div>
                <p className="text-[15px] text-slate-500 leading-[1.6] mt-1">
                  {homeData.contextLine}
                </p>
              </div>
            ) : null}
          </div>

          {/* Block 2: Start Session Button */}
          <div className="mb-8 flex flex-col items-start gap-2">
            <button
              onClick={() => navigate("/chat", { 
                state: { 
                  sessionId, 
                  userName: homeData?.userName,
                  isReturningUser: true,
                  contextLine: homeData?.lastSession?.summary || homeData?.contextLine
                } 
              })}
              disabled={isLoading}
              className="bg-[#5BA8A0] text-white text-[15px] font-medium px-6 py-3.5 rounded-xl transition-transform active:scale-[0.98] hover:bg-[#4E938C] disabled:opacity-50"
            >
              Talk to Saathi
            </button>
            <p className="text-[12px] text-slate-500 text-center w-[160px]">
              Continue from where you left off
            </p>
          </div>

          {/* Block 3: Divider */}
          <div className="w-full h-px bg-black/[0.06] mb-8" />

          <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {/* Block 4: Mood Check-in Widget */}
            {moodWidgetVisible && !isLoading && (
              <div className={`mb-8 transition-opacity duration-300 ${!moodConfirmVisible && selectedMood ? 'opacity-0' : 'opacity-100'}`}>
                <h2 className="text-[13px] font-medium text-slate-500 mb-3">
                  How are you feeling right now?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map(({ mood, emoji }) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      className={`h-[38px] px-4 rounded-xl text-[14px] font-medium transition-all duration-150 flex items-center gap-1.5 ${
                        selectedMood === mood
                          ? "bg-[#5BA8A0] text-white border-transparent shadow-[0_0_0_3px_rgba(91,168,160,0.2)]"
                          : "bg-white text-slate-600 border border-black/[0.06] hover:border-black/[0.12] hover:shadow-sm"
                      }`}
                    >
                      <span className="text-[15px]">{emoji}</span> {mood}
                    </button>
                  ))}
                </div>
                
                {/* Confirmation Text */}
                <p 
                  className={`text-[12px] text-slate-500 mt-3 transition-opacity duration-300 ${
                    moodConfirmVisible ? "opacity-100" : "opacity-0 invisible"
                  }`}
                >
                  Got it. Saathi will keep this in mind.
                </p>
              </div>
            )}

            {/* Block 5: Last Session Card */}
            {homeData?.lastSession && (
              <div 
                className="clay-card border-l-[2px] p-5 mb-6"
                style={{ borderLeftColor: getMoodColor(homeData.lastSession.closingMood) }}
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[12px] text-slate-400 font-medium">Last session</span>
                  <span className="text-[12px] text-slate-500 font-medium">{homeData.lastSession.date}</span>
                </div>
                
                <p className="text-[14px] leading-[1.7] text-slate-700 mb-4">
                  {homeData.lastSession.summary}
                </p>

                {/* Mood Arc Visualization */}
                <MoodDotArc 
                  openingMood={homeData.lastSession.openingMood}
                  closingMood={homeData.lastSession.closingMood}
                />

                <button 
                  onClick={() => navigate('/history')}
                  className="text-[13px] text-slate-500 hover:text-slate-800 hover:underline transition-colors duration-150 ease-in-out font-medium flex items-center gap-1 group py-2 pr-2 focus:outline-none"
                >
                  View full session <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* Block 6: Gentle Insight Card */}
            {homeData?.insight && homeData.sessionCount >= 3 && (
              <div 
                className="clay-card p-5"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles size={18} className="text-[#B45309]" />
                  <h3 className="text-[11px] font-medium text-slate-500 tracking-[0.04em] uppercase">
                    Something Saathi noticed
                  </h3>
                </div>
                <p className="text-[15px] leading-[1.6] text-slate-800 mb-3">
                  {homeData.insight}
                </p>
                <button className="text-[12px] text-slate-500 hover:text-slate-700 underline underline-offset-2">
                  Was this helpful?
                </button>
              </div>
            )}
          </div>
          
      </div>
    </div>
  );
};

export default Home;
