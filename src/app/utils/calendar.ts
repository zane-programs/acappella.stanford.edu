import { google, office365, ics } from "calendar-link";

/** Time zone that all event times on the site are displayed in. */
export const EVENT_TIME_ZONE = "America/Los_Angeles";

export type Platform = "ios" | "android" | "other";

/** Minimal event shape shared by the shows page and promo banners. */
export interface CalendarEventDetails {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

export interface CalendarLink {
  name: string;
  url: string;
  /** Open in the same tab (e.g. `.ics` downloads that hand off to Apple Calendar). */
  noNewTab?: boolean;
}

/** Detects the platform from a user agent string (server- or client-side). */
export function detectPlatform(userAgent: string): Platform {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  if (/android/i.test(userAgent)) return "android";
  return "other";
}

/**
 * Builds "add to calendar" links for each supported provider.
 *
 * Note: the `.ics` link embeds a creation timestamp, so call this at request
 * time on the server or after mount on the client (not during hydration).
 */
export function getCalendarLinks(
  event: CalendarEventDetails,
  platform: Platform
): CalendarLink[] {
  return [
    { name: "Apple Calendar", url: ics(event), noNewTab: true },
    { name: "Stanford (Office 365)", url: getOutlookUrl(event, platform) },
    { name: "Google Calendar", url: google(event) },
  ];
}

function getOutlookUrl(event: CalendarEventDetails, platform: Platform) {
  if (platform === "other") {
    return office365(event);
  }

  // Mobile platforms use the `ms-outlook://` URL scheme (iOS and Android).
  // Dates are ISO strings in UTC; the Outlook apps handle time zone conversion.
  const formatISO = (date: Date) => date.toISOString().slice(0, 19) + "Z";
  return `ms-outlook://events/new?title=${encodeURIComponent(
    event.title
  )}&start=${formatISO(event.start)}&end=${formatISO(
    event.end
  )}&location=${encodeURIComponent(
    event.location ?? ""
  )}&description=${encodeURIComponent(event.description ?? "")}`;
}

/**
 * Formats an event's date and time range in Pacific time, e.g.
 * "Saturday, September 19 · 7–9 PM" or "Saturday, September 19 · 7:30 PM".
 *
 * Built from `Intl.DateTimeFormat` parts so the output is identical on the
 * server and in the browser (ICU versions differ in the whitespace they emit).
 */
export function formatEventDateTime(start: Date, end?: Date): string {
  const day = dateParts(start, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const dateText = `${day.weekday}, ${day.month} ${day.day}`;

  const startTime = timeParts(start);
  if (!end) {
    return `${dateText} · ${startTime.time} ${startTime.period}`;
  }

  const endTime = timeParts(end);
  const timeText =
    startTime.period === endTime.period
      ? `${startTime.time}–${endTime.time} ${endTime.period}`
      : `${startTime.time} ${startTime.period}–${endTime.time} ${endTime.period}`;

  return `${dateText} · ${timeText}`;
}

function dateParts(date: Date, options: Intl.DateTimeFormatOptions) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: EVENT_TIME_ZONE, ...options })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
}

function timeParts(date: Date) {
  const parts = dateParts(date, { hour: "numeric", minute: "2-digit" });
  return {
    time: parts.minute === "00" ? parts.hour : `${parts.hour}:${parts.minute}`,
    period: parts.dayPeriod,
  };
}
