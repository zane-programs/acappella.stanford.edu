"use client";

import { useState } from "react";

import Image from "next/image";
import { Flex, Spinner } from "@/app/components/chakra";

import type { ACappellaGroup } from "@/app/groups";
import type { FlexProps } from "@chakra-ui/react";

export default function PosterImage({
  group,
  ...props
}: FlexProps & { group: ACappellaGroup }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Flex
      w="100%"
      aspectRatio="3 / 2"
      position="relative"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {!isLoaded && <Spinner color="#888" size="lg" thickness="3px" />}
      <Image
        className="posterImage"
        src={group.imgUrl}
        alt={"Picture for " + group.name}
        layout="fill"
        objectFit="cover"
        onLoadingComplete={() => setIsLoaded(true)}
      />
    </Flex>
  );
}
