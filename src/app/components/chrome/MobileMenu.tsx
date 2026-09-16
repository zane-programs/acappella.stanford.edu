"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

import { cn } from "@/app/lib/cn";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { DURATION, EASE, gsap, prefersReducedMotion } from "@/app/components/transitions/gsap";
import { IconButton } from "@/app/components/ui/IconButton";
import { Wordmark } from "@/app/components/ui/Wordmark";
import { AuditionsNavButton } from "./AuditionsNavButton";
import type { NavGroup, NavItem } from "./SiteHeader";

interface MobileMenuProps {
  nav: NavItem[];
  groups: NavGroup[];
  /** Follows the header tone so the trigger is legible over the video. */
  onOverlay: boolean;
}

type Phase = "closed" | "opening" | "open" | "closing";

/**
 * Full-screen cardinal menu (docs/DESIGN.md §4). Radix Dialog gives the focus
 * trap, Escape, outside-press, scroll lock and aria-hiding of the page; GSAP
 * owns every frame of the open and the close.
 *
 * Radix keeps the panel mounted while `phase !== "closed"`, so the close can
 * animate first; only then does Radix unmount it, release the scroll lock and
 * hand focus back to the trigger. (Force-mounting the modal content is not an
 * option: Radix would lock scroll and aria-hide the page permanently.)
 */
