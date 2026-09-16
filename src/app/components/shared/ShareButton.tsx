"use client";

import { useCallback, useEffect, useState } from "react";
import { MdIosShare } from "react-icons/md";

import { Button } from "@/app/components/ui/Button";

/**
 * Native share sheet trigger. Rendered only where `navigator.share` exists
 * (decided after mount so server and client markup match).
 */
export default function ShareButton({ className }: { className?: string }) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleShare = useCallback(() => {
    navigator
      .share({
        title: document.title,
        text:
          document.querySelector(`meta[name="description"]`)?.getAttribute("content") ??
          "Stanford A Cappella - The home of a cappella at Stanford University",
        url: window.location.origin + window.location.pathname,
      })
      .then(() => {
        window.gtag?.("event", "shareWithShareButton", {
          event_category: "groupPage",
          event_label: document.title,
        });
      })
      .catch(() => {
        // The user dismissed the sheet; nothing to do.
      });
  }, []);

  if (!supported) return null;

  return (
    <Button variant="ghost" onClick={handleShare} iconLeft={<MdIosShare />} className={className}>
      Share this page
    </Button>
  );
}
