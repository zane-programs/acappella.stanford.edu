import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";

import GROUPS from "./config/groups";
import { TransitionProvider } from "./components/transitions/TransitionProvider";
import {
  AnnouncementBar,
  CookieConsent,
  Masthead,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "./components/chrome";

import "./globals.css";

/* ---------- Fonts (docs/DESIGN.md §3) ---------- */

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--next-font-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--next-font-serif",
});

// Only ever used for the word "Stanford" in the wordmark and masthead.
const stanford = localFont({
  src: "../../public/assets/fonts/stanford.woff",
  weight: "400",
  display: "swap",
  variable: "--next-font-stanford",
});

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://acappella.stanford.edu"),
  title: "Stanford A Cappella",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8c1515",
};

const GA_ID = "G-EWZRGZZY5Y";

/**
 * Adds `html.js` before first paint unless the visitor prefers reduced
 * motion. `[data-reveal]` elements are hidden only under `html.js`, so
 * content is never invisible without JavaScript or for reduced-motion users.
 */
const JS_FLAG_SCRIPT =
  "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js')}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navGroups = Object.entries(GROUPS)
    .map(([slug, g]) => ({ slug, name: g.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} ${stanford.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <Script id="google-analytics">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
            </Script>
          </>
        )}
      </head>
      <body className="flex min-h-svh flex-col">
        <TransitionProvider>
          <SkipLink />
          <Masthead />
          <SiteHeader groups={navGroups} />
          <AnnouncementBar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CookieConsent />
        </TransitionProvider>
      </body>
    </html>
  );
}
