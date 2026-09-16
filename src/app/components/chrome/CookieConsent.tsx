"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/app/components/ui/Button";
import { TextLink } from "@/app/components/ui/TextLink";

const STORAGE_KEY = "sac-cookie-consent";

function readConsent(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? false : JSON.parse(v) === true;
  } catch {
    return false;
  }
}

/** Small bottom-left consent card (docs/DESIGN.md §4). Same storage key as before. */
export function CookieConsent() {
  // Assume consent during SSR so the card never flashes for returning visitors.
  const [consented, setConsented] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setConsented(readConsent());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (consented || pathname === "/privacy") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 z-[70] max-w-[22rem] rounded-md bg-white p-5 text-black ring-1 ring-black-10 shadow-elevated sm:right-auto"
    >
      <p className="type-small text-black-80">
        We use cookies to understand how the site is used. See our{" "}
        <TextLink href="/privacy">privacy policy</TextLink>.
      </p>
      <Button
        size="md"
        className="mt-4"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_KEY, "true");
          } catch {
            /* storage unavailable */
          }
          window.gtag?.("event", "cookieConsent");
          setConsented(true);
        }}
      >
        Got it
      </Button>
    </div>
  );
}
