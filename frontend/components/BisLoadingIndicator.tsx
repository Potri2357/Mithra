"use client";

import React from "react";

// ─── Props (showStatusText / statusText kept for backward compat, no longer rendered) ──
interface BisLoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  /** @deprecated No longer rendered — pure shimmer animation mode */
  showStatusText?: boolean;
  /** @deprecated No longer rendered — pure shimmer animation mode */
  statusText?: string;
  className?: string;
}

// ─── BIS logo geometry (viewBox 0 0 100 100) ───────────────────────────────────
// Triangular arch (chevron with inner void)
const TRI =
  "M 50,10 L 92,62 C 90,66 85,70 78,70 L 58,70 L 58,58 L 72,58 " +
  "L 50,28 L 28,58 L 42,58 L 42,70 L 22,70 C 15,70 10,66 8,62 Z";
// Lower curved base / underline
const ARC = "M 16,78 Q 50,88 84,78 L 81,84 Q 50,94 19,84 Z";
// Central circular element: cx=50 cy=47 r=7.5

export function BisLoadingIndicator({
  size = "md",
  className = "",
}: BisLoadingIndicatorProps) {
  const dim = { sm: 52, md: 84, lg: 96 }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 100 100"
        width={dim}
        height={dim}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* ── 1. Watermark grey base gradient ── */}
          <linearGradient id="bis-wm-grey" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#C9CDD2" />
            <stop offset="100%" stopColor="#E5E7EA" />
          </linearGradient>

          {/* ── 2. Animated blue shimmer gradient
               Direction: lower-left → upper-right (~−22° from horizontal)
               Uses userSpaceOnUse so gradientTransform operates in SVG units.
               Band sweeps from off-screen left (centre x≈−50) to off-screen
               right (centre x≈+150), covering the logo silhouette at x 8–92. ── */}
          <linearGradient
            id="bis-blue-shimmer"
            gradientUnits="userSpaceOnUse"
            x1="-80"
            y1="30"
            x2="20"
            y2="-10"
          >
            <stop offset="0%"   stopColor="#1D4ED8" stopOpacity="0"    />
            <stop offset="42%"  stopColor="#2563EB" stopOpacity="0.30" />
            <stop offset="50%"  stopColor="#93C5FD" stopOpacity="0.48" />
            <stop offset="58%"  stopColor="#2563EB" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0"    />
            {/*
              from="-20 0"  → x1=−100, x2=0   → band centre x −50  (off-screen left)
              to="180 0"    → x1=+100, x2=+200 → band centre x +150 (off-screen right)
            */}
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-20 0"
              to="180 0"
              dur="2.6s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </linearGradient>

          {/* ── 3. Clip path — exact BIS logo silhouette ── */}
          <clipPath id="bis-logo-clip">
            <path d={TRI} />
            <circle cx="50" cy="47" r="7.5" />
            <path d={ARC} />
          </clipPath>

          {/* ── 4. Gaussian blur for soft luminous glow layer ── */}
          <filter
            id="bis-glow-filter"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" />
          </filter>
        </defs>

        {/* ════════════════════════════════════════════════════
            LAYER 1 — Grey watermark base (22% opacity)
            Frosted-glass / matte-metal silhouette of the logo
            ════════════════════════════════════════════════════ */}
        <g opacity="0.22">
          <path d={TRI}                    fill="url(#bis-wm-grey)" />
          <circle cx="50" cy="47" r="7.5" fill="url(#bis-wm-grey)" />
          <path d={ARC}                    fill="url(#bis-wm-grey)" />
        </g>

        {/* ════════════════════════════════════════════════════
            LAYER 2 — Diffused blue glow halo (blurred + clipped)
            Soft luminous corona around the active shimmer region
            ════════════════════════════════════════════════════ */}
        <g clipPath="url(#bis-logo-clip)" filter="url(#bis-glow-filter)" opacity="0.18">
          <rect x="0" y="0" width="100" height="100" fill="url(#bis-blue-shimmer)" />
        </g>

        {/* ════════════════════════════════════════════════════
            LAYER 3 — Crisp blue shimmer sweep (clipped)
            Blue energy flowing diagonally through the logo
            ════════════════════════════════════════════════════ */}
        <g clipPath="url(#bis-logo-clip)">
          <rect x="0" y="0" width="100" height="100" fill="url(#bis-blue-shimmer)" />
        </g>
      </svg>
    </div>
  );
}

export default BisLoadingIndicator;
