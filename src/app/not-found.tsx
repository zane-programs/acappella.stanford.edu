import { Flex, Link, Text } from "@/app/components/chakra";

function CustomNotFound() {
  return (
    <Flex textAlign="center" direction="column" gap="2">
      <Text fontWeight="600" fontSize="xl">
        The page you were looking for was not found.
      </Text>
      <Link href="/" textDecoration="underline" fontWeight="700" fontSize="xl">
        Go Home
      </Link>
    </Flex>
  );
}

export default CustomNotFound;
