"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdExpandLess, MdPause, MdPlayArrow } from "react-icons/md";

import { cn } from "@/app/lib/cn";
import { Button } from "@/app/components/ui/Button";
import { Container } from "@/app/components/ui/Container";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { IconButton } from "@/app/components/ui/IconButton";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from "@/app/components/ui/Menu";
import { Wordmark } from "@/app/components/ui/Wordmark";
import { DURATION, EASE, gsap } from "@/app/components/transitions/gsap";
import { markIntroDone, markIntroPending, navState } from "@/app/components/transitions/intro";
import { numberWordCapitalized } from "@/app/lib/words";

export interface FootageCredit {
  group: string;
  title: string;
  url: string;
  channel: string;
  in: string;
  out: string;
  order: number;
}

/**
 * Two cuts of the same loop, built by `tools/hero-video`: a 16:9 desktop encode
 * and a 9:16 mobile encode. Each poster is frame 0 of its own encode so the
 * hand-off from poster to video is invisible.
 */
export type HeroVariant = "desktop" | "mobile";
const VIDEO: Record<HeroVariant, { webm: string; mp4: string; poster: string }> = {
  desktop: {
    webm: "/assets/video/hero-loop.webm",
    mp4: "/assets/video/hero-loop.mp4",
    poster: "/assets/video/hero-poster.jpg",
  },
  mobile: {
    webm: "/assets/video/hero-loop-mobile.webm",
    mp4: "/assets/video/hero-loop-mobile.mp4",
    poster: "/assets/video/hero-poster-mobile.jpg",
  },
};
const POSTER = VIDEO.desktop.poster;
const POSTER_MOBILE = VIDEO.mobile.poster;
/**
 * Exact codec strings so `canPlayType` answers "" rather than "maybe". Without
 * them Safari selects the WebM source on hardware that cannot decode VP9,
 * fails once it is fetched, and only then (slowly, sometimes never) falls
 * through to the MP4. VP9 profile 0, 8-bit; H.264 High 4.1 (both set in
 * tools/hero-video/herovideo/encode.py).
 */
const WEBM_TYPE = 'video/webm; codecs="vp09.00.10.08"';
const MP4_TYPE = 'video/mp4; codecs="avc1.640029"';
const LOGO = "/assets/img/a_cappella_treble_clef_transparent.png";

/** Intro card timing (ms). See docs/DESIGN.md §6 "Intro card". */
const INTRO_MIN_MS = 900;
const INTRO_BAR_AFTER_MS = 2500;
const INTRO_CANPLAY_GRACE_MS = 1500;
const INTRO_HARD_TIMEOUT_MS = 9000;

/**
 * Full-viewport muted looping video (docs/DESIGN.md §5 item 1).
 *
 * The `<section>` is the `#hero-sentinel` the site header watches: the header
 * is drawn transparent over this block and turns solid once it scrolls past.
 *
 * Sources are attached only after mount: the portrait encode under 768px, the
 * landscape one above, and none at all under reduced motion or a data-saver
 * preference (those visitors see the poster). `hasVideo` is decided on the
 * server per variant from the presence of the encoded files, so a missing
 * asset never produces a failed request.
 *
 * Autoplay policy: a muted, playsinline video may autoplay everywhere except
 * when the visitor's device forbids it: iOS Low Power Mode, iOS Settings ›
 * Accessibility › Motion › "Auto-Play Video Previews" off, macOS Safari
 * "Never Auto-Play" for the site, or a browser with autoplay disabled. Those
 * reject `play()` with NotAllowedError, but the same call inside a user
 * gesture is allowed, so the poster stays, the control reads "Play", and the
 * first tap, click or key press anywhere retries (`prefers-reduced-motion`
 * visitors never get a video at all, see above). A visitor's own Pause is
 * final: nothing restarts it. If the tab is backgrounded or restored from the
 * back/forward cache, iOS pauses the element and does not always resume it,
 * so playback is retried when the page is visible again.
 *
 * Intro card: on a hard load of the homepage (not a client-side navigation
 * back to it) a cardinal card with the logo and wordmark covers the page while
 * the video buffers. It is server-rendered so there is no flash, hidden by CSS
 * without JS or under reduced motion, and dropped on mount whenever the video
 * itself won't be used. A thin progress bar appears only if loading takes more
 * than a couple of seconds. The transition provider waits for `sac:intro-done`
 * before revealing the page (see transitions/intro.ts).
 */
