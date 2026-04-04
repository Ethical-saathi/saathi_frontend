import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardWrapperProps {
  children: ReactNode;
  keyProp: string | number;
}

export const CardWrapper = ({ children, keyProp }: CardWrapperProps) => {
  return (
    <motion.div
      key={keyProp}
      initial={{ opacity: 0, x: 60, y: "-50%", scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
      exit={{ opacity: 0, x: -60, y: "-50%", scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute w-[92vw] max-w-[520px] max-h-[85vh] overflow-y-auto no-scrollbar clay-panel border border-white/60 p-6 sm:p-8 flex flex-col items-center mx-auto left-0 right-0 top-1/2"
      style={{
        fontFamily: "var(--font-heading)",
      }}
    >
      {children}
    </motion.div>
  );
};
