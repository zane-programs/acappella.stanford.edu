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
import { navState, whenIntroDone } from "./intro";
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
 * - `[data-shared-image="<slug>"]`: an <img> that a tile hands off to the
 *   matching <img> on the destination page (and back again on Back).
 * - Scroll is owned here: `history.scrollRestoration` is manual, every push
 *   uses `{ scroll: false }`, and per-URL scroll positions are remembered so
 *   Back/Forward land exactly where the visitor left.
 * - Reduced motion: every sequence collapses to an instant swap.
 *
 * Technique: before the route changes, <main> is cloned into a fixed layer
 * (a "snapshot") and the real <main> is hidden. The snapshot is what animates
 * out, so the moment Next swaps the DOM underneath is never visible, however
 * long the fetch takes. Images that morph are separate clones on top.
 */

type Pending =
  | { mode: "instant"; scrollY: number | null }
  | { mode: "wipe"; href: string; covered: Promise<void> }
  | { mode: "history"; scrollY: number; snap: HTMLElement }
  | {
      mode: "morph";
      toUrl: string;
      fromUrl: string;
      slug: string;
      clone: HTMLImageElement;
      snap: HTMLElement;
      headerTop: number;
    }
  | {
      mode: "reverse";
      slug: string;
      clone: HTMLImageElement;
      snap: HTMLElement;
      scrollY: number;
      bandRect: DOMRect;
      headerTop: number;
    };

const MAX_STAGGERED = 8;
const TARGET_TIMEOUT_MS = 800;
const NAVIGATION_TIMEOUT_MS = 8000;
const RELOAD_SCROLL_KEY = "sac:reload-scroll";

/* ---------- memory (module-level so it survives re-renders) ---------- */

/** Last scroll position per URL (pathname + search). */
const scrollMemory = new Map<string, number>();
/** Group pages entered via the tile morph: destination URL → where from. */
const morphMemory = new Map<string, { fromUrl: string; slug: string }>();

