import type { Metadata } from "next";
import { Box, Button, Flex, Heading, Link } from "@/app/components/chakra";
import AutoStyledContent from "@/app/components/shared/AutoStyledContent";
import { type ButtonProps } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import PosterImage from "../components/shared/PosterImage";

import GROUPS, {
  type ACappellaGroup,
  type GroupSocialLinks,
} from "@/app/groups";
import { notFound } from "next/navigation";

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
import { useMemo } from "react";

export function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Metadata {
  const group = GROUPS[slug];

  if (!group) {
    notFound();
  }

  const groupNameLowercase = group.name.toLowerCase();

  return {
    title: group.name + " - Stanford A Cappella",
    description: `Learn more about ${group.name}, ${group.tagline}!`,
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

export default function GroupPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const group = GROUPS[slug];

  return (
    <>
      <Heading as="h2" size="xl" mb="4">
        {group.name}
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} gap="8">
        <Flex
          direction="column"
          gap="4"
          w={{ base: "auto", md: "270px", mdPlus: "315px", lg: "345px" }}
        >
          <PosterImage group={group} />
          {group.socialLinks && Object.keys(group.socialLinks).length > 0 && (
            <SocialLinks group={group} />
          )}
          <Flex direction="column" w="100%" gap="1">
            {group.auditionLink && (
              <Button colorScheme="red" {...linkButton(group.auditionLink)}>
                Audition for {group.name}
              </Button>
            )}
            <Button colorScheme="blue" {...linkButton(group.siteLink)}>
              {group.name} Website
            </Button>
          </Flex>
        </Flex>
        <Box flex={{ base: undefined, md: 1 }}>
          <AutoStyledContent lineHeight="1.3em">
            {group.description}
          </AutoStyledContent>
          {/* Spotify Preview (for groups with listed Spotify) */}
          {group.socialLinks?.spotify && (
            <>
              <Heading size="md" as="h3" my="2">
                Listen
              </Heading>
              <SpotifyArtistEmbed spotifyUrl={group.socialLinks.spotify} />
            </>
          )}
        </Box>
      </Flex>
    </>
  );
}

function SpotifyArtistEmbed({ spotifyUrl }: { spotifyUrl: string }) {
  const pathname = useMemo(() => new URL(spotifyUrl).pathname, [spotifyUrl]);

  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src={"https://open.spotify.com/embed" + pathname}
      width="100%"
      height="152"
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
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
    <Flex alignItems="center" justifyContent="center" gap="3">
      {Object.entries(SOCIAL_LINK_ICONS)
        .filter(([key]) => !!socialLinks![key as keyof GroupSocialLinks])
        .map(([key, IconComponent]) => (
          <Link
            key={key}
            href={socialLinks![key as keyof GroupSocialLinks]!}
            target="_blank"
            rel="noopener noreferrer"
            title={
              name + " " + SOCIAL_LINK_NAMES[key as keyof GroupSocialLinks]
            }
            color="#821b"
            transition="color 200ms ease"
            sx={{
              "& svg": { fontSize: "1.75rem" },
              "&:hover": { color: "#821e" },
            }}
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
