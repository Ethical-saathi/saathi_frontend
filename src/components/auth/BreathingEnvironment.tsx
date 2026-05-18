import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BreathingEnvironmentProps {
  children: ReactNode;
}

// The entire hero breathes — a 7-second inhale/exhale cycle
// mimicking therapeutic grounding breathing (4-7-8 pattern approximation)
export default function BreathingEnvironment({ children }: BreathingEnvironmentProps) {
  return (
    <div className="relative w-full h-full">
      {/* Breathing luminance layer — brightens gently on "inhale" */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 45% 50%, rgba(255,244,238,0.35) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.025, 1] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1], // slow ease — mimics breath curve
          times: [0, 0.45, 1],
        }}
      />

      {/* Secondary lavender breath — offset phase for richness */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 65% 55%, rgba(201,160,220,0.18) 0%, transparent 65%)",
        }}
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1.02, 1, 1.02] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 3.5,
          times: [0, 0.45, 1],
        }}
      />

      {/* Content */}
      {children}
    </div>
  );
}
