import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import { WaveDivider } from './Visuals';

const CARDS = [
  {
    id: '01', tag: 'THE EAR',
    quote: '"Before it thinks, it listens — perfectly."',
    body: 'When you type "im sooo anxious rn" — AI Saathi doesn\'t stumble. It cleans, normalizes, and standardizes your words so the emotional understanding underneath never misses a beat.',
    borderColor: '#F9C784',
  },
  {
    id: '02', tag: 'THE PERCEPTION ENGINE',
    quote: '"Your words become coordinates in emotional space."',
    body: 'A proprietary model trained on 2.18 million rows of clinical data. It maps your message across 22 distinct mental health classifications — anxiety, depression, burnout, grief, and beyond — outputting a precise psychological signature in milliseconds.',
    borderColor: '#C9A0DC',
  },
  {
    id: '03', tag: 'THE GUARDRAIL',
    quote: '"It knows when to step aside and get you real help."',
    body: 'Safety is hardcoded into the math — not bolted on after. If a crisis signal spikes above threshold, it stops, escalates, and a human enters the conversation. Every time. No exceptions.',
    borderColor: '#F4845F',
  },
  {
    id: '04', tag: 'THE MEMORY',
    quote: '"It remembers your worst days — so your best days matter more."',
    body: 'Every session is written into a longitudinal emotional graph. AI Saathi tracks your emotional drift over weeks and months. It notices when something shifts — even before you do.',
    borderColor: '#A8C5DA',
  },
  {
    id: '05', tag: 'THE VOICE',
    quote: '"Only after understanding everything — does it speak."',
    body: 'The response you receive isn\'t generic. It\'s generated with full knowledge of your psychological state right now, and your complete history with the system. It feels like someone who has known you for years.',
    borderColor: '#B5D5C5',
  },
];

const CARD_BG_TINTS = [
  'rgba(249, 199, 132, 0.12)',  // Card 1 — honey amber wash
  'rgba(244, 132, 95, 0.10)',   // Card 2 — peach wash
  'rgba(201, 111, 78, 0.08)',   // Card 3 — terracotta wash
  'rgba(201, 160, 220, 0.10)',  // Card 4 — lavender wash
  'rgba(244, 132, 95, 0.07)',   // Card 5 — soft peach wash
];

function CardContent({ card }: { card: typeof CARDS[0] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '36px 40px', height: '100%' }}>

      {/* Top row: layer tag + large ghosted number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.16em',
          color: card.borderColor,
          textTransform: 'uppercase',
          background: `${card.borderColor}1A`,
          border: `1px solid ${card.borderColor}40`,
          borderRadius: '100px',
          padding: '4px 12px',
          display: 'inline-block',
          fontWeight: 600,
        }}>
          {card.id} · {card.tag}
        </span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 72,
          fontWeight: 700,
          color: 'rgba(244, 132, 95, 0.08)',
          lineHeight: 1,
          userSelect: 'none',
          marginTop: -12,
          marginRight: -8,
        }}>
          {card.id}
        </span>
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: '20px',
        color: '#1C0F0A',
        lineHeight: 1.4,
        fontWeight: 600,
        margin: 0,
      }}>
        {card.quote}
      </p>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, rgba(244,132,95,0.3), transparent)',
      }} />

      {/* Body */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: '#4A3728',
        lineHeight: 1.75,
        margin: 0,
        flex: 1,
      }}>
        {card.body}
      </p>

    </div>
  );
}

