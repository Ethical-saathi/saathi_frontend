import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useState, useRef, useEffect, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════════
   CHAPTER 6 — "THE HANDOFF"
   The moment the AI steps aside and a real human enters.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── Typing indicator component ──────────────────────────────────────────────
function TypingIndicator({ color = '#7A665A' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: color,
          }}
        />
      ))}
    </div>
  );
}

// ─── AI Message Bubble ───────────────────────────────────────────────────────
function AIBubble({ text, timestamp, softer = false }: { text: string; timestamp: string; softer?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: `linear-gradient(135deg, rgba(201,160,220,${softer ? 0.15 : 0.22}), rgba(168,218,220,${softer ? 0.10 : 0.16}))`,
        border: `1px solid rgba(201,160,220,${softer ? 0.18 : 0.25})`,
        borderRadius: '16px 16px 16px 4px',
        padding: '12px 16px',
        maxWidth: '82%',
        alignSelf: 'flex-start',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: '#3D2C2C',
        lineHeight: 1.65,
        position: 'relative' as const,
      }}
    >
      {text}
      <div style={{
        fontSize: 10, color: '#7A665A', marginTop: 6, textAlign: 'right',
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
      }}>
        {timestamp}
      </div>
    </motion.div>
  );
}

// ─── Human Message Bubble ────────────────────────────────────────────────────
function HumanBubble({ lines }: { lines: { text: string; delay: number }[] }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((line, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), line.delay * 1000);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', maxWidth: '86%', alignItems: 'flex-end' }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #F4845F, #F9C784)',
        borderRadius: '16px 16px 4px 16px',
        padding: '14px 18px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: 'white',
        fontWeight: 500,
        lineHeight: 1.65,
        boxShadow: '0 4px 16px rgba(244, 132, 95, 0.25)',
        flex: 1,
      }}>
        {lines.map((line, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < visibleLines ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'block' }}
          >
            {line.text}
          </motion.span>
        ))}
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 6, textAlign: 'right',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          2:45 PM
        </div>
      </div>
      {/* Therapist avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #F9C784, #F4845F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 600, color: 'white', letterSpacing: '0.05em',
        }}
      >
        Dr. A
      </motion.div>
    </motion.div>
  );
}

// ─── Warmth particles ────────────────────────────────────────────────────────
function WarmthParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      left: 20 + Math.random() * 60,
      size: 6 + Math.random() * 2,
      delay: i * 0.6,
      duration: 3.5 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.10,
    })), []);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -60, opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'rgba(244, 132, 95, 0.5)'
              : 'rgba(249, 199, 132, 0.5)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}

// ─── The Chat Window (centre of the section) ────────────────────────────────
function HandoffChat({ isMobile, onWarmShift }: { isMobile: boolean; onWarmShift?: () => void }) {
  const chatRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chatRef, { once: true, margin: '-15%' });

  // Detect prefers-reduced-motion
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  // ── PHASE MANAGEMENT ──
  // Mobile: reduce delays by 20%
  const dm = isMobile ? 0.8 : 1.0;

  const [phase, setPhase] = useState(0);        // 0=waiting, 1=typing1, 2=msg1, 3=typing2, 4=msg2, 5=detection-typing, 6=detection-msg, 7=silence, 8=human-entry, 9=complete
  const [showTyping, setShowTyping] = useState(false);
  const [showDetectionGlow, setShowDetectionGlow] = useState(false);
  const [headerName, setHeaderName] = useState<'ai' | 'crossfade' | 'human'>('ai');
  const [showPresenceDot, setShowPresenceDot] = useState(false);
  const [showHumanBubble, setShowHumanBubble] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // If reduced motion: skip to final state
  useEffect(() => {
    if (isInView && prefersReduced) {
      setPhase(9);
      setHeaderName('human');
      setShowPresenceDot(true);
      setShowHumanBubble(true);
      onWarmShift?.();
    }
  }, [isInView, prefersReduced]);

  // Full animation sequence
  useEffect(() => {
    if (!isInView || prefersReduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms * dm); timers.push(id); return id; };

    // Phase 1: Show typing then first AI message
    t(() => { setPhase(1); setShowTyping(true); }, 400);
    t(() => { setShowTyping(false); setPhase(2); }, 1800);

    // Typing then second AI message
    t(() => { setShowTyping(true); setPhase(3); }, 2400);
    t(() => { setShowTyping(false); setPhase(4); }, 3800);

    // Phase 2: Detection — long typing pause + amber glow
    t(() => { setShowTyping(true); setPhase(5); }, 6300);
    t(() => { setShowDetectionGlow(true); }, 7300);
    t(() => { setShowDetectionGlow(false); }, 7900);
    t(() => { setShowTyping(false); setPhase(6); }, 8300);

    // Phase 3: The Silence — 800ms of nothing
    t(() => { setPhase(7); }, 9600);
    // Header crossfade begins
    t(() => { setHeaderName('crossfade'); }, 9900);
    t(() => { setHeaderName('human'); setShowPresenceDot(true); }, 10400);

    // Phase 4: Human entry
    t(() => { setPhase(8); setShowHumanBubble(true); }, 10800);

    // Phase 5: Ambient shift
    t(() => { setShowParticles(true); onWarmShift?.(); setPhase(9); }, 11200);

    return () => timers.forEach(clearTimeout);
  }, [isInView, prefersReduced, dm]);

  // Determine which messages to show
  const showMsg1 = phase >= 2;
  const showMsg2 = phase >= 4;
  const showMsg3 = phase >= 6;

  return (
    <div ref={chatRef} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      {/* Detection amber glow behind window */}
      <AnimatePresence>
        {showDetectionGlow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              width: isMobile ? '90%' : 560,
              height: 400,
              borderRadius: 30,
              background: 'radial-gradient(ellipse, rgba(255,180,100,0.35), transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Warmth particles */}
      {showParticles && <WarmthParticles />}

      {/* ──── THE CHAT WINDOW ──── */}
      <motion.div
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: isMobile ? 'calc(100% - 32px)' : 520,
          minHeight: 320,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: 20,
          border: '1.5px solid rgba(244, 132, 95, 0.12)',
          boxShadow: '0 12px 60px rgba(244,132,95,0.10), 0 4px 16px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.95) inset',
          overflow: 'hidden',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(244,132,95,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255,255,255,0.6)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 52,
        }}>
          {/* Window dots */}
          <div style={{ display: 'flex', gap: 5, marginRight: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(244,132,95,0.35)' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(249,199,132,0.35)' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(168,218,220,0.35)' }} />
          </div>

          {/* Title — crossfade between AI and Human */}
          <div style={{ position: 'relative', flex: 1 }}>
            <motion.span
              animate={{
                opacity: headerName === 'ai' ? 1 : 0,
                y: headerName === 'ai' ? 0 : -8,
              }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#3D2C2C',
                position: headerName !== 'ai' ? 'absolute' : 'relative',
                left: 0, top: 0,
              }}
            >
              AI Saathi
            </motion.span>
            <motion.span
              animate={{
                opacity: headerName === 'human' ? 1 : 0,
                y: headerName === 'human' ? 0 : 8,
              }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#3D2C2C',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                position: headerName !== 'human' ? 'absolute' : 'relative',
                left: 0, top: 0,
              }}
            >
              Dr. Ananya M.
              <span style={{
                fontSize: 11,
                fontWeight: 400,
                color: '#7A665A',
              }}>
                · Licensed Therapist
              </span>
              {/* Presence dot */}
              <AnimatePresence>
                {showPresenceDot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="presence-dot-live"
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#4CAF50',
                      boxShadow: '0 0 0 2px rgba(76,175,80,0.2)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.span>
          </div>
        </div>

        {/* ── CHAT BODY ── */}
        <div style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 240,
        }}>
          {/* Message 1 */}
          <AnimatePresence>
            {showMsg1 && (
              <AIBubble
                text="It sounds like today has been really heavy."
                timestamp="2:41 PM"
              />
            )}
          </AnimatePresence>

          {/* Message 2 */}
          <AnimatePresence>
            {showMsg2 && (
              <AIBubble
                text="You're not alone in feeling this way."
                timestamp="2:42 PM"
              />
            )}
          </AnimatePresence>

          {/* Message 3 — The detection message (softer) */}
          <AnimatePresence>
            {showMsg3 && (
              <AIBubble
                text="I want to make sure you have the right support right now. I'm connecting you with someone who can help."
                timestamp="2:44 PM"
                softer
              />
            )}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {showTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ alignSelf: 'flex-start' }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Human bubble */}
          <AnimatePresence>
            {showHumanBubble && (
              <HumanBubble
                lines={[
                  { text: "Hi. I'm here.", delay: 0 },
                  { text: "You don't have to explain anything — I've already been briefed.", delay: 0.3 * dm },
                  { text: "How are you feeling right now?", delay: 0.8 * dm },
                ]}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Breathing Heartbeat Line ────────────────────────────────────────────────
function BreathLine() {
  return (
    <motion.div
      animate={{ width: [48, 80, 48] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #F4845F, transparent)',
        margin: '40px auto 0',
        borderRadius: 2,
      }}
    />
  );
}


/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — Therapists (Chapter 5 + Chapter 6)
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function Therapists() {
  const isMobile = useIsMobile();

  const chatSectionRef = useRef<HTMLDivElement>(null);

  // Background warmth shift — triggered by child HandoffChat
  const [bgWarm, setBgWarm] = useState(false);

  return (
    <>
      {/* ═══════════════════════ CHAPTER FIVE — SESSION MEMORY ═══════════════════ */}
      <section id="sessions" data-chapter="chapter five · memory" style={{ padding: isMobile ? '80px 24px' : '160px 48px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Floating Quotes Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none', zIndex: -1 }}>
          <motion.div animate={{ y: ['100vh', '-200px'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="quote-fragment" style={{ position: 'absolute', left: '10%', fontSize: 24 }}>"you mentioned feeling trapped"</motion.div>
          <motion.div animate={{ y: ['100vh', '-200px'] }} transition={{ duration: 32, repeat: Infinity, delay: 5, ease: 'linear' }} className="quote-fragment" style={{ position: 'absolute', right: '15%', fontSize: 20 }}>"last week you said things felt lighter"</motion.div>
          <motion.div animate={{ y: ['100vh', '-200px'] }} transition={{ duration: 28, repeat: Infinity, delay: 12, ease: 'linear' }} className="quote-fragment" style={{ position: 'absolute', left: '40%', fontSize: 18 }}>"it sounds like you are still holding onto that"</motion.div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 120, position: 'relative' }}>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="chapter-label" style={{ display: 'block', marginBottom: 32 }}>chapter five · memory</span>
            <h2 className="headline-display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontStyle: 'italic', marginBottom: 48 }}>
              "Last Week, You Told<br/>Us About Your Father.<br/>We Haven't <span className="ghosted-text">Forgotten</span>."
            </h2>
            <div className="body-airy" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p>Every conversation you've had —<br/>every emotion you've expressed,<br/>every breakthrough, every hard day —<br/>is remembered and carried into your next session.</p>
              <p style={{ fontWeight: 500, color: '#F4845F' }}>No re-explaining. No starting over.</p>
              <p>Just continuation. Just care.</p>
            </div>
          </motion.div>
        </div>

        {/* Floating Timeline Thread */}
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', height: isMobile ? 180 : 240, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* SVG Pen stroke thread */}
          {!isMobile && (
            <div style={{ position: 'absolute', top: '50%', left: 40, right: 40, height: 40, transform: 'translateY(-50%)', zIndex: 0 }}>
              <svg viewBox="0 0 1000 40" preserveAspectRatio="none" width="100%" height="100%">
                <motion.path
                  d="M 0 20 Q 250 -20 500 20 T 1000 20"
                  fill="transparent" stroke="#F4845F" strokeWidth="2" strokeDasharray="8 8" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                />
              </svg>
            </div>
          )}

          {[
            { n: 1, date: "OCT 14", glow: false },
            { n: 2, date: "OCT 21", glow: false },
            { n: 3, date: "TODAY", glow: true }
          ].map((session, i) => (
            <motion.div
              key={session.n}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.4, type: 'spring', damping: 20 }}
              className={`blob-shape-${(i%3)+1}`}
              style={{
                width: i === 2 ? (isMobile ? 110 : 160) : (isMobile ? 90 : 130), 
                height: i === 2 ? (isMobile ? 110 : 160) : (isMobile ? 90 : 130),
                background: session.glow ? 'linear-gradient(135deg, rgba(255,250,247,0.9), rgba(244,132,95,0.1))' : 'rgba(255,250,247,0.8)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: session.glow ? '2px solid rgba(244,132,95,0.4)' : '1px solid rgba(160,140,128,0.2)',
                boxShadow: session.glow ? '0 16px 48px rgba(244,132,95,0.2)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
            >
              <div style={{ fontSize: isMobile ? 9 : 11, fontWeight: 700, color: session.glow ? '#E06B45' : '#7A665A', letterSpacing: 2 }}>{session.date}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: session.glow ? (isMobile ? 32 : 48) : (isMobile ? 24 : 36), fontWeight: 900, color: '#2D1B0E', marginTop: 8 }}>{session.n}</div>
              
              {/* Unique micro waveform per session */}
              {!isMobile && (
                <svg width="60" height="20" viewBox="0 0 60 20" style={{ marginTop: 12 }}>
                  <path d={`M0,10 Q${10+i*5},${i===1?0:20} ${20+i*5},10 T60,10`} fill="none" stroke={session.glow ? "#F4845F" : "#7A665A"} strokeWidth="1.5" strokeLinecap="round" opacity={session.glow ? 1 : 0.4}/>
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Background Transition Hint */}
      <div style={{ position: 'relative', width: '100%', height: 80, background: 'linear-gradient(to bottom, transparent, #FFF8F4)', zIndex: 0 }} />

      {/* ═══════════════════════ CHAPTER SIX — HUMAN SUPPORT: THE HANDOFF ═══════ */}
      <section
        id="therapists"
        data-chapter="chapter six · human support"
        ref={chatSectionRef}
        style={{
          padding: isMobile ? '80px 16px 120px' : '120px 48px 200px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient background — warm shift */}
        <motion.div
          animate={{
            background: bgWarm
              ? 'linear-gradient(180deg, #FFF8F4 0%, #FFF3EC 50%, #FFF8F4 100%)'
              : '#FFF8F4',
          }}
          transition={{ duration: 3 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* ── TOP COPY ── */}
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, marginBottom: isMobile ? 40 : 64 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="chapter-label" style={{ display: 'block', marginBottom: 32 }}>chapter six · human support</span>
            <h2 className="headline-display" style={{ fontSize: 'clamp(36px, 5vw, 52px)', marginBottom: 24 }}>
              "Because Some Moments<br/>Need a Human Heart."
            </h2>
            <p className="body-airy" style={{
              fontSize: 17, maxWidth: 480, margin: '0 auto',
              color: '#7A665A', opacity: 0.6,
            }}>
              AI Saathi knows its limits.
            </p>
          </motion.div>
        </div>

        {/* ── THE CHAT WINDOW ── */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 600, margin: '0 auto' }}>
          <HandoffChat isMobile={isMobile} onWarmShift={() => setBgWarm(true)} />

          {/* Breath line beneath chat */}
          <BreathLine />
        </div>

        {/* ── BOTTOM SUPPORTING COPY ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            maxWidth: 480, textAlign: 'center', margin: '0 auto',
            marginTop: isMobile ? 48 : 72,
            position: 'relative', zIndex: 10,
          }}
        >
          <p className="body-airy" style={{ fontSize: 16, lineHeight: 1.85 }}>
            When the system detects a crisis — when the signals go beyond what any AI should handle — a real, licensed human therapist enters the conversation. Seamlessly. Immediately. Without you having to ask.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: '#7A665A',
            opacity: 0.4,
            marginTop: 32,
            lineHeight: 1.8,
          }}>
            This is the safety net we built not because we had to —<br/>
            but because we believe no one should face their darkest moments alone.
          </p>
        </motion.div>
      </section>
    </>
  );
}
