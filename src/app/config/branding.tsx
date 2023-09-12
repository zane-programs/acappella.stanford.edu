import type { Metadata } from "next";

import Home from "../page";

const BRANDING_OG_OPTIONS: {
  [brandingKey: string]: { component: React.ReactNode; metadata: Metadata };
} = {
  fizz_auditions_v1: {
    component: <Home />,
    metadata: {
      title: "Click to learn about a cappella auditions at Stanford!",
      description:
        "Want to audition for a cappella? Look no further! Visit StanfordACappella.com to find audition information for your favorite a cappella groups.",
      openGraph: {
        title: "Click to learn about a cappella auditions at Stanford!",
        description:
          "Want to audition for a cappella? Look no further! Visit StanfordACappella.com to find audition information for your favorite a cappella groups.",
        images: ["/assets/img/branding/StanfordACappella_Promo1.png"],
      },
    },
  },
};

export default BRANDING_OG_OPTIONS;
