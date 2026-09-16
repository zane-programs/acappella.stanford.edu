"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { Wordmark } from "@/app/components/ui/Wordmark";
import { DURATION, EASE, gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";
import {
  TransitionContext,
  type SharedImageHandoff,
  type TransitionPushOptions,
  type TransitionRouter,
} from "./context";

/**
 * Site-wide page transitions (docs/DESIGN.md §6).
 *
 * Contracts consumed by pages:
 * - `[data-reveal]` (inside <main>): staggered in on route change / first
 *   load; below-the-fold ones reveal on scroll, once. Hidden via CSS while
 *   `html.js` is set (see globals.css) so nothing flashes.
 * - `[data-shared-image="<slug>"]`: an <img> on the destination page that a
 *   tile's image morphs into. The source tile passes a `SharedImageHandoff`.
 * - Reduced motion: every sequence collapses to a 150ms crossfade.
 */

type Pending =
  | { mode: "instant"; href: string }
  | { mode: "wipe"; href: string; covered: Promise<void> }
  | {
      mode: "shared";
      href: string;
      handoff: SharedImageHandoff;
      clone: HTMLImageElement;
      source: HTMLElement | null;
    };

const MAX_STAGGERED = 8;
const SHARED_TARGET_TIMEOUT_MS = 800;
const NAVIGATION_TIMEOUT_MS = 8000;

/** Top of page, or the hash target if the destination href has one. */
function scrollToDestination(href: string) {
  let hash = "";
  try {
    hash = new URL(href, window.location.href).hash;
  } catch {
    hash = "";
  }
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const wipeRef = useRef<HTMLDivElement>(null);
  const wipeMarkRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const cloneLayerRef = useRef<HTMLDivElement>(null);

  const pendingRef = useRef<Pending | null>(null);
  const popRef = useRef(false);
  const firstRunRef = useRef(true);
  const batchTriggersRef = useRef<ScrollTrigger[]>([]);
  const navTimeoutRef = useRef<number | null>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  /* ---------- reveal ---------- */

  const killBatches = useCallback(() => {
    batchTriggersRef.current.forEach((t) => t.kill());
    batchTriggersRef.current = [];
  }, []);

  const revealPage = useCallback(
    (opts: { animate: boolean; exclude?: Element | null } = { animate: true }) => {
      killBatches();
      const main = document.getElementById("main-content");
      if (!main) return;
      const all = Array.from(main.querySelectorAll<HTMLElement>("[data-reveal]"));
      const els = all.filter((el) => el !== opts.exclude);
      if (els.length === 0) return;

      if (!document.documentElement.classList.contains("js") || !opts.animate) {
        gsap.set(els, { opacity: 1, clearProps: "transform" });
        return;
      }

      const vh = window.innerHeight;
      const inView: HTMLElement[] = [];
      const below: HTMLElement[] = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        (r.top < vh * 0.95 ? inView : below).push(el);
      }

      const staggered = inView.slice(0, MAX_STAGGERED);
      const immediate = inView.slice(MAX_STAGGERED);
      if (immediate.length) gsap.set(immediate, { opacity: 1 });
      if (staggered.length) {
        gsap.fromTo(
          staggered,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATION.slower,
            ease: EASE.outExpo,
            stagger: 0.06,
            overwrite: true,
            clearProps: "transform",
          }
        );
      }
      if (below.length) {
        batchTriggersRef.current = ScrollTrigger.batch(below, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: DURATION.slower,
                ease: EASE.outExpo,
                stagger: 0.06,
                overwrite: true,
                clearProps: "transform",
              }
            ),
        });
      }
    },
    [killBatches]
  );

  /* ---------- finish sequences (run after the new route painted) ---------- */

  const settle = useCallback(() => {
    pendingRef.current = null;
    setIsTransitioning(false);
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
  }, []);

  const finishWipe = useCallback(
    async (pending: Extract<Pending, { mode: "wipe" }>) => {
      await pending.covered;
      await nextPaint();
      scrollToDestination(pending.href);
      const wipe = wipeRef.current!;
      const mark = wipeMarkRef.current!;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(wipe, { autoAlpha: 0 });
          settle();
        },
      });
      tl.to(mark, { opacity: 0, duration: DURATION.fast }, 0);
      tl.set(wipe, { transformOrigin: "50% 0%" }, 0);
      tl.to(
        wipe,
        { scaleY: 0, duration: DURATION.slow, ease: EASE.inOutQuart },
        0
      );
      tl.call(() => revealPage({ animate: true }), [], 0.2);
    },
    [revealPage, settle]
  );

  const finishShared = useCallback(
    async (pending: Extract<Pending, { mode: "shared" }>) => {
      await nextPaint();
      const { clone, handoff } = pending;
      const veil = veilRef.current!;
      const main = document.getElementById("main-content");

      // Wait (briefly) for the destination image to exist and have a size.
      const deadline = performance.now() + SHARED_TARGET_TIMEOUT_MS;
      let target: HTMLElement | null = null;
      while (performance.now() < deadline) {
        const el = main?.querySelector<HTMLElement>(
          `[data-shared-image="${CSS.escape(handoff.slug)}"]`
        );
        if (el && el.getBoundingClientRect().width > 0) {
          target = el;
          break;
        }
        await new Promise((r) => requestAnimationFrame(r));
      }

      if (!target) {
        // Redirect or a page without a hero image: quietly fall back.
        gsap.to(veil, { opacity: 0, duration: DURATION.base });
        gsap.to(clone, {
          opacity: 0,
          duration: DURATION.base,
          onComplete: () => {
            clone.remove();
            settle();
          },
        });
        revealPage({ animate: true });
        return;
      }

      const rect = target.getBoundingClientRect();
      const radius = getComputedStyle(target).borderRadius || "6px";
      target.style.opacity = "0";
      // The hero image is often inside a [data-reveal] block; keep it visible
      // so the clone lands on a stable, already-revealed target.
      const revealAncestor = target.closest<HTMLElement>("[data-reveal]");
      if (revealAncestor) gsap.set(revealAncestor, { opacity: 1 });

      gsap.to(veil, { opacity: 0, duration: DURATION.slow });
      gsap.to(clone, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: radius,
        duration: DURATION.slower,
        ease: EASE.outExpo,
        onComplete: () => {
          // Crossfade rather than swap: some groups show a different photo on
          // their page (`descriptionImgUrl`) than on the tile, and a hard cut
          // between the two reads as a glitch.
          gsap.to(target!, {
            opacity: 1,
            duration: DURATION.base,
            clearProps: "opacity",
          });
          gsap.to(clone, {
            opacity: 0,
            duration: DURATION.base,
            onComplete: () => {
              clone.remove();
              settle();
            },
          });
        },
      });
      revealPage({ animate: true, exclude: revealAncestor });
    },
    [revealPage, settle]
  );

  const finishInstant = useCallback(() => {
    const main = document.getElementById("main-content");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (main) {
      gsap.fromTo(
        main,
        { opacity: 0 },
        { opacity: 1, duration: DURATION.fast, clearProps: "opacity" }
      );
    }
    revealPage({ animate: false });
    settle();
  }, [revealPage, settle]);

  const crossfadeHistory = useCallback(() => {
    const main = document.getElementById("main-content");
    if (main) {
      gsap.fromTo(
        main,
        { opacity: 0 },
        { opacity: 1, duration: DURATION.base, clearProps: "opacity" }
      );
    }
    revealPage({ animate: false });
  }, [revealPage]);

  /* ---------- route-change observer ---------- */

  useEffect(() => {
    const onPop = () => {
      popRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      // First paint: reveal whatever is on screen.
      nextPaint().then(() => revealPage({ animate: true }));
      return;
    }
    const pending = pendingRef.current;
    if (pending) {
      if (pending.mode === "wipe") void finishWipe(pending);
      else if (pending.mode === "shared") void finishShared(pending);
      else finishInstant();
      return;
    }
    if (popRef.current) {
      popRef.current = false;
      crossfadeHistory();
      return;
    }
    // A push we didn't initiate (e.g. a redirect() from a page): plain reveal.
    nextPaint().then(() => revealPage({ animate: true }));
  }, [pathname, finishWipe, finishShared, finishInstant, crossfadeHistory, revealPage]);

  useEffect(() => () => killBatches(), [killBatches]);

  /* ---------- start sequences ---------- */

  const abortToStable = useCallback(() => {
    // Navigation never completed (offline, hard error). Uncover and reset.
    const pending = pendingRef.current;
    if (!pending) return;
    if (pending.mode === "wipe") {
      gsap.to(wipeRef.current!, {
        autoAlpha: 0,
        duration: DURATION.base,
        onComplete: () => gsap.set(wipeRef.current!, { scaleY: 0 }),
      });
    } else if (pending.mode === "shared") {
      pending.clone.remove();
      if (pending.source) pending.source.style.opacity = "";
      gsap.to(veilRef.current!, { opacity: 0, duration: DURATION.base });
    }
    settle();
  }, [settle]);

  const startWipe = useCallback(
    (href: string) => {
      const wipe = wipeRef.current!;
      const mark = wipeMarkRef.current!;
      setIsTransitioning(true);
      let resolveCovered: () => void = () => {};
      const covered = new Promise<void>((r) => (resolveCovered = r));
      pendingRef.current = { mode: "wipe", href, covered };

      gsap.set(wipe, { autoAlpha: 1, scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(mark, { opacity: 0 });
      const tl = gsap.timeline({ onComplete: () => resolveCovered() });
      tl.to(wipe, { scaleY: 1, duration: DURATION.slow, ease: EASE.inOutQuart }, 0);
      tl.to(mark, { opacity: 1, duration: DURATION.base }, 0.15);
      // Start fetching/rendering once ~95% covered so the old page never
      // visibly changes underneath.
      tl.call(() => router.push(href), [], 0.45);
    },
    [router]
  );

  const startShared = useCallback(
    (href: string, handoff: SharedImageHandoff) => {
      const layer = cloneLayerRef.current!;
      const veil = veilRef.current!;
      setIsTransitioning(true);

      const source = document.querySelector<HTMLElement>(
        `[data-shared-image="${CSS.escape(handoff.slug)}"]`
      );
      const clone = document.createElement("img");
      clone.src = handoff.src;
      clone.alt = "";
      clone.setAttribute("aria-hidden", "true");
      Object.assign(clone.style, {
        position: "fixed",
        top: `${handoff.from.top}px`,
        left: `${handoff.from.left}px`,
        width: `${handoff.from.width}px`,
        height: `${handoff.from.height}px`,
        objectFit: "cover",
        borderRadius: source ? getComputedStyle(source).borderRadius : "6px",
        pointerEvents: "none",
      } satisfies Partial<CSSStyleDeclaration>);
      layer.appendChild(clone);
      if (source) source.style.opacity = "0";

      pendingRef.current = { mode: "shared", href, handoff, clone, source };
      gsap.to(veil, { opacity: 0.6, duration: DURATION.base });
      router.push(href);
    },
    [router]
  );

  const push = useCallback<TransitionRouter["push"]>(
    (href, opts?: TransitionPushOptions) => {
      if (pendingRef.current) return; // ignore double clicks mid-transition

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }

      if (url.pathname === window.location.pathname) {
        // Same page: only scroll (to the hash, or the top).
        router.push(url.pathname + url.search + url.hash, { scroll: false });
        const hashTarget = url.hash
          ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
          : null;
        if (hashTarget) {
          hashTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (!url.hash) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      navTimeoutRef.current = window.setTimeout(abortToStable, NAVIGATION_TIMEOUT_MS);

      if (prefersReducedMotion()) {
        pendingRef.current = { mode: "instant", href };
        setIsTransitioning(true);
        router.push(href);
        return;
      }
      if (opts?.sharedImage) startShared(href, opts.sharedImage);
      else startWipe(href);
    },
    [router, startShared, startWipe, abortToStable]
  );

  const value = useMemo<TransitionRouter>(
    () => ({ push, isTransitioning }),
    [push, isTransitioning]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {/* White veil under a moving shared image */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85] bg-white opacity-0"
      />
      {/* Cardinal wipe */}
      <div
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[90] flex items-center justify-center bg-cardinal opacity-0"
        style={{ transform: "scaleY(0)" }}
      >
        <div ref={wipeMarkRef} className="opacity-0">
          <Wordmark tone="white" size="lg" />
        </div>
      </div>
      {/* Shared-image clones */}
      <div
        ref={cloneLayerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95]"
      />
    </TransitionContext.Provider>
  );
}
