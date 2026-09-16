import { redirect } from "next/navigation";

import { getGroup } from "@/app/config/groups";
import { getPrimaryAuditionHref } from "@/app/utils/auditions";

/**
 * `/<slug>/audition` → the group's primary audition link for the active
 * cohort. Falls back to the group page (or home for unknown slugs) so old
 * flyers never dead-end on a stale form.
 */
export default async function AuditionRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroup(slug);

  redirect(group ? getPrimaryAuditionHref(slug) ?? `/${slug}` : "/");
}
