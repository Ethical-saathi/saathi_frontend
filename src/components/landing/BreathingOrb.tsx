import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export type OrbEmotion = 'happy' | 'anxious' | 'heavy' | 'relieved' | 'overwhelmed' | 'grateful' | 'tired';
export type OrbVariant = 'hero' | 'engine' | 'session' | 'support';

interface BreathingOrbProps {
  variant: OrbVariant;
  scale?: number;
  emotionOverride?: OrbEmotion;
  textPrompt?: string;
  onEmotionChange?: (emotion: string) => void;
}

// ─── HERO EMOTION CONFIG (unchanged — hero is frozen) ────────────────────────
const HERO_EMOTION_CONFIG = {
  happy: {
    outerGrad: 'radial-gradient(circle at center, rgba(255,200,180,0.25) 0%, rgba(210,190,255,0.10) 70%)',
    outerBorder: 'rgba(244,132,95,0.18)',
    warmthGrad: 'radial-gradient(circle at center, rgba(255,180,150,0.35) 0%, rgba(220,180,255,0.15) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(255,160,120,0.45) 0%, transparent 70%)',
    breathDuration: 6,
    mouthD: 'M 15 26 Q 30 40 45 26',
    eyeRx: 3, eyeRy: 4, eyeOffsetY: 0,
    cheekOpacity: 0.65,
    browLeftD: null as string | null, browRightD: null as string | null,
    glowColor: 'rgba(244,132,95,0.35)',
    blinks: false, showTears: false,
    bodyScale: [1, 1.05, 1] as number[],
  },
  anxious: {
    outerGrad: 'radial-gradient(circle at center, rgba(244,132,95,0.5) 0%, rgba(220,80,60,0.2) 70%)',
    outerBorder: 'rgba(244,100,70,0.55)',
    warmthGrad: 'radial-gradient(circle at center, rgba(240,100,70,0.55) 0%, rgba(200,70,50,0.25) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(255,120,80,0.75) 0%, transparent 70%)',
    breathDuration: 1.5,
    mouthD: 'M 22 32 Q 30 27 38 32',
    eyeRx: 3, eyeRy: 4.5, eyeOffsetY: 0,
    cheekOpacity: 0.15,
    browLeftD: 'M 15 14 Q 20 11 24 14', browRightD: 'M 36 14 Q 40 11 45 14',
    glowColor: 'rgba(244,80,50,0.7)',
    blinks: true, showTears: false,
    bodyScale: [1, 1.08, 0.96, 1.08, 1] as number[],
  },
  heavy: {
    outerGrad: 'radial-gradient(circle at center, rgba(140,170,200,0.45) 0%, rgba(100,130,170,0.15) 70%)',
    outerBorder: 'rgba(140,170,210,0.3)',
    warmthGrad: 'radial-gradient(circle at center, rgba(130,160,195,0.4) 0%, rgba(110,140,180,0.18) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(110,140,175,0.55) 0%, transparent 70%)',
    breathDuration: 9,
    mouthD: 'M 19 31 Q 30 29 41 31',
    eyeRx: 3, eyeRy: 1.5, eyeOffsetY: 3,
    cheekOpacity: 0.0,
    browLeftD: 'M 15 18 Q 20 20 26 17', browRightD: 'M 34 17 Q 40 20 45 18',
    glowColor: 'rgba(140,170,210,0.25)',
    blinks: false, showTears: false,
    bodyScale: [1, 1.02, 1] as number[],
  },
  tired: {
    outerGrad: 'radial-gradient(circle at center, rgba(180,160,200,0.4) 0%, rgba(150,130,180,0.15) 70%)',
    outerBorder: 'rgba(170,150,200,0.3)',
    warmthGrad: 'radial-gradient(circle at center, rgba(170,150,195,0.38) 0%, rgba(140,120,175,0.15) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(155,135,185,0.5) 0%, transparent 70%)',
    breathDuration: 8,
    mouthD: 'M 20 30 Q 30 27 40 30',
    eyeRx: 3, eyeRy: 2, eyeOffsetY: 2,
    cheekOpacity: 0.08,
    browLeftD: 'M 14 18 Q 20 17 26 19', browRightD: 'M 34 19 Q 40 17 46 18',
    glowColor: 'rgba(160,140,195,0.3)',
    blinks: false, showTears: false,
    bodyScale: [1, 1.03, 1] as number[],
  },
  relieved: {
    outerGrad: 'radial-gradient(circle at center, rgba(255,225,130,0.5) 0%, rgba(255,195,130,0.2) 70%)',
    outerBorder: 'rgba(255,200,100,0.4)',
    warmthGrad: 'radial-gradient(circle at center, rgba(255,215,130,0.55) 0%, rgba(255,185,120,0.25) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(255,200,110,0.7) 0%, transparent 70%)',
    breathDuration: 3.5,
    mouthD: 'M 10 24 Q 30 46 50 24',
    eyeRx: 4, eyeRy: 3.5, eyeOffsetY: -1,
    cheekOpacity: 1.0,
    browLeftD: null as string | null, browRightD: null as string | null,
    glowColor: 'rgba(255,215,100,0.6)',
    blinks: false, showTears: false,
    bodyScale: [1, 1.07, 1] as number[],
  },
  grateful: {
    outerGrad: 'radial-gradient(circle at center, rgba(180,230,200,0.4) 0%, rgba(150,210,180,0.15) 70%)',
    outerBorder: 'rgba(150,210,180,0.35)',
    warmthGrad: 'radial-gradient(circle at center, rgba(160,220,185,0.45) 0%, rgba(130,195,165,0.2) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(140,210,170,0.6) 0%, transparent 70%)',
    breathDuration: 5,
    mouthD: 'M 16 25 Q 30 38 44 25',
    eyeRx: 3.5, eyeRy: 3.5, eyeOffsetY: 0,
    cheekOpacity: 0.5,
    browLeftD: null as string | null, browRightD: null as string | null,
    glowColor: 'rgba(140,210,170,0.45)',
    blinks: false, showTears: false,
    bodyScale: [1, 1.06, 1] as number[],
  },
  overwhelmed: {
    outerGrad: 'radial-gradient(circle at center, rgba(220,80,60,0.55) 0%, rgba(200,60,40,0.25) 70%)',
    outerBorder: 'rgba(220,70,50,0.6)',
    warmthGrad: 'radial-gradient(circle at center, rgba(240,90,65,0.65) 0%, rgba(210,70,50,0.3) 70%)',
    soulGrad: 'radial-gradient(circle at center, rgba(255,100,70,0.85) 0%, transparent 70%)',
    breathDuration: 1.0,
    mouthD: 'M 20 34 Q 30 26 40 34',
    eyeRx: 3.5, eyeRy: 5, eyeOffsetY: -2,
    cheekOpacity: 0.0,
    browLeftD: 'M 14 13 Q 19 9 24 13', browRightD: 'M 36 13 Q 41 9 46 13',
    glowColor: 'rgba(230,70,50,0.8)',
    blinks: true, showTears: true,
    bodyScale: [1, 1.1, 0.92, 1.1, 1] as number[],
  },
};

