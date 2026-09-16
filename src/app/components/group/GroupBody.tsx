import type { ACappellaGroup } from "@/app/config/groups";
import { getGroupAudition } from "@/app/utils/auditions";
import { Button } from "@/app/components/ui/Button";
import { Prose } from "@/app/components/ui/Prose";
import { Section } from "@/app/components/ui/Section";
import { TextLink } from "@/app/components/ui/TextLink";
import AuditionSection from "@/app/components/shared/AuditionSection";
import ShareButton from "@/app/components/shared/ShareButton";
import { ListenSection } from "./ListenEmbed";

/**
 * Bio + Listen on the left, a sticky aside on the right with the audition
 * call-to-action (when sign-ups are open or upcoming), the group's website,
 * share, and a way back to the full list.
 */
export function GroupBody({ slug, group }: { slug: string; group: ACappellaGroup }) {
  const audition = getGroupAudition(slug);

  return (
    <Section spacing="tight" className="py-12 md:py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 xl:gap-24">
        <div>
          <div data-reveal>
            <Prose>{group.description}</Prose>
          </div>
          <ListenSection group={group} />
        </div>

        <aside
          data-reveal
          aria-label={`${group.name} links`}
          className="flex h-fit flex-col gap-6 rounded-md p-6 ring-1 ring-black-10 lg:sticky lg:top-[calc(var(--header-h)+24px)]"
        >
          <AuditionSection groupName={group.name} audition={audition} />

          <div className="flex flex-col gap-3">
            {group.siteLink && (
              <Button
                href={group.siteLink}
                variant="secondary"
                size="lg"
                className="w-full"
                aria-label={`Visit the ${group.name} website (opens in new tab)`}
              >
                {group.name} website
              </Button>
            )}
            <ShareButton className="self-start" />
          </div>

          <TextLink href="/#groups" tone="black" className="type-small self-start">
            Back to all groups
          </TextLink>
        </aside>
      </div>
    </Section>
  );
}
