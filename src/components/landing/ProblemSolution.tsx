import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import Logo from './Logo';
import { WaveDivider } from './Visuals';
import EmotionWaveform from './EmotionWaveform';

const SESSIONS = [1, 12, 31, 47, 68, 89, 103, 108];
const MESSAGE = "Hi… I've been feeling really anxious lately.";

function InteractiveChatLoop() {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'loop' | 'breaking' | 'broken'>('loop');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [dotCount, setDotCount] = useState(1);
  const [shatterStep, setShatterStep] = useState(-1);

  // Typewriter effect
  useEffect(() => {
    if (phase === 'broken') return;
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(MESSAGE.slice(0, i + 1));
      i++;
      if (i >= MESSAGE.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [currentIndex, phase]);

  // AI thinking dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(d => (d === 3 ? 1 : d + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleNextSession = () => {
    if (phase === 'broken') return;

    if (currentIndex >= SESSIONS.length - 2) {
      if (currentIndex === SESSIONS.length - 2) {
        // This click pushes to the final state (Session 108)
        setPhase('broken');
        triggerShatterSequence();
        return;
      }
      setPhase('breaking');
    }
    setCurrentIndex(i => i + 1);
    
    if (currentIndex >= 4) {
      setPhase('breaking');
    }
  };

  const triggerShatterSequence = () => {
    setCurrentIndex(SESSIONS.length - 1);
    // T+0ms: Shudder
    setShatterStep(0);
    // T+400ms: Blur outward
    setTimeout(() => setShatterStep(1), 400);
    // T+700ms: Red X
    setTimeout(() => setShatterStep(2), 700);
    // T+1200ms: Shatter
    setTimeout(() => setShatterStep(3), 1200);
    // T+1600ms: Peach glow & "Until now."
    setTimeout(() => setShatterStep(4), 1600);
    // T+2500ms: Memory Chat
    setTimeout(() => setShatterStep(5), 2500);
  };

  const buttonText =
    phase === 'broken' ? null :
    currentIndex >= 6 ? 'Again →' :
    currentIndex >= 4 ? 'One more time →' :
    'Next Session →';

  const captionText =
    phase === 'broken' ? null :
    currentIndex === 0 ? "You've said this before. They don't remember." :
    currentIndex >= 5 ? 'Still starting over.' :
    currentIndex >= 2 ? `Same message. ${SESSIONS[currentIndex]} times.` :
    "You've said this before. They don't remember.";

  const isBreaking = phase === 'breaking' || currentIndex >= 5;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* SHATTERED PIECES CONTAINER */}
      <div style={{ position: 'relative', width: '100%', zIndex: 10 }}>
        
        {/* Main Loop Window (Visible until shatter step 3) */}
        {shatterStep < 3 && (
          <motion.div
            animate={
              shatterStep === 0 ? { x: [0, -4, 4, -3, 3, 0] } :
              (shatterStep === 1 || shatterStep === 2) ? { filter: 'blur(4px)', opacity: 0.8 } :
              { x: 0, filter: 'blur(0px)', opacity: 1 }
            }
            transition={shatterStep === 0 ? { duration: 0.4 } : { duration: 0.3 }}
            style={{
              width: '100%',
              minHeight: 220,
              background: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 16,
              border: `1.5px solid ${isBreaking ? 'rgba(220, 80, 80, 0.20)' : 'rgba(244, 132, 95, 0.12)'}`,
              boxShadow: isBreaking 
                ? '0 8px 40px rgba(220, 80, 80, 0.08), 0 2px 8px rgba(0,0,0,0.04)'
                : '0 8px 40px rgba(244, 132, 95, 0.10), 0 2px 8px rgba(0,0,0,0.04)',
              padding: isMobile ? '32px 16px 24px' : '48px 24px 24px',
              position: 'relative',
              transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
            }}
          >
            {/* Traffic lights */}
            <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6058' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD30' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42' }} />
            </div>

            {/* Session Badge with Flip */}
            <div style={{
              background: 'rgba(244, 132, 95, 0.15)',
              border: '1px solid rgba(244, 132, 95, 0.3)',
              borderRadius: 20,
              padding: '4px 12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#F4845F',
              position: 'absolute',
              top: 12,
              right: 16,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              height: 26,
              width: 90,
              justifyContent: 'center'
            }}>
              Session&nbsp;
              <div style={{ position: 'relative', height: 16, width: 24, overflow: 'hidden' }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={SESSIONS[currentIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center', lineHeight: '16px' }}
                  >
                    {SESSIONS[currentIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Breaking indicator */}
            <AnimatePresence>
              {isBreaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute', top: 44, right: 16,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#DC5050'
                  }}
                >
                  Same message. {SESSIONS[currentIndex]} times.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Container (blurs during step 1) */}
            <motion.div
               animate={shatterStep >= 1 ? { filter: 'blur(8px)', opacity: 0 } : { filter: 'blur(0px)', opacity: 1 }}
               transition={{ duration: 0.3 }}
               style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #F4845F, #F9C784)',
                borderRadius: '16px 16px 4px 16px',
                padding: '12px 16px',
                maxWidth: '80%',
                marginLeft: 'auto',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: 'white',
                fontWeight: 500,
                lineHeight: 1.5,
              }}>
                {displayedText}
                <motion.span 
                  animate={{ opacity: isTyping ? [1, 0] : 0 }} 
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  style={{ display: 'inline-block', width: 2, marginLeft: 2, background: 'white' }}
                >
                  |
                </motion.span>
              </div>

              {!isTyping && (
                <div style={{
                  fontSize: 20, color: '#C9A0DC', letterSpacing: 4,
                  padding: '8px 0', minHeight: 36, textAlign: 'left'
                }}>
                  {'•'.repeat(dotCount)}
                </div>
              )}
            </motion.div>

            {/* Red X SVG - draws in step 2 */}
            {shatterStep >= 2 && (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" 
                   style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
                <motion.path d="M18 6L6 18" stroke="rgba(220, 80, 80, 0.8)" strokeWidth="3" strokeLinecap="round"
                   initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                <motion.path d="M6 6L18 18" stroke="rgba(220, 80, 80, 0.8)" strokeWidth="3" strokeLinecap="round"
                   initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
              </svg>
            )}
          </motion.div>
        )}

        {/* Shatter Pieces (Appear at step 3) */}
        {shatterStep >= 3 && shatterStep < 5 && (
          <div style={{ width: '100%', height: 220, position: 'absolute', top: 0, left: 0 }}>
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={isMobile ? { x: -10, y: 80, opacity: 0, rotate: -5 } : { x: -60, y: -40, opacity: 0, rotate: -10 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)',
                clipPath: 'polygon(0 0, 100% 0, 60% 50%, 0 40%)',
                border: '1px solid rgba(220,80,80,0.2)'
              }}
            />
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={isMobile ? { x: 15, y: 120, opacity: 0, rotate: 8 } : { x: 80, y: 50, opacity: 0, rotate: 15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)',
                clipPath: 'polygon(100% 0, 100% 100%, 40% 100%, 60% 50%)',
                border: '1px solid rgba(220,80,80,0.2)'
              }}
            />
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={isMobile ? { scale: 0.8, y: 140, opacity: 0, filter: 'blur(10px)' } : { scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: 'easeIn' }}
              style={{
                position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)',
                clipPath: 'polygon(0 40%, 60% 50%, 40% 100%, 0 100%)',
              }}
            />
          </div>
        )}

        {/* Blossom Center (Step 4+) */}
        {shatterStep >= 4 && (
          <div style={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(244, 132, 95, 0.4) 0%, rgba(244, 132, 95, 0) 70%)',
              }}
            />
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={shatterStep === 4 ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: -40 }} // shift up to make room for final chat
               transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Logo size={56} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={shatterStep === 4 ? { opacity: 1, y: 0 } : { opacity: 1, y: -40 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22,1,0.36,1] }}
              style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: 32, color: '#2C1810', marginTop: 16, whiteSpace: 'nowrap'
              }}
            >
              "Until now."
            </motion.div>
          </div>
        )}

        {/* Final Memory Chat Window (Step 5) */}
        {shatterStep >= 5 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 60, opacity: 1 }} // Offset down a bit so the logo floats above it
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              borderRadius: 16,
              border: '1.5px solid rgba(201, 160, 220, 0.3)',
              boxShadow: '0 12px 60px rgba(201, 160, 220, 0.15), 0 2px 8px rgba(0,0,0,0.04)',
              padding: '48px 24px 24px',
              position: 'relative',
              zIndex: 40
            }}
          >
            {/* Traffic lights */}
            <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6058' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD30' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42' }} />
            </div>

            <div style={{
              position: 'absolute', top: 12, right: 16,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#86EFAC', fontWeight: 500
            }}>
              ✓ Connected
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 160, 220, 0.25), rgba(168, 218, 220, 0.20))',
              border: '1px solid rgba(201, 160, 220, 0.3)',
              borderRadius: '16px 16px 16px 4px',
              padding: '14px 18px',
              maxWidth: '88%',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: '#3D2C2C',
              lineHeight: 1.65,
              textAlign: 'left'
            }}>
              Welcome back. Last time you told me about the presentation at work that was making you anxious. How did it go?
            </div>
          </motion.div>
        )}
      </div>

      {/* BUTTON CONTAINER - Hidden after break */}
      {buttonText && (
         <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.button 
              onClick={handleNextSession}
              whileHover={{ x: 2, background: 'rgba(244, 132, 95, 0.08)' }}
              style={{
                background: 'transparent',
                border: `1.5px solid ${isBreaking ? 'rgba(220, 80, 80, 0.4)' : 'rgba(244, 132, 95, 0.4)'}`,
                borderRadius: 100,
                padding: '10px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: isBreaking ? '#DC5050' : '#F4845F',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {buttonText}
            </motion.button>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: isBreaking ? '#DC5050' : 'rgba(92, 64, 51, 0.6)',
              marginTop: 8,
              transition: 'color 0.4s ease'
            }}>
              {captionText}
            </div>
         </div>
      )}

    </div>
  );
}

