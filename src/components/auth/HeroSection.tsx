import { motion } from "framer-motion";
import AtmosphericBackground from "./AtmosphericBackground";

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  tagline: string;
}

// Micro light motes — sparse, warm, dust-catching-light quality
function LightMotes() {
  const motes = [
    { id: 1, cx: "22%", cy: "38%", r: 1.4, delay: 0, dur: 14 },
    { id: 2, cx: "68%", cy: "22%", r: 1.0, delay: 3, dur: 18 },
    { id: 3, cx: "45%", cy: "71%", r: 1.6, delay: 6, dur: 22 },
    { id: 4, cx: "80%", cy: "55%", r: 0.9, delay: 9, dur: 16 },
    { id: 5, cx: "15%", cy: "65%", r: 1.1, delay: 2, dur: 20 },
    { id: 6, cx: "55%", cy: "18%", r: 0.8, delay: 11, dur: 24 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {motes.map(({ id, cx, cy, r, delay, dur }) => (
        <circle key={id} cx={cx} cy={cy} r={r} fill="rgba(244,132,95,0.55)">
          <animate
            attributeName="opacity"
            values="0;0.35;0.15;0.4;0"
            dur={`${dur}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${cy};calc(${cy} - 1.5%);${cy}`}
            dur={`${dur}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export default function HeroSection({ headline, subheadline, tagline }: HeroSectionProps) {
  return (
    <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col justify-center">
      {/* ── FULL ATMOSPHERIC SYSTEM (replaces 3D orbs) ── */}
      <AtmosphericBackground />

      {/* ── MICRO LIGHT MOTES ── */}
      <LightMotes />

      {/* ── TYPOGRAPHY — embedded into atmosphere, not layered above ── */}
      <div className="relative z-30 flex flex-col justify-center h-full px-14 xl:px-20">

        {/* Eyebrow line */}
        <motion.div
          className="flex items-center gap-2.5 mb-8"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="h-px"
            style={{
              width: 28,
              background: "linear-gradient(to right, rgba(244,132,95,0.7), transparent)",
            }}
          />
          <span
            className="text-[10px] tracking-[3.5px] uppercase"
            style={{ color: "rgba(92,64,51,0.42)", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
          >
            Mental Wellness
          </span>
        </motion.div>

        {/* Headline — emerges from atmosphere */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.4rem, 3.2vw, 3.6rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: "#3D2B1F",
          }}
        >
          {headline}
          {subheadline && (
            <>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.72 }}
                transition={{ delay: 0.9, duration: 1.2 }}
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#5C4033",
                }}
              >
                {subheadline}
              </motion.span>
            </>
          )}
        </motion.h1>

        {/* Soft divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            originX: 0,
            width: 40,
            height: 1,
            marginTop: 24,
            marginBottom: 20,
            background: "linear-gradient(to right, rgba(244,132,95,0.5), rgba(201,160,220,0.3), transparent)",
          }}
        />

        {/* Tagline — intimate, not marketing */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.5 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.75,
            color: "rgba(92,64,51,0.58)",
            maxWidth: "26rem",
            fontWeight: 300,
          }}
        >
          {tagline}
        </motion.p>

        {/* Trust micro-markers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="mt-10 flex flex-col gap-2.5"
        >
          {[
            { label: "DPDPA 2023 Compliant", color: "rgba(244,132,95,0.5)" },
            { label: "AES-256 Encrypted Sessions", color: "rgba(201,160,220,0.6)" },
            { label: "MHCA 2017 Aligned", color: "rgba(249,199,132,0.65)" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(92,64,51,0.38)",
                  letterSpacing: "0.06em",
                  fontWeight: 400,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
