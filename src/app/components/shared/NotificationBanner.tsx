"use client";

import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@/app/components/chakra";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { Notification } from "@/app/config/notifications";
import { usePathname } from "next/navigation";

interface NotificationBannerProps {
  notification: Notification;
}

export default function NotificationBanner({
  notification,
}: NotificationBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dismissedKey = `dismissed:${notification.id}`;

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && notification.analytics) {
      window?.gtag?.("event", "closeBanner", {
        event_category: notification.analytics.category,
        event_label: notification.analytics.label,
      });
    }

    if (notification.dismissDuration === "permanent") {
      localStorage.setItem(dismissedKey, "1");
    } else {
      sessionStorage.setItem(dismissedKey, "1");
    }

    setIsOpen(false);
  }, [notification, dismissedKey]);

  const handleAction = useCallback(() => {
    if (notification.dismissDuration === "permanent") {
      localStorage.setItem(dismissedKey, "1");
    } else {
      sessionStorage.setItem(dismissedKey, "1");
    }
    setIsOpen(false);
    notification.action?.onClick?.();
  }, [notification, dismissedKey]);

  useEffect(() => {
    const shouldDisplay = () => {
      if (notification.hidePages && notification.hidePages.includes(pathname)) {
        return false;
      }

      if (notification.displayPages && notification.displayPages.length > 0) {
        return notification.displayPages.includes(pathname);
      }

      return true;
    };

    const isNotDismissed = () => {
      if (notification.dismissDuration === "permanent") {
        return !localStorage.getItem(dismissedKey);
      }
      return !sessionStorage.getItem(dismissedKey);
    };

    const isWithinDateRange = () => {
      const now = new Date();
      if (notification.startDate && now < notification.startDate) return false;
      if (notification.endDate && now > notification.endDate) return false;
      return true;
    };

    setIsOpen(shouldDisplay() && isNotDismissed() && isWithinDateRange());
  }, [pathname, notification, dismissedKey]);

  const backgroundStyle = notification.backgroundGradient
    ? { background: notification.backgroundGradient }
    : { backgroundColor: notification.backgroundColor || "#8c1515" };

  return (
    <Collapse in={isOpen}>
      <Box
        {...backgroundStyle}
        color={notification.textColor || "white"}
        p={{ base: "3", md: "4" }}
        borderRadius={{ base: "12px", md: "16px" }}
        position="relative"
        border={`1px solid ${
          notification.borderColor || "rgba(255, 255, 255, 0.2)"
        }`}
        boxShadow="0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        role="banner"
        aria-labelledby={`notification-heading-${notification.id}`}
      >
        {notification.dismissible !== false && (
          <IconButton
            position="absolute"
            top={{ base: "1", md: "2" }}
            right={{ base: "1", md: "2" }}
            size="xs"
            icon={<MdClose />}
            aria-label={`Close ${notification.title} banner`}
            background="rgba(255, 255, 255, 0.15)"
            color={notification.textColor || "white"}
            borderRadius="6px"
            minW="auto"
            h="auto"
            p="1"
            _hover={{
              background: "rgba(255, 255, 255, 0.25)",
            }}
            onClick={handleClose}
          />
        )}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          gap={{ base: 2, md: 4 }}
          pr={{
            base: notification.dismissible !== false ? "8" : "0",
            md: notification.dismissible !== false ? "10" : "0",
          }}
        >
          <Box flex="1">
            <Flex direction="column">
              <Heading
                as="h3"
                size={{ base: "md", md: "lg" }}
                id={`notification-heading-${notification.id}`}
                lineHeight="1.2"
              >
                {notification.title}
              </Heading>
              {notification.subtitle && (
                <Text
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  opacity="0.95"
                >
                  {notification.subtitle}
                </Text>
              )}
            </Flex>
            {notification.description && (
              <Text
                fontSize={{ base: "sm", md: "md" }}
                mt="1"
                opacity="0.9"
                lineHeight="1.3"
              >
                {notification.description}
              </Text>
            )}
          </Box>
          {notification.action && (
            <Button
              background="rgba(255, 255, 255, 0.2)"
              color={notification.textColor || "white"}
              borderWidth="1px"
              borderStyle="solid"
              borderColor="rgba(255, 255, 255, 0.3)"
              rightIcon={notification.action.icon as React.ReactElement}
              as={Link}
              href={notification.action.href}
              onClick={handleAction}
              size={{ base: "sm", md: "md" }}
              fontWeight="600"
              whiteSpace="nowrap"
              flexShrink={0}
              aria-label={`${notification.action.label} for ${notification.title}`}
              _hover={{
                background: "rgba(255, 255, 255, 0.3)",
                borderColor: "rgba(255, 255, 255, 0.5)",
              }}
              _focus={{
                outline: "2px solid",
                outlineColor: notification.textColor || "white",
                outlineOffset: "2px",
              }}
            >
              {notification.action.label}
            </Button>
          )}
        </Flex>
      </Box>
    </Collapse>
  );
}
