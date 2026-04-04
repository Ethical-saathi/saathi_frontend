import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// --- Perlin Noise ---
const permutation = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
const p = [...permutation, ...permutation];

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp2(t: number, a: number, b: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function perlinNoise2(x: number, y: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const a = p[X] + Y;
  const b = p[X + 1] + Y;
  
  return lerp2(v,
    lerp2(u, grad(p[a], x, y),     grad(p[b], x - 1, y)),
    lerp2(u, grad(p[a + 1], x, y - 1), grad(p[b + 1], x - 1, y - 1))
  );
}

// --- Correct Wave Geometry ---
const waves = [
  {
    // Wave 1 — Surface
    baseColor: { r: 244, g: 132, b: 95 },
    baseAmplitude: 35,
    baseFrequency: 0.008,
    baseSpeed: 0.0004,
    strokeWidth: 1.5,
    harmonicStrength: 0.15,
    noiseStrength: 0.05,
  },
  {
    // Wave 2 — Undertow  
    baseColor: { r: 201, g: 160, b: 220 },
    baseAmplitude: 60,
    baseFrequency: 0.005,
    baseSpeed: 0.00025,
    strokeWidth: 2,
    harmonicStrength: 0.30,
    noiseStrength: 0.15,
  },
  {
    // Wave 3 — Deep
    baseColor: { r: 249, g: 199, b: 132 },
    baseAmplitude: 90,
    baseFrequency: 0.003,
    baseSpeed: 0.00015,
    strokeWidth: 1,
    harmonicStrength: 0.0,
    noiseStrength: 0.6,
  }
];

// --- Emotional State Machine ---
const emotionalStates = [
  {
    name: "anxiety",
    duration: 4000,
    labelColor: "#E8705A",
    waves: [
      { amplitudeMultiplier: 1.8, speedMultiplier: 3.5, opacity: 0.7, colorShift: { r: 232, g: 112, b: 90 } },
      { amplitudeMultiplier: 2.2, speedMultiplier: 3.0, opacity: 0.6, colorShift: { r: 210, g: 140, b: 200 } },
      { amplitudeMultiplier: 1.5, speedMultiplier: 2.5, opacity: 0.45, colorShift: { r: 249, g: 180, b: 110 } },
    ],
    baselineJitter: true,
    specialEffect: "jagged" 
  },
  {
    name: "sadness",
    duration: 5000,
    labelColor: "#8B9ABD",
    waves: [
      { amplitudeMultiplier: 0.6, speedMultiplier: 0.4, opacity: 0.5, colorShift: { r: 180, g: 160, b: 200 } },
      { amplitudeMultiplier: 0.8, speedMultiplier: 0.3, opacity: 0.45, colorShift: { r: 150, g: 140, b: 190 } },
      { amplitudeMultiplier: 1.2, speedMultiplier: 0.25, opacity: 0.3, colorShift: { r: 180, g: 170, b: 160 } },
    ],
    baselineJitter: false,
    specialEffect: "sag"
  },
  {
    name: "hope",
    duration: 3000,
    labelColor: "#F9C784",
    waves: [
      { amplitudeMultiplier: 1.0, speedMultiplier: 1.2, opacity: 0.65, colorShift: { r: 249, g: 199, b: 132 } },
      { amplitudeMultiplier: 1.0, speedMultiplier: 1.0, opacity: 0.55, colorShift: { r: 220, g: 185, b: 245 } },
      { amplitudeMultiplier: 1.0, speedMultiplier: 0.8, opacity: 0.40, colorShift: { r: 249, g: 210, b: 150 } },
    ],
    baselineJitter: false,
    specialEffect: "sync"
  },
  {
    name: "numb",
    duration: 2500,
    labelColor: "#B0A09A",
    waves: [
      { amplitudeMultiplier: 0.08, speedMultiplier: 0.15, opacity: 0.3, colorShift: { r: 180, g: 165, b: 155 } },
      { amplitudeMultiplier: 0.10, speedMultiplier: 0.10, opacity: 0.25, colorShift: { r: 175, g: 165, b: 175 } },
      { amplitudeMultiplier: 0.12, speedMultiplier: 0.08, opacity: 0.20, colorShift: { r: 185, g: 175, b: 160 } },
    ],
    baselineJitter: false,
    specialEffect: "flatline"
  },
  {
    name: "overwhelmed",
    duration: 2500,
    labelColor: "#D4607A",
    waves: [
      { amplitudeMultiplier: 3.2, speedMultiplier: 5.0, opacity: 0.8, colorShift: { r: 220, g: 90, b: 100 } },
      { amplitudeMultiplier: 3.5, speedMultiplier: 4.5, opacity: 0.7, colorShift: { r: 180, g: 120, b: 220 } },
      { amplitudeMultiplier: 2.8, speedMultiplier: 3.8, opacity: 0.6, colorShift: { r: 240, g: 160, b: 80 } },
    ],
    baselineJitter: true,
    specialEffect: "clash"
  },
  {
    name: "healing",
    duration: 4500,
    labelColor: "#98C9B0",
    waves: [
      { amplitudeMultiplier: 1.1, speedMultiplier: 0.9, opacity: 0.65, colorShift: { r: 244, g: 132, b: 95 } },
      { amplitudeMultiplier: 1.3, speedMultiplier: 0.7, opacity: 0.55, colorShift: { r: 201, g: 160, b: 220 } },
      { amplitudeMultiplier: 1.5, speedMultiplier: 0.5, opacity: 0.45, colorShift: { r: 249, g: 199, b: 132 } },
    ],
    baselineJitter: false,
    specialEffect: "glow"
  }
];

const TRANSITION_DURATION = 1200;

function rgbLerp(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}, t: number) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

