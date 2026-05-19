import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlurText } from './Effects';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import BreathingOrb, { type OrbEmotion } from './BreathingOrb';

const pillEmotionMap: Record<string, OrbEmotion> = {
  anxiety:     'anxious',      // orange, worried brows, frown, fast breath
  hope:        'relieved',     // warm gold, big beaming smile, squinty eyes
  tired:       'tired',        // purple-lavender, half-closed heavy eyes, droopy brows
  grateful:    'grateful',     // soft green, warm eyes, genuine smile
  overwhelmed: 'overwhelmed',  // deep red, wide startled eyes, tears, erratic breath
  healing:     'relieved'      // warm gold, same as hope — recovery
};

const emotionPills = [
  { id: 'anxiety', label: 'anxiety', className: 'pill-anxiety', top: '15%', left: '12%', stagger: 0 },
  { id: 'hope', label: 'hope', className: 'pill-hope', top: '20%', left: '70%', stagger: 0.2 },
  { id: 'tired', label: 'tired', className: 'pill-tired', top: '45%', left: '5%', stagger: 0.4 },
  { id: 'grateful', label: 'grateful', className: 'pill-grateful hidden md:block', top: '55%', left: '75%', stagger: 0.6 },
  { id: 'overwhelmed', label: 'overwhelmed', className: 'pill-overwhelmed hidden md:block', top: '75%', left: '8%', stagger: 0.8 },
  { id: 'healing', label: 'healing', className: 'pill-healing', top: '80%', left: '60%', stagger: 1.0 },
];

const particles = [
  { id: 1, size: 4, top: '20%', left: '30%', color: '#8B4E41', duration: 12, drift: 1 },
  { id: 2, size: 3, top: '40%', left: '70%', color: '#45678A', duration: 9, drift: 2 },
  { id: 3, size: 5, top: '60%', left: '20%', color: '#625178', duration: 14, drift: 3 },
  { id: 4, size: 4, top: '80%', left: '60%', color: '#A67632', duration: 10, drift: 1 },
  { id: 5, size: 3, top: '30%', left: '80%', color: '#75486B', duration: 13, drift: 2 },
  { id: 6, size: 5, top: '50%', left: '10%', color: '#4A7A61', duration: 11, drift: 3 },
  { id: 7, size: 4, top: '70%', left: '80%', color: '#8B4E41', duration: 8, drift: 1 },
  { id: 8, size: 3, top: '25%', left: '50%', color: '#45678A', duration: 12, drift: 2 },
  { id: 9, size: 5, top: '85%', left: '35%', color: '#625178', duration: 10, drift: 3 },
  { id: 10, size: 4, top: '15%', left: '60%', color: '#A67632', duration: 14, drift: 1 },
];

