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
 * History timeline: one entry per group in founding order, plus three
 * scene-wide moments (the Bill Hare recording era, the 1993 CARA sweep,
 * Talisman's 1997 national title). Dates and milestones were checked against
 * group sites, the Stanford Daily, Stanford Magazine, casa.org and the ICCA
 * archive in September 2026; only verified facts appear here. The previous
 * four-era draft is kept in the comment at the bottom of this file.
 */
const TIMELINE: {
  slug: string;
  when: string;
  title: string;
  body: React.ReactNode;
}[] = [
  {
    slug: "mendicants",
    when: "1963",
    title: "The Mendicants, and a tradition begins",
    body: (
      <>
        Hank Adams, a transfer from Yale who had sung with the Whiffenpoofs, gathered five
        undergraduates and founded the{" "}
        <TextLink href="/mendicants">Stanford Mendicants</TextLink>, the university&apos;s
        first a cappella group. Legend holds that they rehearsed a song or two, sang at
        lunch in Branner Hall, then serenaded a women&apos;s dorm and left through a window.
        Still a lower-voices group, the Mendicants remain Stanford&apos;s original, and won
        their ICCA West quarterfinal in 2019.
      </>
    ),
  },
  {
    slug: "counterpoint",
    when: "1979",
    title: "Counterpoint finds the upper voices",
    body: (
      <>
        Sophomores Linda Chin and Joyce Rogers, who met in Stanford Chorale, auditioned
        twelve singers in the Dinkelspiel basement and started{" "}
        <TextLink href="/counterpoint">Counterpoint</TextLink>, Stanford&apos;s first
        soprano/alto group. That same year the Stanford Alumni Association named it the
        most innovative student project. A Southern California tour alongside the
        Mendicants began soon after and is still an annual fixture.
      </>
    ),
  },
  {
    slug: "fleet-street",
    when: "1981",
    title: "Fleet Street writes its own songs",
    body: (
      <>
        <TextLink href="/fleet-street">Fleet Street</TextLink> began with barbershop roots
        and grew into something rarer: a comedy group that sings almost nothing but
        originals, with sketch and film to match. Its 1991 album{" "}
        <em>Up Toward Mountains Higher</em> marked the Stanford centennial, and the group
        opened its voicing to all genders in 2022.
      </>
    ),
  },
  {
    slug: "mixed-company",
    when: "1985",
    title: "Mixed Company, the first all-gender group",
    body: (
      <>
        Bonnie Zare put up posters for a co-ed a cappella ensemble in the fall of 1985 and
        found that Gina DeLuca and Fritz Stewart were planning the same thing; together
        they founded <TextLink href="/mixed-company">Mixed Company</TextLink>,
        Stanford&apos;s first all-gender group. Its first album,{" "}
        <em>The Loudest Voice Wins</em>, followed in 1987, and the anti-Valentine&apos;s
        show <em>Love Sucks</em> has been a February fixture since the late 1980s. The
        group won its ICCA West quarterfinal in 2022 and again in 2023.
      </>
    ),
  },
  {
    slug: "everyday-people",
    when: "1987",
    title: "Everyday People, named for a Sly Stone song",
    body: (
      <>
        Juniors Larry Shorter and Tony Stovall founded{" "}
        <TextLink href="/everyday-people">Everyday People</TextLink> and named it for the
        Sly and the Family Stone hit and the message behind it. The group sings hip-hop,
        R&amp;B, Motown and soul, always in black, and its album <em>EP Jones</em> won
        Best Mixed Collegiate Album at the 2000 Contemporary A Cappella Recording Awards.
        In 2026 it won Stanford&apos;s first campus riff-off.
      </>
    ),
  },
  {
    slug: "bill-hare",
    when: "1989",
    title: "A young engineer named Bill Hare",
    body: (
      <>
        <em>Aquapella</em>, recorded with the Mendicants across 1988 and 1989, was among
        the first a cappella albums Bill Hare ever engineered. He went on to record Fleet
        Street, Harmonics and others, and the albums from those years are where
        Stanford&apos;s award run begins.
      </>
    ),
  },
  {
    slug: "talisman",
    when: "1990",
    title: "Talisman, and the songs of South Africa",
    body: (
      <>
        Joseph Pigato founded <TextLink href="/talisman">Talisman</TextLink> around the
        music of Black liberation struggles, above all the anti-apartheid songs of South
        Africa, alongside spirituals and folk traditions from around the world. A promise
        the group made in 1993, to sing in South Africa&apos;s townships, was kept with a
        first tour in 2000; there have been five since. <em>Watch Me Fly</em> won Best
        Mixed Collegiate Album at the 2004 CARAs.
      </>
    ),
  },
  {
    slug: "harmonics",
    when: "1991",
    title: "Harmonics plug in",
    body: (
      <>
        <TextLink href="/harmonics">Harmonics</TextLink> took Stanford a cappella somewhere
        it had not gone: rock and experimental repertoire, sung on individual wireless
        mics with live effects. <em>Escape Velocity</em> won three CARAs in 2009,
        including Best Mixed Collegiate Album, and <em>Signal Lost</em> won Best Rock
        Album in 2020, an open category not limited to college groups.
      </>
    ),
  },
  {
    slug: "testimony",
    when: "1991",
    title: "Testimony, with a story in every show",
    body: (
      <>
        <TextLink href="/testimony">Testimony</TextLink> was founded the same year as
        Stanford&apos;s Christian a cappella group. Its concerts pair music with a spoken
        testimony from a member, and the group sings as readily at churches, shelters and
        conferences as it does on campus. Its 2012 album <em>From Dust</em> earned
        recognition at the CARAs.
      </>
    ),
  },
  {
    slug: "cara-1993",
    when: "1993",
    title: "A record at the CARAs",
    body: (
      <>
        The Contemporary A Cappella Recording Awards were a year old when Fleet
        Street&apos;s <em>50-Minute Fun Break</em> took five of them, Best Male Collegiate
        Album among them, a record at the time. Mixed Company&apos;s <em>Unanimous</em>{" "}
        was runner-up in two categories the same year. Fleet Street won three more in
        1995, and by 1999 Stanford&apos;s groups were drawing a record number of
        nominations.
      </>
    ),
  },
  {
    slug: "icca-1997",
    when: "1997",
    title: "Talisman wins the national title",
    body: (
      <>
        Talisman won the national championship of collegiate a cappella, the tournament
        now known as the ICCA. The same year, its recording of{" "}
        <em>Wanting Memories</em> appeared on Best of College A Cappella alongside a Mixed
        Company track, and <em>The Rainmaker</em> shared the CARA for Best Mixed
        Collegiate Song.
      </>
    ),
  },
  {
    slug: "raagapella",
    when: "2002",
    title: "Raagapella brings Bollywood to the Farm",
    body: (
      <>
        Mehul Trivedi, Bobby Ghosh, Sudeep Roy and Jay Pandit founded{" "}
        <TextLink href="/raagapella">Raagapella</TextLink> as one of the first South Asian
        a cappella groups at any American college. The repertoire runs from Bollywood and
        Indian classical music to American pop and R&amp;B. The group first toured India
        in 2008 and returned in 2024, and it has been all-gender since 2017.
      </>
    ),
  },
  {
    slug: "o-tone",
    when: "2016",
    title: "O-Tone sings in four languages",
    body: (
      <>
        <TextLink href="/o-tone">O-Tone</TextLink> took shape in the winter of 2016, after
        Zhengyuan Ma and Ye Wang floated the idea the previous fall, as an East Asian
        interest group singing in Chinese, Korean, Japanese and English, with graduate
        students alongside undergraduates. It soon earned a place at O-Show, the
        orientation-week showcase where new students meet every group, and marked five
        years with the concert <em>Reflections</em> in 2022.
      </>
    ),
  },
  {
    slug: "kol-etz",
    when: "2026",
    title: "Kol Etz joins the scene",
    body: (
      <>
        <TextLink href="/kol-etz">Kol Etz</TextLink>, Stanford&apos;s Jewish a cappella
        group, was founded in 2026: the newest addition to a tradition that is now more
        than sixty years old.
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
              key={entry.slug}
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

  Previous timeline (2026 redesign, first draft), replaced September 2026 after
  fact-checking (Counterpoint is 1979, not "soon after" 1963, and was Stanford's
  first upper-voices group rather than the West Coast's; Talisman is 1990, not
  1980s; the record CARA sweep was 1993, with three more wins in 1995; the "14
  nominations in 1999" figure is only lightly sourced):

  1963, "The tradition begins": "Stanford University's rich a cappella tradition
  began with the founding of the Stanford Mendicants, an all-male group inspired
  by Yale's collegiate a cappella scene. Soon after, Counterpoint emerged as the
  first all-female a cappella group on the West Coast."

  1980s, "A surge of new voices": "The 1980s brought a surge in diversity and
  creativity, with four new groups: Fleet Street, Mixed Company, Everyday
  People, and Stanford Talisman, each bringing their unique style and focus."

  1990s, "National acclaim": "Collaborations with audio engineer Bill Hare led
  to award-winning recordings. Fleet Street's sweep at the 1995 Contemporary A
  Cappella Recording Awards marked a highlight, and Stanford's groups earned
  unparalleled recognition with 14 nominations in 1999."

  Today, "A vibrant community": "Stanford boasts a vibrant a cappella community
  with diverse groups, including Harmonics, O-Tone, Raagapella, Testimony, and
  the newest addition, Kol Etz, each contributing to the rich tapestry of voices
  and styles that define Stanford A Cappella."
*/
