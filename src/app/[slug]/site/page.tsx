import { redirect } from "next/navigation";

import { getGroup } from "@/app/config/groups";

export default async function SiteRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroup(slug);

  redirect(group ? group.siteLink ?? `/${slug}` : "/");
}
