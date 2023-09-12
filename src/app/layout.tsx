import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

// components & setup
import { Providers } from "./providers";
import { Box, Flex, Heading } from "./components/chakra";
import NavItem from "./components/shared/NavItem";
import Footer from "./components/shared/Footer";
import ScrollRestorer from "./utils/ScrollRestorer";
import CookieConsentBanner from "./components/shared/CookieConsentBanner";

// fonts
import { Source_Sans_3 } from "next/font/google";

// styles
import "./globals.css";

// font setup
const sourceSans3 = Source_Sans_3({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <head>
          {/* Google tag (gtag.js) */}
          {process.env.NODE_ENV === "production" && (
            <>
              <Script src="https://www.googletagmanager.com/gtag/js?id=G-EWZRGZZY5Y"></Script>
              <Script id="google-analytics">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EWZRGZZY5Y');
          `}
              </Script>
            </>
          )}
        </head>
        <body className={sourceSans3.className}>
          <Providers>
            <CookieConsentBanner />
            <Flex
              direction="column"
              minH="calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))"
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
                  <Image
                    width={60}
                    height={60}
                    src="/assets/img/a_cappella_treble_clef_transparent.png"
                    alt="Treble Clef Logo"
                  />
                  <Heading size="2xl" as="h1" textAlign="center" mt="-1">
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
      <ScrollRestorer />
    </>
  );
}
