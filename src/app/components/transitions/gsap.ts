"use client";

/**
 * Single place GSAP plugins are registered. Import `gsap` from here (never from
 * the package directly) so the plugins are guaranteed to be registered.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip };

/** Mirrors `prefers-reduced-motion: reduce`. Safe to call during SSR (false). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Easings named in docs/DESIGN.md §3, as GSAP ease strings. */
export const EASE = {
  outExpo: "expo.out",
  inOutQuart: "power4.inOut",
} as const;

/** Durations (seconds) named in docs/DESIGN.md §3. */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  slower: 0.9,
} as const;
