// next.js stuff
import type { Metadata } from "next";
import { headers } from "next/headers";

import { Box, SimpleGrid, Heading } from "./components/chakra";
import GROUPS from "./config/groups";

import GroupTile from "./components/groups/GroupTile";
import BRANDING_OG_OPTIONS from "./config/branding";

// page metadata
export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();

  const brandingKey = requestHeaders.get("x-branding-key");

  const openGraph = brandingKey
    ? BRANDING_OG_OPTIONS[brandingKey]?.openGraph ?? {}
    : {};

  return {
    openGraph,
    title: "Stanford A Cappella",
    description:
      "Learn more about auditions, shows, and events for a cappella groups at Stanford University!",
    keywords: [
      "stanford a cappella",
      "stanford acapella",
      "audition",
      "a cappella",
      "a cappella audition",
      "acapella audition",
      "a cappella audition stanford",
      "acapella audition stanford",
      "a cappella groups",
      "acapella",
      "acapella groups",
      "stanford university",
      "mendicants",
      "counterpoint",
      "counter point",
      "talisman",
      "mixed co",
      "mixed company",
      "raagapella",
      "everyday people",
      "ep",
      "testimony",
      "o-tone",
      "otone",
      "fleet street",
      "harmonics",
      "harmz",
    ],
  };
}

// Sort groups alphabetically for viewing
const sortedGroups = Object.entries(GROUPS).sort(([_a, a], [_b, b]) =>
  a.name.localeCompare(b.name, "en")
);

export default function Home() {
  return (
    <Box>
      <Heading
        as="h2"
        size="xl"
        mb="8"
        textAlign="center"
        className="gradient-text"
        fontWeight="700"
        srOnly
      >
        Stanford A Cappella Groups
      </Heading>
      <SimpleGrid
        columns={{ base: 1, smPlus: 2, mdPlus: 3, lg: 4 }}
        spacingX={6}
        spacingY={10}
        role="grid"
        aria-label="A cappella groups at Stanford University"
      >
        {sortedGroups.map(([slug, group], index) => (
          <GroupTile key={slug} slug={slug} group={group} index={index} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
