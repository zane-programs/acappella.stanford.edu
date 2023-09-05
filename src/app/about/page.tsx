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
        Welcome to <strong>StanfordACappella.com</strong>, the digital home of
        Stanford University&apos;s a cappella groups!
      </Text>
      <AutoStyledContent>
        <Box as="section">
          <Heading size="lg" as="h2">
            For Auditionees
          </Heading>
          <Text>
            Looking to audition for a cappella at Stanford? You&apos;re in the
            right place! Check out our <Link href="/">Groups</Link> page to see
            a full list of a cappella groups.
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
      </AutoStyledContent>
    </>
  );
}
