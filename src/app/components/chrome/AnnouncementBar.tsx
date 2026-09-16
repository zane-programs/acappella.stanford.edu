"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdClose, MdExpandMore } from "react-icons/md";

import { ACTIVE_NOTIFICATIONS, type Notification } from "@/app/config/notifications";
import { cn } from "@/app/lib/cn";
import { DURATION, EASE, gsap, prefersReducedMotion } from "@/app/components/transitions/gsap";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { Container } from "@/app/components/ui/Container";
import { IconButton } from "@/app/components/ui/IconButton";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/app/components/ui/Menu";
import { detectPlatform, getCalendarLinks, type CalendarLink } from "@/app/utils/calendar";

/**
 * Slim announcement strip (docs/DESIGN.md §4). Replaces the old
 * NotificationBanner/NotificationManager while keeping the `Notification`
 * config shape, dismiss storage keys, date windows and page filters.
 *
 * The layout renders it in `.announcement-slot`, which CSS hides on pages with
 * a `#hero-sentinel`; those pages render `<AnnouncementBar inline />` below
 * their hero instead.
 */
export function AnnouncementBar({ inline = false }: { inline?: boolean }) {
  const sorted = [...ACTIVE_NOTIFICATIONS].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );
  if (sorted.length === 0) return null;
  return (
    <div className={cn(!inline && "announcement-slot")}>
      {sorted.map((n) => (
        <AnnouncementItem key={n.id} notification={n} />
      ))}
    </div>
  );
}

function storageFor(n: Notification): Storage | null {
  if (typeof window === "undefined") return null;
  return n.dismissDuration === "permanent" ? window.localStorage : window.sessionStorage;
}

function AnnouncementItem({ notification: n }: { notification: Notification }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [calendarLinks, setCalendarLinks] = useState<CalendarLink[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dismissedKey = `dismissed:${n.id}`;

  useEffect(() => {
    const onPage =
      !(n.hidePages && n.hidePages.includes(pathname)) &&
      (!n.displayPages || n.displayPages.length === 0 || n.displayPages.includes(pathname));
    const now = new Date();
    const inWindow =
      !(n.startDate && now < n.startDate) && !(n.endDate && now > n.endDate);
    let dismissed = false;
    try {
      dismissed = !!storageFor(n)?.getItem(dismissedKey);
    } catch {
      dismissed = false;
    }
    setVisible(onPage && inWindow && !dismissed);
  }, [pathname, n, dismissedKey]);

  useEffect(() => {
    if (!visible || !n.calendarEvent) return;
    setCalendarLinks(getCalendarLinks(n.calendarEvent, detectPlatform(navigator.userAgent)));
  }, [visible, n.calendarEvent]);

  const remember = useCallback(() => {
    try {
      storageFor(n)?.setItem(dismissedKey, "1");
    } catch {
      /* storage unavailable */
    }
  }, [n, dismissedKey]);

  const dismiss = useCallback(() => {
    if (n.analytics) {
      window.gtag?.("event", "closeBanner", {
        event_category: n.analytics.category,
        event_label: n.analytics.label,
      });
    }
    remember();
    const el = wrapRef.current;
    if (!el || prefersReducedMotion()) {
      setVisible(false);
      return;
    }
    gsap.to(el, {
      height: 0,
      opacity: 0,
      duration: DURATION.base,
      ease: EASE.inOutQuart,
      onComplete: () => setVisible(false),
    });
  }, [n, remember]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label={n.title}
      className="overflow-hidden border-b border-black-10 bg-fog-light text-black"
    >
      <Container className="flex items-start gap-3 py-2.5 sm:items-center">
        <p className="type-small flex-1 leading-snug">
          <span className="font-semibold">{n.title}</span>
          {n.subtitle && <span className="text-black-80"> {n.subtitle}.</span>}
          {n.description && (
            <span className="text-black-70">
              {" "}
              <span aria-hidden="true" className="hidden sm:inline">
                ·{" "}
              </span>
              <span className="block sm:inline">{n.description}</span>
            </span>
          )}
          {(n.action || calendarLinks.length > 0) && (
            <span className="ml-1 inline-flex flex-wrap items-baseline gap-x-3">
              {n.action && (
                <TransitionLink
                  href={n.action.href}
                  onClick={() => {
                    remember();
                    n.action?.onClick?.();
                  }}
                  className="font-semibold text-digital-red underline decoration-1 underline-offset-[3px] hover:text-digital-red-light focus-ring rounded-sm"
                >
                  {n.action.label}
                </TransitionLink>
              )}
              {n.calendarEvent && calendarLinks.length > 0 && (
                <Menu>
                  <MenuTrigger
                    className="inline-flex items-center gap-0.5 font-semibold text-digital-red underline decoration-1 underline-offset-[3px] hover:text-digital-red-light focus-ring rounded-sm"
                    aria-label={`Add to calendar: ${n.calendarEvent.title}`}
                  >
                    Add to calendar
                    <MdExpandMore aria-hidden="true" className="text-[1.1em]" />
                  </MenuTrigger>
                  <MenuContent>
                    {calendarLinks.map((link) => (
                      <MenuItem key={link.name} asChild>
                        <a
                          href={link.url}
                          target={link.opensInNewTab ? "_blank" : undefined}
                          rel={link.opensInNewTab ? "noopener noreferrer" : undefined}
                          onClick={() =>
                            window.gtag?.("event", "addToCalendar", {
                              event_category: "calendar",
                              event_label: `${n.analytics?.label ?? n.id}:${link.name}`,
                            })
                          }
                        >
                          {link.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Menu>
              )}
            </span>
          )}
        </p>
        {n.dismissible !== false && (
          <IconButton
            label={`Dismiss ${n.title}`}
            tone="black"
            className="-mr-2 -my-1.5 size-9 text-[1.2rem]"
            onClick={dismiss}
          >
            <MdClose />
          </IconButton>
        )}
      </Container>
    </div>
  );
}
