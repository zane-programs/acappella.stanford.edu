/** Time zone that all event times on the site are displayed in. */
export const EVENT_TIME_ZONE = "America/Los_Angeles";

/**
 * Coarse platform bucket used to pick the right calendar deep links.
 * - `ios`: iPhone/iPod, and iPads that still send a mobile user agent.
 * - `android`
 * - `mac`: macOS, plus iPadOS Safari (which reports itself as a Mac).
 * - `other`: Windows, Linux, unknown.
 */
export type Platform = "ios" | "android" | "mac" | "other";

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
  /**
   * Regular web pages (Google Calendar, Outlook on the web) open in a new
   * tab. Handoffs to native apps (`.ics` files, `ms-outlook://`) must stay in
   * the current tab: a `_blank` custom-scheme link leaves an empty tab behind
   * on mobile, and some browsers block scheme launches from fresh tabs.
   */
  opensInNewTab: boolean;
}

/** Path of the route handler that serves generated `.ics` files. */
export const ICS_ROUTE = "/api/ics";

/** Detects the platform from a user agent string (server- or client-side). */
export function detectPlatform(userAgent: string): Platform {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  if (/android/i.test(userAgent)) return "android";
  if (/macintosh|mac os x/i.test(userAgent)) return "mac";
  return "other";
}

/**
 * Builds "add to calendar" links for each supported provider.
 *
 * All links are deterministic (no timestamps or random IDs), so this is safe
 * to call during server rendering and hydration.
 */
export function getCalendarLinks(
  event: CalendarEventDetails,
  platform: Platform
): CalendarLink[] {
  const apple: CalendarLink = {
    name: platform === "ios" || platform === "mac" ? "Apple Calendar" : "Download .ics",
    url: getIcsUrl(event),
    opensInNewTab: false,
  };
  const outlook: CalendarLink = {
    name: "Stanford (Office 365)",
    ...getOutlookLink(event, platform),
  };
  const google: CalendarLink = {
    name: "Google Calendar",
    url: getGoogleCalendarUrl(event),
    opensInNewTab: true,
  };

  // Lead with the platform's native calendar.
  return platform === "ios" || platform === "mac"
    ? [apple, outlook, google]
    : [google, outlook, apple];
}

/* -------------------------------------------------------------------------- */
/* Google Calendar                                                            */
/* -------------------------------------------------------------------------- */

export function getGoogleCalendarUrl(event: CalendarEventDetails): string {
  const params = toQueryString({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatUtcCompact(event.start)}/${formatUtcCompact(event.end)}`,
    details: event.description,
    location: event.location,
    ctz: EVENT_TIME_ZONE,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/* -------------------------------------------------------------------------- */
/* Outlook / Office 365                                                       */
/* -------------------------------------------------------------------------- */

function getOutlookLink(
  event: CalendarEventDetails,
  platform: Platform
): Pick<CalendarLink, "url" | "opensInNewTab"> {
  switch (platform) {
    case "ios":
      // Outlook for iOS registers the `ms-outlook://` scheme. If the app is
      // not installed, iOS shows an "address is invalid" alert; there is no
      // web fallback mechanism for custom schemes on iOS.
      return { url: getOutlookAppUrl(event), opensInNewTab: false };
    case "android":
      // Android intent URLs open the app when installed and fall back to
      // Outlook on the web otherwise (Chrome, Samsung Internet, Firefox).
      return { url: getOutlookAndroidIntentUrl(event), opensInNewTab: false };
    default:
      return { url: getOutlookWebUrl(event), opensInNewTab: true };
  }
}

/**
 * Outlook on the web (Office 365 / Stanford accounts) compose deep link.
 *
 * Times are sent in UTC with an explicit offset. Outlook converts them to the
 * user's mailbox time zone, so the result is correct regardless of where the
 * link was generated (this used to be built in the server's local time zone).
 */
