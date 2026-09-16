import { MdCalendarMonth, MdPlace, MdSchedule } from "react-icons/md";

import type { GroupAudition } from "@/app/config/auditions";
import {
  formatAuditionInstant,
  getAuditionStatus,
  type AuditionStatus,
} from "@/app/utils/auditions";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Eyebrow } from "@/app/components/ui/Eyebrow";

/**
 * Audition call-to-action for a group page: one button per link (the first
 * solid, the rest outlined), followed by location / deadline details.
 * Renders nothing when the group has no audition config in the active cohort
 * or sign-ups have closed.
 *
 * Server component: the open/closed decision is made per request.
 */
export default function AuditionSection({
  groupName,
  audition,
}: {
  groupName: string;
  audition: GroupAudition | undefined;
}) {
  const status: AuditionStatus = getAuditionStatus(audition);
  if (!audition || status === "none" || status === "closed") return null;

  const details: { key: string; icon: React.ReactNode; text: string }[] = [];
  if (status === "upcoming" && audition.opensAt) {
    details.push({
      key: "opens",
      icon: <MdSchedule aria-hidden="true" />,
      text: `Sign-ups open ${formatAuditionInstant(audition.opensAt)}`,
    });
  }
  if (audition.location) {
    details.push({
      key: "location",
      icon: <MdPlace aria-hidden="true" />,
      text: `Auditions at ${audition.location}`,
    });
  }
  if (status === "open" && audition.closesAt) {
    details.push({
      key: "closes",
      icon: <MdCalendarMonth aria-hidden="true" />,
      text: `Sign-ups close ${formatAuditionInstant(audition.closesAt)}`,
    });
  }

  return (
    <section aria-labelledby="audition-heading" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow as="span" id="audition-heading" tone="cardinal">
          Auditions
        </Eyebrow>
        {status === "open" ? (
          <Badge tone="open">Sign-ups open</Badge>
        ) : (
          <Badge tone="neutral">Opening soon</Badge>
        )}
      </div>

      {status === "open" && (
        <div className="flex flex-col gap-2">
          {audition.links.map(({ label, href }, index) => (
            <Button
              key={href}
              href={href}
              variant={index === 0 ? "primary" : "secondary"}
              size="lg"
              className="w-full"
              aria-label={`${label ?? `Audition for ${groupName}`} (opens in new tab)`}
            >
              {label ?? `Audition for ${groupName}`}
            </Button>
          ))}
        </div>
      )}

      {(details.length > 0 || audition.note) && (
        <ul
          className="type-small flex flex-col gap-1.5 text-black-80"
          aria-label={`Audition details for ${groupName}`}
        >
          {details.map(({ key, icon, text }) => (
            <li key={key} className="flex items-start gap-2">
              <span className="mt-[0.2em] inline-flex shrink-0 text-[1.1em] text-black-60">
                {icon}
              </span>
              <span>{text}</span>
            </li>
          ))}
          {audition.note && <li>{audition.note}</li>}
        </ul>
      )}
    </section>
  );
}
