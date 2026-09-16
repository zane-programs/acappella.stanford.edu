"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a `groupPromo` analytics event, then sends the visitor to
 * `destination` (resolved on the server from the active audition cohort).
 */
export default function GroupPromoRedirect({
  slug,
  groupName,
  destination,
}: {
  slug: string;
  groupName: string;
  destination: string;
}) {
  const ranOnceRef = useRef(false);

  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;

    const redirectTo = () => window.location.replace(destination);

    if (window.gtag) {
      window.gtag("event", "groupPromo", {
        event_category: "promo",
        event_label: slug,
        event_callback: redirectTo,
      });
    } else {
      redirectTo();
    }
  }, [slug, destination]);

  return (
    <section
      aria-live="polite"
      className="mx-auto flex min-h-[60svh] w-full max-w-[1440px] flex-col items-center justify-center gap-6 px-5 text-center select-none"
    >
      <h1 className="type-h1 font-serif text-black">{groupName}</h1>
      <span
        aria-hidden="true"
        className="size-9 animate-spin rounded-full border-2 border-black-20 border-t-cardinal"
      />
      <p className="type-lead text-black-70">Taking you to the sign-up page…</p>
    </section>
  );
}
