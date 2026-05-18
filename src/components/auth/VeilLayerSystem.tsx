import { motion } from "framer-motion";

// Translucent silk-like veil planes drifting independently
export default function VeilLayerSystem() {
  const veils = [
    {
      id: "veil-1",
      className: "absolute inset-0",
      style: {
        background: "linear-gradient(135deg, rgba(255,244,238,0.45) 0%, rgba(254,240,245,0.3) 50%, transparent 100%)",
        filter: "blur(2px)",
      },
      animate: { opacity: [0.6, 0.85, 0.6], x: [0, 6, 0], y: [0, -4, 0] },
      transition: { duration: 18, repeat: Infinity, ease: "easeInOut" },
    },
    {
      id: "veil-2",
      className: "absolute inset-0",
      style: {
        background: "linear-gradient(220deg, transparent 20%, rgba(201,160,220,0.15) 50%, rgba(244,132,95,0.08) 80%, transparent 100%)",
        filter: "blur(4px)",
      },
      animate: { opacity: [0.4, 0.7, 0.4], x: [0, -8, 0], y: [0, 6, 0] },
      transition: { duration: 24, repeat: Infinity, ease: "easeInOut", delay: 3 },
    },
    {
      id: "veil-3",
      className: "absolute inset-0",
      style: {
        background: "linear-gradient(45deg, rgba(249,199,132,0.1) 0%, transparent 40%, rgba(244,132,95,0.08) 70%, transparent 100%)",
        filter: "blur(6px)",
      },
      animate: { opacity: [0.3, 0.6, 0.3], x: [0, 10, -5, 0], y: [0, -8, 4, 0] },
      transition: { duration: 30, repeat: Infinity, ease: "easeInOut", delay: 7 },
    },
    // Silk highlight sweep — ultra-subtle top-left warmth
    {
      id: "veil-4",
      className: "absolute",
      style: {
        top: 0, left: 0, width: "60%", height: "50%",
        background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.22) 0%, transparent 65%)",
        filter: "blur(8px)",
      },
      animate: { opacity: [0.5, 0.8, 0.5], scale: [1, 1.04, 1] },
      transition: { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 },
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {veils.map(({ id, className, style, animate, transition }) => (
        <motion.div
          key={id}
          className={className}
          style={style as React.CSSProperties}
          animate={animate}
          transition={transition}
        />
      ))}
    </div>
  );
}