function urlKey(): string {
  return window.location.pathname + window.location.search;
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

function hashTargetOf(href: string): HTMLElement | null {
  try {
    const hash = new URL(href, window.location.href).hash;
    return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  } catch {
    return null;
  }
}

function scrollInstant(top: number) {
  window.scrollTo({ top, left: 0, behavior: "instant" });
}

function findSharedImage(slug: string): HTMLElement | null {
  const main = document.getElementById("main-content");
  const el = main?.querySelector<HTMLElement>(
    `[data-shared-image="${CSS.escape(slug)}"]`
  );
  return el && el.getBoundingClientRect().width > 0 ? el : null;
}

function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

/** Delay per element proportional to its distance from `origin`, capped at `amount`. */
function radialStagger(origin: Element, amount: number) {
  const o = origin.getBoundingClientRect();
  const ox = o.left + o.width / 2;
  const oy = o.top + o.height / 2;
  return (_i: number, target: Element, list: Element[]) => {
    const dist = (el: Element) => {
      const r = el.getBoundingClientRect();
      return Math.hypot(r.left + r.width / 2 - ox, r.top + r.height / 2 - oy);
    };
    const max = Math.max(1, ...list.map(dist));
    return (dist(target) / max) * amount;
  };
}

/** Fixed <img> that stands in for an image while it flies between pages. */
function makeImageClone(from: DOMRect, src: string, radius: string): HTMLImageElement {
  const clone = document.createElement("img");
  clone.src = src;
  clone.alt = "";
  clone.setAttribute("aria-hidden", "true");
  clone.decoding = "sync";
  Object.assign(clone.style, {
    position: "absolute",
    top: `${from.top}px`,
    left: `${from.left}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: "cover",
    borderRadius: radius,
    pointerEvents: "none",
    willChange: "transform, width, height",
  } satisfies Partial<CSSStyleDeclaration>);
  return clone;
}

/**
 * Deep-clones <main> into `layer` at its current screen position. Ids and
 * shared-image markers are stripped so nothing else can find the copy; media
 * is dropped so nothing reloads or plays twice.
 */
function snapshotMain(main: HTMLElement, layer: HTMLElement): HTMLElement {
  const rect = main.getBoundingClientRect();
  const snap = main.cloneNode(true) as HTMLElement;
  snap.removeAttribute("id");
  snap.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  snap
    .querySelectorAll("[data-shared-image]")
    .forEach((el) => el.removeAttribute("data-shared-image"));
  snap.querySelectorAll("iframe, video, script, [data-intro]").forEach((el) => el.remove());
  snap.setAttribute("aria-hidden", "true");
  snap.setAttribute("inert", "");
  Object.assign(snap.style, {
    position: "absolute",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    overflow: "hidden",
    pointerEvents: "none",
  } satisfies Partial<CSSStyleDeclaration>);
  layer.appendChild(snap);
  return snap;
}

/** The sticky header and the masthead above it. */
function chrome(): HTMLElement[] {
  return [
    document.querySelector<HTMLElement>("header.site-header"),
    document.getElementById("masthead"),
  ].filter((el): el is HTMLElement => !!el);
}

function headerTop(): number {
  return document.querySelector("header.site-header")?.getBoundingClientRect().top ?? 0;
}

/**
 * After a scroll jump the sticky header may sit 32px lower or higher
 * (the masthead scrolls away). Slide header + masthead (+ any `followers`)
 * from where they were to where they are so the chrome never jumps.
 * Returns the delta so callers can move fixed elements along.
 */
function compensateChrome(before: number, followers: Element[] = []): number {
  const delta = headerTop() - before;
  if (Math.abs(delta) < 1) return 0;
  gsap.fromTo(
    [...chrome(), ...followers],
    { y: -delta },
    { y: 0, duration: DURATION.slow, ease: EASE.outExpo, clearProps: "transform", overwrite: true }
  );
  return delta;
}

/**
 * Flies a clone onto `target`, re-measuring the target every frame so the
 * landing is exact even if the page shifts underneath (late-mounting content,
 * the chrome slide, a scrollbar appearing). Width/height are tweened rather
 * than scaled so the border radius and image crop stay true the whole way.
 */
function flyClone(clone: HTMLElement, target: HTMLElement): gsap.core.Tween {
  const from = clone.getBoundingClientRect();
  const fromRadius = parseFloat(getComputedStyle(clone).borderRadius) || 0;
  const toRadius = parseFloat(getComputedStyle(target).borderRadius) || 0;
  const state = { p: 0 };
  const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
  const apply = () => {
    const to = target.getBoundingClientRect();
    const p = state.p;
    Object.assign(clone.style, {
      top: `${lerp(from.top, to.top, p)}px`,
      left: `${lerp(from.left, to.left, p)}px`,
      width: `${lerp(from.width, to.width, p)}px`,
      height: `${lerp(from.height, to.height, p)}px`,
      borderRadius: `${lerp(fromRadius, toRadius, p)}px`,
    });
  };
  gsap.set(clone, { scale: 1, clearProps: "transform" });
  return gsap.to(state, {
    p: 1,
    duration: DURATION.flight,
    ease: EASE.hero,
    onUpdate: apply,
    onComplete: apply,
  });
}

/** Cross-fades a flown clone into the real image and removes the clone. */
function landClone(clone: HTMLElement, target: HTMLElement, onDone: () => void) {
  gsap.to(target, { opacity: 1, duration: DURATION.base, clearProps: "opacity" });
  gsap.to(clone, {
    opacity: 0,
    duration: DURATION.base,
    onComplete: () => {
      clone.remove();
      onDone();
    },
  });
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const wipeRef = useRef<HTMLDivElement>(null);
  const wipeEdgeRef = useRef<HTMLDivElement>(null);
  const wipeBodyRef = useRef<HTMLDivElement>(null);
  const wipeMarkRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const pendingRef = useRef<Pending | null>(null);
  const currentUrlRef = useRef<string>("");
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
    (opts: { animate: boolean; exclude?: (Element | null | undefined)[] } = { animate: true }) => {
      killBatches();
      const main = document.getElementById("main-content");
      if (!main) return;
      const excluded = (opts.exclude ?? []).filter((e): e is Element => !!e);
      const els = Array.from(main.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
        (el) => !excluded.some((ex) => ex === el || ex.contains(el))
      );
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

  /* ---------- bookkeeping ---------- */

  const settle = useCallback(() => {
    pendingRef.current = null;
    setIsTransitioning(false);
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
  }, []);

  /** Drop every in-flight artifact and show the page as it is. */
  const hardReset = useCallback(() => {
    const layer = layerRef.current;
    const main = document.getElementById("main-content");
    if (layer) {
      gsap.killTweensOf(layer.querySelectorAll("*"));
      layer.replaceChildren();
    }
    if (bandRef.current) gsap.set(bandRef.current, { autoAlpha: 0, clearProps: "transform" });
    if (wipeRef.current) {
      gsap.set(wipeRef.current, { autoAlpha: 0 });
      gsap.set([wipeEdgeRef.current, wipeBodyRef.current], { scaleY: 0 });
    }
    if (main) {
      gsap.killTweensOf(main);
      gsap.set(main, { clearProps: "opacity,transform,clipPath" });
      main.querySelectorAll<HTMLElement>("[data-shared-image]").forEach((el) => {
        el.style.opacity = "";
      });
    }
    gsap.set(chrome(), { clearProps: "transform" });
    revealPage({ animate: false });
    settle();
  }, [revealPage, settle]);

  const armTimeout = useCallback(() => {
    if (navTimeoutRef.current) window.clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = window.setTimeout(hardReset, NAVIGATION_TIMEOUT_MS);
  }, [hardReset]);

  /* ---------- finish sequences (run after the new route painted) ---------- */

  const finishInstant = useCallback(
    (scrollY: number | null) => {
      const main = document.getElementById("main-content");
      if (scrollY !== null) scrollInstant(scrollY);
      else scrollInstant(0);
      if (main) gsap.set(main, { clearProps: "opacity,transform" });
      revealPage({ animate: false });
      settle();
    },
    [revealPage, settle]
  );

  const finishWipe = useCallback(
    async (pending: Extract<Pending, { mode: "wipe" }>) => {
      await pending.covered;
      await nextPaint();
      const main = document.getElementById("main-content");
      const hashTarget = hashTargetOf(pending.href);
      if (hashTarget) hashTarget.scrollIntoView({ behavior: "instant", block: "start" });
      else scrollInstant(0);
      if (main) gsap.set(main, { clearProps: "opacity,transform" });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(wipeRef.current!, { autoAlpha: 0 });
          settle();
        },
      });
      tl.to(wipeMarkRef.current!, { opacity: 0, y: -6, duration: DURATION.fast }, 0);
      tl.set([wipeEdgeRef.current, wipeBodyRef.current], { transformOrigin: "50% 0%" }, 0);
      tl.to(wipeBodyRef.current!, { scaleY: 0, duration: DURATION.wipe, ease: EASE.inOutQuart }, 0);
      tl.to(wipeEdgeRef.current!, { scaleY: 0, duration: DURATION.wipe, ease: EASE.inOutQuart }, 0.06);
      // Start revealing as the wipe clears the top third of the viewport.
      tl.call(() => revealPage({ animate: true }), [], 0.22);
    },
    [revealPage, settle]
  );

  const finishHistory = useCallback(
    async (pending: Extract<Pending, { mode: "history" }>) => {
      await nextPaint();
      const main = document.getElementById("main-content");
      const before = headerTop();
      scrollInstant(pending.scrollY);
      compensateChrome(before);
      revealPage({ animate: false });
      if (main) {
        gsap.fromTo(
          main,
          { opacity: 0 },
          { opacity: 1, duration: DURATION.base, clearProps: "opacity,transform" }
        );
      }
      gsap.to(pending.snap, {
        opacity: 0,
        duration: DURATION.base,
        onComplete: () => {
          pending.snap.remove();
          settle();
        },
      });
    },
    [revealPage, settle]
  );

  /** Wait (briefly) for an element with `data-shared-image={slug}` to exist and have a size. */
  const awaitSharedImage = useCallback(async (slug: string) => {
    const deadline = performance.now() + TARGET_TIMEOUT_MS;
    while (performance.now() < deadline) {
      const el = findSharedImage(slug);
      if (el) return el;
      await new Promise((r) => requestAnimationFrame(r));
    }
    return null;
  }, []);

  /** Forward morph landed on a page without a matching hero image. */
  const fallbackFromMorph = useCallback(
    (clone: HTMLElement, snap: HTMLElement, scrollY: number | null) => {
      const main = document.getElementById("main-content");
      const before = headerTop();
      scrollInstant(scrollY ?? 0);
      compensateChrome(before);
      if (main) {
        gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: DURATION.base, clearProps: "opacity" });
      }
      gsap.to([clone, snap], {
        opacity: 0,
        duration: DURATION.base,
        onComplete: () => {
          clone.remove();
          snap.remove();
          settle();
        },
      });
      revealPage({ animate: true });
    },
    [revealPage, settle]
  );

  const finishMorph = useCallback(
    async (pending: Extract<Pending, { mode: "morph" }>) => {
      await nextPaint();
      const main = document.getElementById("main-content")!;
      const target = await awaitSharedImage(pending.slug);
      if (!target) {
        fallbackFromMorph(pending.clone, pending.snap, 0);
        return;
      }

      const section = target.closest<HTMLElement>("section") ?? target;
      const textColumn = section.querySelector<HTMLElement>("[data-reveal]");
      const textItems = textColumn ? Array.from(textColumn.children) : [];

      // Land at the top of the new page under the (still hidden) real main.
      scrollInstant(0);
      target.style.opacity = "0";
      section.style.clipPath = "inset(0 0 100% 0)";
      gsap.set(main, { opacity: 1 });
      compensateChrome(pending.headerTop, [section]);
      morphMemory.set(pending.toUrl, { fromUrl: pending.fromUrl, slug: pending.slug });

      const tl = gsap.timeline();
      // 1. The cardinal band grows down from under the header…
      tl.to(
        section,
        {
          clipPath: "inset(0 0 0% 0)",
          duration: DURATION.slow,
          ease: EASE.outExpo,
          onComplete: () => {
            section.style.clipPath = "";
          },
        },
        0
      );
      // 2. …while the photo flies into place.
      tl.add(flyClone(pending.clone, target), 0.05);
      // 3. Hero copy steps in as the photo settles.
      if (textColumn) {
        tl.set(textColumn, { opacity: 1 }, 0.58);
        tl.fromTo(
          textItems,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: EASE.outExpo,
            stagger: 0.06,
            clearProps: "transform",
          },
          0.58
        );
      }
      // 4. Body content follows; the clone dissolves into the real image.
      tl.call(() => revealPage({ animate: true, exclude: [textColumn] }), [], 0.9);
      tl.call(
        () => {
          pending.snap.remove();
          landClone(pending.clone, target, settle);
        },
        [],
        DURATION.flight + 0.05
      );
    },
    [awaitSharedImage, fallbackFromMorph, revealPage, settle]
  );

  const finishReverse = useCallback(
    async (pending: Extract<Pending, { mode: "reverse" }>) => {
      await nextPaint();
      const main = document.getElementById("main-content")!;
      const band = bandRef.current!;
      const before = pending.headerTop;

      scrollInstant(pending.scrollY);
      const target = await awaitSharedImage(pending.slug);
      if (!target || !inViewport(target)) {
        gsap.to(band, { autoAlpha: 0, duration: DURATION.base, clearProps: "transform" });
        fallbackFromMorph(pending.clone, pending.snap, pending.scrollY);
        return;
      }

      const li = target.closest<HTMLElement>("li") ?? target.closest<HTMLElement>("[data-reveal]");
      const section = target.closest<HTMLElement>("section");
      const neighbors = section
        ? Array.from(section.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
            (el) => el !== li && !el.contains(target)
          )
        : [];
      const tileText = li ? Array.from(li.querySelectorAll<HTMLElement>("h3, p")) : [];

      // Prepare the landing tile: the frame itself is visible, but its photo
      // box (ring + placeholder) and caption stay hidden until the clone lands.
      const box = target.parentElement;
      target.style.opacity = "0";
      if (li) gsap.set(li, { opacity: 1 });
      if (box) gsap.set(box, { opacity: 0 });
      gsap.set(tileText, { opacity: 0 });
      gsap.set(neighbors, { opacity: 0 });

      // Everything outside the tile's section appears at once (under the
      // fading snapshot); the section itself radiates back in from the tile.
      revealPage({ animate: false, exclude: section ? [section] : [] });
      gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: DURATION.base, clearProps: "opacity" });

      const delta = compensateChrome(before);

      const tl = gsap.timeline();
      // 1. The cardinal band retreats up under the header.
      tl.set(band, { transformOrigin: "50% 0%" }, 0);
      tl.to(band, { scaleY: 0, y: delta, duration: 0.5, ease: EASE.inOutQuart }, 0);
      tl.set(band, { autoAlpha: 0, clearProps: "transform" }, 0.5);
      // 2. The photo flies back into its tile.
      tl.add(flyClone(pending.clone, target), 0);
      // 3. Neighbours return, radiating from the landing tile.
      if (neighbors.length) {
        tl.fromTo(
          neighbors,
          { opacity: 0, y: 12, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: EASE.outExpo,
            stagger: li ? radialStagger(li, 0.2) : 0.03,
            clearProps: "transform",
          },
          0.4
        );
      }
      if (tileText.length) {
        tl.to(tileText, { opacity: 1, duration: DURATION.base, clearProps: "opacity" }, 0.6);
      }
      tl.to(pending.snap, { opacity: 0, duration: DURATION.base }, 0);
      tl.call(
        () => {
          pending.snap.remove();
          if (box) gsap.set(box, { clearProps: "opacity" });
          landClone(pending.clone, target, settle);
        },
        [],
        DURATION.flight
      );
    },
    [awaitSharedImage, fallbackFromMorph, revealPage, settle]
  );

  /* ---------- route-change observer ---------- */

  useEffect(() => {
    // We own scroll restoration for the life of the app (never handed back:
    // the browser would otherwise fight the sequences below on Back/Forward).
    history.scrollRestoration = "manual";

    if (firstRunRef.current) {
      firstRunRef.current = false;
      currentUrlRef.current = urlKey();

      // Reload: put the visitor back where they were (browsers would, but we
      // took over scroll restoration).
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      let restore: number | null = null;
      if (nav?.type === "reload") {
        try {
          const raw = sessionStorage.getItem(RELOAD_SCROLL_KEY);
          if (raw) {
            const saved = JSON.parse(raw) as { url: string; y: number };
            if (saved.url === urlKey()) restore = saved.y;
          }
        } catch {
          restore = null;
        }
      }
      const onPageHide = () => {
        try {
          sessionStorage.setItem(RELOAD_SCROLL_KEY, JSON.stringify({ url: urlKey(), y: window.scrollY }));
        } catch {
          /* storage unavailable */
        }
      };
      window.addEventListener("pagehide", onPageHide);

      nextPaint()
        .then(() => {
          if (restore !== null && !hashTargetOf(window.location.href)) scrollInstant(restore);
          return whenIntroDone();
        })
        .then(() => revealPage({ animate: true }));

      return () => window.removeEventListener("pagehide", onPageHide);
    }

    // React StrictMode re-runs effects on mount; nothing changed, nothing to do.
    if (currentUrlRef.current === urlKey() && !pendingRef.current) return;

    navState.routed = true;
    currentUrlRef.current = urlKey();
    const pending = pendingRef.current;
    if (pending) {
      if (pending.mode === "wipe") void finishWipe(pending);
      else if (pending.mode === "morph") void finishMorph(pending);
      else if (pending.mode === "reverse") void finishReverse(pending);
      else if (pending.mode === "history") void finishHistory(pending);
      else finishInstant(pending.scrollY);
      if (pending.mode !== "morph") morphMemory.delete(urlKey());
      return;
    }
    // A push we didn't initiate (e.g. a redirect() from a page): plain reveal.
    nextPaint().then(() => revealPage({ animate: true }));
  }, [pathname, finishWipe, finishMorph, finishReverse, finishHistory, finishInstant, revealPage]);

  useEffect(() => () => killBatches(), [killBatches]);

  /* ---------- start sequences ---------- */

  const startWipe = useCallback(
    (href: string) => {
      const main = document.getElementById("main-content");
      setIsTransitioning(true);
      let resolveCovered: () => void = () => {};
      const covered = new Promise<void>((r) => (resolveCovered = r));
      pendingRef.current = { mode: "wipe", href, covered };

      const wipe = wipeRef.current!;
      const edge = wipeEdgeRef.current!;
      const body = wipeBodyRef.current!;
      const mark = wipeMarkRef.current!;
      gsap.set(wipe, { autoAlpha: 1 });
      gsap.set([edge, body], { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(mark, { opacity: 0, y: 8 });

      const tl = gsap.timeline({ onComplete: () => resolveCovered() });
      // Dark leading edge first, cardinal body a breath behind it.
      tl.to(edge, { scaleY: 1, duration: DURATION.wipe, ease: EASE.inOutQuart }, 0);
      tl.to(body, { scaleY: 1, duration: DURATION.wipe, ease: EASE.inOutQuart }, 0.06);
      if (main) tl.to(main, { opacity: 0.6, y: -8, duration: 0.4, ease: "power2.out" }, 0);
      tl.to(mark, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.outExpo }, 0.25);
      // Fetch/render once the page is essentially covered.
      tl.call(() => router.push(href, { scroll: false }), [], 0.38);
    },
    [router]
  );

  /**
   * Tile → hero. `navigate` is false when replaying the morph for a Forward
   * button press (the router already moved).
   */
  const startMorph = useCallback(
    (toUrl: string, handoff: SharedImageHandoff, navigate: boolean) => {
      const main = document.getElementById("main-content");
      const layer = layerRef.current;
      if (!main || !layer) {
        if (navigate) router.push(toUrl, { scroll: false });
        return;
      }
      setIsTransitioning(true);
      const fromUrl = urlKey();
      scrollMemory.set(fromUrl, window.scrollY);

      const source = findSharedImage(handoff.slug);
      const li = source?.closest<HTMLElement>("li") ?? null;
      const section = source?.closest<HTMLElement>("section") ?? null;

      // Mark, snapshot, unmark: the copies are what animate out.
      li?.setAttribute("data-morph-origin", "");
      section?.setAttribute("data-morph-section", "");
      const snap = snapshotMain(main, layer);
      li?.removeAttribute("data-morph-origin");
      section?.removeAttribute("data-morph-section");
      const snapLi = snap.querySelector<HTMLElement>("[data-morph-origin]");
      const snapSection = snap.querySelector<HTMLElement>("[data-morph-section]");
      const snapImg = snapLi?.querySelector<HTMLElement>("img");
      const receding = snapSection
        ? Array.from(snapSection.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
            (el) => el !== snapLi && !(snapLi && el.contains(snapLi))
          )
        : [];
      const caption = snapLi ? Array.from(snapLi.querySelectorAll<HTMLElement>("h3, p")) : [];

      const clone = makeImageClone(
        handoff.from,
        handoff.src,
        source ? getComputedStyle(source).borderRadius : "6px"
      );
      layer.appendChild(clone);
      if (snapImg) (snapImg.parentElement ?? snapImg).style.opacity = "0";
      gsap.set(main, { opacity: 0 });

      pendingRef.current = {
        mode: "morph",
        toUrl,
        fromUrl,
        slug: handoff.slug,
        clone,
        snap,
        headerTop: headerTop(),
      };
      if (navigate) router.push(toUrl, { scroll: false });

      const tl = gsap.timeline();
      // The chosen photo lifts; everything around it recedes, nearest first.
      tl.to(clone, { scale: 1.02, duration: 0.12, ease: "power1.out" }, 0);
      if (caption.length) tl.to(caption, { opacity: 0, duration: 0.2 }, 0);
      if (receding.length) {
        tl.to(
          receding,
          {
            opacity: 0,
            y: 12,
            scale: 0.985,
            duration: 0.35,
            ease: "power2.in",
            stagger: snapLi ? radialStagger(snapLi, 0.2) : 0.03,
          },
          0
        );
      }
      tl.to(snap, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 0.2);
    },
    [router]
  );

  /** Hero → tile, triggered from popstate (the router is already moving). */
  const startReverse = useCallback((slug: string, hero: HTMLElement, scrollY: number) => {
    const main = document.getElementById("main-content");
    const layer = layerRef.current;
    const band = bandRef.current;
    if (!main || !layer || !band) return false;
    setIsTransitioning(true);

    const section = hero.closest<HTMLElement>("section") ?? hero;
    const bandRect = section.getBoundingClientRect();
    const from = hero.getBoundingClientRect();
    const src = (hero as HTMLImageElement).currentSrc || (hero as HTMLImageElement).src;

    const snap = snapshotMain(main, layer);
    // The band keeps the cardinal under the flying photo after the snapshot fades.
    gsap.set(band, {
      autoAlpha: 1,
      top: bandRect.top,
      left: bandRect.left,
      width: bandRect.width,
      height: bandRect.height,
      scaleY: 1,
      y: 0,
      transformOrigin: "50% 0%",
    });
    const clone = makeImageClone(from, src, getComputedStyle(hero).borderRadius);
    layer.appendChild(clone);
    gsap.set(main, { opacity: 0 });

    pendingRef.current = {
      mode: "reverse",
      slug,
      clone,
      snap,
      scrollY,
      bandRect,
      headerTop: headerTop(),
    };
    return true;
  }, []);

  const startHistory = useCallback((scrollY: number) => {
    const main = document.getElementById("main-content");
    const layer = layerRef.current;
    if (!main || !layer) {
      pendingRef.current = { mode: "instant", scrollY };
      return;
    }
    setIsTransitioning(true);
    const snap = snapshotMain(main, layer);
    gsap.set(main, { opacity: 0 });
    pendingRef.current = { mode: "history", scrollY, snap };
  }, []);

  /* ---------- Back / Forward ---------- */

  useEffect(() => {
    const onPop = () => {
      const fromUrl = currentUrlRef.current;
      const toUrl = urlKey();
      if (fromUrl === toUrl) return; // hash-only change: nothing to transition
      if (pendingRef.current) hardReset();
      scrollMemory.set(fromUrl, window.scrollY);
      const saved = scrollMemory.get(toUrl) ?? 0;
      armTimeout();

      if (prefersReducedMotion() || !document.documentElement.classList.contains("js")) {
        pendingRef.current = { mode: "instant", scrollY: saved };
        return;
      }

      // Back out of a page we morphed into: fly the photo home.
      const back = morphMemory.get(fromUrl);
      if (back && back.fromUrl === toUrl) {
        const hero = findSharedImage(back.slug);
        if (hero && startReverse(back.slug, hero, saved)) return;
      }
      // Forward into a page we morphed into before: replay the morph.
      const fwd = morphMemory.get(toUrl);
      if (fwd && fwd.fromUrl === fromUrl) {
        const tile = findSharedImage(fwd.slug) as HTMLImageElement | null;
        if (tile && inViewport(tile)) {
          startMorph(
            toUrl,
            { slug: fwd.slug, from: tile.getBoundingClientRect(), src: tile.currentSrc || tile.src },
            false
          );
          return;
        }
      }
      startHistory(saved);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [armTimeout, hardReset, startHistory, startMorph, startReverse]);

  /* ---------- public push ---------- */

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
        const hashTarget = hashTargetOf(url.href);
        if (hashTarget) hashTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (!url.hash) window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      armTimeout();
      scrollMemory.set(urlKey(), window.scrollY);

      if (prefersReducedMotion() || !document.documentElement.classList.contains("js")) {
        pendingRef.current = { mode: "instant", scrollY: null };
        setIsTransitioning(true);
        router.push(href, { scroll: false });
        return;
      }
      if (opts?.sharedImage) startMorph(url.pathname + url.search, opts.sharedImage, true);
      else startWipe(href);
    },
    [router, startMorph, startWipe, armTimeout]
  );

  const value = useMemo<TransitionRouter>(
    () => ({ push, isTransitioning }),
    [push, isTransitioning]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {/* Snapshot of the outgoing page + flying image clones (under the header) */}
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[76] overflow-hidden"
      />
      {/* Cardinal band that retreats when a group page flies back into its tile (under the layer) */}
      <div
        ref={bandRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed z-[75] bg-cardinal opacity-0"
      />
      {/* Two-layer cardinal wipe (over everything, header included) */}
      <div
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[90] opacity-0"
      >
        <div
          ref={wipeEdgeRef}
          className="absolute inset-0 bg-cardinal-dark"
          style={{ transform: "scaleY(0)" }}
        />
        <div
          ref={wipeBodyRef}
          className="absolute inset-0 bg-cardinal"
          style={{ transform: "scaleY(0)" }}
        />
        <div ref={wipeMarkRef} className="absolute inset-0 flex items-center justify-center opacity-0">
          <Wordmark tone="white" size="lg" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
