import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  
  const pos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const ringPos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const raf = useRef<number>(0);
  const lastTrailPos = useRef({ x: 0, y: 0 });

  const LERP_FACTOR = 0.12;

  const animate = useCallback(() => {
    ringPos.current.x += (pos.current.x - ringPos.current.x) * LERP_FACTOR;
    ringPos.current.y += (pos.current.y - ringPos.current.y) * LERP_FACTOR;
    
    if (ring.current) {
      ring.current.style.left = ringPos.current.x + 'px';
      ring.current.style.top = ringPos.current.y + 'px';
    }
    
    // Spawn trail dot if moved enough
    const dist = Math.hypot(pos.current.x - lastTrailPos.current.x, pos.current.y - lastTrailPos.current.y);
    if (dist > 40) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail-dot';
      trail.style.left = pos.current.x + 'px';
      trail.style.top = pos.current.y + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 400);
      lastTrailPos.current = { x: pos.current.x, y: pos.current.y };
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px';
        dot.current.style.top = e.clientY + 'px';
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      
      if (t.closest('h1, h2, h3, .headline-display')) {
        ring.current?.classList.add('mode-text');
        ring.current?.classList.remove('mode-interactive');
      } else if (t.closest('button, a, [data-hover]')) {
        ring.current?.classList.add('mode-interactive');
        ring.current?.classList.remove('mode-text');
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('h1, h2, h3, button, a, [data-hover]')) {
        ring.current?.classList.remove('mode-interactive', 'mode-text');
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const ripple = document.createElement('div');
          ripple.className = 'cursor-ripple';
          ripple.style.left = e.clientX + 'px';
          ripple.style.top = e.clientY + 'px';
          document.body.appendChild(ripple);
          setTimeout(() => ripple.remove(), 800);
        }, i * 150);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mousedown', onClick);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onClick);
      cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
