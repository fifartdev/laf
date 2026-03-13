import type { Notification } from "@/types/models";

export const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    recipientId: "user-guest-1",
    type: "match_found",
    title: "Potential match found!",
    message:
      "We found an item that may match your lost iPhone. Please review the match details.",
    read: false,
    relatedMatchId: "match-1",
    relatedLostItemId: "lost-1",
    relatedFoundItemId: "found-1",
    createdAt: "2025-03-12T14:05:00.000Z",
  },
  {
    id: "notif-2",
    recipientId: "user-guest-1",
    type: "match_confirmed",
    title: "Match confirmed — your item is ready for pickup!",
    message:
      "Great news! Your iPhone has been confirmed found. Please visit the front desk to collect it.",
    read: false,
    relatedMatchId: "match-1",
    createdAt: "2025-03-12T15:35:00.000Z",
  },
];
