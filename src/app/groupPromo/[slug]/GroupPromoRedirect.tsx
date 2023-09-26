"use client";

import { Box, Flex, Heading, Spinner, Text } from "@/app/components/chakra";
import { useEffect, useRef } from "react";

import GROUPS from "@/app/config/groups";

function redirectTo(link: string | undefined) {
  window.location.replace(link ?? "/");
}

export default function GroupPromoRedirect({
  slug,
  groupName,
}: {
  slug: string;
  groupName: string;
}) {
  const ranOnceRef = useRef(false);

  useEffect(() => {
    if (slug in GROUPS) {
      const group = GROUPS[slug];
      if (group.auditionLink && typeof window !== "undefined") {
        if (window.gtag && !ranOnceRef.current) {
          ranOnceRef.current = true;

          window.gtag("event", "groupPromo", {
            event_category: "promo",
            event_label: slug,
            event_callback: () => {
              console.log("analytics hit");
              redirectTo(group.auditionLink);
            },
          });
        } else {
          redirectTo(group.auditionLink);
        }
      }
    } else {
      window.location.href = "/";
    }
  }, [slug]);

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
