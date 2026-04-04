import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sun, Sparkles, Leaf, Cloud, Link2 } from "lucide-react";
import { CardWrapper } from "@/components/onboarding/CardWrapper";
import { DotIndicator } from "@/components/onboarding/DotIndicator";
import { ConsentCard } from "@/components/onboarding/ConsentCard";
import { OpeningCard } from "@/components/onboarding/OpeningCard";
import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { ProcessingCard } from "@/components/onboarding/ProcessingCard";
import PetalsAnimation from "@/components/ui/PetalsAnimation";

type Screen = "onboarding" | "processing" | "chat";

const QUESTIONS = [
  { icon: Sun, text: "What does a typical day feel like for you right now? Not what you do — how it feels to get through it." },
  { icon: Sparkles, text: "Is there something you're looking forward to right now — even something small?" },
  { icon: Leaf, text: "How has your body been feeling lately? Sleep, appetite, energy — anything feel off or different from usual?" },
  { icon: Cloud, text: "Is there something that's been sitting heavy on your mind lately? Something you find hard to switch off from?" },
  { icon: Link2, text: "When things feel overwhelming, what does that look like for you? Do you go quiet, or does it show up differently?" },
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [currentCard, setCurrentCard] = useState(0); // 0 = Opening, 1-5 = Questions
  const [userName, setUserName] = useState("");
  const [userMood, setUserMood] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  
  // Simulated backend delay tracker
  const [processingReady, setProcessingReady] = useState(false);

  const checkCrisis = (textList: string[]) => {
    const text = textList.join(" ").toLowerCase();
    const keywords = ["self harm", "suicide", "hopeless", "end it all", "kill myself", "worthless", "die", "hurt myself"];
    return keywords.some(kw => text.includes(kw));
  };

  useEffect(() => {
    if (currentScreen === "processing" && processingReady) {
      const isCrisis = checkCrisis(answers);
      const timer = setTimeout(() => {
        if (isCrisis) {
          navigate("/escalation", { state: { entryPoint: "escalation", sessionId, userName, mood: userMood } });
        } else {
          navigate("/chat", { state: { userName, mood: userMood, sessionId } });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, processingReady, answers, navigate, sessionId, userName, userMood]);

  // Background light shifting animation wrapper
  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#e8e5ce] to-[#CCC9A4] relative">
      <PetalsAnimation />
      
      {/* Soft Top Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40vh] bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-3xl pointer-events-none" />

      {currentScreen === "onboarding" && (
        <DotIndicator totalDocs={6} activeIndex={currentCard} />
      )}

      {/* 
        Using AnimatePresence without mode="wait" ensures that outgoing and 
        incoming cards animate simultaneously as required by the design spec.
      */}
      <AnimatePresence>

          {currentScreen === "onboarding" && currentCard === 0 && (
            <CardWrapper keyProp="opening">
              <OpeningCard
                onNext={(name, mood) => {
                  setUserName(name);
                  setUserMood(mood);
                  // Fire and forget POST mock
                  console.log("POST /api/session/start", { sessionId, name, mood });
                  setCurrentCard(1);
                }}
                onSkip={() => {
                  setUserName("Friend");
                  console.log("POST /api/session/start", { sessionId, name: "Friend", mood: null });
                  setCurrentCard(1);
                }}
              />
            </CardWrapper>
          )}

          {currentScreen === "onboarding" && currentCard > 0 && currentCard <= 5 && (() => {
            const index = currentCard - 1; // 0 to 4
            const questionData = QUESTIONS[index];
            
            return (
              <CardWrapper keyProp={`question-${currentCard}`}>
                <QuestionCard
                  icon={questionData.icon}
                  question={questionData.text}
                  isLastCard={currentCard === 5}
                  onNext={(answer) => {
                    console.log("POST /api/session/answer", { sessionId, questionIndex: currentCard, answer });
                    setAnswers(prev => [...prev, answer]);
                    if (currentCard === 5) {
                      setCurrentScreen("processing");
                      setTimeout(() => setProcessingReady(true), 1500); // Mock ready after 1.5s
                    } else {
                      setCurrentCard((prev) => prev + 1);
                    }
                  }}
                  onSkip={() => {
                    console.log("POST /api/session/answer", { sessionId, questionIndex: currentCard, answer: "" });
                    setAnswers(prev => [...prev, ""]);
                    if (currentCard === 5) {
                      setCurrentScreen("processing");
                      setTimeout(() => setProcessingReady(true), 1500);
                    } else {
                      setCurrentCard((prev) => prev + 1);
                    }
                  }}
                />
              </CardWrapper>
            );
          })()}

          {currentScreen === "processing" && (
            <CardWrapper keyProp="processing">
              <ProcessingCard userName={userName || "Friend"} />
            </CardWrapper>
          )}


      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
