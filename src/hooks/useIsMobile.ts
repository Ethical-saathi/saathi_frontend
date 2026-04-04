import { useState, useEffect } from 'react';

/**
 * A robust React hook to detect mobile viewports.
 * Uses matchMedia which accurately responds to device rotations and resizes.
 * Default breakpoint is 768px (standard iPad vertical / standard mobile boundary).
 */
export function useIsMobile(breakpoint = 768) {
  // We initialize with a safe server-side default or a guess. 
  // In pure client-side React, we can check immediately.
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Event listener for viewport changes
    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [breakpoint]);

  return isMobile;
}
