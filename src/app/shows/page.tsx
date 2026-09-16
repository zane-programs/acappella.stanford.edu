import type { Metadata } from "next";
import { headers } from "next/headers";

import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";
import FeaturedShowCard from "@/app/components/shows/FeaturedShowCard";
import ShowCard from "@/app/components/shows/ShowCard";
import { fetchShows } from "@/app/lib/shows";
import { detectPlatform } from "@/app/utils/calendar";
import { FEATURED_SHOW } from "../config/shows";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows - Stanford A Cappella",
  description:
    "Learn more about auditions, shows, and events for a cappella groups at Stanford University!",
  keywords: [
    "stanford a cappella shows",
    "stanford acapella shows",
    "a cappella shows",
    "acapella shows",
    "stanford shows",
    "shows",
    "shows at stanford",
  ],
};

export default async function Shows() {
  const shows = await fetchShows();
  const headersList = await headers();
  const platform = detectPlatform(headersList.get("user-agent") || "");

  const featured =
    FEATURED_SHOW && FEATURED_SHOW.event.end.getTime() > Date.now()
      ? FEATURED_SHOW
      : null;

  return (
    <>
      <Section spacing="tight" className="pt-14 md:pt-20 lg:pt-24">
        <div data-reveal className="max-w-[46rem]">
          <Eyebrow>Shows and events</Eyebrow>
          <Heading as="h1" size="h1" className="mt-3">
            Shows
          </Heading>
          <p className="type-lead mt-5 text-black-80">
            Upcoming performances and events from Stanford&apos;s a cappella groups. Groups
            add their own shows here throughout the year.
          </p>
        </div>
      </Section>

      <Section spacing="tight" className="pb-20 md:pb-28 lg:pb-32">
        {shows.length > 0 ? (
          <ul aria-label="Upcoming a cappella shows" className="border-b border-black-20">
            {shows.map((show) => (
              <ShowCard
                key={show.group + ":" + show.title + ":" + show.startDate.toISOString()}
                show={show}
                platform={platform}
              />
            ))}
          </ul>
        ) : featured ? (
          <div data-reveal>
            <FeaturedShowCard featured={featured} platform={platform} />
            {/* Previous copy (through the 2025–26 season):
                "More shows coming soon—be on the lookout for performances throughout the year!" */}
            <p className="type-body mt-8 text-black-70">
              More shows are added as groups announce them. Check back throughout the year.
            </p>
          </div>
        ) : (
          /* Previous copy (through the 2025–26 season):
             "Coming soon—be on the lookout for a cappella shows and performances!" */
          <p data-reveal className="type-lead text-black-70">
            No shows are scheduled right now. Check back soon for upcoming performances.
          </p>
        )}
      </Section>
    </>
  );
}
