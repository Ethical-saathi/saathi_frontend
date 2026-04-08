import { useState } from "react";
import { useHome, MoodType } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";
import { MoodDotArc } from "@/components/ui/MoodDotArc";
import { getMoodColor } from "@/components/ui/MoodDot";
import { SaathiAvatar } from "@/components/chat/SaathiAvatar";
import { ArrowRight, Sparkles, CloudRain, Wind, Meh, Smile, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOOD_OPTIONS: { mood: MoodType; icon: React.ElementType }[] = [
  { mood: "Struggling", icon: CloudRain },
  { mood: "Anxious", icon: Wind },
  { mood: "Okay", icon: Meh },
  { mood: "Alright", icon: Smile },
  { mood: "Good", icon: Sun },
];

export const Home = () => {
  const navigate = useNavigate();
  // Using a static session ID for demonstration
  const sessionId = "session_123";
  const { homeData, isLoading, submitMoodCheckin } = useHome(sessionId);

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

  const getGreetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <div className="flex-1 overflow-y-auto w-full no-scrollbar relative z-10">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-16 pb-24 relative">
          
          <AnimatePresence>
            {/* Block 1: Greeting */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
              className="mb-8"
            >
              {isLoading ? (
                <div className="animate-pulse flex flex-col gap-3">
                  <div className="h-8 bg-white/40 rounded-md w-64" />
                  <div className="h-4 bg-white/40 rounded-md w-96 mt-2" />
                </div>
              ) : homeData ? (
                <div>
                  <div className="flex items-center gap-4">
                    <SaathiAvatar size={40} />
                    <h1 className="text-[32px] md:text-[40px] font-normal text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {getGreetingText()} <span className="italic text-teal-800" style={{ fontFamily: "var(--font-serif)" }}>{homeData.userName}.</span>
                    </h1>
                  </div>
                  <p className="text-[16px] text-slate-600 leading-[1.6] mt-3 max-w-[480px]">
                    {homeData.contextLine}
                  </p>
                </div>
              ) : null}
            </motion.div>

            {/* Block 2: Start Session Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
              className="mb-12 flex flex-col items-start gap-4"
            >
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
                className="blob-btn breathing-slow text-white text-[16px] font-medium px-8 py-4 disabled:opacity-50"
              >
                Continue Your Journey →
              </button>
            </motion.div>

            {/* Block 4: Mood Check-in Widget */}
            {moodWidgetVisible && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: (!moodConfirmVisible && selectedMood) ? 0 : 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-[14px] font-medium text-slate-500 mb-4 tracking-wide uppercase">
                  How are you feeling right now?
                </h2>
                <div className="flex flex-wrap gap-4">
                  {MOOD_OPTIONS.map(({ mood, icon: Icon }) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      className={`clay-panel flex flex-col items-center justify-center gap-2 w-[80px] h-[80px] rounded-[24px] rounded-bl-[12px] rounded-tr-[12px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F4845F]/10
                        ${selectedMood === mood
                          ? "bg-white/80 ring-2 ring-[#5BA8A0]/50 shadow-lg text-[#5BA8A0]"
                          : "bg-white/40 text-slate-500 hover:text-slate-800 border border-white/60"
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[1.5px]" />
                      <span className="text-[11px] font-medium">{mood}</span>
                    </button>
                  ))}
                </div>
                
                {/* Confirmation Text */}
                <p 
                  className={`text-[13px] text-teal-700 italic font-medium mt-4 transition-opacity duration-300 ${
                    moodConfirmVisible ? "opacity-100" : "opacity-0 invisible"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Got it. Saathi will keep this in mind.
                </p>
              </motion.div>
            )}

            {/* Block 5 & 6 Container */}
            <div className={`transition-all duration-700 ${isLoading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Block 5: Last Session Card */}
                {homeData?.lastSession && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="clay-panel bg-white/40 backdrop-blur-md border border-white/60 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[12px] text-slate-500 font-medium tracking-wide uppercase">Last session</span>
                        <span className="text-[12px] text-slate-400 font-medium">{homeData.lastSession.date}</span>
                      </div>
                      
                      <p className="text-[15px] leading-[1.7] text-slate-700 mb-6 font-medium">
                        {homeData.lastSession.summary}
                      </p>
                    </div>

                    <div>
                      {/* Mood Arc Visualization */}
                      <div className="mb-4 bg-white/30 rounded-2xl p-4 border border-white/50">
                        <MoodDotArc 
                          openingMood={homeData.lastSession.openingMood}
                          closingMood={homeData.lastSession.closingMood}
                        />
                      </div>

                      <button 
                        onClick={() => navigate('/history')}
                        className="text-[13px] text-teal-700 hover:text-teal-900 transition-colors duration-150 ease-in-out font-medium flex items-center gap-1 group w-fit focus:outline-none"
                      >
                        View full session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Block 6: Gentle Insight Card */}
                {homeData?.insight && homeData.sessionCount >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="clay-panel bg-[#FFFAF7]/50 backdrop-blur-md border border-[#F4845F]/20 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#F4845F]/10 flex items-center justify-center">
                          <Sparkles size={16} className="text-[#F4845F]" />
                        </div>
                        <h3 className="text-[12px] font-medium text-[#F4845F] tracking-wide uppercase">
                          Saathi noticed
                        </h3>
                      </div>
                      <p className="text-[16px] leading-[1.6] text-slate-800 mb-6 italic" style={{ fontFamily: "var(--font-serif)" }}>
                        "{homeData.insight}"
                      </p>
                    </div>
                    
                    <button className="text-[12px] text-slate-500 hover:text-[#F4845F] underline underline-offset-4 decoration-[#F4845F]/30 hover:decoration-[#F4845F] transition-all w-fit">
                      Was this helpful?
                    </button>
                  </motion.div>
                )}
                
              </div>
            </div>
          </AnimatePresence>
          
      </div>
    </div>
  );
};

export default Home;
