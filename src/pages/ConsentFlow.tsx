import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useConsent } from "@/hooks/useConsent";
import { ConsentCard } from "@/components/onboarding/ConsentCard";
import { Layer2ConsentCard } from "@/components/onboarding/Layer2ConsentCard";

/**
 * ConsentFlow — 2-screen DPDPA-compliant consent flow
 * Screen 1: Layer 1 (required service consent)
 * Screen 2: Layer 2 (optional AI training consent)
 */
const ConsentFlow = () => {
  const navigate = useNavigate();
  const { hasCompletedConsent, saveLayer1, saveLayer2 } = useConsent();
  const [screen, setScreen] = useState<1 | 2>(hasCompletedConsent ? 2 : 1);

  const handleLayer1Complete = async () => {
    await saveLayer1();
    setScreen(2);
  };

  const handleLayer2Complete = async (agreed: boolean) => {
    await saveLayer2(agreed);
    navigate("/onboarding", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] w-full saathi-gradient-bg flex items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <motion.div
            key="layer1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[480px]"
          >
            <ConsentCard onNext={handleLayer1Complete} />
          </motion.div>
        )}

        {screen === 2 && (
          <motion.div
            key="layer2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[480px]"
          >
            <Layer2ConsentCard onComplete={handleLayer2Complete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsentFlow;
