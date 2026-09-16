import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { headers } from "next/headers";

import GROUPS from "./config/groups";
import BRANDING_OG_OPTIONS from "./config/branding";
import credits from "../../public/assets/video/credits.json";

import { AnnouncementBar } from "./components/chrome";
import { AboutTeaser } from "./components/home/AboutTeaser";
import { AuditionsStrip } from "./components/home/AuditionsStrip";
import { GroupsGrid } from "./components/home/GroupsGrid";
import { ShowsPreview } from "./components/home/ShowsPreview";
import { VideoHero, type FootageCredit } from "./components/home/VideoHero";

// Audition status and the shows sheet are evaluated per request.
export const dynamic = "force-dynamic";

const GENERIC_KEYWORDS = [
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
];

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const brandingKey = requestHeaders.get("x-branding-key");
  const openGraph = brandingKey
    ? BRANDING_OG_OPTIONS[brandingKey]?.openGraph ?? {}
    : {};

  // Group names and their aliases, derived from config rather than hand-kept.
  const groupKeywords = Object.values(GROUPS).flatMap((group) => [
    group.name.toLowerCase(),
    ...(group.extraKeywords ?? []),
  ]);

  return {
    openGraph,
    title: "Stanford A Cappella",
    description:
      "Learn more about auditions, shows, and events for a cappella groups at Stanford University!",
    keywords: Array.from(new Set([...GENERIC_KEYWORDS, ...groupKeywords])),
  };
}

const VIDEO_DIR = path.join(process.cwd(), "public", "assets", "video");

export default async function Home() {
  const groupCount = Object.keys(GROUPS).length;
  const hasVideo =
    existsSync(path.join(VIDEO_DIR, "hero-loop.mp4")) ||
    existsSync(path.join(VIDEO_DIR, "hero-loop.webm"));

  return (
    <>
      <VideoHero
        credits={credits as FootageCredit[]}
        groupCount={groupCount}
        hasVideo={hasVideo}
      />
      <AnnouncementBar inline />
      <AuditionsStrip />
      <GroupsGrid />
      <ShowsPreview />
      <AboutTeaser groupCount={groupCount} />
    </>
  );
}
