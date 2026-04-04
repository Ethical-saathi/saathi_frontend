import React from "react";

interface SaathiAvatarProps {
  size?: number | string;
  className?: string;
}

export const SaathiAvatar = ({ size = 24, className = "" }: SaathiAvatarProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="50" cy="50" r="50" fill="#EAF0EC" />
      <circle cx="42" cy="42" r="24" fill="#5BA8A0" opacity="0.85" style={{ mixBlendMode: "multiply" }} />
      <circle cx="64" cy="48" r="18" fill="#7DC98A" opacity="0.85" style={{ mixBlendMode: "multiply" }} />
      <circle cx="48" cy="66" r="16" fill="#4FD1C5" opacity="0.75" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
};
