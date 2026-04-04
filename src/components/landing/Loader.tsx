import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BlurText } from './Effects';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0: initial blank, 1: materializing, 2: blooming out

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Time materialization start
    const t1 = setTimeout(() => setStage(1), 300);
    
    // Time the hold and bloom
    const t2 = setTimeout(() => {
      setStage(2);
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, 1000); // Wait for bloom to finish
    }, 2500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 2 && (
        <motion.div
          className="loader-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {/* Outermost expanding ring bloom */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage === 1 ? 1 : 10, 
              opacity: stage === 1 ? 0.6 : 0,
            }}
            transition={{ 
              duration: stage === 1 ? 2.5 : 1, 
              ease: stage === 1 ? 'circOut' : 'easeInOut' 
            }}
            style={{
              position: 'absolute',
              width: 500, height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFDDD0 0%, #FFD6E8 40%, transparent 70%)',
              filter: 'blur(100px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {stage >= 1 && (
              <>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <BlurText 
                    text="AI Saathi" 
                    stagger={0.06} 
                    className="headline-display" 
                    style={{ fontSize: 'clamp(40px, 6vw, 64px)', color: '#F4845F' }}
                  />
                </div>
                
                {/* Organic Heartbeat Flatline */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 200 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className="loader-heartbeat-line"
                  style={{ background: 'transparent' }}
                >
                  <svg viewBox="0 0 200 6" width="200" height="6">
                    <motion.path 
                      d="M 0 3 Q 50 1, 100 4 T 200 3" 
                      fill="transparent" 
                      stroke="#F4845F" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                    />
                  </svg>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
