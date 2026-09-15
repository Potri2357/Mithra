"use client";

import React, { useId } from "react";

export interface MithraLogoProps {
  /** Width & height in pixels */
  size?: number;
  /** Optional extra CSS classes */
  className?: string;
  /**
   * "squircle" — Rendered inside a premium squircle badge.
   * "plain"    — Just the freestanding geometric "M" & Mithra solar spark.
   */
  variant?: "squircle" | "plain";
  /** Optional title for accessibility */
  title?: string;
  /**
   * When true renders the light-palette version (white/silver squircle + navy "M")
   * suited for dark-mode backgrounds.
   * When false (default) renders the dark-palette version (midnight-navy squircle + cyan "M").
   */
  darkMode?: boolean;
}

export function MithraLogo({
  size = 28,
  className = "",
  variant = "squircle",
  title = "Mithra AI Logo",
  darkMode = false,
}: MithraLogoProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, "");

  const bgId     = `ml-bg-${id}`;
  const borderId = `ml-border-${id}`;
  const haloId   = `ml-halo-${id}`;
  const f1Id     = `ml-f1-${id}`;
  const f2Id     = `ml-f2-${id}`;
  const f3Id     = `ml-f3-${id}`;
  const f4Id     = `ml-f4-${id}`;
  const starId   = `ml-star-${id}`;

  /* ─── DARK-MODE palette: sleek obsidian squircle, luminous white & platinum "M" ── */
  if (darkMode) {
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
          {/* Deep Obsidian / Dark Slate Squircle Background (matches website dark theme #181816) */}
          <linearGradient id={bgId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#262522" />
            <stop offset="45%"  stopColor="#181816" />
            <stop offset="100%" stopColor="#0D0D0B" />
          </linearGradient>

          {/* Crisp Platinum / Frosted Glass Metallic Rim */}
          <linearGradient id={borderId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.32" />
            <stop offset="40%"  stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.04" />
          </linearGradient>

          {/* Subtle White Ethereal Halo Aura */}
          <radialGradient id={haloId} cx="32" cy="19.5" r="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Facet 1 — Left Outer Blade: Brilliant White to Crisp Platinum */}
          <linearGradient id={f1Id} x1="13" y1="15" x2="23" y2="49" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D4D4D8" />
          </linearGradient>

          {/* Facet 2 — Left Inner Slope: Polished Silver / Chrome */}
          <linearGradient id={f2Id} x1="23" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#E4E4E7" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>

          {/* Facet 3 — Right Inner Slope: Titanium Shadow Facet for 3D Depth */}
          <linearGradient id={f3Id} x1="41" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>

          {/* Facet 4 — Right Outer Blade: Brilliant White to Crisp Platinum */}
          <linearGradient id={f4Id} x1="51" y1="15" x2="41" y2="49" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D4D4D8" />
          </linearGradient>

          {/* Star — Brilliant Diamond Intelligence Spark */}
          <linearGradient id={starId} x1="32" y1="11" x2="32" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFFFFF" />
            <stop offset="45%"  stopColor="#FAFAFA" />
            <stop offset="80%"  stopColor="#E4E4E7" />
            <stop offset="100%" stopColor="#D4D4D8" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Base */}
        {variant === "squircle" && (
          <>
            <rect width="64" height="64" rx="16" fill={`url(#${bgId})`} />
            <rect
              x="0.75" y="0.75"
              width="62.5" height="62.5"
              rx="15.25"
              stroke={`url(#${borderId})`}
              strokeWidth="1.5"
            />
          </>
        )}

        {/* Ethereal Glow */}
        <circle cx="32" cy="18.5" r="14" fill={`url(#${haloId})`} />

        {/* ── Mithra Luminous Geometric "M" Facets ── */}
        <path d="M 13 49 L 13 22 L 23 15 L 23 42 Z" fill={`url(#${f1Id})`} />
        <path d="M 23 15 L 32 28 L 32 38 L 23 42 Z" fill={`url(#${f2Id})`} />
        <path d="M 32 28 L 41 15 L 41 42 L 32 38 Z" fill={`url(#${f3Id})`} />
        <path d="M 41 15 L 51 22 L 51 49 L 41 42 Z" fill={`url(#${f4Id})`} />

        {/* Top Edge Beveled Diamond Highlight */}
        <path
          d="M 13 22 L 23 15 L 32 28 L 41 15 L 51 22"
          stroke="#FFFFFF"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.95"
        />
        {/* Bottom Base Edge Definition */}
        <path
          d="M 13 49 L 23 42 L 32 38 L 41 42 L 51 49"
          stroke={variant === "squircle" ? "#34332E" : "#71717A"}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mithra AI Intelligence Spark */}
        <path
          d="M 32 11.5 C 32 16 34.5 18.5 39 18.5 C 34.5 18.5 32 21 32 25.5 C 32 21 29.5 18.5 25 18.5 C 29.5 18.5 32 16 32 11.5 Z"
          fill={`url(#${starId})`}
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeOpacity="1"
        />
        {/* Core Brilliant Spark Center */}
        <circle cx="32" cy="18.5" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  /* ─── LIGHT-MODE palette: midnight-navy squircle, cyan "M" (original) ─────── */
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
          <stop offset="0%"   stopColor="#0F1F42" />
          <stop offset="50%"  stopColor="#08142A" />
          <stop offset="100%" stopColor="#040915" />
        </linearGradient>

        {/* Subtle Precision Border Glow */}
        <linearGradient id={borderId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.18" />
        </linearGradient>

        {/* Radial Halo Aura */}
        <radialGradient id={haloId} cx="32" cy="19.5" r="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="45%"  stopColor="#0284C7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>

        {/* Facet 1 — Left Outer Blade */}
        <linearGradient id={f1Id} x1="13" y1="15" x2="23" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Facet 2 — Left Inner Slope */}
        <linearGradient id={f2Id} x1="23" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Facet 3 — Right Inner Slope */}
        <linearGradient id={f3Id} x1="41" y1="15" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Facet 4 — Right Outer Blade */}
        <linearGradient id={f4Id} x1="51" y1="15" x2="41" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Mithra Intelligence Spark Gradient */}
        <linearGradient id={starId} x1="32" y1="11" x2="32" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="40%"  stopColor="#E0F2FE" />
          <stop offset="75%"  stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Optional Squircle Badge Base */}
      {variant === "squircle" && (
        <>
          <rect width="64" height="64" rx="16" fill={`url(#${bgId})`} />
          <rect
            x="0.75" y="0.75"
            width="62.5" height="62.5"
            rx="15.25"
            stroke={`url(#${borderId})`}
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Radial Aura Glow */}
      <circle cx="32" cy="18.5" r="14" fill={`url(#${haloId})`} />

      {/* ── Mithra Geometric "M" Facets ── */}
      <path d="M 13 49 L 13 22 L 23 15 L 23 42 Z" fill={`url(#${f1Id})`} />
      <path d="M 23 15 L 32 28 L 32 38 L 23 42 Z" fill={`url(#${f2Id})`} />
      <path d="M 32 28 L 41 15 L 41 42 L 32 38 Z" fill={`url(#${f3Id})`} />
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

      {/* Mithra AI Intelligence Spark */}
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
