"use client";

import { useCallback } from "react";
import { MdCalendarMonth, MdExpandMore } from "react-icons/md";

import { Button, type ButtonSize, type ButtonVariant } from "@/app/components/ui/Button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/app/components/ui/Menu";
import type { CalendarLink } from "@/app/utils/calendar";

export interface AddToCalendarMenuProps {
  /** One link per calendar provider (see `getCalendarLinks`). */
  links: CalendarLink[];
  /** Used for the trigger's accessible label. */
  eventTitle: string;
  /** When set, an `addToCalendar` analytics event is logged per provider chosen. */
  analyticsLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * "Add to calendar" button that opens a menu of calendar providers.
 *
 * - Built on the Radix-based `ui/Menu`: portaled (never clipped by cards),
 *   collision-aware, keyboard navigable, and it never scrolls the page open.
 * - Items are plain anchors. Web destinations open in a new tab; `.ics` and
 *   app-scheme handoffs stay in the current tab (see `CalendarLink`).
 *   `data-prevent-progress` is kept so any route-change instrumentation can
 *   ignore these downloads/handoffs.
 */
export default function AddToCalendarMenu({
  links,
  eventTitle,
  analyticsLabel,
  variant = "secondary",
  size = "md",
  className,
}: AddToCalendarMenuProps) {
  const handleSelect = useCallback(
    (link: CalendarLink) => {
      if (!analyticsLabel) return;
      window?.gtag?.("event", "addToCalendar", {
        event_category: "calendar",
        event_label: `${analyticsLabel}:${link.name}`,
      });
    },
    [analyticsLabel]
  );

  return (
    <Menu modal={false}>
      <MenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          iconLeft={<MdCalendarMonth />}
          iconRight={<MdExpandMore />}
          aria-label={`Add ${eventTitle} to calendar`}
        >
          Add to calendar
        </Button>
      </MenuTrigger>
      <MenuContent aria-label={`Calendar options for ${eventTitle}`}>
        {links.map((link) => (
          <MenuItem key={link.name} asChild onSelect={() => handleSelect(link)}>
            <a
              href={link.url}
              target={link.opensInNewTab ? "_blank" : undefined}
              rel={link.opensInNewTab ? "noopener noreferrer" : undefined}
              data-prevent-progress="true"
              aria-label={`Add to ${link.name}${
                link.opensInNewTab ? " (opens in new tab)" : ""
              }`}
            >
              {link.name}
            </a>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
