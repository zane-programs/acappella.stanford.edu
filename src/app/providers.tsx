"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, createLocalStorageManager } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}

const colorModeManager = createLocalStorageManager("sac-color-mode");

const theme = extendTheme({
  breakpoints: {
    smPlus: "39em",
    mdPlus: "55em",
  },
  styles: {
    global: {
      body: {
        color: "#111",
        bg: "#eee",
      },
    },
  },
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    // TODO: Specify font here? Or just let Next.js drive it?
    heading: "inherit",
    body: "inherit",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "700",
      },
    },
    Text: {
      baseStyle: {
        fontSize: "lg",
      },
    },
    // Button: { baseStyle: { fontFamily: "heading" } },
  },
});
