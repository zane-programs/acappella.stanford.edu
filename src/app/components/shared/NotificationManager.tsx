"use client";

import { Stack } from "@/app/components/chakra";
import { ACTIVE_NOTIFICATIONS } from "@/app/config/notifications";
import NotificationBanner from "./NotificationBanner";

export default function NotificationManager() {
  const sortedNotifications = [...ACTIVE_NOTIFICATIONS].sort((a, b) => {
    return (b.priority || 0) - (a.priority || 0);
  });

  return (
    <Stack spacing={{ base: 2, md: 3 }} mb={{ base: 4, md: 6 }}>
      {sortedNotifications.map((notification) => (
        <NotificationBanner key={notification.id} notification={notification} />
      ))}
    </Stack>
  );
}