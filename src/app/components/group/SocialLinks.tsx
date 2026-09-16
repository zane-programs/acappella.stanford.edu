import type { IconType } from "react-icons";
import {
  SiApplemusic,
  SiFacebook,
  SiInstagram,
  SiSpotify,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";

import type { GroupSocialLinks } from "@/app/config/groups";
import { cn } from "@/app/lib/cn";

const SOCIAL_LINK_NAMES: { [k in keyof GroupSocialLinks]: string } = {
  instagram: "Instagram",
  youtube: "YouTube",
  spotify: "Spotify",
  appleMusic: "Apple Music",
  tiktok: "TikTok",
  twitter: "X (Twitter)",
  facebook: "Facebook",
};

const SOCIAL_LINK_ICONS: { [k in keyof GroupSocialLinks]: IconType } = {
  instagram: SiInstagram,
  youtube: SiYoutube,
  spotify: SiSpotify,
  appleMusic: SiApplemusic,
  tiktok: SiTiktok,
  twitter: SiX,
  facebook: SiFacebook,
};

/** Row of social icon links, white on the cardinal hero. 44px hit areas. */
export function SocialLinks({
  name,
  links,
  className,
}: {
  name: string;
  links: Partial<GroupSocialLinks>;
  className?: string;
}) {
  const entries = (Object.keys(SOCIAL_LINK_ICONS) as (keyof GroupSocialLinks)[]).filter(
    (key) => !!links[key]
  );
  if (entries.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)} aria-label={`${name} on social media`}>
      {entries.map((key) => {
        const Icon = SOCIAL_LINK_ICONS[key];
        const platform = SOCIAL_LINK_NAMES[key];
        return (
          <li key={key}>
            <a
              href={links[key]!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name} on ${platform} (opens in new tab)`}
              title={platform}
              className="inline-flex size-11 items-center justify-center rounded-sm text-white/85 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-ring"
            >
              <Icon aria-hidden="true" className="text-[1.25rem]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
