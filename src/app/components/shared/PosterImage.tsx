"use client";

import { useState } from "react";

import Image from "next/image";
import { Flex, Spinner } from "@/app/components/chakra";

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
      {...props}
    >
      {!isLoaded && <Spinner color="#888" size="lg" thickness="3px" />}
      <Image
        className="posterImage"
        src={
          isDescription ? group.descriptionImgUrl ?? group.imgUrl : group.imgUrl
        }
        alt={"Picture for " + group.name}
        layout="fill"
        objectFit="cover"
        onLoadingComplete={() => setIsLoaded(true)}
      />
    </Flex>
  );
}
