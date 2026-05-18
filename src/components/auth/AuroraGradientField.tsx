import { motion } from "framer-motion";

// Slowly morphing aurora gradient blobs — felt, not seen
export default function AuroraGradientField() {
  const blobs = [
    {
      id: "aurora-1",
      style: { top: "-10%", left: "-15%", width: "80%", height: "75%", background: "radial-gradient(ellipse at center, rgba(244,132,95,0.28) 0%, rgba(249,199,132,0.12) 45%, transparent 72%)" },
      animate: { x: [0, 18, -8, 0], y: [0, -12, 10, 0], scale: [1, 1.06, 0.97, 1] },
      transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
    },
    {
      id: "aurora-2",
      style: { bottom: "-5%", right: "-10%", width: "75%", height: "70%", background: "radial-gradient(ellipse at center, rgba(201,160,220,0.24) 0%, rgba(244,132,95,0.08) 40%, transparent 70%)" },
      animate: { x: [0, -20, 12, 0], y: [0, 15, -8, 0], scale: [1, 0.95, 1.04, 1] },
      transition: { duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 },
    },
    {
      id: "aurora-3",
      style: { top: "20%", left: "10%", width: "65%", height: "60%", background: "radial-gradient(ellipse at 40% 60%, rgba(249,199,132,0.2) 0%, rgba(201,160,220,0.1) 50%, transparent 75%)" },
      animate: { x: [0, 10, -15, 5, 0], y: [0, 8, -5, -10, 0], scale: [1, 1.03, 0.98, 1.02, 1] },
      transition: { duration: 34, repeat: Infinity, ease: "easeInOut", delay: 8 },
    },
    {
      id: "aurora-4",
      style: { top: "40%", right: "5%", width: "50%", height: "55%", background: "radial-gradient(ellipse at 60% 40%, rgba(255,220,200,0.18) 0%, rgba(244,132,95,0.06) 55%, transparent 78%)" },
      animate: { x: [0, -8, 16, 0], y: [0, -16, 6, 0], scale: [1, 1.04, 0.96, 1] },
      transition: { duration: 26, repeat: Infinity, ease: "easeInOut", delay: 12 },
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {blobs.map(({ id, style, animate, transition }) => (
        <motion.div
          key={id}
          className="absolute will-change-transform"
          style={{ ...style, filter: "blur(48px)", mixBlendMode: "normal" }}
          animate={animate}
          transition={transition}
        />
      ))}
    </div>
  );
}