export default function EmotionWaveform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const [currentStateKey, setCurrentStateKey] = useState('anxiety');
  
  const S = useRef({
    currentStateIndex: 0,
    stateStartTime: 0,
    transitionProgress: 0,
    inViewPhase: 0
  }).current;

  useEffect(() => {
    if (inView && S.inViewPhase === 0) {
      setTimeout(() => { S.inViewPhase = 1; }, 0);
      setTimeout(() => { S.inViewPhase = 2; }, 600);
      setTimeout(() => { S.inViewPhase = 3; }, 900);
      setTimeout(() => { S.inViewPhase = 4; }, 1200);
      S.stateStartTime = performance.now();
    }
  }, [inView, S]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let resizeObserver: ResizeObserver;

    const setupCanvas = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const height = window.innerWidth < 768 ? 200 : 280;
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
    };

    resizeObserver = new ResizeObserver(setupCanvas);
    resizeObserver.observe(canvas.parentElement!);
    setupCanvas();

    const renderLoop = (timestamp: number) => {
      if (S.stateStartTime === 0) S.stateStartTime = timestamp;
      const elapsed = timestamp - S.stateStartTime;
      const currentState = emotionalStates[S.currentStateIndex];
      
      if (elapsed > currentState.duration) {
        S.currentStateIndex = (S.currentStateIndex + 1) % emotionalStates.length;
        S.stateStartTime = timestamp;
        S.transitionProgress = 0;
        setCurrentStateKey(emotionalStates[S.currentStateIndex].name);
      } else {
        S.transitionProgress = Math.min(elapsed / TRANSITION_DURATION, 1.0);
      }

      const prevIndex = (S.currentStateIndex - 1 + emotionalStates.length) % emotionalStates.length;
      const prevState = emotionalStates[prevIndex];
      const targetState = emotionalStates[S.currentStateIndex];
      const transitionProgress = S.transitionProgress;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerY = height / 2;
      
      ctx.clearRect(0, 0, width, height);

      let baselineY = centerY;
      const isJitter = (targetState.baselineJitter && transitionProgress > 0.5) || (prevState.baselineJitter && transitionProgress <= 0.5);
      if (isJitter && Math.random() > 0.5) {
        baselineY += (Math.random() - 0.5) * 4;
      }
      
      const isOverwhelmed = (targetState.name === 'overwhelmed' && transitionProgress > 0.5);
      if (!isOverwhelmed && S.inViewPhase >= 1) { 
         ctx.beginPath();
         ctx.moveTo(0, baselineY);
         ctx.lineTo(width, baselineY);
         ctx.strokeStyle = `rgba(244, 132, 95, 0.25)`;
         ctx.lineWidth = 1.5;
         ctx.stroke();
      }

      const drawWave = (waveIndex: number, inViewThreshold: number) => {
        if (S.inViewPhase < inViewThreshold) return;

        const w = waves[waveIndex];
        const prevParams = prevState.waves[waveIndex];
        const targParams = targetState.waves[waveIndex];

        const ampMult = lerp2(transitionProgress, prevParams.amplitudeMultiplier, targParams.amplitudeMultiplier);
        const speedMult = lerp2(transitionProgress, prevParams.speedMultiplier, targParams.speedMultiplier);
        const opac = lerp2(transitionProgress, prevParams.opacity, targParams.opacity);
        const cShift = rgbLerp(prevParams.colorShift, targParams.colorShift, transitionProgress);
        
        const alphaPhase = S.inViewPhase >= inViewThreshold ? 1 : 0;
        
        ctx.beginPath();
        const amplitude = w.baseAmplitude * ampMult;
        const speed = w.baseSpeed * speedMult;
        const freq = w.baseFrequency;

        const specialPrev = prevState.specialEffect;
        const specialCurr = targetState.specialEffect;
        const isClash = (specialCurr === 'clash' && transitionProgress > 0.2) || (specialPrev === 'clash' && transitionProgress < 0.8);
        const isSag = (specialCurr === 'sag' && transitionProgress > 0.2) || (specialPrev === 'sag' && transitionProgress < 0.8);
        const isJagged = (specialCurr === 'jagged' && transitionProgress > 0.3) || (specialPrev === 'jagged' && transitionProgress < 0.7);

        let dirMultiplier = 1;
        if (isClash && waveIndex === 1) dirMultiplier = -1;
        
        let yOffset = 0;
        if (isSag && waveIndex === 2) yOffset = 40; 
        
        for (let x = 0; x <= width; x += 3) {
          let primary = Math.sin(x * freq + timestamp * speed * dirMultiplier);
          
          if (isJagged && waveIndex === 1) {
             const jagged = -Math.abs(Math.sin(x * freq * 1.5 + timestamp * speed * dirMultiplier)) * 1.2;
             primary = lerp2(transitionProgress, primary, jagged); 
          }

          const harmonic = w.harmonicStrength * Math.sin(x * freq * 2.5 + timestamp * speed * 1.3 * dirMultiplier);
          const noise = w.noiseStrength * perlinNoise2(x * 0.005, timestamp * 0.0001);
          
          const renderY = centerY + (primary + harmonic + noise) * amplitude + yOffset;
          x === 0 ? ctx.moveTo(x, renderY) : ctx.lineTo(x, renderY);
        }
        
        ctx.strokeStyle = `rgba(${cShift.r}, ${cShift.g}, ${cShift.b}, ${opac * alphaPhase})`;
        ctx.lineWidth = w.strokeWidth;
        ctx.stroke();
      };

      drawWave(2, 2);
      drawWave(1, 3);
      drawWave(0, 4);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [inView, S]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', margin: '140px 0 100px 0' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -10 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{ position: 'absolute', top: -50, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}
      >
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(160, 130, 120, 0.6)' }}>
          The Emotion Engine
        </div>
        
        <div style={{ position: 'relative', height: 20, marginTop: 10 }}>
          {emotionalStates.map((state) => (
             <motion.div
               key={state.name}
               initial={false}
               animate={{ opacity: currentStateKey === state.name ? 1 : 0, scale: currentStateKey === state.name ? 1 : 0.95 }}
               transition={{ duration: 0.4 }}
               style={{
                 position: 'absolute', left: 0, right: 0,
                 fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, fontStyle: 'italic',
                 color: state.labelColor,
                 textTransform: 'lowercase'
               }}
             >
               {state.name}
             </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: currentStateKey === 'healing' ? 0.35 : 0 }}
        transition={{ duration: 1.0 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(249,199,132,0.4) 0%, transparent 60%)',
          filter: 'blur(30px)', zIndex: 0
        }}
      />

      {currentStateKey === 'overwhelmed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
        >
          <span style={{ position: 'absolute', top: '20%', left: '30%', color: 'rgba(232,80,60,0.5)', fontSize: 14, fontStyle: 'italic', transform: 'rotate(-5deg)' }}>overwhelmed</span>
          <span style={{ position: 'absolute', bottom: '30%', right: '20%', color: 'rgba(180,120,200,0.5)', fontSize: 12, transform: 'rotate(12deg)' }}>overwhelmed</span>
        </motion.div>
      )}

      <div style={{ width: '100%', position: 'relative', zIndex: 5 }}>
        <canvas ref={canvasRef} style={{ display: 'block', pointerEvents: 'all', margin: '0 auto' }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{ zIndex: 10 }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 300, color: 'rgba(244,132,95,0.5)', pointerEvents: 'none' }}>
          surface
        </div>
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 300, color: 'rgba(201,160,220,0.5)', pointerEvents: 'none' }}>
          beneath
        </div>
      </motion.div>

    </div>
  );
}
