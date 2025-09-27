import { ReactNode } from "react";
import { MdArrowForward } from "react-icons/md";
import { GROUPS_WITH_CURRENT_AUDITION_LINKS } from "./groups";

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

export const ACTIVE_NOTIFICATIONS: Notification[] = [];
