import Image from "next/image";
import type { Metadata } from "next";
import { Box, Button, Flex, Heading } from "@/app/components/chakra";
import AutoStyledContent from "@/app/components/shared/AutoStyledContent";
import type { BoxProps, ButtonProps } from "@chakra-ui/react";

import GROUPS, { type ACappellaGroup } from "@/app/groups";

// or Dynamic metadata
export function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Metadata {
  const group = GROUPS[slug];
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
      <PosterImage
        group={group}
        mt="2"
        mb="6"
        display={{ base: "block", md: "none" }}
      />
      <Flex direction={{ base: "column-reverse", md: "row" }} gap="6">
        <Flex
          direction="column"
          gap="4"
          w={{ base: "auto", md: "270px", mdPlus: "315px" }}
        >
          <PosterImage group={group} display={{ base: "none", md: "block" }} />
          <Flex direction="column" w="100%" gap="1">
            {group.auditionLink && (
              <Button colorScheme="red" {...linkButton(group.auditionLink)}>
                Audition for {group.name}
              </Button>
            )}
            <Button colorScheme="blue" {...linkButton(group.siteLink)}>
              Group Website
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

function PosterImage({
  group,
  ...props
}: BoxProps & { group: ACappellaGroup }) {
  return (
    <Box w="100%" aspectRatio="3 / 2" position="relative" {...props}>
      <Image
        className="posterImage"
        src={group.imgUrl}
        alt={"Picture for " + group.name}
        layout="fill"
        objectFit="cover"
      />
    </Box>
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
