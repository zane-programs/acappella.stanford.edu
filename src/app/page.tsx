// next.js stuff
import type { Metadata } from "next";
import { headers } from "next/headers";

import { Box, SimpleGrid } from "./components/chakra";
import GROUPS from "./config/groups";

import GroupTile from "./components/groups/GroupTile";
import BRANDING_OG_OPTIONS from "./config/branding";

// page metadata
export function generateMetadata(): Metadata {
  const requestHeaders = headers();

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
      <SimpleGrid
        columns={{ base: 1, smPlus: 2, mdPlus: 3, lg: 4 }}
        spacingX={4}
        spacingY={8}
      >
        {sortedGroups.map(([slug, group]) => (
          <GroupTile key={slug} slug={slug} group={group} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
