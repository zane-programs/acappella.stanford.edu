"use client";

import { useState } from "react";

import Image from "next/image";
import { Box, Flex, Spinner } from "@/app/components/chakra";

import type { ACappellaGroup } from "@/app/config/groups";
import type { FlexProps } from "@chakra-ui/react";

export default function PosterImage({
  group,
  isDescription,
  ...props
}: FlexProps & { group: ACappellaGroup; isDescription?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Flex
      w="100%"
      aspectRatio="3 / 2"
      position="relative"
      alignItems="center"
      justifyContent="center"
      borderRadius="16px"
      overflow="hidden"
      className="card-modern"
      {...props}
    >
      {!isLoaded && (
        <Box
          position="absolute"
          inset="0"
          className="shimmer"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box className="float">
            <Spinner color="brand.500" size="xl" thickness="4px" />
          </Box>
        </Box>
      )}
      <Image
        className="posterImage"
        src={
          isDescription ? group.descriptionImgUrl ?? group.imgUrl : group.imgUrl
        }
        alt={`${group.name} group photo`}
        layout="fill"
        objectFit="cover"
        onLoadingComplete={() => setIsLoaded(true)}
        style={{
          transition: 'opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </Flex>
  );
}
