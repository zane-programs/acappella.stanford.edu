"use client";

import { useCallback } from "react";
import { MdCalendarMonth } from "react-icons/md";
import {
  ButtonMenuButton,
  Menu,
  MenuItem,
  MenuList,
  Portal,
} from "@/app/components/chakra";
import type { CalendarLink } from "@/app/utils/calendar";

type ButtonProps = Omit<
  React.ComponentProps<typeof ButtonMenuButton>,
  "children" | "aria-label"
>;

interface AddToCalendarMenuProps extends ButtonProps {
  /** One link per calendar provider (see `getCalendarLinks`). */
  links: CalendarLink[];
  /** Used for the button's accessible label. */
  eventTitle: string;
  /** When set, an `addToCalendar` analytics event is logged per provider chosen. */
  analyticsLabel?: string;
}

/**
 * "Add to Calendar" button that opens a menu of calendar providers.
 *
 * Implementation notes:
 * - The menu is portaled so it isn't clipped by `overflow: hidden` ancestors
 *   (cards, collapsing banners, etc.).
 * - It uses `position: fixed`. Chakra moves focus into the menu on open
 *   without `preventScroll`, and with absolute positioning that could scroll
 *   the page whenever the menu extended past the viewport. Fixed elements
 *   never trigger viewport scrolling.
 * - `autoSelect` is off so a click/tap opens the menu without pre-highlighting
 *   the first item; keyboard opening still focuses it.
 * - Items are plain anchors. `data-prevent-progress` opts them out of the
 *   route-change progress bar, which otherwise starts on any same-tab link
 *   and never finishes for downloads and app handoffs.
 */
export default function AddToCalendarMenu({
  links,
  eventTitle,
  analyticsLabel,
  ...buttonProps
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
    <Menu placement="bottom" strategy="fixed" autoSelect={false}>
      <ButtonMenuButton
        display="flex"
        gap="2"
        alignItems="center"
        aria-label={`Add ${eventTitle} to calendar`}
        {...buttonProps}
      >
        <MdCalendarMonth /> Add to Calendar
      </ButtonMenuButton>
      <Portal>
        <MenuList>
          {links.map((link) => (
            <MenuItem
              key={link.name}
              as="a"
              href={link.url}
              target={link.opensInNewTab ? "_blank" : undefined}
              rel={link.opensInNewTab ? "noopener noreferrer" : undefined}
              data-prevent-progress="true"
              aria-label={`Add to ${link.name}${
                link.opensInNewTab ? " (opens in new tab)" : ""
              }`}
              onClick={() => handleSelect(link)}
            >
              {link.name}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