export function MobileMenu({ nav, groups, onOverlay }: MobileMenuProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const phaseRef = useRef<Phase>("closed");
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineBottomRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  const setPhaseBoth = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const lines = useCallback(
    () => [lineTopRef.current, lineBottomRef.current].filter((el): el is HTMLSpanElement => !!el),
    []
  );

  const open = useCallback(() => {
    if (phaseRef.current === "opening" || phaseRef.current === "open") return;
    tlRef.current?.kill();
    setPhaseBoth("opening"); // Radix mounts the panel; the effect below animates it.
  }, [setPhaseBoth]);

  // Entrance. Radix portals the panel in a follow-up commit, so the refs can
  // be empty on the first pass; poll a few frames until it exists. The
  // `menu-entering` styles hold everything off-screen/invisible until then.
  useEffect(() => {
    if (phase !== "opening") return;
    let raf = 0;
    let tries = 0;
    const attempt = () => {
      const panel = panelRef.current;
      const overlay = overlayRef.current;
      if (!panel || !overlay) {
        if (tries++ < 20) raf = requestAnimationFrame(attempt);
        return;
      }
      const links = Array.from(panel.querySelectorAll<HTMLElement>("[data-menu-link]"));
      const groupsList = panel.querySelector<HTMLElement>("[data-menu-groups]");

      if (prefersReducedMotion()) {
        gsap.set([panel, overlay, ...links, groupsList].filter(Boolean), { clearProps: "all" });
        setPhaseBoth("open");
        return;
      }

      gsap.set(overlay, { opacity: 0 });
      // `x: 0` discards the inline translateX(100%) GSAP would otherwise parse
      // into its cache and add on top of xPercent.
      gsap.set(panel, { x: 0, xPercent: 100 });
      gsap.set(links, { y: 24, opacity: 0 });
      if (groupsList) gsap.set(groupsList, { y: 12, opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhaseBoth("open") });
      tl.to(overlay, { opacity: 1, duration: 0.2 }, 0);
      tl.to(panel, { xPercent: 0, duration: DURATION.slow, ease: EASE.outExpo }, 0);
      tl.to(
        links,
        { y: 0, opacity: 1, duration: DURATION.slow, ease: EASE.outExpo, stagger: 0.04 },
        0.18
      );
      if (groupsList) {
        tl.to(groupsList, { y: 0, opacity: 1, duration: 0.45, ease: EASE.outExpo }, 0.42);
      }
      // Hamburger → X.
      const [top, bottom] = lines();
      if (top && bottom) {
        tl.to(top, { y: 4, rotate: 45, duration: DURATION.base, ease: EASE.outExpo }, 0);
        tl.to(bottom, { y: -4, rotate: -45, duration: DURATION.base, ease: EASE.outExpo }, 0);
      }
      tlRef.current = tl;
    };
    attempt();
    return () => cancelAnimationFrame(raf);
  }, [phase, lines, setPhaseBoth]);

  const close = useCallback(() => {
    if (phaseRef.current === "closing" || phaseRef.current === "closed") return;
    tlRef.current?.kill();
    setPhaseBoth("closing");
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    const finish = () => {
      setPhaseBoth("closed"); // Radix unmounts, unlocks scroll, restores focus.
      triggerRef.current?.focus({ preventScroll: true });
    };
    if (!panel || !overlay || prefersReducedMotion()) {
      gsap.set(lines(), { clearProps: "transform" });
      finish();
      return;
    }
    const links = Array.from(panel.querySelectorAll<HTMLElement>("[data-menu-link]")).reverse();
    const groupsList = panel.querySelector<HTMLElement>("[data-menu-groups]");

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(links, { opacity: 0, y: 8, duration: 0.12, ease: "power1.in", stagger: 0.02 }, 0);
    if (groupsList) tl.to(groupsList, { opacity: 0, duration: 0.12 }, 0);
    tl.to(panel, { xPercent: 100, duration: 0.45, ease: "power3.in" }, 0.05);
    tl.to(overlay, { opacity: 0, duration: 0.3 }, 0.2);
    tl.to(lines(), { y: 0, rotate: 0, duration: DURATION.base, ease: EASE.outExpo }, 0);
    tlRef.current = tl;
  }, [lines, setPhaseBoth]);

  // Route changed (a menu link, or Back): the wipe is covering, slide away.
  useEffect(() => {
    if (phaseRef.current === "open" || phaseRef.current === "opening") close();
  }, [pathname, close]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const radixOpen = phase !== "closed";
  const entering = phase === "opening";

  return (
    <Dialog.Root
      open={radixOpen}
      onOpenChange={(next) => {
        if (next) open();
        else close();
      }}
    >
      <Dialog.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-2.5 rounded-sm px-2 text-[0.9375rem] font-semibold transition-colors duration-150 focus-ring lg:hidden",
            onOverlay ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
          )}
          aria-label={radixOpen ? "Close menu" : "Open menu"}
        >
          <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
            <span ref={lineTopRef} className="block h-[2px] w-full bg-current" />
            <span ref={lineBottomRef} className="block h-[2px] w-full bg-current" />
          </span>
          Menu
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="fixed inset-0 z-[99] bg-black/20"
          style={entering ? { opacity: 0 } : undefined}
        />
        <Dialog.Content
          ref={panelRef}
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            close();
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            if (phaseRef.current === "open") close();
          }}
          className="fixed inset-y-0 right-0 z-[100] flex w-full flex-col overflow-y-auto bg-cardinal text-white shadow-elevated outline-none sm:max-w-[26rem]"
          // Held off-screen until the entrance timeline takes over (GSAP writes
          // the same inline `transform`, so there is no fight once it starts).
          style={entering ? { transform: "translateX(100%)" } : undefined}
        >
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-5 sm:px-8">
            <Dialog.Title asChild>
              <TransitionLink href="/" className="focus-ring rounded-sm" onClick={close}>
                <Wordmark tone="white" size="sm" />
                <span className="sr-only">Home</span>
              </TransitionLink>
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label="Close menu" tone="white">
                <MdClose />
              </IconButton>
            </Dialog.Close>
          </div>

          <nav aria-label="Main navigation" className="px-5 pt-6 sm:px-8">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href} data-menu-link>
                  <TransitionLink
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "type-h1 block py-2.5 text-white transition-opacity duration-150 hover:opacity-80 focus-ring rounded-sm",
                      pathname === item.href && "underline decoration-white/60 decoration-2 underline-offset-8"
                    )}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
              <li data-menu-link className="mt-4">
                <AuditionsNavButton onCardinal />
              </li>
            </ul>
          </nav>

          <div data-menu-groups className="mt-auto px-5 pb-10 pt-12 sm:px-8">
            <p className="type-eyebrow mb-3 text-white/70">Groups</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {groups.map((g) => (
                <li key={g.slug}>
                  <TransitionLink
                    href={`/${g.slug}`}
                    onClick={close}
                    className="type-small block py-1 font-semibold text-white/90 hover:text-white focus-ring rounded-sm"
                  >
                    {g.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
