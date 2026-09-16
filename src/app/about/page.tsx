import type { Metadata } from "next";

import { Eyebrow } from "../components/ui/Eyebrow";
import { Heading } from "../components/ui/Heading";
import { Prose } from "../components/ui/Prose";
import { Section } from "../components/ui/Section";
import { TextLink } from "../components/ui/TextLink";

export const metadata: Metadata = {
  title: "About - Stanford A Cappella",
  description:
    "acappella.stanford.edu is the home of Stanford University's a cappella groups. Learn more about Stanford's a cappella groups.",
  keywords: [
    "about stanford a cappella",
    "about stanford acapella",
    "about",
    "about a cappella",
    "about acapella",
  ],
};

/**
 * History timeline. Every sentence below is taken from the previous About
 * page copy (kept verbatim in the comment at the bottom of this file).
 */
const TIMELINE: { when: string; title: string; body: React.ReactNode }[] = [
  {
    when: "1963",
    title: "The tradition begins",
    body: (
      <>
        Stanford University&apos;s rich a cappella tradition began with the founding of
        the <TextLink href="/mendicants">Stanford Mendicants</TextLink>, an all-male group
        inspired by Yale&apos;s collegiate a cappella scene. Soon after,{" "}
        <TextLink href="/counterpoint">Counterpoint</TextLink> emerged as the first
        all-female a cappella group on the West Coast.
      </>
    ),
  },
  {
    when: "1980s",
    title: "A surge of new voices",
    body: (
      <>
        The 1980s brought a surge in diversity and creativity, with four new groups:{" "}
        <TextLink href="/fleet-street">Fleet Street</TextLink>,{" "}
        <TextLink href="/mixed-company">Mixed Company</TextLink>,{" "}
        <TextLink href="/everyday-people">Everyday People</TextLink>, and{" "}
        <TextLink href="/talisman">Stanford Talisman</TextLink>, each bringing their unique
        style and focus.
      </>
    ),
  },
  {
    when: "1990s",
    title: "National acclaim",
    body: (
      <>
        Collaborations with audio engineer Bill Hare led to award-winning recordings. Fleet
        Street&apos;s sweep at the 1995 Contemporary A Cappella Recording Awards marked a
        highlight, and Stanford&apos;s groups earned unparalleled recognition with 14
        nominations in 1999.
      </>
    ),
  },
  {
    when: "Today",
    title: "A vibrant community",
    body: (
      <>
        Stanford boasts a vibrant a cappella community with diverse groups, including{" "}
        <TextLink href="/harmonics">Harmonics</TextLink>,{" "}
        <TextLink href="/o-tone">O-Tone</TextLink>,{" "}
        <TextLink href="/raagapella">Raagapella</TextLink>,{" "}
        <TextLink href="/testimony">Testimony</TextLink>, and the newest addition,{" "}
        <TextLink href="/kol-etz">Kol Etz</TextLink>, each contributing to the rich tapestry
        of voices and styles that define Stanford A Cappella.
      </>
    ),
  },
];

export default function About() {
  return (
    <>
      <Section spacing="tight" className="pt-14 md:pt-20 lg:pt-24">
        <div data-reveal className="max-w-[46rem]">
          <Eyebrow>About</Eyebrow>
          <Heading as="h1" size="h1" className="mt-3">
            The home of a cappella at Stanford
          </Heading>
          {/* Previous lead (through the 2025–26 season):
              "Welcome to the digital home of Stanford University's a cappella groups!" */}
          <p className="type-lead mt-5 text-black-80">
            Welcome to the digital home of Stanford University&apos;s a cappella groups: one
            place to meet every group, find upcoming shows, and learn how to audition.
          </p>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div data-reveal>
            <Heading as="h2" size="h2">
              For auditionees
            </Heading>
            <Prose className="mt-4">
              <p>
                Looking to audition for a cappella at Stanford? You&apos;ve come to the right
                place. Check out our <TextLink href="/#groups">Groups</TextLink> page to see
                a full list of a cappella groups, and the audition details on each
                group&apos;s page while sign-ups are open.
              </p>
            </Prose>
          </div>
          <div data-reveal>
            <Heading as="h2" size="h2">
              For fans
            </Heading>
            <Prose className="mt-4">
              <p>
                Are you a fan of Stanford a cappella groups? Check out the{" "}
                <TextLink href="/shows">Shows</TextLink> page for a list of upcoming a
                cappella shows and events.
              </p>
            </Prose>
          </div>
        </div>
      </Section>

      <Section tone="fog-light">
        <div data-reveal className="max-w-[46rem]">
          <Eyebrow>History</Eyebrow>
          <Heading as="h2" size="h2" className="mt-3">
            Six decades of song
          </Heading>
        </div>
        <ol className="mt-12 grid gap-y-10 md:mt-16">
          {TIMELINE.map((entry) => (
            <li
              key={entry.when}
              data-reveal
              className="grid gap-4 border-t border-black-20 pt-8 md:grid-cols-[10rem_1fr] md:gap-10"
            >
              <p className="type-h2 text-cardinal">{entry.when}</p>
              <div className="max-w-[60ch]">
                <h3 className="type-h3">{entry.title}</h3>
                <p className="type-body mt-2 text-black-80 [&_a]:font-semibold">
                  {entry.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

/*
  Previous About page copy (through the 2025–26 season), kept for reference:

  For Auditionees: "Looking to audition for a cappella at Stanford? You've come
  to the right place! Check out our Groups page to see a full list of a cappella
  groups."

  For Fans: "Are you a fan of Stanford A Cappella groups? Check out the Shows
  page for a list of upcoming a cappella shows and events."

  History: "Stanford University's rich a cappella tradition began in 1963 with
  the founding of the Stanford Mendicants, an all-male group inspired by Yale's
  collegiate a cappella scene. Soon after, Counterpoint emerged as the first
  all-female a cappella group on the West Coast. The 1980s brought a surge in
  diversity and creativity, with four new groups: Fleet Street, Mixed Company,
  Everyday People, and Stanford Talisman, each bringing their unique style and
  focus.

  Throughout the years, Stanford a cappella groups have achieved national
  acclaim. By the 1990s, collaborations with audio engineer Bill Hare led to
  award-winning recordings. Fleet Street's sweep at the 1995 Contemporary A
  Cappella Recording Awards marked a highlight, and Stanford's groups earned
  unparalleled recognition with 14 nominations in 1999.

  Today, Stanford boasts a vibrant a cappella community with diverse groups,
  including Harmonics, O-Tone, Raagapella, Testimony, and the newest addition,
  Kol Etz, each contributing to the rich tapestry of voices and styles that
  define Stanford A Cappella."
*/
