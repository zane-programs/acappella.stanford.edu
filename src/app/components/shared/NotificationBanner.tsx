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
import {
  CalendarLink,
  detectPlatform,
  getCalendarLinks,
} from "@/app/utils/calendar";
import AddToCalendarMenu from "./AddToCalendarMenu";
import { onDarkButtonProps } from "./buttonStyles";

interface NotificationBannerProps {
  notification: Notification;
}

export default function NotificationBanner({
  notification,
}: NotificationBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarLinks, setCalendarLinks] = useState<CalendarLink[]>([]);
  const pathname = usePathname();
  const dismissedKey = `dismissed:${notification.id}`;
  const textColor = notification.textColor || "white";

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

  // Calendar links depend on the visitor's platform and embed a timestamp,
  // so build them after mount rather than during server rendering. Only
  // bother once the banner is actually shown on this page.
  useEffect(() => {
    if (!notification.calendarEvent || !isOpen) return;
    setCalendarLinks(
      getCalendarLinks(
        notification.calendarEvent,
        detectPlatform(navigator.userAgent)
      )
    );
  }, [notification.calendarEvent, isOpen]);

  const backgroundStyle = notification.backgroundGradient
    ? { background: notification.backgroundGradient }
    : { backgroundColor: notification.backgroundColor || "#8c1515" };

  const buttonStyle = onDarkButtonProps(textColor);

  const hasActions = !!notification.action || calendarLinks.length > 0;

  return (
    <Collapse in={isOpen}>
      <Box
        {...backgroundStyle}
        color={textColor}
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
            color={textColor}
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
          {hasActions && (
            <Flex gap="2" wrap="wrap" flexShrink={0}>
              {notification.action && (
                <Button
                  {...buttonStyle}
                  rightIcon={notification.action.icon as React.ReactElement}
                  as={Link}
                  href={notification.action.href}
                  onClick={handleAction}
                  aria-label={`${notification.action.label} for ${notification.title}`}
                >
                  {notification.action.label}
                </Button>
              )}
              {notification.calendarEvent && calendarLinks.length > 0 && (
                <AddToCalendarMenu
                  {...buttonStyle}
                  links={calendarLinks}
                  eventTitle={notification.calendarEvent.title}
                  analyticsLabel={notification.analytics?.label ?? notification.id}
                />
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </Collapse>
  );
}
