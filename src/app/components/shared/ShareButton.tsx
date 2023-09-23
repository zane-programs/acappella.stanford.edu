"use client";

import { useCallback } from "react";

import { MdShare } from "react-icons/md";
import { Button } from "@/app/components/chakra";

const hasShareSupport =
  typeof window !== "undefined" && "share" in window.navigator;

export default function ShareButton() {
  const handleShare = useCallback(() => {
    navigator
      .share({
        title: document.title,
        text:
          document
            .querySelector(`meta[name="description"]`)
            ?.getAttribute("content") ??
          "StanfordACappella.com - The Digital Home of A Cappella at Stanford University",
        url: window.location.origin + window.location.pathname,
      })
      .then(() => {
        console.log("Shared!");

        // Log analytics event
        typeof window !== "undefined" &&
          window?.gtag?.("event", "shareWithShareButton", {
            event_category: "groupPage",
            event_label: document.title,
          });
      })
      .catch((e) => console.error(e));
  }, []);

  return hasShareSupport ? (
    <Button colorScheme="green" leftIcon={<MdShare />} onClick={handleShare}>
      Share
    </Button>
  ) : null;
}
