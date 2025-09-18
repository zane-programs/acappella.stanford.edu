import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

// components & setup
import { Providers } from "./providers";
import { Box, Flex, Heading, Link } from "./components/chakra";
import NavItem from "./components/shared/NavItem";
import Footer from "./components/shared/Footer";
import ScrollRestorer from "./utils/ScrollRestorer";
import CookieConsentBanner from "./components/shared/CookieConsentBanner";
import NotificationManager from "./components/shared/NotificationManager";

// fonts
import { Source_Sans_3 } from "next/font/google";

// styles
import "./globals.css";

const STANFORD_CARDINAL_RED = "#8c1515";

// font setup
const sourceSans3 = Source_Sans_3({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
};

const MASTHEAD_IMAGE_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATIAAAAsCAYAAADmbTSaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MDdGMDgzMzExMjA2ODExOThDQkVEMDRDNTUyNEExMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNUM0QzJGQzFDOEUxMUUyQjM1M0E3NDJBRTY0QTBBNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNUM0QzJGQjFDOEUxMUUyQjM1M0E3NDJBRTY0QTBBNSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkM3RjExNzQwNzIwNjgxMTg3MUZEOUM2MDUzQTlFMzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTA3RjA4MzMxMTIwNjgxMTk4Q0JFRDA0QzU1MjRBMTAiLz4gPC9yZGY6RGVzY3Jp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";

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
          <SkipLink />
          <Providers>
            <CookieConsentBanner />
            <Flex
              direction="column"
              minH="calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))"
            >
              <Masthead />
              <Box
                px="8"
                pt="7"
                pb="12"
                w="100%"
                maxW="72em"
                margin="0 auto"
                flex={1}
              >
                <Flex
                  as="nav"
                  role="navigation"
                  aria-label="Main navigation"
                  direction="column"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                  gap="6"
                  className="slideInUp"
                >
                  <Box position="relative">
                    <Image
                      width={80}
                      height={80}
                      src="/assets/img/a_cappella_treble_clef_transparent.png"
                      alt="Treble Clef Logo"
                      style={{
                        filter: "drop-shadow(0 4px 8px rgba(140, 21, 21, 0.2))",
                      }}
                      draggable={false}
                    />
                  </Box>
                  <LogoHeading />
                  <Flex
                    as="ul"
                    role="menubar"
                    gap="8"
                    fontSize="xl"
                    className="card-modern"
                    px="8"
                    py="4"
                    borderRadius="16px"
                    sx={{ listStyle: "none" }}
                  >
                    <NavItem name="Groups" href="/" />
                    <NavItem name="Shows" href="/shows" />
                    <NavItem name="About" href="/about" />
                  </Flex>
                </Flex>
                <Box as="main" role="main" id="main-content" mt="6">
                  <NotificationManager />
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

function LogoHeading() {
  return (
    <Heading
      size={{ base: "2xl", md: "3xl" }}
      as="h1"
      textAlign="center"
      mt="-1"
      display="flex"
      fontWeight="400"
      gap={{ base: "1", md: "3" }}
      sx={{ "& span": { alignSelf: "flex-end" } }}
      userSelect="none"
      flexWrap={{ base: "wrap", sm: "nowrap" }}
      justifyContent="center"
      alignItems="center"
      lineHeight="1.2"
    >
      <Box
        as="span"
        fontWeight="400"
        fontFamily="Stanford"
        marginBottom="-0.1em"
        className="gradient-text"
        fontSize={{ base: "inherit", md: "inherit" }}
      >
        Stanford
      </Box>
      <Box
        aria-hidden="true"
        width={{ base: "1.5px", md: "2px" }}
        height={{ base: "24px", md: "32px", lg: "40px" }}
        background="linear-gradient(135deg, #8c1515 0%, #dc2626 100%)"
        borderRadius="2px"
        alignSelf="center"
        display={{ base: "none", sm: "block" }}
      ></Box>
      <Box
        as="div"
        fontSize={{ base: "0.85em", md: "0.90em", lg: "0.95em" }}
        fontWeight="500"
        color="gray.700"
        letterSpacing="-0.01em"
        mt={{ base: "1", sm: "0" }}
        w={{ base: "100%", sm: "auto" }}
        // Fix alignment with inflexible Stanford font
        // TODO: Consider replacing logo font with SVG
        position="relative"
        transform="translateY(-2.5%)"
      >
        A Cappella
      </Box>
    </Heading>
  );
}

function SkipLink() {
  return (
    <Link
      href="#main-content"
      position="absolute"
      left="-999px"
      top="0"
      zIndex="1000"
      background="white"
      color="black"
      padding="8px 16px"
      textDecoration="none"
      borderRadius="0 0 4px 4px"
      fontSize="sm"
      fontWeight="600"
      _focus={{
        left: "0",
        outline: "2px solid",
        outlineColor: "brand.600",
      }}
    >
      Skip to main content
    </Link>
  );
}

function Masthead() {
  return (
    <Box
      width="100%"
      height="30px"
      backgroundColor={STANFORD_CARDINAL_RED}
      overflow="hidden"
      paddingLeft="6.5%"
      sx={{
        "& a": {
          display: "block",
          height: "70%",
        },
        "& img": { height: "100%" },
      }}
      display="flex"
      alignItems="center"
    >
      <a href="https://www.stanford.edu">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MASTHEAD_IMAGE_URI} alt="Stanford University logo" draggable={false} />
      </a>
    </Box>
  );
}
