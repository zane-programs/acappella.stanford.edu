"use client";

import { Box, Flex, Heading, Spinner, Text } from "@/app/components/chakra";
import { useEffect, useRef } from "react";

/**
 * Fires a `groupPromo` analytics event, then sends the visitor to
 * `destination` (resolved on the server from the active audition cohort).
 */
export default function GroupPromoRedirect({
  slug,
  groupName,
  destination,
}: {
  slug: string;
  groupName: string;
  destination: string;
}) {
  const ranOnceRef = useRef(false);

  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;

    const redirectTo = () => window.location.replace(destination);

    if (window.gtag) {
      window.gtag("event", "groupPromo", {
        event_category: "promo",
        event_label: slug,
        event_callback: redirectTo,
      });
    } else {
      redirectTo();
    }
  }, [slug, destination]);

  return (
    <Box userSelect="none">
      <Heading as="h2" size="xl" w="100%" textAlign="center" mt="2">
        {groupName}
      </Heading>
      <Flex
        direction="column"
        w="100%"
        h="320px"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        gap="8"
      >
        <Spinner size="xl" color="#555" thickness="4px" />
        <Text fontSize="2xl" fontWeight="600">
          Loading&hellip;
        </Text>
      </Flex>
    </Box>
  );
}