export function getOutlookWebUrl(event: CalendarEventDetails): string {
  const params = toQueryString({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: formatUtcOffset(event.start),
    enddt: formatUtcOffset(event.end),
    location: event.location,
    body: event.description,
  });
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params}`;
}

/** Query string shared by the `ms-outlook://` scheme and the Android intent. */
function outlookAppQuery(event: CalendarEventDetails): string {
  // Dates are ISO strings in UTC; the Outlook apps convert to local time.
  return toQueryString({
    title: event.title,
    start: formatUtcIso(event.start),
    end: formatUtcIso(event.end),
    location: event.location ?? "",
    description: event.description ?? "",
  });
}

export function getOutlookAppUrl(event: CalendarEventDetails): string {
  return `ms-outlook://events/new?${outlookAppQuery(event)}`;
}

export function getOutlookAndroidIntentUrl(event: CalendarEventDetails): string {
  const fallback = encodeURIComponent(getOutlookWebUrl(event));
  return (
    `intent://events/new?${outlookAppQuery(event)}` +
    `#Intent;scheme=ms-outlook;package=com.microsoft.office.outlook;` +
    `S.browser_fallback_url=${fallback};end`
  );
}

/* -------------------------------------------------------------------------- */
/* iCalendar (.ics)                                                           */
/* -------------------------------------------------------------------------- */

/**
 * URL of a server-generated `.ics` file for the event (see `app/api/ics`).
 *
 * A real `text/calendar` response is the only thing that works everywhere:
 * iOS Safari shows the native "Add to Calendar" sheet, macOS Safari hands the
 * file to Calendar, and Chrome/Firefox download it. (`data:` URLs, which this
 * replaced, are blocked for top-level navigation in Chrome and Firefox.)
 */
export function getIcsUrl(event: CalendarEventDetails): string {
  const params = toQueryString({
    title: event.title,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    location: event.location,
    description: event.description,
  });
  return `${ICS_ROUTE}?${params}`;
}

export interface IcsOptions {
  /** Stable identifier so re-adding the event updates it instead of duplicating. */
  uid: string;
  /** Creation timestamp (`DTSTAMP`). Defaults to now. */
  stamp?: Date;
  /** Optional canonical URL for the event. */
  url?: string;
}

/** Serialises an event as an RFC 5545 iCalendar document. */
export function buildIcs(
  event: CalendarEventDetails,
  { uid, stamp = new Date(), url }: IcsOptions
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Stanford A Cappella//acappella.stanford.edu//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${formatUtcCompact(stamp)}`,
    `DTSTART:${formatUtcCompact(event.start)}`,
    `DTEND:${formatUtcCompact(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    event.description
      ? `DESCRIPTION:${escapeIcsText(event.description)}`
      : null,
    url ? `URL:${url}` : null,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

/** Escapes a TEXT value per RFC 5545 §3.3.11. */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Folds a content line to at most 75 octets per physical line (RFC 5545
 * §3.1), splitting on character boundaries so multi-byte text stays intact.
 */
function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let current = "";
  let currentBytes = 0;
  // Continuation lines start with a space, which costs one octet.
  let limit = 75;

  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (currentBytes + bytes > limit) {
      chunks.push(current);
      current = "";
      currentBytes = 0;
      limit = 74;
    }
    current += char;
    currentBytes += bytes;
  }
  chunks.push(current);
  return chunks.join("\r\n ");
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

/** `20260920T020000Z` (Google Calendar, iCalendar). */
function formatUtcCompact(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/** `2026-09-20T02:00:00Z` (Outlook mobile apps). */
function formatUtcIso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** `2026-09-20T02:00:00+00:00` (Outlook on the web). */
function formatUtcOffset(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

/**
 * Builds a query string, skipping empty values. Spaces are encoded as `%20`
 * rather than `+`, which some calendar providers render literally.
 */
function toQueryString(
  params: Record<string, string | undefined | null>
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return search.toString().replace(/\+/g, "%20");
}

/* -------------------------------------------------------------------------- */
/* Display formatting                                                         */
/* -------------------------------------------------------------------------- */

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
