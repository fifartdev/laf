import type { FoundItem } from "@/types/models";

export const seedFoundItems: FoundItem[] = [
  {
    id: "found-1",
    loggedByStaffId: "user-staff-1",
    hotelId: "hotel-1",
    title: "iPhone in Clear Case",
    description:
      "Black iPhone in a clear case, found near the pool sunbeds. Has a green phone charm.",
    category: "electronics",
    dateFound: "2025-03-11",
    locationFound: "Pool deck, sunbed row B",
    storageLocation: "Front desk — secure drawer #3",
    photoUrls: ["https://placehold.co/400x300/C9A96E/FFFFFF?text=Found+Phone"],
    status: "matched",
    matchId: "match-1",
    createdAt: "2025-03-11T17:00:00.000Z",
    updatedAt: "2025-03-12T14:00:00.000Z",
  },
  {
    id: "found-2",
    loggedByStaffId: "user-staff-1",
    hotelId: "hotel-1",
    title: "Men's Leather Wallet",
    description:
      "Brown leather bifold wallet, contains some foreign currency notes and a loyalty card. No ID found.",
    category: "accessories",
    dateFound: "2025-03-12",
    locationFound: "Lobby seating area, armchair near window",
    storageLocation: "Front desk — secure drawer #1",
    photoUrls: [],
    status: "unclaimed",
    createdAt: "2025-03-12T11:30:00.000Z",
    updatedAt: "2025-03-12T11:30:00.000Z",
  },
  {
    id: "found-3",
    loggedByStaffId: "user-staff-1",
    hotelId: "hotel-1",
    title: "Set of Keys with Red Lanyard",
    description:
      "A keychain with 4 keys and a red lanyard. One key appears to be a car key (Toyota logo).",
    category: "keys",
    dateFound: "2025-03-13",
    locationFound: "Conference room B, 2nd floor",
    storageLocation: "Front desk — key hook board",
    photoUrls: [],
    status: "unclaimed",
    createdAt: "2025-03-13T09:00:00.000Z",
    updatedAt: "2025-03-13T09:00:00.000Z",
  },
];
