import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { NameCard } from "@/components/onboarding/NameCard";
import { MoodCard } from "@/components/onboarding/MoodCard";
import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { SafetyContactCard } from "@/components/onboarding/SafetyContactCard";
import type { OnboardingMood } from "@/hooks/useOnboarding";

const QUESTIONS = [
  "What does a typical day feel like for you right now? Not what you do — how it feels to get through it.",
  "Is there something you're looking forward to right now — even something small?",
  "How has your body been feeling lately? Sleep, appetite, energy — anything feel off or different from usual?",
  "Is there something that's been sitting heavy on your mind lately? Something you find hard to switch off from?",
  "When things feel overwhelming, what does that look like for you? Do you go quiet, or does it show up differently?",
];

const TOTAL_STEPS = 8;

export const Onboarding = () => {
  const navigate = useNavigate();
  const {
    saveName,
    saveMood,
    saveResponse,
    saveSafetyContact,
    completeOnboarding,
    hasCompletedOnboarding,
  } = useOnboarding();

  const [step, setStep] = useState(1); // Steps 1-6
  const [userName, setUserName] = useState("");

  // If already onboarded, redirect
  if (hasCompletedOnboarding) {
    navigate("/home", { replace: true });
    return null;
  }

  const canGoBack = step > 1;

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Step 1: Name
  const handleName = async (name: string) => {
    setUserName(name);
    await saveName(name);
    setStep(2);
  };

  // Step 2: Mood
  const handleMood = async (mood: OnboardingMood) => {
    await saveMood(mood);
    setStep(3);
  };

  // Steps 3-7: Questions (indices 0-4 of QUESTIONS array)
  // Step 8: Safety Contact

  const handleQuestionAnswer = async (answer: string) => {
    const questionIndex = step - 3; // 0, 1, 2, 3, or 4
    await saveResponse(questionIndex, answer);
    setStep(step + 1);
  };

  const handleQuestionSkip = async () => {
    const questionIndex = step - 3;
    await saveResponse(questionIndex, "");
    setStep(step + 1);
  };

  // Step 8: Safety Contact
  const handleSafetyContact = async (
    contact: { name: string; relationship: string; phone: string } | null
  ) => {
    if (contact) {
      await saveSafetyContact(contact.name, contact.relationship, contact.phone);
    }
    await completeOnboarding();
    
    // Track onboarding completion safely (don't track answers or mood)
    import("@/lib/posthog").then(({ captureEvent }) => {
      captureEvent('onboarding_completed', { has_completed_onboarding: true });
    });
    
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] w-full saathi-gradient-bg flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Back button */}
      {canGoBack && (
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/60 z-20"
          style={{ color: "var(--saathi-text-mid)" }}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Progress indicator */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center z-10">
        <div className="flex gap-2 mb-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i + 1 === step
                    ? "var(--saathi-coral)"
                    : i + 1 < step
                    ? "var(--saathi-coral-light)"
                    : "var(--saathi-border-med)",
                transform: i + 1 === step ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex justify-center"
        >
          {step === 1 && <NameCard onNext={handleName} />}

          {step === 2 && <MoodCard userName={userName} onNext={handleMood} />}

          {step >= 3 && step <= 7 && (
            <QuestionCard
              question={QUESTIONS[step - 3]}
              onNext={handleQuestionAnswer}
              onSkip={handleQuestionSkip}
            />
          )}

          {step === 8 && <SafetyContactCard onComplete={handleSafetyContact} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
