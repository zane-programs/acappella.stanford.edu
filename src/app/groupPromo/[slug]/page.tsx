import type { Metadata } from "next";

import GROUPS from "@/app/config/groups";
import GroupPromoRedirect from "./GroupPromoRedirect";

export function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Metadata {
  const group = GROUPS[slug];

  return group.directAuditionLinkConfig?.metadata ?? {};
}

export default function GroupPromo({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const groupName = GROUPS[slug].name ?? "";
  return <GroupPromoRedirect slug={slug} groupName={groupName} />;
}
