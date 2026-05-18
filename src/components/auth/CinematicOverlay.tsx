// CinematicOverlay.tsx
// Film grain + edge vignette + top haze — makes the environment feel
// emotionally real and dimensionally warm, not sterile or digital.

export default function CinematicOverlay() {
  return (
    <>
      {/* Edge vignette — draws attention inward, frames the space */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(92,64,51,0.12) 80%, rgba(92,64,51,0.22) 100%)",
        }}
      />

      {/* Top atmospheric haze */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,244,238,0.35) 0%, transparent 100%)",
        }}
      />

      {/* Bottom warmth fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to top, rgba(255,244,238,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Film grain — SVG turbulence, ultra-low opacity */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-[0.028]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="auth-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#auth-grain)" />
      </svg>

      {/* Soft left-edge light bleed — cinematic warmth */}
      <div
        className="absolute top-0 bottom-0 left-0 w-24 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(255,244,238,0.2) 0%, transparent 100%)",
        }}
      />
    </>
  );
}
