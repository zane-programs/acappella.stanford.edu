import type { ACappellaGroup } from "@/app/config/groups";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";
import { TextLink } from "@/app/components/ui/TextLink";
import { SocialLinks } from "./SocialLinks";
import { VoiceParts } from "./VoiceParts";

/**
 * Most group photos are 600px-wide JPEGs (see docs/DESIGN.md §5); the 2026
 * WebP photos are 2000px+. The hero box is capped so a 600px source is never
 * stretched much past its natural width.
 */
function heroMaxWidth(src: string): string {
  return /\.(jpe?g|png)$/i.test(src) ? "max-w-[520px]" : "max-w-[560px]";
}

/**
 * Cardinal band at the top of a group page. The photo is the destination of
 * the shared-image page transition (`data-shared-image={slug}`), so its box
 * is a fixed 3:2 aspect ratio and sits above any late-loading content.
 */
export function GroupHero({ slug, group }: { slug: string; group: ACappellaGroup }) {
  const src = group.descriptionImgUrl ?? group.imgUrl;

  return (
    <Section tone="cardinal" spacing="none" className="pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        <div className={`w-full ${heroMaxWidth(src)}`}>
          {/* Plain <img> (not next/image) so the transition provider can
              measure and morph onto a stable box. Allowed per DESIGN.md §7. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-shared-image={slug}
            src={src}
            alt={`${group.name} group photo`}
            width={600}
            height={400}
            decoding="async"
            fetchPriority="high"
            className="aspect-[3/2] w-full rounded-md object-cover ring-1 ring-white/15 select-none"
            draggable={false}
          />
        </div>

        <div data-reveal className="flex flex-col items-start gap-5 lg:gap-6">
          <Eyebrow tone="white">Stanford A Cappella</Eyebrow>
          <Heading as="h1" size="display" className="-mt-2 text-white">
            {group.name}
          </Heading>
          <p className="type-lead max-w-[36rem] text-white/85">{group.tagline}</p>
          <VoiceParts parts={group.voiceParts} />
          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
            {group.socialLinks && Object.keys(group.socialLinks).length > 0 && (
              <SocialLinks name={group.name} links={group.socialLinks} className="-ml-3" />
            )}
            {group.siteLink && (
              <TextLink
                href={group.siteLink}
                tone="white"
                aria-label={`Visit the ${group.name} website (opens in new tab)`}
              >
                Website
              </TextLink>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
