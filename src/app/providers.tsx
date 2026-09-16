"use client";

/**
 * TEMP: Chakra UI provider kept only so the not-yet-converted home, group and
 * shows pages keep rendering inside the new layout. Removed at integration
 * along with the Chakra/Emotion/framer-motion packages.
 */
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, createLocalStorageManager } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider
        colorModeManager={colorModeManager}
        theme={theme}
        resetCSS={false}
        disableGlobalStyle
      >
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
  colors: {
    brand: {
      50: "#fef5f5",
      100: "#fde8e8",
      200: "#fbd5d5",
      300: "#f8b4b4",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#8c1515",
      900: "#7f1d1d",
    },
  },
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    heading: "inherit",
    body: "inherit",
  },
});
