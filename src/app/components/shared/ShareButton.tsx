"use client";

import { useCallback, useEffect, useState } from "react";

import { MdShare } from "react-icons/md";
import { Button } from "@/app/components/chakra";

const hasShareSupport =
  typeof window !== "undefined" && "share" in window.navigator;

export default function ShareButton() {
  const [isShowing, setIsShowing] = useState(true);
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

  useEffect(() => {
    if (!hasShareSupport) {
      setIsShowing(false);
    }
  }, []);

  return (
    <Button
      colorScheme="green"
      leftIcon={<MdShare />}
      onClick={handleShare}
      aria-hidden={!isShowing}
      display={isShowing ? undefined : "none"}
    >
      Share
    </Button>
  );
}
