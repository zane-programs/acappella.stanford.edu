import { Box, Link, Text } from "@/app/components/chakra";

export default function Footer() {
  return (
    <Box as="footer" textAlign="center" p="6" color="#555">
      <Text fontSize="md">
        &copy; {new Date().getFullYear()} Stanford A Cappella |{" "}
        <Link href="/privacy" textDecoration="underline">
          Privacy
        </Link>
      </Text>
    </Box>
  );
}