export default function Hero() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, isMobile ? 40 : 150]); 
  const yVisual = useTransform(scrollY, [0, 1000], [0, isMobile ? 20 : 100]); 

  const [activePillId, setActivePillId] = useState<string | null>(null);
  const [userSelectedEmotion, setUserSelectedEmotion] = useState<OrbEmotion | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePillClick = (pillId: string) => {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    
    setActivePillId(pillId);
    setUserSelectedEmotion(pillEmotionMap[pillId] || 'happy');
    
    clickTimeoutRef.current = setTimeout(() => {
      setActivePillId(null);
      setUserSelectedEmotion(null);
      clickTimeoutRef.current = null;
    }, 5000); // Resume normal after 5 seconds
  };

  useEffect(() => {
    // Start interval after initial entrance animations complete
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (clickTimeoutRef.current) return; // Skip auto-highlight if user overriding

        setActivePillId(prev => {
          let randomPill;
          do {
            randomPill = emotionPills[Math.floor(Math.random() * emotionPills.length)].id;
          } while (randomPill === prev);
          
          // Clear active state after 0.8s
          setTimeout(() => {
            setActivePillId(curr => curr === randomPill ? null : curr);
          }, 800);
          return randomPill;
        });
      }, 7000); 
      return () => clearInterval(interval);
    }, 4500); 
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="hero" data-chapter="" style={{
      position: 'relative', width: '100%', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '120px 24px 0px' : '160px 48px 0px', overflow: 'hidden'
    }} className="flex-col md:flex-row">
      
      {/* 55% Left: COPY (UNCHANGED) */}
      <motion.div 
        style={{ y: yText, width: '100%', maxWidth: isMobile ? '100%' : '55%', zIndex: 10, alignSelf: 'center' }}
        className="mb-20 md:mb-0 md:pr-16"
      >
        <div style={{ position: 'relative' }}>
          <h1 className="headline-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.05 }}>
            <BlurText text="The AI That Doesn't" stagger={0.12} delay={2.6} />
            <br />
            <BlurText text="Just Hear You —" stagger={0.12} delay={3.08} />
            <br />
            <BlurText text="It" stagger={0.12} delay={3.56} />
            <motion.span 
              initial={{ scale: 0.7, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 3.8, duration: 1.2, type: 'spring', damping: 15, stiffness: 80 }}
              style={{ display: 'inline-block', color: '#F4845F', marginLeft: '0.25em' }}
            >
              Remembers
            </motion.span>
            <br/>
            <BlurText text="How You Feel." stagger={0.08} delay={4.2} />
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 1 }}
          className="body-airy"
          style={{ fontSize: 18, marginTop: 40, maxWidth: 480 }}
        >
          AI Saathi understands your emotions, tracks your mental journey across time, 
          and responds like someone who has known you for years — not just seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.4, duration: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 56 }}
        >
          <a onClick={(e) => { e.preventDefault(); navigate('/onboarding'); }} data-hover className="journey-btn" style={{
            padding: '22px 36px', fontSize: 18, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', cursor: 'pointer'
          }}>
            Walk This Journey Together →
          </a>
          
          <a onClick={(e) => { e.preventDefault(); navigate('/how-it-works'); }} data-hover className="nav-link" style={{ 
            fontSize: 16, color: '#7A665A', borderBottom: '1px solid rgba(160,140,128,0.3)', paddingBottom: 4, cursor: 'pointer' 
          }}>
            Watch how it works ↓
          </a>
        </motion.div>
      </motion.div>

      {/* 45% Right: LIVING VISUAL */}
      <motion.div 
        style={{ y: yVisual, flex: 1, height: isMobile ? '60vh' : '80vh', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 2 }}
        className="w-full md:w-auto mt-16 md:mt-0 hero-visual-container"
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: 500, height: '80%', minHeight: isMobile ? 400 : 600, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: isMobile ? 'scale(0.8)' : 'none' }}>
          
          {/* Orb Layer */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BreathingOrb variant="hero" scale={0.75} emotionOverride={userSelectedEmotion || undefined} />
          </div>

          {/* L4: Particles */}
          <div className="particles-container" style={{ position: 'absolute', inset: 0, zIndex: 4, overflow: 'visible', pointerEvents: 'none' }}>
            {particles.map(p => (
              <div key={p.id} className="particle" style={{
                width: p.size, height: p.size, background: p.color,
                top: p.top, left: p.left,
                animation: `particle-drift-${p.drift} ${p.duration}s infinite ease-in-out`
              }}></div>
            ))}
          </div>

          {/* L5: Emotion Pills */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 7 }}>
            {emotionPills.map((pill) => (
              <motion.div
                key={pill.id}
                onClick={() => handlePillClick(pill.id)}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: activePillId === pill.id ? undefined : 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ 
                  delay: 3 + pill.stagger, 
                  type: 'spring', stiffness: 120, damping: 14 
                }}
                className={`emotion-pill-base ${pill.className} ${activePillId === pill.id ? 'pill-active-moment pill-active-' + pill.id : ''}`}
                style={{ top: pill.top, left: pill.left, cursor: 'pointer' }}
              >
                {pill.label}
              </motion.div>
            ))}
          </div>

          {/* Micro-copy Voice */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 5.5, duration: 2 }}
             style={{
               position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)',
               fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300,
               letterSpacing: 0.5, color: 'rgba(160,140,128,0.6)', whiteSpace: 'nowrap'
             }}
          >
            what are you feeling right now?
          </motion.div>

        </div>
      </motion.div>

      {/* Down Scroll Indicator (UNCHANGED) */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5, duration: 1 }}
        style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
      >
        <span style={{ fontSize: 12, color: '#7A665A', fontWeight: 300, letterSpacing: 1 }}>scroll to understand</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7A665A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </motion.div>
      </motion.div>

    </section>
  );
}
