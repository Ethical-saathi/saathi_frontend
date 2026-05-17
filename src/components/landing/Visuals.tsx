import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Massive CSS Parallax Background Built with `useTransform`
export function BackgroundBlobs() {
  const { scrollYProgress } = useScroll();
  
  // Parallax mapping offsets 0.08x equivalent (slow, barely noticed drift)
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const y4 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']); // upward float

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
      <motion.div style={{
        y: y1, position: 'absolute', top: '10%', left: '-10%',
        width: '60vw', height: '60vw', 
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        background: '#FFDDD0', filter: 'blur(120px)', opacity: 0.5,
      }} className="breathing" />
      
      <motion.div style={{
        y: y2, position: 'absolute', top: '40%', right: '-5%',
        width: '50vw', height: '50vw', 
        borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
        background: '#FFD6E8', filter: 'blur(120px)', opacity: 0.4,
      }} className="breathing-slow" />
      
      <motion.div style={{
        y: y3, position: 'absolute', top: '70%', left: '20%',
        width: '70vw', height: '70vw', 
        borderRadius: '50% 50% 60% 40% / 40% 60% 30% 70%',
        background: '#E8DAFF', filter: 'blur(120px)', opacity: 0.45,
      }} className="breathing" />
      
      <motion.div style={{
        y: y4, position: 'absolute', top: '120%', right: '10%',
        width: '80vw', height: '80vw', 
        borderRadius: '70% 30% 50% 50% / 30% 70% 60% 40%',
        background: '#FFDDD0', filter: 'blur(120px)', opacity: 0.6,
      }} className="breathing-fast" />
    </div>
  );
}

// Right edge wavy scroll line
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const height = '100vh';

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, height, width: 40, zIndex: 9990, pointerEvents: 'none' }}>
      <svg viewBox={`0 0 40 1000`} height="100%" width="40" preserveAspectRatio="none">
        {/* Helper path logic to create a subtle vertical wave.
            M x y Q cx cy x y T x y (smooth quadratic) */}
        <motion.path
          d="M 20 0 Q 30 150 20 300 T 20 600 T 20 1000"
          fill="none"
          stroke="#F4845F"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
    </div>
  );
}

// Global Chapter Tracking Pill
export function ChapterPill() {
  const [activeLabel, setActiveLabel] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-chapter]');
      let current = "";
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        // If top is above middle of screen, it's active
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          current = sec.getAttribute('data-chapter') || "";
        }
      });
      setActiveLabel(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    setTimeout(handleScroll, 500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {activeLabel && (
        <motion.div
          className="chapter-indicator"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {activeLabel}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WaveDivider({ color = '#FFFAF7', tiltLeft = false }: { color?: string, tiltLeft?: boolean }) {
  return (
    <div className="wave-container">
      {/* Hand-drawn style slightly asymmetric wave */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ transform: tiltLeft ? 'scaleX(-1)' : 'none' }}>
        <path d="M0,40 C320,80 440,0 720,40 C1000,80 1120,0 1440,30 L1440,80 L0,80 Z" fill={color} />
      </svg>
    </div>
  );
}
