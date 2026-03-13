import type { Hotel } from "@/types/models";

export const seedHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Grand Seaside Hotel",
    address: "123 Ocean Drive, Miami Beach, FL 33139",
    logoUrl: "https://placehold.co/100x40/1B3A5C/FFFFFF?text=Grand+Seaside",
    contactEmail: "lostfound@grandseaside.com",
    holdingPeriodDays: 90,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "hotel-2",
    name: "Mountain View Inn",
    address: "456 Alpine Road, Aspen, CO 81611",
    logoUrl: "https://placehold.co/100x40/1B3A5C/FFFFFF?text=Mountain+View",
    contactEmail: "lostfound@mountainviewinn.com",
    holdingPeriodDays: 60,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];