export default function ProblemSolution() {
  const isMobile = useIsMobile();
  return (
    <>
      <section id="problem" data-chapter="chapter one · the problem" style={{ padding: isMobile ? '80px 24px' : '160px 48px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="chapter-label" style={{ display: 'block', marginBottom: 32 }}>chapter one · the problem</span>
            <h2 className="headline-display" style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontStyle: 'italic', marginBottom: 48 }}>
              "You've Been Pouring<br/>Your Heart Out<br/>Into a System That<br/>
              <span className="ghosted-text">Forgets</span> You Tomorrow."
            </h2>
          </motion.div>

          <div className="body-airy" style={{ fontSize: 17, maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              Every session, you start over.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ marginTop: 24 }}>
              You re-explain your anxiety.<br/>
              You re-describe your panic attack from last Thursday.<br/>
              You re-introduce yourself to a machine<br/>
              that was supposed to help you.
            </motion.p>
            
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} style={{ 
              marginTop: 24, 
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#2D1B0E', letterSpacing: 3 
            }}>
              Every. Single. Time.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.0 }} style={{ marginTop: 24, fontSize: 20, color: '#F4845F', fontWeight: 500 }}>
              That's not therapy.<br/>
              That's a loop of exhaustion.
            </motion.p>
          </div>
        </div>

        {/* The New Interactive Chat Loop Interface */}
        <div style={{ marginTop: 120, minHeight: 450 }}>
          <InteractiveChatLoop />
        </div>
      </section>

      <WaveDivider color="var(--color-surface)" />

      <section id="solution" data-chapter="chapter two · the solution" style={{ background: 'var(--color-surface)', padding: isMobile ? '80px 24px' : '160px 48px', position: 'relative' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="chapter-label" style={{ display: 'block', marginBottom: 32 }}>chapter two · the solution</span>
            <h2 className="headline-display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 48 }}>
              "AI Saathi Doesn't<br/>Just Process Words.<br/>It Processes You."
            </h2>
          </motion.div>
          <div className="body-airy" style={{ fontSize: 18, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              We built AI Saathi from the ground up as an Emotionally Continuous Intelligence System.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ fontWeight: 500, color: '#E06B45' }}>
              Not a chatbot. Not a GPT wrapper.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
              A layered psychological engine that knows<br/>
              not just what you said —<br/>
              but what you were feeling when you said it.
            </motion.p>
          </div>
        </div>

        {/* Identity Visual */}
        <EmotionWaveform />

      </section>
    </>
  );
}
