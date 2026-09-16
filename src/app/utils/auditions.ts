import {
  ACTIVE_AUDITION_COHORT_ID,
  AUDITION_COHORTS,
  type AuditionCohort,
  type GroupAudition,
} from "@/app/config/auditions";
import { EVENT_TIME_ZONE } from "./calendar";

export type AuditionStatus =
  /** No audition config for this group in the active cohort (or no active cohort). */
  | "none"
  /** Config exists but `opensAt` is in the future. */
  | "upcoming"
  /** Sign-ups are live. */
  | "open"
  /** `closesAt` has passed. */
  | "closed";

export function getActiveAuditionCohort(): AuditionCohort {
  return ACTIVE_AUDITION_COHORT_ID === null
    ? {}
    : AUDITION_COHORTS[ACTIVE_AUDITION_COHORT_ID];
}

/** The active cohort's audition config for `slug`, if any. */
export function getGroupAudition(slug: string): GroupAudition | undefined {
  const cohort = getActiveAuditionCohort();
  return Object.hasOwn(cohort, slug)
    ? cohort[slug as keyof AuditionCohort]
    : undefined;
}

export function getAuditionStatus(
  audition: GroupAudition | undefined,
  now: Date = new Date()
): AuditionStatus {
  if (!audition) return "none";
  if (audition.opensAt && now < audition.opensAt) return "upcoming";
  if (audition.closesAt && now > audition.closesAt) return "closed";
  return "open";
}

/**
 * The URL that `/<slug>/audition` and `/groupPromo/<slug>` should send
 * visitors to. Only defined while the group is in the active cohort; the
 * open/close window is deliberately ignored so printed QR codes and flyers
 * keep working (the destination form will say if it's closed).
 */
export function getPrimaryAuditionHref(slug: string): string | undefined {
  return getGroupAudition(slug)?.links[0].href;
}

/** e.g. "Mon, Sep 21 at 11:59 PM" in Pacific time. */
export function formatAuditionInstant(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIME_ZONE,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;

  const time =
    parts.minute === "00" ? parts.hour : `${parts.hour}:${parts.minute}`;
  return `${parts.weekday}, ${parts.month} ${parts.day} at ${time} ${parts.dayPeriod}`;
}
