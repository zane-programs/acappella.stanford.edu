import GROUPS from "@/app/config/groups";
import { numberWordCapitalized } from "@/app/lib/words";
import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Heading } from "@/app/components/ui/Heading";
import { Section } from "@/app/components/ui/Section";
import { GroupTile } from "./GroupTile";

/** Every group, alphabetical (docs/DESIGN.md §5 item 4). */
export function GroupsGrid() {
  const groups = Object.entries(GROUPS).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name, "en")
  );

  return (
    <Section id="groups" aria-labelledby="groups-heading">
      <div data-reveal className="max-w-[46rem]">
        <Eyebrow>The groups</Eyebrow>
        <Heading as="h2" size="h2" id="groups-heading" className="mt-3">
          {numberWordCapitalized(groups.length)} groups, one campus
        </Heading>
        <p className="type-lead mt-5 text-black-80">
          Every group has its own sound, history, and audition process. Pick one to
          meet the members, listen in, and find out how to join.
        </p>
      </div>
      <ul
        aria-label="A cappella groups at Stanford University"
        className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4 md:mt-16"
      >
        {groups.map(([slug, group], index) => (
          <GroupTile key={slug} slug={slug} group={group} priority={index < 4} />
        ))}
      </ul>
    </Section>
  );
}
