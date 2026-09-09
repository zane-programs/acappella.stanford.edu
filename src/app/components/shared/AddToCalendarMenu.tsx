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
 * The menu is portaled so it isn't clipped by `overflow: hidden` ancestors
 * (cards, collapsing banners, etc.).
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
    <Menu placement="bottom">
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
              target={link.noNewTab ? "_self" : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Add to ${link.name}${
                link.noNewTab ? "" : " (opens in new tab)"
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
