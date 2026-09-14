"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface BisLoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  showStatusText?: boolean;
  statusText?: string;
  className?: string;
}

const COMPLIANCE_STEPS = [
  "Searching 22,000+ Indian Standards (IS)...",
  "Verifying Quality Control Order (QCO) applicability...",
  "Cross-referencing BIS technical committee gazettes...",
  "Synthesizing grounded compliance advisory...",
];

export function BisLoadingIndicator({
  size = "md",
  showStatusText = true,
  statusText,
  className = "",
}: BisLoadingIndicatorProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % COMPLIANCE_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Dimensions based on size
  const dimensions = {
    sm: { width: 28, height: 28, textClass: "text-xs" },
    md: { width: 44, height: 44, textClass: "text-xs sm:text-sm" },
    lg: { width: 64, height: 64, textClass: "text-sm sm:text-base" },
  }[size];

  const currentStatus = statusText || COMPLIANCE_STEPS[stepIndex];

  return (
    <div
      className={`flex items-center gap-3.5 py-2 px-1 text-[#0F172A] dark:text-slate-200 select-none ${className}`}
      role="status"
      aria-label={currentStatus}
    >
      {/* BIS Geometric Emblem with Radar Pulse */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Pulsing radar halo behind the emblem */}
        <div
          className="absolute inset-0 rounded-full bg-[#005EB8]/15 dark:bg-blue-400/20 animate-ping pointer-events-none"
          style={{ animationDuration: "2s" }}
        />

        {/* SVG Vector of the Official BIS Emblem */}
        <svg
          viewBox="0 0 100 100"
          width={dimensions.width}
          height={dimensions.height}
          className="relative z-10 drop-shadow-xs transition-transform duration-500 hover:scale-105"
        >
          <defs>
            <linearGradient id="bisBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005EB8" />
              <stop offset="50%" stopColor="#004B94" />
              <stop offset="100%" stopColor="#00356B" />
            </linearGradient>

            <linearGradient id="bisShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="bisRedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="70%" stopColor="#EC171F" />
              <stop offset="100%" stopColor="#B30C12" />
            </radialGradient>
          </defs>

          {/* Outer Triangular Arch / Chevron */}
          <path
            d="M 50,10 L 92,62 C 90,66 85,70 78,70 L 58,70 L 58,58 L 72,58 L 50,28 L 28,58 L 42,58 L 42,70 L 22,70 C 15,70 10,66 8,62 Z"
            fill="url(#bisBlueGrad)"
            className="animate-pulse"
            style={{ animationDuration: "2.4s" }}
          />

          {/* Radar ripple around center dot */}
          <circle
            cx="50"
            cy="47"
            r="12"
            fill="none"
            stroke="#EC171F"
            strokeWidth="1.5"
            className="animate-ping"
            style={{ animationDuration: "1.8s", transformOrigin: "50px 47px" }}
            opacity="0.6"
          />

          {/* Center Precision Red Bindu */}
          <circle
            cx="50"
            cy="47"
            r="7.5"
            fill="url(#bisRedGlow)"
            className="drop-shadow-sm"
          />

          {/* Bottom Foundation Arc */}
          <path
            d="M 16,78 Q 50,88 84,78 L 81,84 Q 50,94 19,84 Z"
            fill="url(#bisBlueGrad)"
          />
        </svg>
      </div>

      {/* Dynamic Status Text & Micro Indicator */}
      {showStatusText && (
        <div className="flex flex-col justify-center space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#005EB8] dark:text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 animate-spin text-[#005EB8] dark:text-blue-400" style={{ animationDuration: "4s" }} />
            <span>Mithra BIS Engine</span>
          </div>

          <p
            key={currentStatus}
            className={`font-medium text-[#475569] dark:text-slate-300 truncate animate-fadeIn ${dimensions.textClass}`}
          >
            {currentStatus}
          </p>
        </div>
      )}
    </div>
  );
}

export default BisLoadingIndicator;