export function VideoHero({
  credits,
  groupCount,
  hasVideo,
}: {
  credits: FootageCredit[];
  groupCount: number;
  hasVideo: Record<HeroVariant, boolean>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { desktop: hasDesktopVideo, mobile: hasMobileVideo } = hasVideo;
  const [variant, setVariant] = useState<HeroVariant | null>(null);
  const useVideo = variant !== null;
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /** The visitor pressed Pause: no gesture, tab return or cache restore may restart it. */
  const userPausedRef = useRef(false);

  const [intro, setIntro] = useState<"pending" | "done">(hasDesktopVideo ? "pending" : "done");
  const introRootRef = useRef<HTMLDivElement>(null);
  const introEdgeRef = useRef<HTMLDivElement>(null);
  const introCardRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLImageElement>(null);
  const introMarkRef = useRef<HTMLDivElement>(null);
  const introTrackRef = useRef<HTMLDivElement>(null);
  const introBarRef = useRef<HTMLDivElement>(null);
  const introActiveRef = useRef(false);
  const introStartedAtRef = useRef(0);
  const introBarShownRef = useRef(false);
  const introFinishingRef = useRef(false);
  const introBarTweenRef = useRef<gsap.core.Tween | null>(null);

  /** Lift the card (after the minimum time) and let the page reveal. */
  const finishIntro = useCallback(() => {
    if (!introActiveRef.current || introFinishingRef.current) return;
    introFinishingRef.current = true;
    const elapsed = performance.now() - introStartedAtRef.current;
    const wait = Math.max(0, INTRO_MIN_MS - elapsed);

    window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
      const card = introCardRef.current;
      const edge = introEdgeRef.current;
      if (!card || !edge) {
        markIntroDone();
        setIntro("done");
        return;
      }
      const tl = gsap.timeline({
        onComplete: () => {
          introActiveRef.current = false;
          setIntro("done");
        },
      });
      if (introBarShownRef.current && introBarRef.current) {
        introBarTweenRef.current?.kill();
        tl.to(introBarRef.current, { scaleX: 1, duration: 0.25, ease: "power2.out" }, 0);
      }
      const at = introBarShownRef.current ? 0.25 : 0;
      // The entrance is a CSS animation (so it plays before hydration); drop
      // it before tweening so its fill value can't pin the opacity.
      tl.set([introLogoRef.current, introMarkRef.current], { animation: "none", opacity: 1, y: 0 }, at);
      tl.to(
        [introLogoRef.current, introMarkRef.current, introTrackRef.current],
        { opacity: 0, y: -6, duration: DURATION.fast, ease: "power1.in" },
        at
      );
      tl.set([card, edge], { transformOrigin: "50% 0%" }, at);
      tl.to(card, { scaleY: 0, duration: DURATION.slow, ease: EASE.inOutQuart }, at + 0.1);
      tl.to(edge, { scaleY: 0, duration: DURATION.slow, ease: EASE.inOutQuart }, at + 0.16);
      // Let the page underneath start revealing as the card clears the top third.
      tl.call(markIntroDone, [], at + 0.34);
    }, wait);
  }, []);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const wanted: HeroVariant = small ? "mobile" : "desktop";
    const available = wanted === "mobile" ? hasMobileVideo : hasDesktopVideo;
    const ok = available && !reduced && !connection?.saveData;
    if (ok) setVariant(wanted);

    // The intro card is desktop-only: phones fade the video in over the
    // poster instead of waiting on a cellular buffer. Also none under reduced
    // motion, data-saver, or on client-side arrivals.
    if (!ok || small || navState.routed || !document.documentElement.classList.contains("js")) {
      setIntro("done");
      return;
    }

    markIntroPending();
    introActiveRef.current = true;
    introStartedAtRef.current = performance.now();

    const barTimer = window.setTimeout(() => {
      if (!introActiveRef.current || introFinishingRef.current) return;
      introBarShownRef.current = true;
      if (introTrackRef.current) {
        gsap.to(introTrackRef.current, { opacity: 1, duration: DURATION.base });
      }
      // Until real progress arrives, drift toward 85% so it never looks stuck.
      if (introBarRef.current) {
        introBarTweenRef.current = gsap.to(introBarRef.current, {
          scaleX: 0.85,
          duration: 6,
          ease: "power1.out",
        });
      }
    }, INTRO_BAR_AFTER_MS);
    const hardTimer = window.setTimeout(finishIntro, INTRO_HARD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(barTimer);
      window.clearTimeout(hardTimer);
    };
  }, [hasDesktopVideo, hasMobileVideo, finishIntro]);

  useEffect(() => {
    if (!useVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      if (!introBarShownRef.current || !introBarRef.current) return;
      const { buffered, duration } = video;
      if (!duration || !isFinite(duration) || buffered.length === 0) return;
      const fraction = Math.min(1, buffered.end(buffered.length - 1) / duration);
      introBarTweenRef.current?.kill();
      introBarTweenRef.current = gsap.to(introBarRef.current, {
        scaleX: Math.max(fraction, 0.05),
        duration: 0.4,
        ease: "power2.out",
      });
    };
    let canPlayTimer: number | null = null;
    const onCanPlay = () => {
      if (canPlayTimer === null) canPlayTimer = window.setTimeout(finishIntro, INTRO_CANPLAY_GRACE_MS);
    };
    const onReady = () => finishIntro();

    video.addEventListener("progress", onProgress);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("error", onReady);
    video.addEventListener("stalled", onProgress);

    // React sets `muted` as a property only. Mirror it to the content
    // attribute (`defaultMuted` reflects it) so every autoplay policy check
    // sees a muted element however it inspects the node.
    video.muted = true;
    video.defaultMuted = true;

    // With <source> children an unsupported or unreachable resource fires
    // `error` on the last <source>, never on the element. No playable source:
    // keep the poster, drop the control, and don't hold the intro card.
    const lastSource = video.querySelector("source:last-of-type");
    const onNoSource = () => {
      finishIntro();
      setVariant(null);
    };
    lastSource?.addEventListener("error", onNoSource);

    // Keep the control truthful when the browser itself pauses or resumes
    // (backgrounded tab, phone call, Low Power Mode engaging mid-play).
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // Autoplay refused (see the component note): retry inside the visitor's
    // first gesture. Capture phase so a tap that navigates away still counts;
    // the pause control is excluded because it manages the element itself.
    const UNLOCK_EVENTS = ["pointerup", "touchend", "click", "keydown"] as const;
    let armed = false;
    function onGesture(event: Event) {
      if (userPausedRef.current) return disarm();
      if (toggleRef.current?.contains(event.target as Node | null)) return;
      video!.play().then(disarm, () => {});
    }
    function arm() {
      if (armed || userPausedRef.current) return;
      armed = true;
      for (const type of UNLOCK_EVENTS) {
        document.addEventListener(type, onGesture, { capture: true, passive: true });
      }
    }
    function disarm() {
      if (!armed) return;
      armed = false;
      for (const type of UNLOCK_EVENTS) document.removeEventListener(type, onGesture, true);
    }

    const attemptPlay = () => {
      video.play().then(disarm, (err: unknown) => {
        const name = err instanceof DOMException ? err.name : "";
        // A load() or pause() interrupted this call; the next one will do.
        if (name === "AbortError") return;
        // Policy refusal (or no source yet, which the <source> error handles):
        // keep the poster, let the control read "Play", and don't hold the
        // intro card on a video that isn't coming.
        setPaused(true);
        finishIntro();
        if (name === "NotAllowedError") arm();
      });
    };

    // iOS pauses the element when the tab is backgrounded or the page enters
    // the back/forward cache and does not always resume it on return.
    const onVisible = () => {
      if (document.visibilityState !== "visible" || userPausedRef.current) return;
      if (video.paused) attemptPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);

    // Sources were added after mount; ask the element to pick one up.
    video.load();
    attemptPlay();
    if (video.readyState >= 4) finishIntro();

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("error", onReady);
      video.removeEventListener("stalled", onProgress);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      lastSource?.removeEventListener("error", onNoSource);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
      disarm();
      if (canPlayTimer !== null) window.clearTimeout(canPlayTimer);
    };
  }, [useVideo, finishIntro]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
      setPaused(false);
    } else {
      userPausedRef.current = true;
      video.pause();
      setPaused(true);
    }
  }, []);

  const sortedCredits = [...credits].sort((a, b) => a.order - b.order);

  return (
    <>
      {intro === "pending" && (
        <div
          ref={introRootRef}
          data-intro
          aria-hidden="true"
          className="fixed inset-0 z-[88] hidden md:block"
        >
          <div ref={introEdgeRef} className="absolute inset-0 bg-cardinal-dark" />
          <div
            ref={introCardRef}
            className="absolute inset-0 flex flex-col items-center justify-center bg-cardinal text-white"
          >
            <div className="flex flex-col items-center gap-7">
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative, animated by GSAP */}
              <img
                ref={introLogoRef}
                src={LOGO}
                alt=""
                width={72}
                height={72}
                draggable={false}
                className="intro-enter h-[72px] w-[72px] brightness-0 invert select-none"
              />
              <div ref={introMarkRef} className="intro-enter [animation-delay:150ms]">
                <Wordmark tone="white" size="lg" />
              </div>
            </div>
            <div
              ref={introTrackRef}
              className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20 opacity-0"
            >
              <div
                ref={introBarRef}
                className="h-full w-full origin-left bg-white"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      )}

      <section
        id="hero-sentinel"
        aria-labelledby="hero-heading"
        className="relative isolate flex min-h-[640px] h-svh flex-col justify-end overflow-hidden bg-black text-white"
      >
        {/* Poster: portrait crop on phones, landscape elsewhere. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20">
          <picture className="block size-full">
            <source media="(min-width: 768px)" srcSet={POSTER} />
            {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed background with art-directed sources */}
            <img
              src={POSTER_MOBILE}
              alt=""
              draggable={false}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </picture>
        </div>

        {variant && (
          <video
            ref={videoRef}
            aria-hidden="true"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            poster={VIDEO[variant].poster}
            disablePictureInPicture
            onPlaying={() => setPlaying(true)}
            className={cn(
              "absolute inset-0 -z-10 size-full object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]",
              playing ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={VIDEO[variant].webm} type={WEBM_TYPE} />
            <source src={VIDEO[variant].mp4} type={MP4_TYPE} />
          </video>
        )}

        {/* Single legibility scrim: heaviest at the bottom, a touch at the top for the header. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[5] bg-linear-to-t from-black/80 via-black/15 via-55% to-black/35"
        />

        <Container className="relative flex flex-col gap-10 pb-14 pt-[calc(var(--header-h)+2rem)] sm:pb-20 md:flex-row md:items-end md:justify-between md:gap-8 lg:pb-24">
          <div className="max-w-[44rem]">
            <Eyebrow tone="white" data-reveal>
              Stanford University
            </Eyebrow>
            <Heading as="h1" size="display" id="hero-heading" data-reveal className="mt-4 text-white">
              A Cappella at Stanford
            </Heading>
            <p data-reveal className="type-lead mt-6 max-w-[36rem] text-white/85">
              {numberWordCapitalized(groupCount)} student groups and more than sixty years of
              harmony on the Farm. Meet every group, find an upcoming show, and learn how to
              audition.
            </p>
            <div data-reveal className="mt-9 flex flex-wrap gap-3">
              <Button href="/#groups" variant="on-cardinal" size="lg">
                Meet the groups
              </Button>
              <Button href="/shows" variant="on-cardinal-outline" size="lg">
                Upcoming shows
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            {sortedCredits.length > 0 && (
              <Menu>
                <MenuTrigger
                  className="inline-flex h-11 items-center gap-1 rounded-sm px-2 text-[0.9375rem] font-semibold text-white/80 underline decoration-1 underline-offset-[3px] transition-colors duration-150 hover:text-white focus-ring"
                  aria-label="Footage credits"
                >
                  Footage credits
                  <MdExpandLess aria-hidden="true" className="text-[1.1em]" />
                </MenuTrigger>
                <MenuContent align="end" side="top" className="max-h-[60svh] overflow-y-auto">
                  <MenuLabel>Footage, in order of appearance</MenuLabel>
                  {sortedCredits.map((credit) => (
                    <MenuItem key={`${credit.url}-${credit.order}`} asChild>
                      <a href={credit.url} target="_blank" rel="noopener noreferrer">
                        <span className="flex min-w-0 flex-col leading-snug">
                          <span className="truncate">{credit.group}</span>
                          <span className="type-small truncate text-black-60">{credit.title}</span>
                        </span>
                      </a>
                    </MenuItem>
                  ))}
                </MenuContent>
              </Menu>
            )}
            {useVideo && (
              <IconButton
                ref={toggleRef}
                tone="white"
                label={paused ? "Play background video" : "Pause background video"}
                aria-pressed={paused}
                onClick={toggle}
                className="bg-black/20 hover:bg-black/35"
              >
                {paused ? <MdPlayArrow /> : <MdPause />}
              </IconButton>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
