import { MdLocationPin, MdSchedule } from "react-icons/md";

import { Button } from "@/app/components/ui/Button";
import { TextLink } from "@/app/components/ui/TextLink";
import InfoRow from "@/app/components/shared/InfoRow";
import { findGroupForShow, type ShowItem } from "@/app/lib/shows";
import {
  type CalendarEventDetails,
  type Platform,
  EVENT_TIME_ZONE,
  getCalendarLinks,
} from "@/app/utils/calendar";
import AddToCalendarMenu from "./AddToCalendarMenu";

export interface ShowCardProps {
  show: ShowItem;
  platform: Platform;
}

/**
 * One upcoming show: a serif date block on the left, details on the right.
 * Renders an `<li>`; the page wraps the list in a `<ul>`.
 */
export default function ShowCard({ show, platform }: ShowCardProps) {
  const match = findGroupForShow(show);

  const event: CalendarEventDetails = {
    title: show.title,
    description: show.description,
    location: show.location,
    start: show.startDate,
    end: show.endDate,
  };
  const calendarLinks = getCalendarLinks(event, platform);
  const date = pacificDateParts(show.startDate);

  return (
    <li className="grid gap-6 border-t border-black-20 py-8 md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-10 md:py-10">
      <time
        dateTime={show.startDate.toISOString()}
        className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-0"
      >
        <span className="type-eyebrow text-cardinal">{date.month}</span>
        <span className="font-serif text-[3rem] leading-none text-black md:mt-1 md:text-[3.5rem]">
          {date.day}
        </span>
        <span className="type-small text-black-70 md:mt-1">{date.weekday}</span>
      </time>

      <div className="max-w-[60ch]">
        {match ? (
          <TextLink href={`/${match.slug}`} plain className="type-eyebrow text-cardinal">
            {match.group.name}
          </TextLink>
        ) : (
          <p className="type-eyebrow text-black-70">{show.group}</p>
        )}
        <h3 className="type-h3 mt-2 text-black">{show.title}</h3>

        <ul className="type-small mt-3 flex flex-col gap-1.5 text-black-80">
          <InfoRow icon={<MdSchedule />}>{formatShowTime(show)}</InfoRow>
          {show.location && <InfoRow icon={<MdLocationPin />}>{show.location}</InfoRow>}
        </ul>

        {show.description && (
          <div className="type-body mt-4 text-black-80">
            {show.description.split("\n").map(
              (line, idx) =>
                line.trim() && (
                  <p key={idx} className="mb-3 last:mb-0">
                    {line}
                  </p>
                )
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {show.link && (
            <Button variant="primary" href={show.link}>
              {show.linkText ?? "Details"}
            </Button>
          )}
          <AddToCalendarMenu
            variant="secondary"
            links={calendarLinks}
            eventTitle={show.title}
            analyticsLabel={`show:${show.title}`}
          />
        </div>
      </div>
    </li>
  );
}

/* ---------- date helpers (Pacific time) ---------- */

function pacificDateParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIME_ZONE,
      weekday: "long",
      month: "short",
      day: "numeric",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
  return { month: parts.month, day: parts.day, weekday: parts.weekday };
}

function pacificTime(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
  const time = parts.minute === "00" ? parts.hour : `${parts.hour}:${parts.minute}`;
  return { time, period: parts.dayPeriod };
}

/** "7 PM", "7:30 PM", or "7–9 PM" / "11 AM–1 PM" when the end time is shown. */
function formatShowTime(show: ShowItem): string {
  const start = pacificTime(show.startDate);
  if (!show.showEndTime) return `${start.time} ${start.period}`;
  const end = pacificTime(show.endDate);
  return start.period === end.period
    ? `${start.time}–${end.time} ${end.period}`
    : `${start.time} ${start.period}–${end.time} ${end.period}`;
}
