import type { Match } from "@/types/models";

export const seedMatches: Match[] = [
  {
    id: "match-1",
    lostItemId: "lost-1",
    foundItemId: "found-1",
    hotelId: "hotel-1",
    status: "confirmed",
    matchScore: 95,
    matchedByStaffId: "user-staff-1",
    staffNotes:
      "Both items match description: black iPhone, clear case, green charm. High confidence match.",
    guestConfirmed: true,
    createdAt: "2025-03-12T14:00:00.000Z",
    updatedAt: "2025-03-12T15:30:00.000Z",
  },
];
