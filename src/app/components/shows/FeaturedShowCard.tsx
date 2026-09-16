import { MdArrowForward, MdCalendarMonth, MdLocationPin } from "react-icons/md";

import { Button } from "@/app/components/ui/Button";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Prose } from "@/app/components/ui/Prose";
import type { FeaturedShow } from "@/app/config/shows";
import { type Platform, formatEventDateTime, getCalendarLinks } from "@/app/utils/calendar";
import InfoRow from "@/app/components/shared/InfoRow";
import AddToCalendarMenu from "./AddToCalendarMenu";

export interface FeaturedShowCardProps {
  featured: FeaturedShow;
  platform: Platform;
}

/**
 * Cardinal panel promoting a single upcoming event. Used on the Shows page
 * (and homepage preview) in place of the "coming soon" placeholder.
 */
export default function FeaturedShowCard({ featured, platform }: FeaturedShowCardProps) {
  const { name, tagline, blurb, event, locationFallback, cta } = featured;
  const calendarLinks = getCalendarLinks(event, platform);
  const headingId = "featured-show-heading";

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-md bg-cardinal px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-16"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div className="max-w-[44rem]">
          <Eyebrow tone="white">Featured event</Eyebrow>
          <Heading as="h2" size="h1" id={headingId} className="mt-3 text-white">
            {name}
          </Heading>
          <p className="type-lead mt-3 text-white/85">{tagline}</p>

          <Prose tone="on-cardinal" className="mt-6">
            {blurb.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </Prose>
        </div>

        <div className="flex flex-col justify-between gap-8 border-t border-white/20 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <ul className="type-body flex flex-col gap-3 text-white">
            <InfoRow icon={<MdCalendarMonth />}>
              {formatEventDateTime(event.start, event.end)}
            </InfoRow>
            {(event.location || locationFallback) && (
              <InfoRow icon={<MdLocationPin />}>{event.location ?? locationFallback}</InfoRow>
            )}
          </ul>

          <div className="flex flex-wrap gap-3">
            <AddToCalendarMenu
              variant="on-cardinal"
              links={calendarLinks}
              eventTitle={event.title}
              analyticsLabel={featured.analyticsLabel ?? name}
            />
            {cta && (
              <Button variant="on-cardinal-outline" href={cta.href} iconRight={<MdArrowForward />}>
                {cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
