import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import { WaveDivider } from './Visuals';

const CARDS = [
  {
    id: '01', tag: 'THE EAR',
    quote: '"Before it thinks, it listens — perfectly."',
    body: 'When you type "im sooo anxious rn" — AI Saathi doesn\'t stumble. It cleans, normalizes, and standardizes your words so the emotional understanding underneath never misses a beat.',
    borderColor: '#F9C784',
    accent: 'rgba(249, 199, 132, 0.15)',
  },
  {
    id: '02', tag: 'THE PERCEPTION ENGINE',
    quote: '"Your words become coordinates in emotional space."',
    body: 'A proprietary model trained on 2.18 million rows of clinical data. It maps your message across 22 distinct mental health classifications — anxiety, depression, burnout, grief, and beyond.',
    borderColor: '#C9A0DC',
    accent: 'rgba(201, 160, 220, 0.15)',
  },
  {
    id: '03', tag: 'THE GUARDRAIL',
    quote: '"It knows when to step aside and get you real help."',
    body: 'Safety is hardcoded into the math — not bolted on after. If a crisis signal spikes above threshold, it stops, escalates, and a human enters the conversation. Every time.',
    borderColor: '#F4845F',
    accent: 'rgba(244, 132, 95, 0.15)',
  },
  {
    id: '04', tag: 'THE MEMORY',
    quote: '"It remembers your worst days — so your best days matter more."',
    body: 'Every session is written into a longitudinal emotional graph. AI Saathi tracks your emotional drift over weeks and months. It notices when something shifts — even before you do.',
    borderColor: '#A8C5DA',
    accent: 'rgba(168, 197, 218, 0.15)',
  },
  {
    id: '05', tag: 'THE VOICE',
    quote: '"Only after understanding everything — does it speak."',
    body: 'The response you receive isn\'t generic. It\'s generated with full knowledge of your psychological state right now, and your complete history with the system.',
    borderColor: '#B5D5C5',
    accent: 'rgba(181, 213, 197, 0.15)',
  },
];

