import { redirect } from "next/navigation";

import GROUPS from "@/app/config/groups";

export default async function AuditionRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = GROUPS[slug];

  redirect(group?.siteLink || "/");
}
