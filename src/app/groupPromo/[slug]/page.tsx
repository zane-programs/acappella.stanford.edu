import type { Metadata } from "next";

import GROUPS from "@/app/config/groups";
import GroupPromoRedirect from "./GroupPromoRedirect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = GROUPS[slug];

  return group.directAuditionLinkConfig?.metadata ?? {};
}

export default async function GroupPromo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const groupName = GROUPS[slug].name ?? "";
  return <GroupPromoRedirect slug={slug} groupName={groupName} />;
}
