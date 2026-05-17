import { useEffect, useState } from "react";

/**
 * A hook that listens to the visualViewport API (if available) to provide
 * the true visible height of the window. This is critical for iOS Safari,
 * where the on-screen keyboard changes the visual viewport without always
 * triggering a standard window resize or updating '100vh'/'100dvh' reliably.
 */
export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" && window.visualViewport
      ? window.visualViewport.height
      : typeof window !== "undefined"
      ? window.innerHeight
      : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    }

    // Initial check
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return viewportHeight;
};
