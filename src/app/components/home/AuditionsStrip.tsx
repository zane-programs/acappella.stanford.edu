import { MdArrowForward } from "react-icons/md";

import GROUPS, { type GroupSlug } from "@/app/config/groups";
import type { GroupAudition } from "@/app/config/auditions";
import {
  formatAuditionInstant,
  getActiveAuditionCohort,
  getAuditionStatus,
  type AuditionStatus,
} from "@/app/utils/auditions";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";

interface Entry {
  slug: GroupSlug;
  name: string;
  tagline: string;
  audition: GroupAudition;
  status: Extract<AuditionStatus, "open" | "upcoming">;
}

/**
 * Homepage strip listing every group with sign-ups open or coming up
 * (docs/DESIGN.md §5 item 3). Server component: the open/closed decision is
 * made per request. Renders nothing outside audition season.
 */
export function AuditionsStrip() {
  const cohort = getActiveAuditionCohort();
  const now = new Date();

  const entries: Entry[] = [];
  for (const [slug, audition] of Object.entries(cohort) as [GroupSlug, GroupAudition][]) {
    const status = getAuditionStatus(audition, now);
    if (status !== "open" && status !== "upcoming") continue;
    const group = GROUPS[slug];
    entries.push({ slug, name: group.name, tagline: group.tagline, audition, status });
  }
  if (entries.length === 0) return null;

  entries.sort((a, b) => a.name.localeCompare(b.name, "en"));
  const anyOpen = entries.some((e) => e.status === "open");

  return (
    <Section id="auditions" tone="fog-light" spacing="tight" aria-labelledby="auditions-heading">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
        <div data-reveal>
          <Eyebrow tone="cardinal">Audition season</Eyebrow>
          <Heading as="h2" size="h2" id="auditions-heading" className="mt-3">
            {anyOpen ? "Sign-ups are open" : "Auditions are coming up"}
          </Heading>
          <p className="type-body mt-4 text-black-80">
            Groups hold auditions at the start of autumn quarter. Each group runs its own
            sign-up; links appear here as groups post them.
          </p>
        </div>
        <ul data-reveal className="min-w-0 divide-y divide-black-20 border-y border-black-20">
          {entries.map(({ slug, name, tagline, audition, status }) => {
            const meta =
              status === "open"
                ? audition.closesAt && `Closes ${formatAuditionInstant(audition.closesAt)}`
                : `Opens ${audition.opensAt ? formatAuditionInstant(audition.opensAt) : "soon"}`;
            return (
              <li key={slug}>
                <TransitionLink
                  href={`/${slug}`}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-4 focus-ring rounded-sm sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-3"
                >
                  <span className="col-start-1 row-start-1 min-w-0">
                    <span className="block font-serif text-[1.25rem] leading-tight text-black group-hover:text-cardinal transition-colors duration-150">
                      {name}
                    </span>
                    <span className="type-small mt-0.5 block truncate text-black-70">{tagline}</span>
                  </span>
                  {/* Status meta: under the tagline on phones, right-aligned beside the arrow from sm up. */}
                  {meta && (
                    <span className="type-small col-start-1 row-start-2 mt-1 text-black-70 sm:col-start-2 sm:row-start-1 sm:mt-0 sm:text-right">
                      {meta}
                    </span>
                  )}
                  <MdArrowForward
                    aria-hidden="true"
                    className="col-start-2 row-start-1 row-span-2 shrink-0 text-[1.25rem] text-black-50 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-cardinal sm:col-start-3 sm:row-span-1"
                  />
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
