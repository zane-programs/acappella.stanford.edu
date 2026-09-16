import { MdLocationPin, MdSchedule } from "react-icons/md";

import GROUPS from "@/app/config/groups";
import type { ShowItem } from "@/app/lib/shows";
import { EVENT_TIME_ZONE } from "@/app/utils/calendar";
import { TextLink } from "@/app/components/ui/TextLink";

/**
 * Compact show row for the homepage preview (docs/DESIGN.md §5 item 5).
 * The Shows page has its own fuller ShowCard; this one is intentionally
 * lighter and self-contained.
 */
export function ShowPreviewCard({ show }: { show: ShowItem }) {
  const groupEntry = Object.entries(GROUPS).find(
    ([, g]) => g.name.trim().toLowerCase() === show.group.trim().toLowerCase()
  );
  const date = pacificParts(show.startDate);
  const time = show.showEndTime
    ? `${formatTime(show.startDate)}–${formatTime(show.endDate)}`
    : formatTime(show.startDate);
  const firstLine = show.description.split("\n").find((line) => line.trim()) ?? "";

  return (
    <li data-reveal className="grid grid-cols-[4.25rem_1fr] gap-5 border-t border-black-20 py-7 sm:gap-8 md:grid-cols-[5.5rem_1fr]">
      <time
        dateTime={show.startDate.toISOString()}
        className="flex flex-col items-start leading-none"
      >
        <span className="type-eyebrow text-cardinal">{date.month}</span>
        <span className="mt-1 font-serif text-[2.75rem] leading-none text-black md:text-[3.25rem]">
          {date.day}
        </span>
        <span className="type-small mt-1.5 text-black-60">{date.weekday}</span>
      </time>
      <div className="min-w-0">
        {groupEntry ? (
          <TextLink href={`/${groupEntry[0]}`} plain className="type-eyebrow text-black-70 hover:text-cardinal">
            {groupEntry[1].name}
          </TextLink>
        ) : (
          <p className="type-eyebrow text-black-70">{show.group}</p>
        )}
        <h3 className="type-h3 mt-1.5 text-balance">{show.title}</h3>
        <ul className="type-small mt-2 flex flex-wrap gap-x-5 gap-y-1 text-black-70">
          <li className="flex items-center gap-1.5">
            <MdSchedule aria-hidden="true" className="text-[1.1em] text-black-50" />
            {time}
          </li>
          {show.location && (
            <li className="flex items-center gap-1.5">
              <MdLocationPin aria-hidden="true" className="text-[1.1em] text-black-50" />
              {show.location}
            </li>
          )}
        </ul>
        {firstLine && (
          <p className="type-body mt-3 line-clamp-2 max-w-[60ch] text-black-80">{firstLine}</p>
        )}
        {show.link && (
          <p className="mt-3">
            <TextLink href={show.link} className="type-small">
              {show.linkText ?? "Details"}
            </TextLink>
          </p>
        )}
      </div>
    </li>
  );
}

function pacificParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIME_ZONE,
      weekday: "short",
      month: "short",
      day: "numeric",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
  return { weekday: parts.weekday, month: parts.month, day: parts.day };
}

function formatTime(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
  const time = parts.minute === "00" ? parts.hour : `${parts.hour}:${parts.minute}`;
  return `${time} ${parts.dayPeriod}`;
}
