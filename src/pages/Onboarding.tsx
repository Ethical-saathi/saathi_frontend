import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CardWrapper } from "@/components/onboarding/CardWrapper";
import { DotIndicator } from "@/components/onboarding/DotIndicator";
import { ConsentCard } from "@/components/onboarding/ConsentCard";
import { OpeningCard } from "@/components/onboarding/OpeningCard";
import { AssessmentCard } from "@/components/onboarding/AssessmentCard";
import { ProcessingCard } from "@/components/onboarding/ProcessingCard";
import PetalsAnimation from "@/components/ui/PetalsAnimation";

type Screen = "onboarding" | "processing" | "chat";

const ONBOARDING_QUESTIONS = [
  "What does a typical day feel like for you right now? Not what you do — how it feels to get through it.",
  "Is there something you're looking forward to right now — even something small?",
  "How has your body been feeling lately? Sleep, appetite, energy — anything feel off or different from usual?",
  "Is there something that's been sitting heavy on your mind lately? Something you find hard to switch off from?",
  "When things feel overwhelming, what does that look like for you? Do you go quiet, or does it show up differently?"
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  
  // 0 = Consent, 1 = Opening, 2-6 = Questions, 7 = Processing
  const [currentCard, setCurrentCard] = useState(0); 
  
  const [userName, setUserName] = useState("");
  const [userMood, setUserMood] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  
  // Simulated backend delay tracker
  const [processingReady, setProcessingReady] = useState(false);

  useEffect(() => {
    if (currentScreen === "processing" && processingReady) {
      const timer = setTimeout(() => {
        // Chat transit
        navigate("/chat", { state: { userName, mood: userMood, sessionId } });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, processingReady, navigate, sessionId, userName, userMood]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#e8e5ce] to-[#CCC9A4] relative">
      <PetalsAnimation />
      
      {/* Soft Top Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40vh] bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-3xl pointer-events-none" />

      {/* Shows 5 dots only during the 5 questions */}
      {currentScreen === "onboarding" && currentCard >= 2 && currentCard <= 6 && (
        <div className="absolute top-6 left-0 right-0 z-50">
          <DotIndicator totalDocs={5} activeIndex={currentCard - 2} />
        </div>
      )}

      <AnimatePresence>
          {currentScreen === "onboarding" && currentCard === 0 && (
            <CardWrapper keyProp="consent" variant="card">
              <ConsentCard
                onNext={() => {
                  console.log("POST /api/consent", { sessionId, timestamp: new Date().toISOString() });
                  setCurrentCard(1); // Proceed to Opening
                }}
              />
            </CardWrapper>
          )}

          {currentScreen === "onboarding" && currentCard === 1 && (
            <CardWrapper keyProp="opening" variant="transparent">
              <OpeningCard
                onNext={(name, mood) => {
                  setUserName(name);
                  setUserMood(mood);
                  console.log("POST /api/session/start", { sessionId, name, mood });
                  setCurrentCard(2); // Proceed to Q1
                }}
                onSkip={() => {
                  setUserName("Friend");
                  console.log("POST /api/session/start", { sessionId, name: "Friend", mood: null });
                  setCurrentCard(2); // Proceed to Q1
                }}
              />
            </CardWrapper>
          )}

          {currentScreen === "onboarding" && currentCard >= 2 && currentCard <= 6 && (() => {
            const index = currentCard - 2; // 0 to 4
            const questionText = ONBOARDING_QUESTIONS[index];
            
            return (
              <CardWrapper keyProp={`question-${currentCard}`} variant="transparent">
                <AssessmentCard
                  question={questionText}
                  onNext={(answer) => {
                    console.log("POST /api/session/answer", { sessionId, questionIndex: index, answer });
                    setAnswers(prev => [...prev, answer]);

                    if (currentCard === 6) {
                      setCurrentScreen("processing");
                      setTimeout(() => setProcessingReady(true), 1500); 
                    } else {
                      setCurrentCard((prev) => prev + 1);
                    }
                  }}
                  onSkip={() => {
                    console.log("POST /api/session/answer", { sessionId, questionIndex: index, answer: "skipped" });
                    setAnswers(prev => [...prev, ""]);
                    if (currentCard === 6) {
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
            <CardWrapper keyProp="processing" variant="transparent">
              <ProcessingCard userName={userName || "Friend"} />
            </CardWrapper>
          )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
