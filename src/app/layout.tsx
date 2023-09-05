// components & setup
import { Providers } from "./providers";
import { Box, Flex, Heading } from "./components/chakra";
import NavItem from "./components/shared/NavItem";

// fonts
import { Source_Sans_3 } from "next/font/google";

// font setup
const sourceSans3 = Source_Sans_3({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sourceSans3.className}>
        <Providers>
          <Flex
            direction="column"
            minH="calc(100vh - env(safe-area-inset-bottom))"
            gap="6"
          >
            <Box px="8" py="7" w="100%" maxW="72em" margin="0 auto" flex={1}>
              <Flex
                as="nav"
                direction="column"
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                gap="4"
              >
                <Heading size="2xl" as="h1" textAlign="center">
                  Stanford A Cappella
                </Heading>
                {/* <Text fontSize="lg">Learn more about a cappella groups at Stanford University.</Text> */}
                <Flex as="ul" gap="5" fontSize="xl">
                  <NavItem name="Groups" href="/" />
                  <NavItem name="Shows" href="/shows" />
                  <NavItem name="About" href="/about" />
                </Flex>
              </Flex>
              <Box as="main" mt="6">
                {children}
              </Box>
            </Box>
            <Footer />
          </Flex>
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <Box as="footer" textAlign="center" p="6" color="#555">
      &copy; 2023 Stanford A Cappella
    </Box>
  );
}
