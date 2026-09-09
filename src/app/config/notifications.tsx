import { ReactNode } from "react";
import type { CalendarEventDetails } from "../utils/calendar";
import { OSHOW_PROMO } from "./oshow";

export interface NotificationAction {
  label: string;
  href: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface Notification {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  action?: NotificationAction;
  /** When set, the banner shows an "Add to Calendar" menu for this event. */
  calendarEvent?: CalendarEventDetails;
  displayPages?: string[];
  hidePages?: string[];
  startDate?: Date;
  endDate?: Date;
  priority?: number;
  dismissible?: boolean;
  dismissDuration?: "session" | "permanent";
  backgroundColor?: string;
  backgroundGradient?: string;
  textColor?: string;
  borderColor?: string;
  analytics?: {
    category: string;
    label: string;
  };
}

export const ACTIVE_NOTIFICATIONS: Notification[] = [OSHOW_PROMO];
