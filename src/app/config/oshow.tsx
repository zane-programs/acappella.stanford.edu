import type { Notification } from "./notifications";
import type { FeaturedShow } from "./shows";
import { CalendarEventDetails, formatEventDateTime } from "../utils/calendar";

/**
 * O-Show: the annual showcase of Stanford's a cappella groups, held during
 * New Student Orientation. Update the details below each year; everything
 * else (banner text, Shows page card, calendar links, auto-hide dates)
 * derives from them.
 */
export const O_SHOW_2026: CalendarEventDetails = {
  title: "O-Show 2026 – Stanford A Cappella Showcase",
  // Saturday, September 19, 2026, 7–9 PM Pacific (PDT is UTC−7)
  start: new Date("2026-09-19T19:00:00-07:00"),
  end: new Date("2026-09-19T21:00:00-07:00"),
  // TODO: confirm venue with this year's organizers
  location: undefined,
  description:
    "Hear every Stanford a cappella group perform at O-Show, the annual " +
    "showcase for new students.\n\nMore info: https://acappella.stanford.edu/shows",
};

const O_SHOW_NAME = "O-Show 2026";
const O_SHOW_TAGLINE = "The annual showcase of Stanford's a cappella groups";

/** Site-wide promo banner for O-Show (rendered by `NotificationManager`). */
export const OSHOW_PROMO: Notification = {
  id: "oshow_2026_r01",
  title: "See O-Show!",
  subtitle: O_SHOW_TAGLINE,
  description: [
    formatEventDateTime(O_SHOW_2026.start, O_SHOW_2026.end),
    O_SHOW_2026.location,
  ]
    .filter(Boolean)
    .join(" • "),
  calendarEvent: O_SHOW_2026,
  displayPages: ["/", "/about"],
  // Automatically stop showing once the show has ended
  endDate: O_SHOW_2026.end,
  dismissible: true,
  dismissDuration: "session",
  backgroundGradient: "linear-gradient(135deg, #8c1515 0%, #b91c1c 100%)",
  textColor: "white",
  borderColor: "rgba(255, 255, 255, 0.2)",
  analytics: {
    category: "promo",
    label: "oShow",
  },
  priority: 10,
};

/** Featured card on the Shows page (rendered when the shows sheet is empty). */
export const OSHOW_FEATURED_SHOW: FeaturedShow = {
  name: O_SHOW_NAME,
  tagline: O_SHOW_TAGLINE,
  blurb: [
    "All of Stanford's a cappella groups take the stage in one night during " +
      "New Student Orientation. Come hear every group and find your favorites.",
    "Details will be updated here as they're confirmed.",
  ],
  event: O_SHOW_2026,
  locationFallback: "Venue to be announced",
  cta: { label: "Meet the Groups", href: "/" },
  analyticsLabel: "oShow",
};
