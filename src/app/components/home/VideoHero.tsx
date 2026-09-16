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

const VIDEO_WEBM = "/assets/video/hero-loop.webm";
const VIDEO_MP4 = "/assets/video/hero-loop.mp4";
const POSTER = "/assets/video/hero-poster.jpg";
const POSTER_MOBILE = "/assets/video/hero-poster-mobile.jpg";
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
 * Sources are attached only after mount, and only on wide viewports without
 * reduced motion or a data-saver preference; everyone else sees the poster.
 * `hasVideo` is decided on the server from the presence of the encoded files
 * so a missing asset never produces a failed request.
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
  hasVideo: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const [intro, setIntro] = useState<"pending" | "done">(hasVideo ? "pending" : "done");
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
    if (!hasVideo) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const ok = !small && !reduced && !connection?.saveData;
    if (ok) setUseVideo(true);

    // No intro on phones, reduced motion, data-saver, or client-side arrivals.
    if (!ok || navState.routed || !document.documentElement.classList.contains("js")) {
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
  }, [hasVideo, finishIntro]);

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

    // Sources were added after mount; ask the element to pick one up.
    video.load();
    video.play().catch(() => {
      /* autoplay blocked: the poster stays, the control still works */
    });
    if (video.readyState >= 4) finishIntro();

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("error", onReady);
      video.removeEventListener("stalled", onProgress);
      if (canPlayTimer !== null) window.clearTimeout(canPlayTimer);
    };
  }, [useVideo, finishIntro]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
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

        {useVideo && (
          <video
            ref={videoRef}
            aria-hidden="true"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            poster={POSTER}
            disablePictureInPicture
            onPlaying={() => setPlaying(true)}
            className={cn(
              "absolute inset-0 -z-10 size-full object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]",
              playing ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
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
