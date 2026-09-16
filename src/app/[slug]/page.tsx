import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";

import { getGroup } from "@/app/config/groups";
import CONFIG from "../config";
import { GroupBody, GroupHero, MoreGroups } from "../components/group";

// The audition open/close window is evaluated per request, never at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroup(slug);

  if (!group) {
    if (CONFIG.groupAltNameMappings[slug]) {
      redirect(CONFIG.groupAltNameMappings[slug], RedirectType.replace);
    } else {
      notFound();
    }
  }

  const groupNameLowercase = group.name.toLowerCase();
  const description =
    group.seoDescription ?? `Learn more about ${group.name} - ${group.tagline}!`;

  return {
    title: group.name + " - Stanford A Cappella",
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: group.name,
      siteName: "Stanford A Cappella",
      description: `Learn more about ${group.name} - ${group.tagline}!`,
      images: [group.imgUrl],
      url: `/${slug}`,
      type: "website",
    },
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

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) {
    // Alias slugs (e.g. /harmz) redirect; anything else is a 404. Mirrors
    // generateMetadata, which can't reliably redirect on its own.
    if (CONFIG.groupAltNameMappings[slug]) {
      redirect(CONFIG.groupAltNameMappings[slug], RedirectType.replace);
    }
    notFound();
  }

  return (
    <>
      <GroupHero slug={slug} group={group} />
      <GroupBody slug={slug} group={group} />
      <MoreGroups slug={slug} />
    </>
  );
}
