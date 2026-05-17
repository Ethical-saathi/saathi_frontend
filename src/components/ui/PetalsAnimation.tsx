import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PETAL_COUNT = 30;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const PetalsAnimation = () => {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(0);
  const [petals, setPetals] = useState<Array<{id: number, left: number, delay: number, duration: number, scale: number, swayDuration: number}>>([]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newPetals = Array.from({ length: PETAL_COUNT }).map((_, i) => ({
      id: i,
      left: getRandom(0, 100),
      delay: getRandom(0, 15),
      duration: getRandom(10, 20),
      scale: getRandom(0.5, 1.2),
      swayDuration: getRandom(3, 7),
    }));
    setPetals(newPetals);
  }, []);

  // Fade in only AFTER scrolling past the hero section (~1 windowHeight)
  const opacity = useTransform(
    scrollY,
    [windowHeight > 0 ? windowHeight * 0.8 : 800, windowHeight > 0 ? windowHeight * 1.2 : 1200],
    [0, 1]
  );

  if (petals.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        opacity
      }}
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-[-10%]"
          style={{
            left: `${petal.left}%`,
            animation: `petal-fall ${petal.duration}s linear ${petal.delay}s infinite`,
            transform: `scale(${petal.scale})`,
          }}
        >
          <div
            className="w-3 h-4 bg-gradient-to-br from-pink-400/70 to-rose-400/70 rounded-tl-full rounded-br-full shadow-[0_0_8px_rgba(251,113,133,0.5)] backdrop-blur-sm"
            style={{
              animation: `petal-sway ${petal.swayDuration}s ease-in-out infinite alternate`,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default PetalsAnimation;
