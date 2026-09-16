"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/app/lib/cn";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { Container } from "@/app/components/ui/Container";
import { Wordmark } from "@/app/components/ui/Wordmark";
import { AuditionsNavButton } from "./AuditionsNavButton";
import { MobileMenu } from "./MobileMenu";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  slug: string;
  name: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Groups", href: "/#groups" },
  { label: "Shows", href: "/shows" },
  { label: "About", href: "/about" },
];

type Tone = "auto" | "overlay" | "solid";

/** Height of the sticky header, also exposed as --header-h on the element. */
export const HEADER_HEIGHT_PX = 72;
export const HEADER_HEIGHT_MOBILE_PX = 64;

/**
 * Sticky site header (docs/DESIGN.md §4).
 *
 * Tone contract: a page that wants the header drawn over its hero renders an
 * element with `id="hero-sentinel"` (normally the hero <section> itself). The
 * header is transparent/white-text while that element is still under it and
 * turns solid once it scrolls past. See `.site-header` in globals.css.
 */
export function SiteHeader({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const [tone, setTone] = useState<Tone>("auto");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const attach = () => {
      const sentinel = document.getElementById("hero-sentinel");
      if (!sentinel) {
        setTone("solid");
        return;
      }
      const headerH =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) ||
        HEADER_HEIGHT_PX;
      observer = new IntersectionObserver(
        ([entry]) => setTone(entry.isIntersecting ? "overlay" : "solid"),
        { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: 0 }
      );
      observer.observe(sentinel);
    };

    // The new page mounts after the pathname changes; wait a frame.
    raf = requestAnimationFrame(() => requestAnimationFrame(attach));
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  const onOverlay = tone === "overlay" || (tone === "auto" && pathname === "/");

  return (
    <header
      data-tone={tone}
      className="site-header sticky top-0 z-[80] h-[var(--header-h)]"
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <TransitionLink
          href="/"
          className="focus-ring -ml-1 rounded-sm px-1"
          aria-label="Stanford A Cappella home"
        >
          <Wordmark tone="inherit" size="sm" className="lg:hidden" />
          <Wordmark tone="inherit" size="md" className="hidden lg:inline-flex" />
        </TransitionLink>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-8">
            {PRIMARY_NAV.map((item) => {
              const current =
                item.href === "/#groups" ? pathname === "/" : pathname === item.href;
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center text-[1.0625rem] font-semibold text-current focus-ring rounded-sm",
                      "after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-current after:transition-[width] after:duration-300 after:ease-[var(--ease-out-expo)]",
                      "hover:after:w-full aria-[current=page]:after:w-full"
                    )}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
          <AuditionsNavButton onCardinal={onOverlay} />
        </nav>

        <MobileMenu nav={PRIMARY_NAV} groups={groups} onOverlay={onOverlay} />
      </Container>
    </header>
  );
}
