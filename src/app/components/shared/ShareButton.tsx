"use client";

import { MdShare } from "react-icons/md";
import { Button } from "@/app/components/chakra";

const hasShareSupport =
  typeof window !== "undefined" && "share" in window.navigator;

export default function ShareButton() {
  return hasShareSupport ? (
    <Button
      colorScheme="green"
      leftIcon={<MdShare />}
      onClick={() =>
        navigator
          .share({
            title: document.title,
            text: "The Digital Home of A Cappella at Stanford University",
            url: window.location.origin + window.location.pathname,
          })
          .then(() => console.log("Success"))
          .catch((e) => console.error(e))
      }
    >
      Share
    </Button>
  ) : null;
}
