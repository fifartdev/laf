"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Props {
  href: string;
}

export function NotificationBell({ href }: Props) {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
