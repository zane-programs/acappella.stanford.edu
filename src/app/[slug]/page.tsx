import type { Metadata } from "next";
import { Button, Flex, Heading } from "@/app/components/chakra";
import AutoStyledContent from "@/app/components/shared/AutoStyledContent";
import { type ButtonProps } from "@chakra-ui/react";
import PosterImage from "../components/shared/PosterImage";

import GROUPS from "@/app/groups";
import { notFound } from "next/navigation";

export function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Metadata {
  const group = GROUPS[slug];

  if (!group) {
    notFound();
  }

  const groupNameLowercase = group.name.toLowerCase();

  return {
    title: group.name + " - Stanford A Cappella",
    description: `Learn more about ${group.name}, ${group.tagline}!`,
    keywords: [
      groupNameLowercase,
      "stanford " + groupNameLowercase,
      groupNameLowercase + " a cappella",
      groupNameLowercase + " acapella",
      "audition for " + groupNameLowercase,
      groupNameLowercase + " audition",
      groupNameLowercase + " auditions",
      // Add `extraKeywords` to SEO keywords if provided
      ...(group.extraKeywords || []),
    ],
  };
}

export default function GroupPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const group = GROUPS[slug];

  return (
    <>
      <Heading size="xl" mb="4">
        {group.name}
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} gap="6">
        <Flex
          direction="column"
          gap="4"
          w={{ base: "auto", md: "270px", mdPlus: "315px", lg: "345px" }}
        >
          <PosterImage group={group} />
          <Flex direction="column" w="100%" gap="1">
            {group.auditionLink && (
              <Button colorScheme="red" {...linkButton(group.auditionLink)}>
                Audition for {group.name}
              </Button>
            )}
            <Button colorScheme="blue" {...linkButton(group.siteLink)}>
              {group.name} Website
            </Button>
          </Flex>
        </Flex>
        <AutoStyledContent lineHeight="1.3em" flex={{ base: undefined, md: 1 }}>
          {group.description}
        </AutoStyledContent>
      </Flex>
    </>
  );
}

function linkButton(
  href: string
): Partial<ButtonProps & { href: string; target: string }> {
  return {
    href,
    as: "a",
    target: "_blank",
    rel: "noopener",
  };
}
