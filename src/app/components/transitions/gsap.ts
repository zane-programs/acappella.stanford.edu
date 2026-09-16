"use client";

/**
 * Single place GSAP plugins are registered. Import `gsap` from here (never from
 * the package directly) so the plugins are guaranteed to be registered.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

/** Name of the bespoke ease used by the tile → hero morph (and its reverse). */
export const HERO_EASE = "hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);
  // Slow in, decisive middle, long settle: the image reads as "placed", not thrown.
  if (!CustomEase.get(HERO_EASE)) {
    CustomEase.create(HERO_EASE, "M0,0 C0.7,0 0.2,1 1,1");
  }
}

export { gsap, ScrollTrigger, Flip, CustomEase };

/** Mirrors `prefers-reduced-motion: reduce`. Safe to call during SSR (false). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Easings named in docs/DESIGN.md §3 and §6, as GSAP ease strings. */
export const EASE = {
  outExpo: "expo.out",
  inOutQuart: "power4.inOut",
  inOutExpo: "expo.inOut",
  /** Tile ↔ hero image flight. */
  hero: HERO_EASE,
} as const;

/** Durations (seconds) named in docs/DESIGN.md §3. */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  slower: 0.9,
  /** The image flight in the tile ↔ hero morph. */
  flight: 0.95,
  /** One leg of the two-layer cardinal wipe. */
  wipe: 0.55,
} as const;
