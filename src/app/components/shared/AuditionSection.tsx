import { Button, Flex, Text } from "@/app/components/chakra";
import { MdCalendarMonth, MdPlace, MdSchedule } from "react-icons/md";

import type { GroupAudition } from "@/app/config/auditions";
import {
  formatAuditionInstant,
  getAuditionStatus,
  type AuditionStatus,
} from "@/app/utils/auditions";
import InfoRow from "./InfoRow";

/**
 * Audition call-to-action for a group page: one glowing button per link,
 * followed by location / deadline details. Renders nothing when the group
 * has no audition config in the active cohort or sign-ups have closed.
 *
 * Server component: the open/closed decision is made per request.
 */
export default function AuditionSection({
  groupName,
  audition,
  linkProps,
}: {
  groupName: string;
  audition: GroupAudition | undefined;
  /** Anchor props (href/target/rel) spread onto each button. */
  linkProps: (href: string) => object;
}) {
  const status: AuditionStatus = getAuditionStatus(audition);
  if (!audition || status === "none" || status === "closed") return null;

  const details: { key: string; icon: React.ReactNode; text: string }[] = [];
  if (status === "upcoming" && audition.opensAt) {
    details.push({
      key: "opens",
      icon: <MdSchedule aria-hidden />,
      text: `Sign-ups open ${formatAuditionInstant(audition.opensAt)}`,
    });
  }
  if (audition.location) {
    details.push({
      key: "location",
      icon: <MdPlace aria-hidden />,
      text: `Auditions at ${audition.location}`,
    });
  }
  if (status === "open" && audition.closesAt) {
    details.push({
      key: "closes",
      icon: <MdCalendarMonth aria-hidden />,
      text: `Sign-ups close ${formatAuditionInstant(audition.closesAt)}`,
    });
  }

  return (
    <Flex direction="column" gap="1">
      {status === "open" &&
        audition.links.map(({ label, href }, index) => (
          <Button
            key={href}
            colorScheme="red"
            size="lg"
            className={index === 0 ? "glow" : undefined}
            variant={index === 0 ? "solid" : "outline"}
            borderRadius="16px"
            fontWeight="700"
            fontSize="md"
            aria-label={`${label ?? `Audition for ${groupName}`} (opens in new tab)`}
            {...linkProps(href)}
          >
            {index === 0 ? "🎤 " : "🗓️ "}
            {label ?? `Audition for ${groupName}`}
          </Button>
        ))}
      {(details.length > 0 || audition.note) && (
        <Flex
          as="ul"
          direction="column"
          gap="0.5"
          listStyleType="none"
          fontSize="sm"
          color="gray.700"
          px="2"
          py="1"
          aria-label={`Audition details for ${groupName}`}
        >
          {details.map(({ key, icon, text }) => (
            <InfoRow key={key} icon={icon}>
              {text}
            </InfoRow>
          ))}
          {audition.note && (
            <Text as="li" fontSize="inherit">
              {audition.note}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
}
