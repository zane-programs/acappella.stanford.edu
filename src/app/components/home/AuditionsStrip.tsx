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
          {entries.map(({ slug, name, tagline, audition, status }) => (
            <li key={slug}>
              <TransitionLink
                href={`/${slug}`}
                className="group flex items-center justify-between gap-4 py-4 focus-ring rounded-sm"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-[1.25rem] leading-tight text-black group-hover:text-cardinal transition-colors duration-150">
                    {name}
                  </span>
                  <span className="type-small mt-0.5 block truncate text-black-70">{tagline}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-right">
                  {status === "open" ? (
                    audition.closesAt && (
                      <span className="type-small text-black-70">
                        Closes {formatAuditionInstant(audition.closesAt)}
                      </span>
                    )
                  ) : (
                    <span className="type-small text-black-70">
                      Opens {audition.opensAt ? formatAuditionInstant(audition.opensAt) : "soon"}
                    </span>
                  )}
                  <MdArrowForward
                    aria-hidden="true"
                    className="text-[1.25rem] text-black-50 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-cardinal"
                  />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
