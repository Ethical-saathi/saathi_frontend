import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ── BLUR-TO-SHARP TEXT REVEAL ──
export function BlurText({
  text, stagger = 0.04, delay = 0, className = "", style = {}
}: { text: string; stagger?: number; delay?: number; className?: string; style?: React.CSSProperties }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay * i }
    })
  };

  const child = {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring' as const, damping: 20, stiffness: 100 }
    }
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em', ...style }}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} style={{ display: 'inline-flex' }}>
          <span dangerouslySetInnerHTML={{ __html: word.replace(/\n/g, '<br/>') }} />
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── SCRAMBLE-TO-SNAP NUMBER REVEAL ──
export function ScrambleNumber({
  value, label, suffix = "", className = "", style = {}
}: { value: string | number; label: string; suffix?: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState("0");
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    if (!inView) return;
    
    // Scale spring
    setScale(1);

    const valStr = String(value);
    const chars = "0123456789";
    let iterations = 0;
    const maxIterations = 20;

    const interval = setInterval(() => {
      setDisplay(() => {
        return valStr.split('').map((char, index) => {
          if (char === '.' || char === 'M' || char === 'k') return char; // skip non-digits
          if (index < iterations / maxIterations * valStr.length) {
            return valStr[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
      });

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplay(valStr);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div ref={ref} className={className} style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <motion.div
        animate={{ scale, opacity: inView ? 1 : 0.5 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900,
          color: '#F4845F', transformOrigin: 'left bottom',
          lineHeight: 0.9, whiteSpace: 'nowrap'
        }}
      >
        {display}<span style={{ display: 'inline-block', opacity: inView ? 1 : 0 }}>{suffix}</span>
      </motion.div>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#A08C80',
            marginTop: 16, zIndex: 2
          }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

// ── 3D CARD BLOOM WRAPPER ──
export function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [inViewHover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !glowRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-10 to 10 deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Move bloom
    glowRef.current.style.left = `${x}px`;
    glowRef.current.style.top = `${y}px`;
    glowRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    setHover(false);
    if (!ref.current || !glowRef.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    glowRef.current.style.opacity = '0';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
      className={`glass-blob-card ${className}`}
      style={{
        ...style,
        transition: inViewHover ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
    >
      <div ref={glowRef} className="bloom-glow" />
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </motion.div>
  );
}
