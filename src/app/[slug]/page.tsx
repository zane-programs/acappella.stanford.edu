import { useMemo } from "react";
import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";

import { Box, Button, Flex, Heading, Link } from "@/app/components/chakra";
import AutoStyledContent from "@/app/components/shared/AutoStyledContent";
import { type ButtonProps } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import PosterImage from "../components/shared/PosterImage";
import ShareButton from "../components/shared/ShareButton";

import GROUPS, {
  type ACappellaGroup,
  type GroupSocialLinks,
  GROUPS_WITH_CURRENT_AUDITION_LINKS,
} from "@/app/config/groups";
import CONFIG from "../config";

// icons
import {
  SiInstagram,
  SiYoutube,
  SiSpotify,
  SiApplemusic,
  SiTiktok,
  SiTwitter,
  SiFacebook,
} from "react-icons/si";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = GROUPS[slug];

  if (!group) {
    if (CONFIG.groupAltNameMappings[slug]) {
      redirect(CONFIG.groupAltNameMappings[slug], RedirectType.replace);
    } else {
      notFound();
    }
  }

  const groupNameLowercase = group.name.toLowerCase();

  return {
    title: group.name + " - Stanford A Cappella",
    description:
      group.seoDescription ??
      `Learn more about ${group.name} - ${group.tagline}!`,
    openGraph: {
      title: group.name,
      siteName: "Stanford A Cappella",
      description: `Learn more about ${group.name} - ${group.tagline}!`,
      images: [group.imgUrl],
    },
    keywords: [
      groupNameLowercase,
      "stanford " + groupNameLowercase,
      groupNameLowercase + " a cappella",
      groupNameLowercase + " acapella",
      "audition for " + groupNameLowercase,
      groupNameLowercase + " audition",
      groupNameLowercase + " auditions",
      // Add `extraKeywords` to SEO keywords if provided
      ...(group.extraKeywords || []),
    ],
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = GROUPS[slug];

  return (
    <>
      <Heading 
        as="h2" 
        size="2xl" 
        mb="6"
        className="gradient-text slideInUp"
        fontWeight="800"
        letterSpacing="-0.02em"
        textAlign={{ base: "center", md: "left" }}
      >
        {group.name}
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} gap="8">
        <Flex
          direction="column"
          gap="4"
          w={{ base: "auto", md: "270px", mdPlus: "315px", lg: "345px" }}
        >
          <PosterImage group={group} isDescription />
          {group.socialLinks && Object.keys(group.socialLinks).length > 0 && (
            <SocialLinks group={group} />
          )}
          <Flex direction="column" w="100%" gap="1">
            {CONFIG.showAuditionButtons &&
              group.auditionLink &&
              GROUPS_WITH_CURRENT_AUDITION_LINKS.indexOf(slug) !== -1 && (
                <Button 
                  colorScheme="red" 
                  size="lg"
                  className="glow"
                  borderRadius="16px"
                  fontWeight="700"
                  fontSize="md"
                  aria-label={`Audition for ${group.name} (opens in new tab)`}
                  {...linkButton(group.auditionLink)}
                >
                  🎤 Audition for {group.name}
                </Button>
              )}
            <Button 
              variant="glass" 
              size="lg"
              colorScheme="blue"
              borderRadius="16px"
              fontWeight="600"
              aria-label={`Visit ${group.name} website (opens in new tab)`}
              {...linkButton(group.siteLink)}
            >
              🌐 {group.name} Website
            </Button>
            <ShareButton />
          </Flex>
        </Flex>
        <Box flex={{ base: undefined, md: 1 }}>
          <AutoStyledContent lineHeight="1.3em">
            {group.description}
          </AutoStyledContent>
          {/* Spotify Preview (for groups with listed Spotify) */}
          {(group.socialLinks?.spotify || group.socialLinks?.youtube) && (
            <>
              <Heading size="md" as="h3" my="2">
                Listen
              </Heading>
              <ArtistEmbed
                spotify={group.socialLinks.spotify}
                youtube={group.socialLinks.youtube}
              />
            </>
          )}
        </Box>
      </Flex>
    </>
  );
}

