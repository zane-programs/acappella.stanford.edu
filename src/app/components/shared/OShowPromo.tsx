"use client";

import {
  Box,
  Button,
  Collapse,
  Heading,
  IconButton,
  Text,
} from "@/app/components/chakra";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// import { Collapse } from "react-collapse";

// icons
import { MdArrowForward, MdClose } from "react-icons/md";

const O_SHOW_PROMO_ID = "oshow_2025_r01";
const DISMISSED_KEY = `dismissed:${O_SHOW_PROMO_ID}`;

export default function OShowPromo() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = useCallback(() => {
    // Log analytics event
    typeof window !== "undefined" &&
      window?.gtag?.("event", "closeBanner", {
        event_category: "promo",
        event_label: "oShow",
      });
    sessionStorage.setItem(DISMISSED_KEY, "1");

    setIsOpen(false);
  }, []);

  useEffect(() => {
    setIsOpen(
      // On homepage or about
      (pathname === "/" || pathname === "/about") &&
        // Must comply with user's choice
        !sessionStorage.getItem(DISMISSED_KEY)
    );
  }, [pathname]);

  const handleLearnMore = useCallback(() => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setIsOpen(false);
  }, []);

  return (
    <Collapse in={isOpen}>
      <Box
        background="linear-gradient(135deg, #8c1515 0%, #b91c1c 100%)"
        color="white"
        p="6"
        mb="8"
        borderRadius="16px"
        position="relative"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        role="banner"
        aria-labelledby="oshow-heading"
      >
        <IconButton
          position="absolute"
          top="2"
          right="2"
          size="sm"
          icon={<MdClose />}
          aria-label="Close O-Show promotion banner"
          background="rgba(255, 255, 255, 0.2)"
          color="white"
          borderRadius="8px"
          _hover={{
            background: "rgba(255, 255, 255, 0.3)",
          }}
          onClick={handleClose}
        />
        <Box>
          <Heading as="h3" size="lg" mb="1" id="oshow-heading">
            See O-Show!
          </Heading>
          <Text fontWeight="600" mb="1">
            The annual showcase of Stanford&apos;s a cappella groups
          </Text>
          <Text lineHeight="1.27em">
            Saturday 9/20, 7:30 PM at Meyer Green
          </Text>
          <Button
            background="rgba(255, 255, 255, 0.2)"
            color="white"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="rgba(255, 255, 255, 0.3)"
            mt="4"
            rightIcon={<MdArrowForward />}
            as={Link}
            href="/shows"
            onClick={handleLearnMore}
            size="md"
            fontWeight="600"
            aria-label="Learn more about O-Show and other upcoming performances"
            _hover={{
              background: "rgba(255, 255, 255, 0.3)",
              borderColor: "rgba(255, 255, 255, 0.5)",
            }}
            _focus={{
              outline: "2px solid",
              outlineColor: "white",
              outlineOffset: "2px",
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
}
