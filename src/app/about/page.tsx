import type { Metadata } from "next";
import { Box, Heading, Link, Text } from "@/app/components/chakra";
import AutoStyledContent from "../components/shared/AutoStyledContent";

export const metadata: Metadata = {
  title: "About - Stanford A Cappella",
  description:
    "StanfordACappella.com is the digital home of Stanford University's a cappella groups. Learn more about Stanford's a cappella groups!",
  keywords: [
    "about stanford a cappella",
    "about stanford acapella",
    "about",
    "about a cappella",
    "about acapella",
  ],
};

export default function About() {
  return (
    <>
      <Text fontSize="xl" mb="4">
        Welcome to the digital home of Stanford University&apos;s a cappella
        groups!
      </Text>
      <AutoStyledContent>
        <Box as="section">
          <Heading size="lg" as="h2">
            For Auditionees
          </Heading>
          <Text>
            Looking to audition for a cappella at Stanford? You&apos;ve come to
            the right place! Check out our <Link href="/">Groups</Link> page to
            see a full list of a cappella groups.
          </Text>
        </Box>
        <Box as="section">
          <Heading size="lg" as="h2">
            For Fans
          </Heading>
          <Text>
            Are you a fan of Stanford A Cappella groups? Check out the{" "}
            <Link href="/shows">Shows</Link> page (coming soon!) for a list of
            upcoming a cappella shows and events.
          </Text>
        </Box>
        <Box as="section">
          <Heading size="lg" as="h2">
            History
          </Heading>
          <Text>
            Stanford University&apos;s rich a cappella tradition began in 1963
            with the founding of the{" "}
            <Link href="/mendicants">Stanford Mendicants</Link>, an all-male
            group inspired by Yale&apos;s collegiate a cappella scene. Soon
            after, <Link href="/counterpoint">Counterpoint</Link> emerged as the
            first all-female a cappella group on the West Coast. The 1980s
            brought a surge in diversity and creativity, with four new groups:{" "}
            <Link href="/fleet-street">Fleet Street</Link>,{" "}
            <Link href="/mixed-company">Mixed Company</Link>,{" "}
            <Link href="/everyday-people">Everyday People</Link>, and{" "}
            <Link href="/talisman">Stanford Talisman</Link>, each bringing their
            unique style and focus.
          </Text>

          <Text>
            Throughout the years, Stanford a cappella groups have achieved
            national acclaim. By the 1990s, collaborations with audio engineer
            Bill Hare led to award-winning recordings. Fleet Street&apos;s sweep
            at the 1995 Contemporary A Cappella Recording Awards marked a
            highlight, and Stanford&apos;s groups earned unparalleled
            recognition with 14 nominations in 1999.
          </Text>

          <Text>
            Today, Stanford boasts a vibrant a cappella community with diverse
            groups, including <Link href="/harmonics">Harmonics</Link>,{" "}
            <Link href="/o-tone">O-Tone</Link>,{" "}
            <Link href="/raagapella">Raagapella</Link>, and{" "}
            <Link href="/testimony">Testimony</Link>, each contributing to the
            rich tapestry of voices and styles that define Stanford A Cappella.
          </Text>
        </Box>
      </AutoStyledContent>
    </>
  );
}
