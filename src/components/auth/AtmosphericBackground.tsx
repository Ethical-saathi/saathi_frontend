// AtmosphericBackground.tsx
// Composes all atmospheric layers into one unified emotional environment.
// Layer order (bottom → top):
//   1. Base warm cream foundation
//   2. Aurora gradient field (slow morphing blobs)
//   3. Veil layer system (translucent silk planes)
//   4. Breathing environment (luminance pulse)
//   5. Cinematic overlay (grain, vignette, haze)

import AuroraGradientField from "./AuroraGradientField";
import VeilLayerSystem from "./VeilLayerSystem";
import BreathingEnvironment from "./BreathingEnvironment";
import CinematicOverlay from "./CinematicOverlay";

export default function AtmosphericBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Foundation — base warm cream-to-rose gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, #FFF8F4 0%, #FEF2F8 35%, #F8F0FF 65%, #FFF4EE 100%)",
        }}
      />

      {/* Layer 1 — aurora field */}
      <AuroraGradientField />

      {/* Layer 2 — translucent silk veils */}
      <VeilLayerSystem />

      {/* Layer 3 — breathing environment (wraps layers 1+2 luminance) */}
      <BreathingEnvironment>
        {/* intentionally empty — BreathingEnvironment adds luminance on top */}
        <></>
      </BreathingEnvironment>

      {/* Layer 4 — cinematic finish (grain, vignette, haze) */}
      <CinematicOverlay />
    </div>
  );
}
