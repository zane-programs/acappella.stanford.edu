import type { Metadata } from "next";
import { Heading, Text } from "@/app/components/chakra";

export const metadata: Metadata = {
  title: "Shows - Stanford A Cappella",
  description:
    "Learn more about auditions, shows, and events for a cappella groups at Stanford University!",
  keywords: [
    "stanford a cappella shows",
    "stanford acapella shows",
    "a cappella shows",
    "acapella shows",
    "stanford shows",
    "shows",
    "shows at stanford",
  ],
};

export default function Shows() {
  return (
    <>
      <Heading size="lg" as="h2" mb="2">
        Shows
      </Heading>
      <Text fontSize="xl">
        <strong>Coming soon!</strong> This page will contain a list of upcoming
        shows and events put on by your favorite Stanford a cappella groups.
      </Text>
    </>
  );
}
