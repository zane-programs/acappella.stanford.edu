import { getServerSideSitemap } from "next-sitemap";

import GROUPS from "../groups";

export async function GET(request: Request) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  return getServerSideSitemap(
    Object.keys(GROUPS).map((slug) => ({
      loc: "https://www.stanfordacappella.com/" + slug,
      lastmod: new Date().toISOString(),
    }))
  );
}