function ArtistEmbed({
  spotify,
  youtube,
}: {
  spotify: string | undefined;
  youtube: string | undefined;
}) {
  return spotify ? (
    <iframe
      style={{ borderRadius: "12px" }}
      src={"https://open.spotify.com/embed" + new URL(spotify).pathname}
      width="100%"
      height="152"
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify music player"
    ></iframe>
  ) : (
    <YoutubeChannelEmbed url={youtube!} />
  );
}

function YoutubeChannelEmbed({ url }: { url: string }) {
  const channelId = useMemo(
    () => url.split("/").slice(-1)[0].replace("@", ""),
    [url]
  );
  return (
    <Flex w="100%" justifyContent={{ base: "center", md: "left" }}>
      <Box
        w="100%"
        maxW={{ base: undefined, md: "400px" }}
        aspectRatio="16 / 9"
      >
        <iframe
          width="100%"
          height="100%"
          src={
            "https://www.youtube-nocookie.com/embed/" +
            (/^UC[\w-]{21}[AQgw]$/.test(channelId)
              ? "videoseries?list=UU" + channelId.substring(2)
              : "?listType=user_uploads&list=" + channelId) +
            "&modestbranding=1"
          }
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </Box>
    </Flex>
  );
}

const SOCIAL_LINK_NAMES: {
  [k in keyof GroupSocialLinks]: string;
} = {
  instagram: "Instagram",
  youtube: "YouTube",
  spotify: "Spotify",
  appleMusic: "Apple Music",
  tiktok: "TikTok",
  twitter: "Twitter",
  facebook: "Facebook",
};

const SOCIAL_LINK_ICONS: {
  [k in keyof GroupSocialLinks]: IconType;
} = {
  instagram: SiInstagram,
  youtube: SiYoutube,
  spotify: SiSpotify,
  appleMusic: SiApplemusic,
  tiktok: SiTiktok,
  twitter: SiTwitter,
  facebook: SiFacebook,
};

function SocialLinks({
  group: { name, socialLinks },
}: {
  group: ACappellaGroup;
}) {
  return (
    <Flex 
      alignItems="center" 
      justifyContent="center" 
      gap="4"
      className="card-modern"
      p="4"
      borderRadius="16px"
      role="list"
      aria-label={`Social media links for ${name}`}
    >
      {Object.entries(SOCIAL_LINK_ICONS)
        .filter(([key]) => !!socialLinks![key as keyof GroupSocialLinks])
        .map(([key, IconComponent]) => (
          <Link
            key={key}
            href={socialLinks![key as keyof GroupSocialLinks]!}
            target="_blank"
            rel="noopener noreferrer"
            color="brand.700"
            p="3"
            borderRadius="12px"
            background="rgba(140, 21, 21, 0.1)"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            role="listitem"
            aria-label={`Visit ${name} on ${SOCIAL_LINK_NAMES[key as keyof GroupSocialLinks]} (opens in new tab)`}
            sx={{
              "& svg": { fontSize: "1.5rem" },
              "&:hover": { 
                color: "white",
                background: "brand.700",
                transform: "translateY(-4px) scale(1.1)",
                boxShadow: "0 8px 25px rgba(140, 21, 21, 0.3)",
              },
              "&:focus": {
                outline: "2px solid",
                outlineColor: "brand.600",
                outlineOffset: "2px",
              },
            }}
            title={
              name + " " + SOCIAL_LINK_NAMES[key as keyof GroupSocialLinks]
            }
          >
            <IconComponent />
          </Link>
        ))}
    </Flex>
  );
}

function linkButton(
  href: string
): Partial<ButtonProps & { href: string; target: string }> {
  return {
    href,
    as: "a",
    target: "_blank",
    rel: "noopener",
  };
}
