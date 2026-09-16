/**
 * Audition configuration, kept separate from the group definitions in
 * `groups.tsx` so the whole layer can be swapped out each year without
 * touching group-scoped config.
 *
 * Each cohort is keyed by the audition year (the fall the auditions happen)
 * and maps a group slug to that group's audition details. Only the cohort
 * named by `ACTIVE_AUDITION_COHORT_ID` is ever rendered; older cohorts are
 * kept for reference and are otherwise inert.
 *
 * Annual workflow:
 *   1. Add a new `AUDITION_COHORTS[<year>]` entry and fill in groups as they
 *      send their links.
 *   2. Point `ACTIVE_AUDITION_COHORT_ID` at it.
 *   3. When the season is over, set `ACTIVE_AUDITION_COHORT_ID` to `null`.
 */
import type { GroupSlug } from "./groups";

export interface AuditionLink {
  /** Button text. Defaults to "Audition for <group name>" when omitted. */
  label?: string;
  href: string;
}

export interface GroupAudition {
  /**
   * Ordered list of links. The first entry is the primary link and is what
   * `/<slug>/audition` and `/groupPromo/<slug>` redirect to.
   */
  links: [AuditionLink, ...AuditionLink[]];
  /** Sign-ups aren't shown before this instant (buttons hidden, "opens" note shown). */
  opensAt?: Date;
  /** Sign-ups aren't shown after this instant (all audition UI hidden). */
  closesAt?: Date;
  /** Where auditions physically happen, e.g. "Old Union 120". */
  location?: string;
  /** Free-form extra line shown under the buttons. */
  note?: string;
}

export type AuditionCohort = Partial<Record<GroupSlug, GroupAudition>>;

// Pacific time offsets: PDT is UTC−7 (Mar–Nov), PST is UTC−8.

export const AUDITION_COHORTS = {
  2025: {
    "fleet-street": {
      links: [
        {
          href: "https://www.signupgenius.com/go/10C0E44A9AF2AABFEC52-58458698-fleet",
        },
      ],
    },
    mendicants: {
      links: [{ href: "https://stanfordmendicants.com/auditions" }],
    },
    counterpoint: {
      links: [{ href: "https://calendly.com/emmadi-stanford/ctp-audition" }],
    },
    harmonics: {
      links: [{ href: "https://calendly.com/stanfordharmonics/audition" }],
    },
    raagapella: {
      links: [
        { href: "https://calendly.com/raagauditions/round1?month=2025-09" },
      ],
    },
    "o-tone": {
      links: [{ href: "https://calendly.com/stanfordotone" }],
    },
    "everyday-people": {
      links: [
        {
          href: "https://docs.google.com/forms/d/e/1FAIpQLScbxVIGG1MHs8lAvEm5lAhptxVrqQRzFd5-eVMGh65Vqf-OgQ/viewform",
        },
      ],
    },
    testimony: {
      links: [{ href: "https://forms.gle/ZRNgk8fvprTBPjCDA" }],
    },
    talisman: {
      links: [
        { href: "https://calendly.com/samgb-stanford/talisman-auditions" },
      ],
    },
    "mixed-company": {
      links: [
        {
          href: "https://docs.google.com/forms/d/e/1FAIpQLSfvsI5rWTcMjMYbiOlaq8GPW0evASdwIV10FUCXdru0fEhC7w/viewform?usp=dialog",
        },
      ],
    },
  },
  2026: {
    counterpoint: {
      links: [
        { href: "https://calendly.com/rachwei-stanford/counterpoint-audition" },
      ],
    },
    harmonics: {
      links: [{ href: "https://calendly.com/stanfordharmonics/audition" }],
    },
    "mixed-company": {
      links: [
        {
          label: "Audition sign-up form",
          href: "https://forms.gle/sT74DjR3AegYc3Cg7",
        },
        {
          label: "Audition time slots",
          href: "https://tinyurl.com/AuditionMC2026",
        },
      ],
      // Sign-ups open Wednesday 9/16 and close Monday 9/21 at 11:59 PM PDT.
      opensAt: new Date("2026-09-16T00:00:00-07:00"),
      closesAt: new Date("2026-09-21T23:59:59-07:00"),
      location: "Old Union 120",
    },
  },
} satisfies Record<number, AuditionCohort>;

export type AuditionCohortId = keyof typeof AUDITION_COHORTS;

/** The cohort currently shown on the site. Set to `null` to hide all audition UI. */
export const ACTIVE_AUDITION_COHORT_ID: AuditionCohortId | null = 2026;
