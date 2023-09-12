"use client";

import NextLink from "next/link";
import type { ACappellaGroup } from "@/app/config/groups";
import { Box, Flex, Spinner, Text } from "@/app/components/chakra";
import { useState } from "react";

export default function GroupTile({
  slug,
  group: { name, imgUrl, tagline },
}: {
  slug: string;
  group: ACappellaGroup;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Flex
      as={NextLink}
      direction="column"
      gap="2"
      href={"/" + slug}
      textAlign="center"
      sx={{
        WebkitTapHighlightColor: "transparent",
        "& .posterImage": {
          transform: "scale(1)",
          transition: "transform 200ms ease",
        },
        "&:hover .posterImage": { transform: "scale(1.1)" },
      }}
      // Show spinner once clicked
      onClick={() => setIsLoading(true)}
    >
      <Box
        w="100%"
        aspectRatio={{ base: "2.5 / 1", smPlus: "1 / 1" }}
        // backgroundSize="cover"
        // backgroundRepeat="no-repeat"
        // backgroundPosition="center"
        // style={{ backgroundImage: `url('${imgUrl}')` }}
        position="relative"
        backgroundColor="#bbb"
        overflow="hidden"
        sx={{
          "& img.posterImage": {
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          },
        }}
      >
        <Flex
          w="100%"
          h="100%"
          zIndex="2"
          position="absolute"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#0007"
          p="6"
        >
          <Text
            fontWeight="700"
            fontSize="1.74rem"
            color="#fff"
            lineHeight="1.15em"
            opacity={isLoading ? 0 : 1}
            transition="opacity 150ms ease"
          >
            {name}
          </Text>
        </Flex>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="posterImage" src={imgUrl} alt={"Picture for " + name} />
        <Flex
          position="absolute"
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
          zIndex="3"
          background="#fff5"
          aria-hidden={!isLoading}
          role="progressbar"
          opacity={isLoading ? 1 : 0}
          transition="opacity 150ms ease"
        >
          <Spinner size="lg" color="#fff" thickness="3px" position="absolute" />
        </Flex>
      </Box>
      <Text lineHeight="1.22em" fontWeight="600">
        {tagline}
      </Text>
    </Flex>
  );
}
