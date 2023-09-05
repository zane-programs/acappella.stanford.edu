import NextLink from "next/link";
import Image from "next/image";
import type { ACappellaGroup } from "@/app/groups";
import { Box, Flex, Text } from "@/app/components/chakra";

export default function GroupTile({
  slug,
  group: { name, imgUrl, tagline },
}: {
  slug: string;
  group: ACappellaGroup;
}) {
  return (
    <Flex
      as={NextLink}
      direction="column"
      gap="2"
      href={"/" + slug}
      textAlign="center"
      sx={{
        "& .posterImage": {
          transform: "scale(1)",
          transition: "transform 200ms ease",
        },
        "&:hover .posterImage": { transform: "scale(1.1)" },
      }}
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
          >
            {name}
          </Text>
        </Flex>
        <Image
          className="posterImage"
          src={imgUrl}
          alt={"Picture for " + name}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <Text lineHeight="1.22em" fontWeight="600">
        {tagline}
      </Text>
    </Flex>
  );
}
