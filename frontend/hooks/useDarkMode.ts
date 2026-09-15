"use client";

import { useState, useEffect } from "react";

/**
 * Reactively tracks whether the <html> element has the "dark" class.
 * Works with the manual class-toggle pattern used by Navbar.tsx
 * (no next-themes required).
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for future class changes on <html>
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
