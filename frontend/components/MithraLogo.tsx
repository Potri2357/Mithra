"use client";

import React, { useId } from "react";

export interface MithraLogoProps {
  /** Width & height in pixels */
  size?: number;
  /** Optional extra CSS classes */
  className?: string;
  /**
   * "squircle" — Rendered inside a premium midnight-navy squircle badge with subtle border.
   * "plain"    — Just the freestanding geometric "M" & Mithra solar spark.
   */
  variant?: "squircle" | "plain";
  /** Optional title for accessibility */
  title?: string;
}

export function MithraLogo({
  size = 28,
  className = "",
  variant = "squircle",
  title = "Mithra AI Logo",
}: MithraLogoProps) {
  const rawId = useId();
  // Sanitize ID for valid SVG URL references
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, "");

  const bgId = `ml-bg-${id}`;
  const borderId = `ml-border-${id}`;
  const haloId = `ml-halo-${id}`;
  const f1Id = `ml-f1-${id}`;
  const f2Id = `ml-f2-${id}`;
  const f3Id = `ml-f3-${id}`;
  const f4Id = `ml-f4-${id}`;
  const starId = `ml-star-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <defs>
        {/* Deep Midnight Navy Squircle Background */}
        <linearGradient id={bgId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F1F42" />
          <stop offset="50%" stopColor="#08142A" />
          <stop offset="100%" stopColor="#040915" />
        </linearGradient>

        {/* Subtle Precision Border Glow */}
        <linearGradient id={borderId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.18" />
        </linearGradient>

        {/* Radial Halo Aura */}
        <radialGradient id={haloId} cx="32" cy="19.5" r="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="45%" stopColor="#0284C7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>

        {/* Facet 1 — Left Outer Blade (Vibrant Cyan to Royal Blue) */}
        <linearGradient id={f1Id} x1="13" y1="15" x2="23" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Facet 2 — Left Inner Slope (Royal Blue to Deep Azure) */}
        <linearGradient id={f2Id} x1="23" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Facet 3 — Right Inner Slope (Deep Azure to Shadow Navy) */}
        <linearGradient id={f3Id} x1="41" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Facet 4 — Right Outer Blade (Vibrant Cyan to Royal Blue) */}
        <linearGradient id={f4Id} x1="51" y1="15" x2="41" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Mithra Intelligence Spark Gradient (Same cyan/blue/white palette) */}
        <linearGradient id={starId} x1="32" y1="11" x2="32" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E0F2FE" />
          <stop offset="75%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Optional Squircle Badge Base */}
      {variant === "squircle" && (
        <>
          <rect width="64" height="64" rx="16" fill={`url(#${bgId})`} />
          <rect
            x="0.75"
            y="0.75"
            width="62.5"
            height="62.5"
            rx="15.25"
            stroke={`url(#${borderId})`}
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Radial Aura Glow */}
      <circle cx="32" cy="18.5" r="14" fill={`url(#${haloId})`} />

      {/* ── Mithra Geometric "M" Facets ── */}
      {/* Facet 1: Left Outer Wing */}
      <path d="M 13 49 L 13 22 L 23 15 L 23 42 Z" fill={`url(#${f1Id})`} />
      {/* Facet 2: Left Inner Slope */}
      <path d="M 23 15 L 32 28 L 32 38 L 23 42 Z" fill={`url(#${f2Id})`} />
      {/* Facet 3: Right Inner Slope */}
      <path d="M 32 28 L 41 15 L 41 42 L 32 38 Z" fill={`url(#${f3Id})`} />
      {/* Facet 4: Right Outer Wing */}
      <path d="M 41 15 L 51 22 L 51 49 L 41 42 Z" fill={`url(#${f4Id})`} />

      {/* Top Edge Beveled Highlight */}
      <path
        d="M 13 22 L 23 15 L 32 28 L 41 15 L 51 22"
        stroke="#E0F2FE"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.95"
      />
      {/* Bottom Base Edge Definition */}
      <path
        d="M 13 49 L 23 42 L 32 38 L 41 42 L 51 49"
        stroke={variant === "squircle" ? "#07273D" : "#0284C7"}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mithra AI Intelligence Spark Icon (Precision vector, matching cyan/white palette) */}
      <path
        d="M 32 11.5 C 32 16 34.5 18.5 39 18.5 C 34.5 18.5 32 21 32 25.5 C 32 21 29.5 18.5 25 18.5 C 29.5 18.5 32 16 32 11.5 Z"
        fill={`url(#${starId})`}
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.9"
      />
      {/* Core Brilliant White Spark Point */}
      <circle cx="32" cy="18.5" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

export default MithraLogo;
