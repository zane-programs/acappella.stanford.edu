import GROUPS from "@/app/config/groups";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";
import { TextLink } from "@/app/components/ui/TextLink";
import { GroupCard } from "./GroupCard";

const MORE_COUNT = 4;

/** The next four groups alphabetically after `slug`, wrapping around. */
export function nextGroups(slug: string, count = MORE_COUNT) {
  const sorted = Object.entries(GROUPS).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name, "en")
  );
  const index = sorted.findIndex(([s]) => s === slug);
  const start = index === -1 ? 0 : index + 1;
  const picked: typeof sorted = [];
  for (let i = 0; i < Math.min(count, sorted.length - 1); i++) {
    picked.push(sorted[(start + i) % sorted.length]);
  }
  return picked;
}

export function MoreGroups({ slug }: { slug: string }) {
  const groups = nextGroups(slug);
  if (groups.length === 0) return null;

  return (
    <Section tone="fog-light" spacing="tight" className="py-14 md:py-20 lg:py-24">
      <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>More groups</Eyebrow>
          <Heading as="h2" size="h2" className="mt-2">
            Keep listening
          </Heading>
        </div>
        <TextLink href="/#groups" tone="black">
          All groups
        </TextLink>
      </div>
      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map(([s, g]) => (
          <GroupCard key={s} slug={s} group={g} />
        ))}
      </ul>
    </Section>
  );
}
