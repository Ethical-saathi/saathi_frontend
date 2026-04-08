import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { OrbEmotion } from './BreathingOrb';
// --- DATA STRUCTURE ---
const sentences = [
  {
    id: 1,
    icon: '☁️',
    cardColor: '#A8C5DA', // Soft blue
    raw: "I don't know why I even bother anymore.",
    words: [
      { text: "I", emotion: "neutral" },
      { text: "don't", emotion: "hopelessness", color: "#C9A0DC" },
      { text: "know", emotion: "neutral" },
      { text: "why", emotion: "neutral" },
      { text: "I", emotion: "neutral" },
      { text: "even", emotion: "underlying anger", color: "#F4845F" },
      { text: "bother", emotion: "hopelessness", color: "#C9A0DC" },
      { text: "anymore.", emotion: "sadness", color: "#A8C5DA" }
    ],
    stats: [
      { label: "Sadness", value: 78, color: "#A8C5DA" },
      { label: "Hopelessness", value: 64, color: "#C9A0DC" },
      { label: "Underlying anger", value: 41, color: "#F4845F" }
    ]
  },
  {
    id: 2,
    icon: '—',
    cardColor: '#F4B860', // Warm amber
    raw: "I'm fine.",
    words: [
      { text: "I'm", emotion: "neutral" },
      { text: "fine.", emotion: "deflection", color: "#7A665A" },
    ],
    stats: [
      { label: "Deflection", value: 89, color: "#7A665A" },
      { label: "Masked Anxiety", value: 65, color: "#F4845F" },
      { label: "Isolation", value: 44, color: "#C9A0DC" }
    ]
  },
  {
    id: 3,
    icon: '☀️',
    cardColor: '#98C9B0', // Soft green
    raw: "I had a good day today.",
    words: [
      { text: "I", emotion: "neutral" },
      { text: "had", emotion: "neutral" },
      { text: "a", emotion: "neutral" },
      { text: "good", emotion: "relief", color: "#F9C784" },
      { text: "day", emotion: "neutral" },
      { text: "today.", emotion: "hope", color: "#98C9B0" }
    ],
    stats: [
      { label: "Relief", value: 82, color: "#F9C784" },
      { label: "Hopefulness", value: 74, color: "#F4B860" },
      { label: "Stability", value: 68, color: "#98C9B0" }
    ]
  }
];

// --- NUMBER COUNTER HOOK ---
function useCounter(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }
    let startTime: number;
    let animId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(ease * target));
      if (progress < 1) animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, duration, trigger]);
  return count;
}


