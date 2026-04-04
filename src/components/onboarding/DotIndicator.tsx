import { motion } from "framer-motion";

interface DotIndicatorProps {
  totalDocs: number;
  activeIndex: number;
}

export const DotIndicator = ({ totalDocs, activeIndex }: DotIndicatorProps) => {
  return (
    <div className="absolute top-8 left-0 right-0 flex justify-center items-center gap-3 z-50">
      {Array.from({ length: totalDocs }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            width: i === activeIndex ? 12 : 10,
            height: i === activeIndex ? 12 : 10,
            backgroundColor: i === activeIndex ? "#5BA8A0" : "rgba(163, 177, 198, 0.35)",
            borderColor: i === activeIndex ? "transparent" : "rgba(255, 255, 255, 0.5)",
            boxShadow: i === activeIndex 
              ? "0 4px 10px rgba(91, 168, 160, 0.4), inset 1px 1px 2px rgba(255, 255, 255, 0.5)" 
              : "inset 2px 2px 4px rgba(163, 177, 198, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 1)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-full border backdrop-blur-sm"
        />
      ))}
    </div>
  );
};
