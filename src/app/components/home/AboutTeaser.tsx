import { Eyebrow } from "@/app/components/ui/Eyebrow";
import { Section } from "@/app/components/ui/Section";
import { TextLink } from "@/app/components/ui/TextLink";
import { numberWord } from "@/app/lib/words";

/** One serif pull-line from the history, linking to /about (docs/DESIGN.md §5 item 6). */
export function AboutTeaser({ groupCount }: { groupCount: number }) {
  return (
    <Section tone="fog" aria-labelledby="about-teaser-heading">
      <div data-reveal className="max-w-[52rem]">
        <Eyebrow id="about-teaser-heading">Since 1963</Eyebrow>
        <p className="type-h2 mt-4 text-balance">
          Stanford&apos;s a cappella tradition began in 1963 with the founding of the
          Mendicants. Six decades later, {numberWord(groupCount)} groups carry it forward.
        </p>
        <p className="mt-8">
          <TextLink href="/about" className="text-[1.0625rem]">
            Read the history
          </TextLink>
        </p>
      </div>
    </Section>
  );
}
