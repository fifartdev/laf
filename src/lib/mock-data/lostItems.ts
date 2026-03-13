import type { LostItemReport } from "@/types/models";

export const seedLostItems: LostItemReport[] = [
  {
    id: "lost-1",
    guestId: "user-guest-1",
    hotelId: "hotel-1",
    title: "Black iPhone 15 Pro",
    description:
      "Black iPhone 15 Pro in a clear case with a small crack on the back. Has a green phone charm attached.",
    category: "electronics",
    dateLastSeen: "2025-03-11",
    locationLastSeen: "Pool area near sunbeds",
    photoUrls: ["https://placehold.co/400x300/1B3A5C/FFFFFF?text=iPhone+15"],
    status: "matched",
    matchId: "match-1",
    createdAt: "2025-03-12T08:30:00.000Z",
    updatedAt: "2025-03-12T14:00:00.000Z",
  },
  {
    id: "lost-2",
    guestId: "user-guest-2",
    hotelId: "hotel-1",
    title: "Navy Blue Jacket",
    description:
      "Navy blue zip-up jacket, size M, with a small logo on the left chest. Left in the restaurant.",
    category: "clothing",
    dateLastSeen: "2025-03-09",
    locationLastSeen: "Hotel restaurant (3rd floor)",
    photoUrls: [],
    status: "open",
    createdAt: "2025-03-10T10:15:00.000Z",
    updatedAt: "2025-03-10T10:15:00.000Z",
  },
  {
    id: "lost-3",
    guestId: "user-guest-1",
    hotelId: "hotel-1",
    title: "Gold Wedding Band",
    description:
      "Plain 18k gold wedding band, about 5mm wide. May have fallen off in the gym.",
    category: "jewelry",
    dateLastSeen: "2025-03-13",
    locationLastSeen: "Hotel gym / fitness center",
    photoUrls: [],
    status: "open",
    createdAt: "2025-03-13T16:45:00.000Z",
    updatedAt: "2025-03-13T16:45:00.000Z",
  },
];
