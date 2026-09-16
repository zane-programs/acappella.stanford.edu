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

  useEffect(() => {
    if (!hasVideo) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (!small && !reduced && !connection?.saveData) setUseVideo(true);
  }, [hasVideo]);

  useEffect(() => {
    if (!useVideo) return;
    const video = videoRef.current;
    if (!video) return;
    // Sources were added after mount; ask the element to pick one up.
    video.load();
    video.play().catch(() => {
      /* autoplay blocked: the poster stays, the control still works */
    });
  }, [useVideo]);

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
          preload="metadata"
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
  );
}

