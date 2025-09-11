import { ReactNode } from "react";
import { MdArrowForward } from "react-icons/md";

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

export const ACTIVE_NOTIFICATIONS: Notification[] = [
  {
    id: "oshow_2025_r01",
    title: "O-Show 2025",
    subtitle: "Stanford's annual a cappella showcase",
    description: "Sat 9/20, 7:30 PM • Meyer Green",
    action: {
      label: "Learn More",
      href: "/shows",
      icon: <MdArrowForward />,
    },
    displayPages: ["/", "/about"],
    dismissible: true,
    dismissDuration: "session",
    backgroundGradient: "linear-gradient(135deg, #8c1515 0%, #b91c1c 100%)",
    textColor: "white",
    borderColor: "rgba(255, 255, 255, 0.2)",
    analytics: {
      category: "promo",
      label: "oShow",
    },
    priority: 10,
  },
  // Example: Auditions notification (commented out - uncomment to activate)
  {
    id: "auditions_fall_2025",
    title: "Want to audition?",
    subtitle: "Stay tuned! Audition details coming Sep 17 👀",
    // Hide on homepage - if user clicks into group page, they'll see this
    hidePages: ["/"],
    dismissible: true,
    dismissDuration: "session",
    backgroundGradient: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    textColor: "white",
    borderColor: "rgba(255, 255, 255, 0.2)",
    analytics: {
      category: "promo",
      label: "auditions",
    },
    priority: 20,
  },
];
