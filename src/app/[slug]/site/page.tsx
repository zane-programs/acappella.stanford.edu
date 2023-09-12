import { redirect } from "next/navigation";

import GROUPS from "@/app/config/groups";

export default function AuditionRedirect({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const group = GROUPS[slug];

  redirect(group?.siteLink || "/");
}
