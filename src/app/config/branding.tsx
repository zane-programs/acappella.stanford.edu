import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

const BRANDING_OG_OPTIONS: {
  [brandingKey: string]: { openGraph: OpenGraph };
} = {
  auditions_v1: {
    openGraph: {
      title: "Click to learn about a cappella auditions at Stanford!",
      description:
        "Want to audition for a cappella? Look no further! Visit StanfordACappella.com to find audition information for your favorite a cappella groups.",
      images: ["/assets/img/branding/StanfordACappella_Promo1.png"],
    },
  },
  aud2024: {
    openGraph: {
      title: "Click to learn about a cappella auditions at Stanford!",
      description:
        "Want to audition for a cappella? Look no further! Visit acappella.stanford.edu to find audition information for your favorite a cappella groups.",
      images: ["/assets/img/branding/StanfordACappella_Promo_2024.png"],
    },
  },
};

export default BRANDING_OG_OPTIONS;
