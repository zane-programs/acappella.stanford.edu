"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, createLocalStorageManager } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ProgressProvider } from "@bprogress/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="4px"
      color="#dc2626"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <CacheProvider>
        <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
          {children}
        </ChakraProvider>
      </CacheProvider>
    </ProgressProvider>
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
      800: "#8c1515", // Stanford Cardinal
      900: "#7f1d1d",
    },
    accent: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
  },
  styles: {
    global: {
      body: {
        color: "gray.800",
        bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        minHeight: "100vh",
      },
      "*": {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(0,0,0,0.3)",
        },
      },
      // Global focus styles for better accessibility
      "*:focus-visible": {
        outline: "2px solid",
        outlineColor: "brand.600",
        outlineOffset: "2px",
      },
    },
  },
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    heading: "inherit",
    body: "inherit",
  },
  shadows: {
    card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    cardHover: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "700",
        letterSpacing: "-0.025em",
      },
    },
    Text: {
      baseStyle: {
        fontSize: "lg",
        lineHeight: "1.6",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "12px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
          transform: "translateY(-1px)",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      variants: {
        solid: {
          shadow: "card",
          _hover: {
            shadow: "cardHover",
          },
        },
        glass: {
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          shadow: "glass",
          _hover: {
            background: "rgba(255, 255, 255, 0.35)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});
