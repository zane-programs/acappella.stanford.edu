import { MdCalendarMonth, MdLocationPin } from "react-icons/md";

import { FEATURED_SHOW } from "@/app/config/shows";
import { fetchShows } from "@/app/lib/shows";
import { formatEventDateTime } from "@/app/utils/calendar";
import { Button } from "@/app/components/ui/Button";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";
import { TextLink } from "@/app/components/ui/TextLink";
import { ShowPreviewCard } from "./ShowPreviewCard";

const PREVIEW_COUNT = 3;

/**
 * The next few shows from the sheet, or the featured show while the sheet is
 * empty (docs/DESIGN.md §5 item 5). Omitted entirely when there is nothing to
 * show.
 */
export async function ShowsPreview() {
  const shows = (await fetchShows()).slice(0, PREVIEW_COUNT);
  const featured =
    shows.length === 0 && FEATURED_SHOW && FEATURED_SHOW.event.end.getTime() > Date.now()
      ? FEATURED_SHOW
      : null;

  if (shows.length === 0 && !featured) return null;

  return (
    <Section aria-labelledby="shows-heading" className="border-t border-black-10">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
        <div data-reveal>
          <Eyebrow>Shows</Eyebrow>
          <Heading as="h2" size="h2" id="shows-heading" className="mt-3">
            On stage soon
          </Heading>
          <p className="type-body mt-4 text-black-80">
            Concerts, showcases, and campus gigs from every group, gathered in one calendar.
          </p>
          <p className="mt-6">
            <TextLink href="/shows" className="text-[1.0625rem]">
              All shows
            </TextLink>
          </p>
        </div>

        {featured ? (
          <div
            data-reveal
            className="rounded-md bg-cardinal p-7 text-white sm:p-9 lg:p-11"
          >
            <Eyebrow tone="white">Featured event</Eyebrow>
            <Heading as="h3" size="h2" className="mt-3">
              {featured.name}
            </Heading>
            <p className="type-lead mt-2 text-white/85">{featured.tagline}</p>
            <ul className="type-body mt-6 flex flex-col gap-1.5 text-white/90">
              <li className="flex items-center gap-2.5">
                <MdCalendarMonth aria-hidden="true" className="text-[1.15em] text-white/70" />
                {formatEventDateTime(featured.event.start, featured.event.end)}
              </li>
              {(featured.event.location || featured.locationFallback) && (
                <li className="flex items-center gap-2.5">
                  <MdLocationPin aria-hidden="true" className="text-[1.15em] text-white/70" />
                  {featured.event.location ?? featured.locationFallback}
                </li>
              )}
            </ul>
            {featured.blurb[0] && (
              <p className="type-body mt-6 max-w-[56ch] text-white/85">{featured.blurb[0]}</p>
            )}
            <div className="mt-8">
              <Button href="/shows" variant="on-cardinal" size="lg">
                Details
              </Button>
            </div>
          </div>
        ) : (
          <ul aria-label="Upcoming shows" className="border-b border-black-20">
            {shows.map((show) => (
              <ShowPreviewCard key={`${show.group}:${show.title}:${show.startDate.getTime()}`} show={show} />
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