export default function ArchitectureSlideshow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const isMobile = useIsMobile();
  const TOTAL = 5;

  // Track scroll inside the 300vh container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    const mapped = latest * (TOTAL - 1);
    setActiveCard(Math.round(mapped));
  });

  const scrollToCard = (index: number) => {
    if (isMobile) {
      setActiveCard(index);
    } else if (sectionRef.current) {
      // Find the precise window scroll position to match this card natively
      const rect = sectionRef.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const scrollableHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const targetY = absoluteTop + (index / (TOTAL - 1)) * scrollableHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Touch tracking for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (activeCard < TOTAL - 1) scrollToCard(activeCard + 1);
  }, [activeCard]);

  const handlePrev = useCallback(() => {
    if (activeCard > 0) scrollToCard(activeCard - 1);
  }, [activeCard]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (delta > 50) handleNext();
    if (delta < -50) handlePrev();
    setTouchStart(null);
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeCard;

    if (offset === 0) return {
      x: 0, scale: 1, opacity: 1, zIndex: 10,
      filter: 'none',
    };
    if (Math.abs(offset) === 1) return {
      x: offset * (isMobile ? 260 : 340),
      scale: 0.88,
      opacity: 0.45,
      zIndex: 5,
      filter: 'blur(1.5px)',
    };
    return {
      x: offset * (isMobile ? 340 : 440),
      scale: 0.8,
      opacity: 0,
      zIndex: 1,
      filter: 'blur(3px)',
    };
  };

  return (
    <>
      <WaveDivider color="#FCFBF9" tiltLeft />
      {/* 
        The outer section provides the scrolling track. 
        300vh means the user scrolls normally, mapped natively to horizontal moves.
        On mobile, it's just 'auto' height with manual swipe array.
      */}
      <section
        ref={sectionRef}
        id="architecture"
        className="chapter-three-section"
        style={{
          height: isMobile ? 'auto' : '300vh',
          minHeight: isMobile ? '700px' : '300vh',
          position: 'relative',
          background: '#FCFBF9',
          marginBottom: 0,
          paddingBottom: isMobile ? '40px' : 0,
        }}
      >
        <div style={{
          position: isMobile ? 'relative' : 'sticky',
          top: 0,
          width: '100%',
          height: isMobile ? 'auto' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: isMobile ? '80px 24px 0' : '0',
        }}>

          {/* Warm radial gradient background tint — shifts per card */}
          <motion.div
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, ${CARD_BG_TINTS[activeCard]}, transparent 70%)`,
              transition: 'background 0.6s ease',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 40, zIndex: 10, position: 'relative' }}>
            <p className="chapter-label" style={{ display: 'block', marginBottom: '20px' }}>
              CHAPTER THREE · THE ARCHITECTURE
            </p>
            <h2 className="headline-display" style={{ fontSize: isMobile ? '32px' : 'clamp(40px, 5vw, 56px)', margin: '0 0 12px 0' }}>
              How It Knows You
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              color: '#A08C80',
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              Five layers. One system. Built entirely for you.
            </p>
          </div>

          {/* Depth carousel — all 5 cards */}
          <div
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
            style={{
              position: 'relative',
              height: isMobile ? 340 : 320,
              width: '100%',
              maxWidth: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            {CARDS.map((card, i) => {
              const style = getCardStyle(i);
              return (
                <motion.div
                  key={card.id}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: style.filter,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => i !== activeCard && scrollToCard(i)}
                  style={{
                    position: 'absolute',
                    width: isMobile ? 'calc(100vw - 64px)' : 580,
                    height: isMobile ? 320 : 300,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid rgba(244, 132, 95, 0.22)',
                    boxShadow: '0 12px 48px rgba(244, 132, 95, 0.10), 0 2px 8px rgba(0, 0, 0, 0.05)',
                    borderLeft: `4px solid ${card.borderColor}`,
                    cursor: i !== activeCard ? 'pointer' : 'default',
                    willChange: 'transform, opacity',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent card={card} />
                </motion.div>
              );
            })}
          </div>

          {/* Mobile nav arrows */}
          {isMobile && (
            <div style={{ display: 'flex', gap: 16, marginTop: 16, zIndex: 10 }}>
              <button
                onClick={handlePrev}
                disabled={activeCard === 0}
                style={{
                  padding: '8px 20px', borderRadius: 20,
                  border: '1px solid rgba(244,132,95,0.4)',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#E8714A', fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: activeCard === 0 ? 0.3 : 1,
                  cursor: activeCard === 0 ? 'default' : 'pointer',
                }}
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={activeCard === TOTAL - 1}
                style={{
                  padding: '8px 20px', borderRadius: 20,
                  border: '1px solid rgba(244,132,95,0.4)',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#E8714A', fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: activeCard === TOTAL - 1 ? 0.3 : 1,
                  cursor: activeCard === TOTAL - 1 ? 'default' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: isMobile ? 20 : 36, zIndex: 10 }}>
            {CARDS.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => scrollToCard(i)}
                animate={{
                  width: i === activeCard ? 28 : 8,
                  backgroundColor: i === activeCard ? '#F4845F' : 'rgba(244,132,95,0.25)',
                }}
                style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Scroll hint — desktop only */}
          {!isMobile && (
            <p style={{
              textAlign: 'center', marginTop: 28,
              fontSize: 11, letterSpacing: '0.12em',
              color: 'rgba(92,64,51,0.4)',
              fontFamily: "'DM Sans', sans-serif",
              textTransform: 'uppercase',
              zIndex: 10,
            }}>
              {activeCard < TOTAL - 1 ? 'Keep scrolling to continue ↓' : 'Scroll down to proceed ↓'}
            </p>
          )}

        </div>
      </section>
    </>
  );
}