// ─── NON-HERO SPHERE EMOTION CONFIG ──────────────────────────────────────────
// New visual system: real sphere with inset box-shadow + layered gradients
const SPHERE_EMOTION_CONFIG = {
  happy: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(255,235,220,0.95) 0%, rgba(249,199,132,0.80) 45%, rgba(244,132,95,0.65) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(180,80,40,0.28), inset 10px 10px 20px rgba(255,255,255,0.60), 0 10px 40px rgba(244,132,95,0.35)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(255,220,200,0.35) 0%, rgba(244,132,95,0.08) 60%, transparent 100%)',
    outerGlow: 'rgba(244,132,95,0.30)',
    breathDuration: 4,
    // Large face in 100x60 viewBox
    mouthD: 'M 30 42 Q 50 58 70 42',        // warm smile
    eyeLRy: 6, eyeRRy: 6,                   // normal round eyes
    eyeOffsetY: 0,
    cheekOpacity: 0.45,
    browLeftD: null as string | null,
    browRightD: null as string | null,
    blinks: false, showTears: false,
    bodyScale: [1, 1.05, 1] as number[],
  },
  anxious: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(255,224,204,0.95) 0%, rgba(251,146,60,0.82) 45%, rgba(234,88,12,0.70) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(160,50,10,0.32), inset 10px 10px 20px rgba(255,255,255,0.55), 0 10px 40px rgba(234,88,12,0.38)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(255,200,160,0.40) 0%, rgba(234,88,12,0.10) 60%, transparent 100%)',
    outerGlow: 'rgba(234,88,12,0.35)',
    breathDuration: 1.5,
    mouthD: 'M 32 46 Q 50 38 68 46',        // worried frown
    eyeLRy: 7, eyeRRy: 7,
    eyeOffsetY: 0,
    cheekOpacity: 0.1,
    browLeftD: 'M 27 18 Q 36 13 43 18',     // inner-raised worried brows
    browRightD: 'M 57 18 Q 64 13 73 18',
    blinks: true, showTears: false,
    bodyScale: [1, 1.09, 0.94, 1.09, 1] as number[],
  },
  heavy: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(232,244,253,0.95) 0%, rgba(186,230,253,0.80) 45%, rgba(125,211,252,0.65) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(50,110,160,0.22), inset 10px 10px 20px rgba(255,255,255,0.65), 0 10px 40px rgba(125,211,252,0.25)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(200,230,250,0.35) 0%, rgba(125,211,252,0.08) 60%, transparent 100%)',
    outerGlow: 'rgba(125,211,252,0.25)',
    breathDuration: 7,
    mouthD: 'M 32 48 Q 50 48 68 48',        // flat, barely there
    eyeLRy: 2, eyeRRy: 2,                   // droopy half-closed
    eyeOffsetY: 4,
    cheekOpacity: 0.0,
    browLeftD: 'M 26 20 Q 35 23 44 19',     // drooping sad brows  
    browRightD: 'M 56 19 Q 65 23 74 20',
    blinks: false, showTears: false,
    bodyScale: [1, 1.02, 1] as number[],
  },
  tired: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(240,235,250,0.95) 0%, rgba(196,181,253,0.80) 45%, rgba(167,139,250,0.65) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(100,70,180,0.22), inset 10px 10px 20px rgba(255,255,255,0.60), 0 10px 40px rgba(167,139,250,0.28)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(220,210,250,0.35) 0%, rgba(167,139,250,0.08) 60%, transparent 100%)',
    outerGlow: 'rgba(167,139,250,0.28)',
    breathDuration: 8,
    mouthD: 'M 35 46 Q 50 43 65 46',        // small tired yawn
    eyeLRy: 2.5, eyeRRy: 2.5,              // heavy-lidded
    eyeOffsetY: 3,
    cheekOpacity: 0.06,
    browLeftD: 'M 26 20 Q 35 19 44 21',     // drooping tired brows
    browRightD: 'M 56 21 Q 65 19 74 20',
    blinks: false, showTears: false,
    bodyScale: [1, 1.03, 1] as number[],
  },
  relieved: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(255,248,230,0.95) 0%, rgba(254,215,170,0.82) 45%, rgba(253,186,116,0.68) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(180,110,30,0.28), inset 10px 10px 20px rgba(255,255,255,0.65), 0 12px 44px rgba(253,186,116,0.45)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(255,240,200,0.40) 0%, rgba(253,186,116,0.10) 60%, transparent 100%)',
    outerGlow: 'rgba(253,186,116,0.42)',
    breathDuration: 2.5,
    mouthD: 'M 22 42 Q 50 68 78 42',        // huge beaming grin
    eyeLRy: 4, eyeRRy: 4,                  // squinting happy eyes
    eyeOffsetY: -1,
    cheekOpacity: 0.45,
    browLeftD: null as string | null,
    browRightD: null as string | null,
    blinks: false, showTears: false,
    bodyScale: [1, 1.07, 1] as number[],
  },
  grateful: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(236,253,245,0.95) 0%, rgba(167,243,208,0.80) 45%, rgba(110,231,183,0.65) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(30,140,100,0.20), inset 10px 10px 20px rgba(255,255,255,0.65), 0 10px 40px rgba(110,231,183,0.30)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(200,250,230,0.35) 0%, rgba(110,231,183,0.08) 60%, transparent 100%)',
    outerGlow: 'rgba(110,231,183,0.30)',
    breathDuration: 5,
    mouthD: 'M 28 42 Q 50 58 72 42',        // genuine warm smile
    eyeLRy: 5, eyeRRy: 5,
    eyeOffsetY: 0,
    cheekOpacity: 0.40,
    browLeftD: null as string | null,
    browRightD: null as string | null,
    blinks: false, showTears: false,
    bodyScale: [1, 1.06, 1] as number[],
  },
  overwhelmed: {
    bodyGrad: 'radial-gradient(circle at 35% 30%, rgba(254,232,232,0.95) 0%, rgba(252,165,165,0.82) 45%, rgba(248,113,113,0.70) 100%)',
    boxShadow: 'inset -14px -14px 32px rgba(180,40,40,0.32), inset 10px 10px 20px rgba(255,255,255,0.50), 0 12px 44px rgba(248,113,113,0.40)',
    auraGrad: 'radial-gradient(circle at 38% 35%, rgba(255,210,210,0.40) 0%, rgba(248,113,113,0.10) 60%, transparent 100%)',
    outerGlow: 'rgba(248,113,113,0.38)',
    breathDuration: 0.8,
    mouthD: 'M 35 48 Q 50 38 65 48',        // open stressed
    eyeLRy: 4, eyeRRy: 7,                  // asymmetric wide startled eyes
    eyeOffsetY: -3,
    cheekOpacity: 0.0,
    browLeftD: 'M 26 14 Q 35 9 44 14',      // high raised alarmed brows
    browRightD: 'M 56 14 Q 65 9 74 14',
    blinks: true, showTears: true,
    bodyScale: [1, 1.11, 0.90, 1.11, 1] as number[],
  },
};

