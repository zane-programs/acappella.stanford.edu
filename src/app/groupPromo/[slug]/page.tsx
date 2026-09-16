import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getGroup } from "@/app/config/groups";
import { getPrimaryAuditionHref } from "@/app/utils/auditions";
import GroupPromoRedirect from "./GroupPromoRedirect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroup(slug);

  return group?.directAuditionLinkConfig?.metadata ?? {};
}

export default async function GroupPromo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) redirect("/");

  return (
    <GroupPromoRedirect
      slug={slug}
      groupName={group.name}
      // No current audition link → land on the group page instead
      destination={getPrimaryAuditionHref(slug) ?? `/${slug}`}
    />
  );
}
