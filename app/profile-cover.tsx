"use client";

import { useId } from "react";

export default function ProfileCover() {
  const maskId = useId();
  const gradId = useId();
  const glowId = useId();

  return (
    <div className="profile-cover-wrap" aria-label="Personal cover banner">
      <svg
        className="profile-cover-svg"
        viewBox="0 0 440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle background radial glow */}
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Linear gradient for text shimmer */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0.5" />
          </linearGradient>

          {/* Grid pattern */}
          <pattern id="cover-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.75" />
          </pattern>

          {/* Center glow mask */}
          <radialGradient id={maskId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Deep base background */}
        <rect width="440" height="120" fill="#090a0d" />

        {/* Ambient grid texture */}
        <rect width="440" height="120" fill="url(#cover-grid)" opacity="0.8" />

        {/* Soft center ambient glow */}
        <circle cx="220" cy="60" r="140" fill={`url(#${glowId})`} />

        {/* Ambient floating constellation particles */}
        <g className="cover-particles" opacity="0.65">
          <circle cx="48" cy="28" r="1" fill="#ffffff" opacity="0.4" />
          <circle cx="92" cy="74" r="1.5" fill="#e4e4e7" opacity="0.5" />
          <circle cx="134" cy="36" r="1" fill="#ffffff" opacity="0.3" />
          <circle cx="178" cy="88" r="1.2" fill="#a1a1aa" opacity="0.4" />
          <circle cx="264" cy="24" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="312" cy="82" r="1" fill="#d4d4d8" opacity="0.45" />
          <circle cx="356" cy="34" r="1.3" fill="#ffffff" opacity="0.4" />
          <circle cx="396" cy="70" r="1" fill="#a1a1aa" opacity="0.35" />

          {/* Tiny accent crosshairs */}
          <path d="M 64 88 L 68 88 M 66 86 L 66 90" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          <path d="M 374 24 L 378 24 M 376 22 L 376 26" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
        </g>

        {/* Accent framing lines */}
        <line x1="0" y1="119.5" x2="440" y2="119.5" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
        <line x1="180" y1="119.5" x2="260" y2="119.5" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

        {/* Pure minimal bold wordmark: LOTER */}
        <text
          x="220"
          y="68"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#${gradId})`}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="36"
          fontWeight="850"
          letterSpacing="0.22em"
          className="cover-wordmark"
        >
          LOTER
        </text>

        {/* Subtle sub-bracket marks around the wordmark */}
        <path d="M 112 52 L 104 60 L 112 68" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 328 52 L 336 60 L 328 68" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
