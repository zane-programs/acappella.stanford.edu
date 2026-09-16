import type { ACappellaGroup } from "@/app/config/groups";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";

/**
 * "Listen" block: a Spotify artist embed when the group lists Spotify,
 * otherwise a YouTube channel/playlist/video embed. `listenEmbedOverride`
 * takes precedence over the social links.
 */
export function ListenSection({ group }: { group: ACappellaGroup }) {
  const { spotify, youtube } = resolveEmbedSource(group);
  if (!spotify && !youtube) return null;

  return (
    <section aria-labelledby="listen-heading" className="mt-12 lg:mt-16">
      <div data-reveal>
        <Eyebrow>Listen</Eyebrow>
        <Heading as="h2" size="h2" id="listen-heading" className="mt-2">
          Hear {group.name}
        </Heading>
      </div>
      <div className="mt-6 max-w-[640px]">
        {spotify ? <SpotifyEmbed url={spotify} /> : <YoutubeEmbed group={group} url={youtube!} />}
      </div>
    </section>
  );
}

function resolveEmbedSource(group: ACappellaGroup): {
  spotify?: string;
  youtube?: string;
} {
  const { spotify, youtube } = group.socialLinks ?? {};
  const override = group.listenEmbedOverride;
  if (override) {
    if (override.type === "spotify") return { spotify: override.embedId };
    // "youtube" (playlist id) and "youtube-video" (video id) both go to YouTube
    return { youtube: override.embedId };
  }
  return { spotify, youtube };
}

function SpotifyEmbed({ url }: { url: string }) {
  return (
    <iframe
      className="block h-[152px] w-full rounded-md ring-1 ring-black-10"
      src={"https://open.spotify.com/embed" + new URL(url).pathname}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify music player"
    />
  );
}

function YoutubeEmbed({ group, url }: { group: ACappellaGroup; url: string }) {
  const override = group.listenEmbedOverride;
  const src = getYtPlayerSource(url, !!override, override?.type === "youtube-video");
  return (
    <div className="aspect-video w-full overflow-hidden rounded-md ring-1 ring-black-10">
      <iframe
        className="h-full w-full"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        title={`YouTube player for ${group.name}`}
      />
    </div>
  );
}

// Kept verbatim from the previous group page: the channel/playlist detection
// is fiddly and known to work for every configured group.
function getYtPlayerSource(
  url: string,
  isOverridePlaylist?: boolean,
  isVideo = false
) {
  if (isVideo) {
    // Direct video link
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1`;
  }

  // Override playlist URL (full YouTube embed URL)
  if (isOverridePlaylist) {
    return (
      "https://www.youtube-nocookie.com/embed/?listType=playlist&list=" +
      url +
      "&modestbranding=1"
    );
  }

  // Extract channel ID from URL
  const channelId = url.split("/").slice(-1)[0].replace("@", "");
  return (
    "https://www.youtube-nocookie.com/embed/" +
    (/^UC[\w-]{21}[AQgw]$/.test(channelId)
      ? "videoseries?list=UU" + channelId.substring(2)
      : "?listType=user_uploads&list=" + channelId) +
    "&modestbranding=1"
  );
}
