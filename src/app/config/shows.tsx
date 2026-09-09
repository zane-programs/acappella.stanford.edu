import type { CalendarEventDetails } from "../utils/calendar";
import { OSHOW_FEATURED_SHOW } from "./oshow";

export interface FeaturedShow {
  /** Display name, e.g. "O-Show 2026". */
  name: string;
  tagline: string;
  /** Paragraphs shown on the card. */
  blurb: string[];
  /** Drives the date/time line, calendar links, and when the card expires. */
  event: CalendarEventDetails;
  /** Shown in place of the location while the venue is unconfirmed. */
  locationFallback?: string;
  /** Optional secondary call to action next to "Add to Calendar". */
  cta?: { label: string; href: string };
  /** Label for `addToCalendar` analytics events. */
  analyticsLabel?: string;
}

/**
 * Featured show promoted on the Shows page whenever the shows sheet has no
 * upcoming entries. It disappears on its own once the event has ended.
 * Set to `null` to fall back to the plain "coming soon" placeholder.
 */
export const FEATURED_SHOW: FeaturedShow | null = OSHOW_FEATURED_SHOW;