export default function BreathingOrb({ variant, scale = 1, emotionOverride, textPrompt, onEmotionChange }: BreathingOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '200px 0px' });
  const isHero = variant === 'hero';

  const [localEmotion, setLocalEmotion] = useState<OrbEmotion>('happy');
  const currentEmotion = emotionOverride || localEmotion;

  // Pick the right config based on variant
  const heroConfig = HERO_EMOTION_CONFIG[currentEmotion];
  const sphereConfig = SPHERE_EMOTION_CONFIG[currentEmotion];

  useEffect(() => {
    if (onEmotionChange) onEmotionChange(currentEmotion);
  }, [currentEmotion, onEmotionChange]);

  // ─── Blink logic ────────────────────────────────────────────────────────────
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkConfig = isHero ? heroConfig : sphereConfig;

  useEffect(() => {
    if (!isInView) return;
    const blinkLoop = () => {
      const nextBlink = blinkConfig.blinks
        ? Math.random() * 2000 + 500
        : Math.random() * 5000 + 2000;
      const t1 = setTimeout(() => {
        setIsBlinking(true);
        if (blinkConfig.blinks && Math.random() > 0.6) {
          setTimeout(() => setIsBlinking(false), 100);
          setTimeout(() => setIsBlinking(true), 200);
          const t2 = setTimeout(() => { setIsBlinking(false); blinkLoop(); }, 350);
          return () => clearTimeout(t2);
        } else {
          const t2 = setTimeout(() => { setIsBlinking(false); blinkLoop(); }, 160);
          return () => clearTimeout(t2);
        }
      }, nextBlink);
      return () => clearTimeout(t1);
    };
    return blinkLoop();
  }, [isInView, blinkConfig.blinks]);

  // ─── Mouse tracking (hero + engine only) ────────────────────────────────────
  const [facePos, setFacePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if ((variant !== 'hero' && variant !== 'engine') || !isInView) return;
    let lastTime = Date.now(), lastX = 0, lastY = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offX = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const offY = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
        setFacePos({ x: Math.max(-1, Math.min(1, offX)) * 8, y: Math.max(-1, Math.min(1, offY)) * 8 });
      }
      if (variant === 'hero' && !emotionOverride) {
        const now = Date.now(), dt = now - lastTime;
        if (dt > 0) {
          const velocity = Math.sqrt((e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2) / dt;
          if (velocity > 2.5) {
            setLocalEmotion('anxious');
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setLocalEmotion('happy'), 3000);
          }
        }
      }
      lastX = e.clientX; lastY = e.clientY; lastTime = Date.now();
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(timeoutId); };
  }, [variant, emotionOverride, isInView]);

  // ─── Session memory echoes ──────────────────────────────────────────────────
  const [echoTag, setEchoTag] = useState<string | null>(null);
  useEffect(() => {
    if (variant !== 'session' || !isInView) return;
    const echoes = ['3 weeks ago · anxious', 'last Tuesday · hopeful', 'yesterday · tired', 'last month · relieved', '2 days ago · heavy'];
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
      const tag = echoes[Math.floor(Math.random() * echoes.length)];
      setEchoTag(null);
      setTimeout(() => setEchoTag(tag), 60);
    }, 5000);
    return () => clearInterval(interval);
  }, [variant, isInView]);

  // ─── Emotion-change key (ripple pulse trigger) ──────────────────────────────
  const [emotionKey, setEmotionKey] = useState(0);
  const prevEmotionRef = useRef(currentEmotion);
  useEffect(() => {
    if (prevEmotionRef.current !== currentEmotion) {
      prevEmotionRef.current = currentEmotion;
      setEmotionKey(k => k + 1);
    }
  }, [currentEmotion]);

  // ─── Early return for off-screen small variants ─────────────────────────────
  if (!isInView && (variant === 'session' || variant === 'support')) {
    return <div ref={containerRef} style={{ width: 100 * scale, height: 100 * scale }} />;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
        transform: `scale(${scale})`, transformOrigin: 'center center',
        width: 480, height: 520, pointerEvents: 'none',
      }}
    >
      {/* ── Hero-Only: orbiting text ring ── */}
      {isHero && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: 620, height: 620, zIndex: 0, opacity: 0.3 }}
        >
          <svg viewBox="0 0 620 620" width="100%" height="100%">
            <defs>
              <path id="circlePath" d="M 310, 310 m -280, 0 a 280,280 0 1,1 560,0 a 280,280 0 1,1 -560,0" />
            </defs>
            <text fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#7A665A" letterSpacing="4" opacity="0.3">
              <textPath href="#circlePath" startOffset="0%">
                listening · remembering · understanding · feeling · listening · remembering · understanding · feeling · listening · remembering · understanding · feeling ·
              </textPath>
            </text>
          </svg>
        </motion.div>
      )}

      {/* ── Overwhelmed spinning ring (both hero + non-hero) ── */}
      {currentEmotion === 'overwhelmed' && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: isHero ? 3 : 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: isHero ? 440 : 380, height: isHero ? 440 : 380,
            borderRadius: '50%',
            border: `2px dashed ${isHero ? 'rgba(244,132,95,0.4)' : 'rgba(248,113,113,0.5)'}`,
            zIndex: 1,
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HERO BODY — old blob structure, COMPLETELY UNCHANGED
          ══════════════════════════════════════════════════════════════════════ */}
      {isHero && (
        <motion.div
          key={`hero-body-${emotionKey}`}
          animate={{ scale: heroConfig.bodyScale }}
          transition={{ duration: heroConfig.breathDuration, ease: 'easeInOut', repeat: Infinity }}
          style={{ position: 'relative', width: 480, height: 520, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* ripple pulse on hero emotion change */}
          {emotionKey > 0 && (
            <motion.div
              key={`hero-ripple-${emotionKey}`}
              initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: `2px solid ${heroConfig.outerBorder}`, zIndex: 0 }}
            />
          )}
          {/* Outer Aura */}
          <motion.div
            animate={{ background: heroConfig.outerGrad, borderColor: heroConfig.outerBorder }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', width: 480, height: 520, borderRadius: '67% 33% 55% 45% / 40% 58% 42% 60%', border: '1px solid', zIndex: 1 }}
          />
          {/* Warmth Layer */}
          <motion.div
            animate={{ background: heroConfig.warmthGrad }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', width: 380, height: 400, borderRadius: '45% 55% 35% 65% / 60% 40% 70% 30%', filter: 'blur(12px)', zIndex: 2 }}
          />
          {/* Soul Glow */}
          <motion.div
            animate={{ background: heroConfig.soulGrad }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', width: 200, height: 220, borderRadius: '50% 50% 40% 60% / 55% 45% 65% 35%', filter: 'blur(30px)', zIndex: 3 }}
          />
          {/* Hero Face */}
          <motion.div
            animate={{ x: facePos.x, y: facePos.y }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{ position: 'absolute', zIndex: 6, bottom: '25%', left: '50%', marginLeft: -30 }}
          >
            <div style={{ position: 'relative', width: 60, height: 60 }}>
              <motion.div
                animate={{ background: `radial-gradient(ellipse at center, ${heroConfig.glowColor} 0%, transparent 60%)` }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', top: -20, left: -30, width: 120, height: 100, filter: 'blur(10px)', zIndex: -1, borderRadius: '50%' }}
              />
              <svg width="60" height="60" viewBox="0 0 60 60" overflow="visible">
                {heroConfig.browLeftD && <motion.path d={heroConfig.browLeftD} animate={{ d: heroConfig.browLeftD }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} fill="none" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />}
                {heroConfig.browRightD && <motion.path d={heroConfig.browRightD} animate={{ d: heroConfig.browRightD }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} fill="none" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />}
                <motion.ellipse cx={20} cy={20 + (heroConfig.eyeOffsetY ?? 0)} animate={{ cy: 20 + (heroConfig.eyeOffsetY ?? 0), rx: heroConfig.eyeRx ?? 3, ry: isBlinking ? 0.2 : (heroConfig.eyeRy ?? 4) }} fill="#5C4033" transition={{ duration: 0.35, type: 'spring', stiffness: 160 }} />
                <motion.ellipse cx={40} cy={20 + (heroConfig.eyeOffsetY ?? 0)} animate={{ cy: 20 + (heroConfig.eyeOffsetY ?? 0), rx: heroConfig.eyeRx ?? 3, ry: isBlinking ? 0.2 : (heroConfig.eyeRy ?? 4) }} fill="#5C4033" transition={{ duration: 0.35, type: 'spring', stiffness: 160 }} />
                <motion.circle cx="10" cy="30" r="7" fill="#F4845F" animate={{ opacity: heroConfig.cheekOpacity }} transition={{ duration: 0.4 }} />
                <motion.circle cx="50" cy="30" r="7" fill="#F4845F" animate={{ opacity: heroConfig.cheekOpacity }} transition={{ duration: 0.4 }} />
                <motion.path d={heroConfig.mouthD} animate={{ d: heroConfig.mouthD }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} fill="none" stroke="#5C4033" strokeWidth="3.5" strokeLinecap="round" />
                {heroConfig.showTears && (
                  <>
                    <motion.ellipse cx={18} cy={28} rx={1.5} ry={3} fill="rgba(140,180,220,0.7)" animate={{ cy: [28, 38], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }} />
                    <motion.ellipse cx={42} cy={28} rx={1.5} ry={3} fill="rgba(140,180,220,0.7)" animate={{ cy: [28, 38], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.6 }} />
                  </>
                )}
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          NON-HERO SPHERE BODY — full redesign with inset box-shadow sphere
          ══════════════════════════════════════════════════════════════════════ */}
      {!isHero && (
        <motion.div
          key={`sphere-body-${emotionKey}`}
          animate={{ scale: sphereConfig.bodyScale }}
          transition={{ duration: sphereConfig.breathDuration, ease: 'easeInOut', repeat: Infinity }}
          style={{ position: 'relative', width: 420, height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Emotion-change ripple pulse */}
          {emotionKey > 0 && (
            <motion.div
              key={`sphere-ripple-${emotionKey}`}
              initial={{ scale: 0.8, opacity: 0.7 }} animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: `2.5px solid ${sphereConfig.outerGlow}`, zIndex: 0 }}
            />
          )}

          {/* Layer 1: Outer Aura — soft diffused halo */}
          <motion.div
            animate={{ background: sphereConfig.auraGrad }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', width: '116%', height: '116%', borderRadius: '50%',
              filter: 'blur(18px)', zIndex: 1, opacity: 0.9,
            }}
          />

          {/* Layer 2: Main Sphere Body — the centrepiece with REAL 3D illusion */}
          <motion.div
            animate={{ background: sphereConfig.bodyGrad, boxShadow: sphereConfig.boxShadow }}
            transition={{ duration: 0.45 }}
            style={{
              position: 'absolute', width: '82%', height: '82%', borderRadius: '50%',
              zIndex: 2,
            }}
          />

          {/* Layer 3: Specular Highlight — top-left bright dot (the "forehead") */}
          <div style={{
            position: 'absolute', width: '22%', height: '22%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.92), rgba(255,255,255,0.20) 60%, transparent)',
            top: '9%', left: '15%', filter: 'blur(3px)', zIndex: 3,
          }} />

          {/* Layer 4: Face — 55% wide, positioned in lower half of sphere */}
          <motion.div
            animate={{ x: facePos.x, y: facePos.y }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{
              position: 'absolute', zIndex: 6,
              width: '55%',
              top: '42%',
              left: '50%', transform: 'translateX(-50%)',
            }}
          >
            <svg
              viewBox="0 0 100 60"
              width="100%" height="100%"
              overflow="visible"
              style={{ display: 'block' }}
            >
              {/* Eyebrows */}
              {sphereConfig.browLeftD && (
                <motion.path
                  d={sphereConfig.browLeftD}
                  animate={{ d: sphereConfig.browLeftD }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  fill="none" stroke="rgba(120,60,30,0.80)" strokeWidth="3" strokeLinecap="round"
                />
              )}
              {sphereConfig.browRightD && (
                <motion.path
                  d={sphereConfig.browRightD}
                  animate={{ d: sphereConfig.browRightD }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  fill="none" stroke="rgba(120,60,30,0.80)" strokeWidth="3" strokeLinecap="round"
                />
              )}

              <motion.ellipse
                cx={35}
                cy={22 + (sphereConfig.eyeOffsetY ?? 0)}
                animate={{
                  cy: 22 + (sphereConfig.eyeOffsetY ?? 0),
                  rx: 5,
                  ry: isBlinking ? 0.3 : (sphereConfig.eyeLRy ?? 6),
                }}
                fill="rgba(120,60,30,0.78)"
                transition={{ duration: 0.3, type: 'spring', stiffness: 180 }}
              />
              {/* Right Eye */}
              <motion.ellipse
                cx={65}
                cy={22 + (sphereConfig.eyeOffsetY ?? 0)}
                animate={{
                  cy: 22 + (sphereConfig.eyeOffsetY ?? 0),
                  rx: 5,
                  ry: isBlinking ? 0.3 : (sphereConfig.eyeRRy ?? 6),
                }}
                fill="rgba(120,60,30,0.78)"
                transition={{ duration: 0.3, type: 'spring', stiffness: 180 }}
              />

              {/* Cheeks — large, warm blush */}
              <motion.circle cx={22} cy={32} r={10} fill="rgba(244,132,95,0.28)"
                animate={{ opacity: sphereConfig.cheekOpacity / 0.45 }} transition={{ duration: 0.45 }} />
              <motion.circle cx={78} cy={32} r={10} fill="rgba(244,132,95,0.28)"
                animate={{ opacity: sphereConfig.cheekOpacity / 0.45 }} transition={{ duration: 0.45 }} />

              {/* Mouth */}
              <motion.path
                d={sphereConfig.mouthD}
                animate={{ d: sphereConfig.mouthD }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                fill="none" stroke="rgba(120,60,30,0.72)" strokeWidth="4" strokeLinecap="round"
              />

              {/* Tears (overwhelmed) */}
              {sphereConfig.showTears && (
                <>
                  <motion.ellipse cx={32} cy={30} rx={2} ry={4}
                    fill="rgba(140,180,220,0.75)"
                    animate={{ cy: [30, 50], opacity: [0.85, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
                  />
                  <motion.ellipse cx={68} cy={30} rx={2} ry={4}
                    fill="rgba(140,180,220,0.75)"
                    animate={{ cy: [30, 50], opacity: [0.85, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn', delay: 0.55 }}
                  />
                </>
              )}
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAYS (speech bubble, echoes, labels)
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Speech Bubble ("Are you sure?" etc.) */}
      <AnimatePresence>
        {textPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -40 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute', top: '10%', right: '-10%',
              background: '#FFFAF7', padding: '8px 16px',
              borderRadius: '18px 18px 18px 5px',
              border: '1.5px solid rgba(160,140,128,0.18)',
              boxShadow: '0 8px 28px rgba(92,64,51,0.10)',
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 24,
              color: '#5C4033', zIndex: 20, whiteSpace: 'nowrap', pointerEvents: 'none',
            }}
          >
            {textPrompt}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Memory Echo Tags — styled as chips */}
      <AnimatePresence>
        {echoTag && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.85, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 28,
              fontWeight: 600, color: '#8B6152',
              background: 'rgba(255,235,220,0.78)',
              borderRadius: 28, padding: '6px 22px',
              border: '1px solid rgba(244,132,95,0.18)',
              backdropFilter: 'blur(6px)',
              pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 10,
              boxShadow: '0 4px 16px rgba(244,132,95,0.12)',
            }}
          >
            {echoTag}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label: "AI Saathi is reading this" */}
      {variant === 'engine' && (
        <div style={{
          position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, opacity: 0.5,
          whiteSpace: 'nowrap', color: '#5C4033',
        }}>
          AI Saathi is reading this
        </div>
      )}

      {/* Label: "remembering your journey" */}
      {variant === 'session' && (
        <div style={{
          position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 500, opacity: 0.42,
          whiteSpace: 'nowrap', color: '#5C4033',
        }}>
          remembering your journey
        </div>
      )}
    </div>
  );
}
