import { notFound, redirect } from "next/navigation";

import BRANDING_OG_OPTIONS from "@/app/config/branding";

export function generateMetadata({
  params: { brandingKey },
}: {
  params: { brandingKey: string };
}) {
  if (!(brandingKey in BRANDING_OG_OPTIONS)) {
    notFound();
  }

  return BRANDING_OG_OPTIONS[brandingKey].metadata;
}

export default function BrandingRedirect({
  params: { brandingKey },
}: {
  params: { brandingKey: string };
}) {
  const { component: brandingPage } = BRANDING_OG_OPTIONS[brandingKey];

  return <>{brandingPage}</>;
}
