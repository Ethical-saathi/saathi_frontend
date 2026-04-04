export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      {/* 
        Organic custom blob shape for the logo.
        We'll use a path that feels natural, soft, and slightly asymmetric.
      */}
      <path 
        d="M 50 15 
           Q 85 15, 85 50 
           T 50 85 
           Q 15 85, 15 50 
           T 50 15 Z" 
        fill="#F4845F" 
      />
      {/* 
        A clean, sharp heartbeat line intersecting the blob.
        Represents the "intelligence" cutting through the "emotion".
      */}
      <path 
        d="M 20 50 L 40 50 L 45 35 L 55 65 L 60 50 L 80 50" 
        stroke="#FFFFAF" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
