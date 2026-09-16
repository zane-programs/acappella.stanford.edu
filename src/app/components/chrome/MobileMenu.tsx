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

/**
 * Full-screen cardinal menu (docs/DESIGN.md §4). Radix Dialog gives the focus
 * trap, Escape and scroll lock; GSAP does the slide and link stagger.
 */
export function MobileMenu({ nav, groups, onOverlay }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const pathname = usePathname();

  // Close instantly on route change (the wipe is already covering the page).
  useEffect(() => {
    setOpen(false);
    closingRef.current = false;
  }, [pathname]);

  const animateIn = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;
    const links = panel.querySelectorAll<HTMLElement>("[data-menu-link]");
    const groupsList = panel.querySelector<HTMLElement>("[data-menu-groups]");
    gsap.set(panel, { xPercent: 100 });
    gsap.set(links, { y: 24, opacity: 0 });
    if (groupsList) gsap.set(groupsList, { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(panel, { xPercent: 0, duration: DURATION.slow, ease: EASE.outExpo }, 0);
    tl.to(
      links,
      { y: 0, opacity: 1, duration: DURATION.slow, ease: EASE.outExpo, stagger: 0.04 },
      0.15
    );
    if (groupsList) tl.to(groupsList, { opacity: 1, duration: DURATION.base }, 0.4);
  }, []);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) {
      setOpen(false);
      return;
    }
    closingRef.current = true;
    gsap.to(panel, {
      xPercent: 100,
      duration: DURATION.base,
      ease: EASE.inOutQuart,
      onComplete: () => {
        closingRef.current = false;
        setOpen(false);
      },
    });
  }, []);

  useEffect(() => {
    if (open) animateIn();
  }, [open, animateIn]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setOpen(true);
        else requestClose();
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-2.5 rounded-sm px-2 text-[0.9375rem] font-semibold transition-colors duration-150 focus-ring lg:hidden",
            onOverlay ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
          )}
          aria-label="Open menu"
        >
          <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
            <span className="block h-[2px] w-full bg-current" />
            <span className="block h-[2px] w-full bg-current" />
          </span>
          Menu
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99] bg-black/20" />
        <Dialog.Content
          ref={panelRef}
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            requestClose();
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            requestClose();
          }}
          className="fixed inset-y-0 right-0 z-[100] flex w-full flex-col overflow-y-auto bg-cardinal text-white shadow-elevated outline-none sm:max-w-[26rem]"
        >
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-5 sm:px-8">
            <Dialog.Title asChild>
              <TransitionLink href="/" className="focus-ring rounded-sm" onClick={requestClose}>
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
                    onClick={requestClose}
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
                    onClick={requestClose}
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
