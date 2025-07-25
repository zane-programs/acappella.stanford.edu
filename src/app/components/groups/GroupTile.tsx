"use client";

import NextLink from "next/link";
import type { ACappellaGroup } from "@/app/config/groups";
import { Box, Flex, Spinner, Text } from "@/app/components/chakra";
import { useState } from "react";

export default function GroupTile({
  slug,
  group: { name, imgUrl, tagline },
  index = 0,
}: {
  slug: string;
  group: ACappellaGroup;
  index?: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const animationDelay = `${index * 100}ms`;

  return (
    <Flex
      as={NextLink}
      direction="column"
      gap="3"
      href={"/" + slug}
      textAlign="center"
      className="staggerFadeIn"
      role="gridcell"
      aria-label={`${name} - ${tagline}`}
      sx={{
        WebkitTapHighlightColor: "transparent",
        // CSS animation with staggered delay
        animation: `fadeInUp 0.6s ease-out ${animationDelay} both`,
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "& .posterImage": {
          transform: "scale(1)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "& .imageOverlay": {
          background:
            "linear-gradient(135deg, rgba(140, 21, 21, 0.9) 0%, rgba(0, 0, 0, 0.4) 100%)",
          transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: 0.5,
        },
        "& .titleText": {
          transform: "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "&:hover, &:focus-visible": {
          outline: "none",
          "& .posterImage": {
            transform: "scale(1.1) rotate(1deg)",
          },
          "& .imageOverlay": {
            opacity: 1,
          },
          "& .cardContainer": {
            boxShadow:
              "0 25px 50px -12px rgba(140, 21, 21, 0.25), 0 10px 20px -6px rgba(140, 21, 21, 0.15)",
          },
        },
        "&:focus-visible": {
          "& .cardContainer": {
            boxShadow: "0 0 0 3px rgba(140, 21, 21, 0.5) !important",
            outline: "none",
          },
        },
      }}
      onClick={() => setIsLoading(true)}
    >
      <Box
        className="cardContainer"
        w="100%"
        aspectRatio={{ base: "2.5 / 1", smPlus: "1 / 1" }}
        position="relative"
        backgroundColor="gray.200"
        overflow="hidden"
        borderRadius="20px"
        boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        sx={{
          "& img.posterImage": {
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userSelect: "none",
          },
        }}
      >
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="posterImage" src={imgUrl} alt={`${name} group photo`} />

        {/* Gradient Overlay */}
        <Box
          className="imageOverlay"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="2"
          aria-hidden="true"
        />

        {/* Content */}
        <Flex
          w="100%"
          h="100%"
          zIndex="3"
          position="absolute"
          alignItems="center"
          justifyContent="center"
          p="6"
        >
          <Text
            className="titleText"
            as="h3"
            fontWeight="800"
            fontSize={{ base: "1.5rem", md: "1.75rem" }}
            color="white"
            lineHeight="1.1"
            textAlign="center"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
            opacity={isLoading ? 0 : 1}
            transition="opacity 200ms ease"
          >
            {name}
          </Text>
        </Flex>

        {/* Loading State */}
        <Flex
          position="absolute"
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
          zIndex="4"
          className="glass"
          aria-hidden={!isLoading}
          role="progressbar"
          aria-label="Loading group page"
          opacity={isLoading ? 1 : 0}
          transition="opacity 200ms ease"
          userSelect="none"
          borderRadius="20px"
        >
          <Box>
            <Spinner size="xl" color="brand.800" thickness="4px" />
          </Box>
        </Flex>
      </Box>

      {/* Tagline */}
      <Box px="2">
        <Text
          lineHeight="1.4"
          fontWeight="600"
          color="gray.700"
          fontSize="md"
          transition="color 0.3s ease"
          _groupHover={{ color: "brand.800" }}
        >
          {tagline}
        </Text>
      </Box>
    </Flex>
  );
}
