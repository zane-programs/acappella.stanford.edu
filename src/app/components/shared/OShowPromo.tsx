"use client";

import {
  Box,
  Button,
  Collapse,
  Heading,
  IconButton,
  Text,
} from "@/app/components/chakra";
import { useCallback, useState } from "react";

// import { Collapse } from "react-collapse";

// icons
import { MdArrowForward, MdClose } from "react-icons/md";

export default function OShowPromo() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    // Log analytics event
    typeof window !== "undefined" &&
      window?.gtag?.("event", "closeBanner", {
        event_category: "promo",
        event_label: "oShow",
      });

    setIsOpen(false);
  }, []);

  const handleMixer = useCallback(() => {
    // Log analytics event
    typeof window !== "undefined" &&
      window?.gtag?.("event", "mixerReferral", {});
  }, []);

  return (
    <Collapse in={isOpen}>
      <Box
        backgroundColor="gray.700"
        color="gray.200"
        p="4"
        mb="6"
        borderRadius="4"
        position="relative"
      >
        <IconButton
          position="absolute"
          top="0.5"
          right="0.5"
          size="lg"
          icon={<MdClose />}
          aria-label="Close"
          backgroundColor="transparent !important"
          color="gray.300"
          padding="0"
          onClick={handleClose}
        />
        <Box>
          <Heading as="h3" size="lg" mb="1">
            See O-Show!
          </Heading>
          <Text fontWeight="600" mb="2">
            A showcase of Stanford&apos;s a cappella groups
          </Text>
          <Text lineHeight="1.27em">
            Saturday 9/23, 7:30 PM
            <br />
            Meyer Green
          </Text>
          <Button
            color="gray.300"
            backgroundColor="transparent !important"
            borderWidth="2px"
            borderStyle="solid"
            borderColor="currentcolor"
            mt="4"
            rightIcon={<MdArrowForward />}
            as="a"
            target="_blank"
            rel="noopener"
            href="https://mixermeet.com/event/u243744_e4XuDMABoKj"
            onClick={handleMixer}
          >
            See Event on Mixer
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
}