// --- PULSE BAR COMPONENT ---
function PulseBar({ stat, delay, isDone, orbEmotion }: { stat: any, delay: number, isDone: boolean, orbEmotion: OrbEmotion }) {
  const [trigger, setTrigger] = useState(false);
  
  // Breath duration mapping same as Orb
  const breathDur = 
    orbEmotion === 'anxious' ? 2 : 
    orbEmotion === 'heavy' ? 8 : 
    orbEmotion === 'relieved' ? 3 : 
    orbEmotion === 'overwhelmed' ? 1.2 : 6;
    
  const intensity = 
    orbEmotion === 'heavy' ? 0.4 : 
    orbEmotion === 'anxious' ? 1.2 : 1;
  
  useEffect(() => {
    if (isDone) {
      const t = setTimeout(() => setTrigger(true), delay * 1000);
      return () => clearTimeout(t);
    } else {
      setTrigger(false);
    }
  }, [isDone, delay]);

  const count = useCounter(stat.value, 600, trigger);

  // SVG Wave path for clip-path
  const waveId = `wave-clip-${stat.label.replace(/\s+/g, '-')}`;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5C4033' }}>
          {stat.label}
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 16, color: stat.color, fontWeight: 600 }}>
          {count}%
        </span>
      </div>
      
      <div style={{ position: 'relative', height: 12, width: '100%', background: 'rgba(92, 64, 51, 0.05)', borderRadius: 6 }}>
        {/* Invisible SVG definition for the wavy clip path */}
        <svg width="0" height="0">
          <defs>
            <clipPath id={waveId} clipPathUnits="objectBoundingBox">
               <path d="M 0,1 L 0,0.3 Q 0.1,0.6 0.2,0.3 T 0.4,0.3 T 0.6,0.3 T 0.8,0.3 T 1,0.3 L 1,1 Z" />
            </clipPath>
          </defs>
        </svg>

         {/* The Blob Fill */}
        <motion.div
           initial={{ width: '0%' }}
           animate={{ 
             width: trigger ? `${stat.value}%` : '0%',
             opacity: trigger ? (0.85 * (intensity > 1 ? 1 : intensity)) : 0,
             scaleY: trigger ? (orbEmotion === 'heavy' ? 0.8 : (orbEmotion === 'anxious' ? [1, 1.15, 1] : [1, 1.05, 1])) : 1
           }}
           transition={{ 
             width: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
             scaleY: { duration: breathDur, repeat: Infinity, ease: 'easeInOut' }
           }}
           style={{
             position: 'absolute', left: 0, top: -2, bottom: -2,
             background: stat.color,
             borderRadius: 6,
             clipPath: `url(#${waveId})`,
             transformOrigin: 'center'
           }}
        />

        {/* Riding Dot */}
        {trigger && (
          <motion.div
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${stat.value}%`, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
              width: 8, height: 8, borderRadius: '50%', background: 'white',
              boxShadow: `0 0 10px 2px ${stat.color}, 0 0 20px 4px ${stat.color}80`,
              zIndex: 10
            }}
          />
        )}
      </div>
    </div>
  );
}


// --- MAIN ENGINE COMPONENT ---
export default function EmotionEngine() {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<number | null>(null);
  
  // Stages: 'idle' -> 'analyzing' -> 'typing' -> 'tagging' -> 'done'
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'typing' | 'tagging' | 'done'>('idle');
  
  const [typedText, setTypedText] = useState("");
  const activeData = activeId ? sentences.find(s => s.id === activeId)! : sentences[0]; // fallback

  // When a user selects a card, run the exact sequence
  const handleSelect = (id: number) => {
    if (activeId === id) return; // ignore re-clicks
    setActiveId(id);
    setStage('analyzing');
    setTypedText("");
  };

  // State Machine Progression
  useEffect(() => {
    if (stage === 'analyzing') {
      // "One beat" wait (300ms) before typing
      const t = setTimeout(() => setStage('typing'), 300);
      return () => clearTimeout(t);
    }

    if (stage === 'typing') {
      let i = 0;
      const typeInterval = setInterval(() => {
        setTypedText(activeData.raw.slice(0, i + 1));
        i++;
        if (i >= activeData.raw.length) {
          clearInterval(typeInterval);
          setTimeout(() => setStage('tagging'), 200);
        }
      }, 35);
      return () => clearInterval(typeInterval);
    }

    if (stage === 'tagging') {
      // Count out tagged words to stagger reveal them (200ms apart)
      const emotionWords = activeData.words.filter(w => w.emotion !== 'neutral');
      const totalTagTime = emotionWords.length * 200;
      const t = setTimeout(() => setStage('done'), totalTagTime + 300);
      return () => clearTimeout(t);
    }

  }, [stage, activeData, activeId]);

  // Map state to Orb emotion
  let orbEmotion: OrbEmotion = 'happy';

  if (activeId === 1) {
    orbEmotion = 'heavy';
  } else if (activeId === 2) {
    orbEmotion = 'anxious';
  } else if (activeId === 3) {
    orbEmotion = 'relieved';
  }


  return (
    <>
      <style>
        {`
          @keyframes panelBreathe {
            0%, 100% { box-shadow: 0 8px 40px rgba(244,132,95,0.06), inset 0 1px 0 rgba(255,255,255,0.6); }
            50% { box-shadow: 0 8px 60px rgba(201,160,220,0.14), inset 0 1px 0 rgba(255,255,255,0.6); }
          }
          .engine-glass {
            animation: panelBreathe 4s ease-in-out infinite;
          }
        `}
      </style>

      <section id="engine" data-chapter="chapter four · the emotion engine" style={{ padding: isMobile ? '100px 16px' : '160px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', marginBottom: 80 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="chapter-label" style={{ display: 'block', marginBottom: 32 }}>chapter four · the emotion engine</span>
            <h2 className="headline-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
              "Words Carry Emotions.<br/>We Built a System<br/>That Finally Reads Both."
            </h2>
          </motion.div>
        </div>

        {/* CONTAINER FOR PANEL + PILLS */}
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', paddingBottom: 100 }}>
          
          {/* THE ANALYSIS PANEL (Engine Glass) */}
          <div 
            className="engine-glass"
            style={{ 
              background: 'rgba(255, 248, 243, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(244, 132, 95, 0.15)',
              borderRadius: 20,
              minHeight: 400,
              padding: isMobile ? '40px 24px' : '64px 56px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 5
            }}
          >
            {/* SVG Circuit Background (opacity 0.04) */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.04 }}>
              <path d="M 0 50 L 100 50 L 120 80 L 300 80 M 500 20 L 550 20 L 600 100 M 100 200 L 200 200 L 250 150 L 400 150" stroke="#2C1810" strokeWidth="1" fill="none" />
              <circle cx="100" cy="50" r="3" fill="#2C1810" />
              <circle cx="300" cy="80" r="3" fill="#2C1810" />
              <circle cx="500" cy="20" r="3" fill="#2C1810" />
              <circle cx="200" cy="200" r="3" fill="#2C1810" />
            </svg>

            {/* Display Area */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
              
              
              {!activeId ? (
                 <div style={{ 
                    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7A665A', fontStyle: 'italic',
                    paddingTop: 180, zIndex: 10 
                 }}>
                   Waiting for input... Select a thought below.
                 </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Top Text Render Layer */}
                  <div style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, paddingTop: 120 }}>
                    
                    <AnimatePresence mode="popLayout">
                      {stage === 'analyzing' ? (
                        <motion.div 
                          key="analyzing-beat"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          style={{
                             fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#2C1810',
                             display: 'flex', alignItems: 'center', gap: 8
                          }}
                        >
                          <span style={{ fontSize: 10 }}>●</span> Analyzing emotional vectors...
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>_</motion.span>
                        </motion.div>
                      ) : (
                        <motion.h3 
                          key="typed-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="headline-display" 
                          style={{ 
                             fontSize: 'clamp(24px, 3.5vw, 36px)', fontStyle: 'italic', 
                             textAlign: 'center', display: 'flex', flexWrap: 'wrap', 
                             gap: '12px 10px', justifyContent: 'center', alignItems: 'flex-end',
                             lineHeight: 1.2
                          }}
                        >
                          {stage === 'typing' ? (
                            <span>{typedText}<motion.span animate={{opacity: [1, 0]}} transition={{duration: 0.6, repeat: Infinity}} style={{borderRight: '2px solid #F4845F', marginLeft: 2}}/></span>
                          ) : (
                            activeData.words.map((word, i) => {
                               // Calculate stagger delay based on emotion index
                               const emotionWords = activeData.words.filter(w => w.emotion !== 'neutral');
                               const emotionIdx = word.emotion === 'neutral' ? -1 : emotionWords.findIndex(w => w.text === word.text);
                               const tagDelay = emotionIdx >= 0 ? emotionIdx * 0.2 : 0;
                               const isTagged = (stage === 'tagging' || stage === 'done') && word.emotion !== 'neutral';

                               return (
                                 <div key={i} style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                   {/* Floating Tag (Above) */}
                                   <AnimatePresence>
                                     {isTagged && (
                                       <motion.div
                                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                          animate={{ opacity: 1, y: -4, scale: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20, delay: tagDelay }}
                                          style={{
                                            position: 'absolute', top: -18,
                                            fontSize: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                                            textTransform: 'uppercase', letterSpacing: 1, color: word.color, whiteSpace: 'nowrap'
                                          }}
                                       >
                                         {word.emotion}
                                       </motion.div>
                                     )}
                                   </AnimatePresence>

                                   {/* The Word Item (Pill highlight under) */}
                                   <motion.div
                                      initial={false}
                                      animate={isTagged ? { 
                                        backgroundColor: `${word.color}1E`, // approx 12% opacity hex hack
                                        borderColor: `${word.color}4D`,     // 30% border opacity
                                        color: '#2C1810',
                                        padding: '4px 8px',
                                        borderRadius: '8px'
                                      } : {
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent',
                                        color: '#2D1B0E',
                                        padding: '4px 8px',
                                        borderRadius: '8px'
                                      }}
                                      transition={{ duration: 0.3, delay: tagDelay }}
                                      style={{ border: '1px solid transparent' }}
                                   >
                                     {word.text}
                                   </motion.div>
                                 </div>
                               );
                            })
                          )}
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Liquid Fill Bars Area (Only visible when stage processing reaches tagging/done) */}
                  <div style={{ marginTop: 'auto', paddingTop: 40 }}>
                     {(stage === 'tagging' || stage === 'done') && (
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 8 : 40 }}>
                          {activeData.stats.map((stat, i) => (
                            <PulseBar 
                              key={`${activeId}-${stat.label}`} 
                              stat={stat} 
                              delay={i * 0.15} 
                              isDone={stage === 'done' || stage === 'tagging'} 
                              orbEmotion={orbEmotion}
                            />
                          ))}
                        </div>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* THE SENTENCE PILLS (Fanned Cards) */}
          <div style={{ 
             position: isMobile ? 'relative' : 'absolute', 
             bottom: isMobile ? 0 : -30, 
             left: 0, right: 0, 
             display: 'flex', 
             flexDirection: isMobile ? 'column' : 'row',
             justifyContent: 'center', 
             alignItems: 'center',
             gap: isMobile ? 12 : 16,
             marginTop: isMobile ? 32 : 0,
             zIndex: 20
          }}>
            {sentences.map((s, i) => {
              const isActive = activeId === s.id;
              
              // Desktop fanning angles
              let rotation = 0;
              let yOffset = 0;
              if (!isMobile && !isActive) {
                 if (i === 0) { rotation = -4; yOffset = 6; }
                 if (i === 2) { rotation = 4; yOffset = 6; }
              }

              return (
                <motion.button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  whileHover={!isActive ? { y: -6, boxShadow: `0 12px 24px ${s.cardColor}20` } : {}}
                  animate={isActive ? { 
                     y: isMobile ? 0 : -80, // shoots up into the glass panel on desktop
                     scale: 0.95,
                     opacity: 0,
                     rotate: 0,
                     pointerEvents: 'none'
                  } : {
                     y: yOffset,
                     scale: 1,
                     opacity: 1,
                     rotate: rotation,
                     pointerEvents: 'all'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${s.cardColor}`,
                    borderRadius: 16,
                    padding: '16px 20px',
                    width: isMobile ? '100%' : 260,
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px rgba(0,0,0,0.04), 0 4px 16px ${s.cardColor}15`,
                  }}
                >
                   <span style={{ fontSize: 20 }}>{s.icon}</span>
                   <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#3D2C2C', textAlign: 'left', lineHeight: 1.4 }}>
                     "{s.raw}"
                   </span>
                </motion.button>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
