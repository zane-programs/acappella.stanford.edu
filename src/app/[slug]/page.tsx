import { useMemo } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Box, Button, Flex, Heading, Link } from "@/app/components/chakra";
import AutoStyledContent from "@/app/components/shared/AutoStyledContent";
import { type ButtonProps } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import PosterImage from "../components/shared/PosterImage";
import ShareButton from "../components/shared/ShareButton";

import GROUPS, {
  type ACappellaGroup,
  type GroupSocialLinks,
} from "@/app/groups";

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
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const group = GROUPS[slug];

  if (!group) {
    notFound();
  }

  const groupNameLowercase = group.name.toLowerCase();

  return {
    title: group.name + " - Stanford A Cappella",
    description:
      group.seoDescription ??
      `Learn more about ${group.name}, ${group.tagline}!`,
    openGraph: {
      title: group.name,
      siteName: "Stanford A Cappella",
      description: `Learn more about ${group.name}, ${group.tagline}!`,
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
            /^UC[\w-]{21}[AQgw]$/.test(channelId)
              ? "https://www.youtube.com/embed/?listType=user_uploads&list=UU" +
                channelId.substring(2)
              : "https://www.youtube.com/embed/?listType=user_uploads&list=" +
                channelId
          }
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