/* ─── Card Visual Component ─── */
function CardInner({ card, compact = false }: { card: typeof CARDS[0]; compact?: boolean }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: compact ? 16 : 20,
        border: '1.5px solid rgba(244, 132, 95, 0.12)',
        borderLeft: `5px solid ${card.borderColor}`,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255,255,255,0.9) inset',
        padding: compact ? '24px 20px' : '36px 40px',
        overflow: 'hidden',
        position: 'relative' as const,
      }}
    >
      <div
        style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${card.accent}, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? 10 : 16, position: 'relative', zIndex: 2 }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: compact ? '10px' : '11px',
            letterSpacing: '0.16em', color: card.borderColor,
            textTransform: 'uppercase',
            background: `${card.borderColor}1A`, border: `1px solid ${card.borderColor}40`,
            borderRadius: '100px', padding: compact ? '3px 12px' : '4px 14px',
            display: 'inline-block', fontWeight: 600,
          }}
        >
          {card.id} · {card.tag}
        </span>
        {!compact && (
          <span
            style={{
              fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 700,
              color: `${card.borderColor}1A`, lineHeight: 1,
              userSelect: 'none', marginTop: -16, marginRight: -4,
            }}
          >
            {card.id}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: compact ? '16px' : '22px', color: '#1C0F0A', lineHeight: 1.45,
        fontWeight: 600, margin: `0 0 ${compact ? 12 : 16}px 0`,
        position: 'relative', zIndex: 2,
      }}>
        {card.quote}
      </p>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${card.borderColor}60, transparent)`, marginBottom: compact ? 12 : 16 }} />
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: compact ? '13px' : '15px',
        color: '#4A3728', lineHeight: 1.8, margin: 0, position: 'relative', zIndex: 2,
      }}>
        {card.body}
      </p>
    </div>
  );
}

/* ─── Shared Logic for Card Transforms ─── */
function AnimatedCard({ card, index, scrollYProgress, TOTAL }: { card: typeof CARDS[0], index: number, scrollYProgress: any, TOTAL: number }) {
  // We divide the scroll into equal segments per card.
  // We offset it slightly so the first card enters soon after scrolling starts.
  const interval = 1 / TOTAL;
  const target = index * interval; 
  
  // start: when card begins entering from bottom
  const start = Math.max(0, target - interval * 0.8);
  
  // center: when card is fully centered and active
  const center = target;
  
  // end: when the NEXT card becomes fully centered
  const end = Math.min(1, target + interval);

  // Purely physics-driven mapping on the GPU
  const opacity = useTransform(
    scrollYProgress,
    [start, center, end, 1],
    [0, 1, 1, 0] // Fade in, stay visible, fade out at very end
  );

  const y = useTransform(
    scrollYProgress,
    [start, center, end],
    [100, 0, -20] // Rise from 100px, lock at 0, push back to -20px
  );

  const scale = useTransform(
    scrollYProgress,
    [start, center, end],
    [0.9, 1, 0.94] // Start slightly small, full size, scale down as it recedes into background
  );

  return (
    <motion.div
      style={{
        position: index === 0 ? 'relative' : 'absolute',
        top: index === 0 ? undefined : 0,
        left: index === 0 ? undefined : 0,
        right: index === 0 ? undefined : 0,
        opacity,
        y,
        scale,
        zIndex: index + 1, // Stacking order ensures newer cards overlap older ones
        transformOrigin: "top center",
      }}
    >
      <CardInner card={card} />
    </motion.div>
  );
}

/* ─── Desktop: Pure CSS/Framer Motion Stack ─── */
function DesktopStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const TOTAL = CARDS.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: `${TOTAL * 100}vh`, // Generous scroll space per layer
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible', // Essential for shadow spread/transforms
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: 640, padding: '0 24px' }}>
          {CARDS.map((card, i) => (
            <AnimatedCard key={card.id} card={card} index={i} scrollYProgress={scrollYProgress} TOTAL={TOTAL} />
          ))}
        </div>

        {/* Dynamic Progress Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            zIndex: 10,
          }}
        >
          {CARDS.map((card, i) => {
            const target = i / TOTAL;
            const diff = 1 / (TOTAL * 2);
            // This drives the dot growth purely based on scroll
            const isActiveOpacity = useTransform(
              scrollYProgress,
              [Math.max(0, target - diff), target, Math.min(1, target + diff)],
              [0.3, 1, 0.3]
            );
            const dotWidth = useTransform(
              scrollYProgress,
              [Math.max(0, target - diff), target, Math.min(1, target + diff)],
              [8, 32, 8]
            );

            return (
              <motion.div
                key={i}
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: dotWidth,
                  backgroundColor: card.borderColor,
                  opacity: isActiveOpacity
                }}
              />
            );
          })}
        </div>

        {/* Static hint */}
        <p
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'rgba(92,64,51,0.4)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          Scroll to explore layers ↓
        </p>
      </div>
    </div>
  );
}

/* ─── Mobile Card ─── */
function MobileCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', marginBottom: 20 }}
    >
      <CardInner card={card} compact />
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Architecture() {
  const isMobile = useIsMobile();

  return (
    <>
      <WaveDivider color="#FCFBF9" tiltLeft />
      <section
        id="architecture"
        style={{
          position: 'relative',
          background: '#FCFBF9',
          paddingBottom: isMobile ? 60 : 0,
        }}
      >
        {/* Header Header */}
        <div style={{ textAlign: 'center', paddingTop: isMobile ? 60 : 120, paddingBottom: isMobile ? 32 : 40, position: 'relative', zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="chapter-label" style={{ display: 'block', marginBottom: 24 }}>
              CHAPTER THREE · THE ARCHITECTURE
            </p>
            <h2 className="headline-display" style={{ fontSize: isMobile ? '36px' : 'clamp(48px, 6vw, 64px)', margin: '0 0 16px 0' }}>
              How It Knows You
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: '#7A665A', margin: 0, letterSpacing: '0.02em' }}>
              Five layers. One system. Built entirely for you.
            </p>
          </motion.div>
        </div>

        {isMobile ? (
          <div style={{ padding: '0 20px', maxWidth: 520, margin: '0 auto' }}>
            {CARDS.map((card, i) => (
              <MobileCard key={card.id} card={card} index={i} />
            ))}
          </div>
        ) : (
          <DesktopStack />
        )}
      </section>
    </>
  );
}
