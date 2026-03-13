import type { User } from "@/types/models";

// Passwords are stored as plain text only for mock/dev purposes.
// In production with Payload CMS, proper hashing is used.
// Mock password for all users: "password123"
export const seedUsers: User[] = [
  {
    id: "user-guest-1",
    email: "alice@example.com",
    name: "Alice Johnson",
    role: "guest",
    passwordHash: "password123",
    phone: "+1-555-0101",
    roomNumber: "402",
    hotelId: "hotel-1",
    checkInDate: "2025-03-10",
    checkOutDate: "2025-03-18",
    createdAt: "2025-03-10T14:00:00.000Z",
    updatedAt: "2025-03-10T14:00:00.000Z",
  },
  {
    id: "user-guest-2",
    email: "bob@example.com",
    name: "Bob Martinez",
    role: "guest",
    passwordHash: "password123",
    phone: "+1-555-0102",
    roomNumber: "215",
    hotelId: "hotel-1",
    checkInDate: "2025-03-08",
    checkOutDate: "2025-03-14",
    createdAt: "2025-03-08T11:00:00.000Z",
    updatedAt: "2025-03-08T11:00:00.000Z",
  },
  {
    id: "user-staff-1",
    email: "staff@grandseaside.com",
    name: "Maria Chen",
    role: "staff",
    passwordHash: "password123",
    hotelId: "hotel-1",
    createdAt: "2024-06-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
  },
  {
    id: "user-admin-1",
    email: "admin@grandseaside.com",
    name: "James Porter",
    role: "admin",
    passwordHash: "password123",
    hotelId: "hotel-1",
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2024-01-15T09:00:00.000Z",
  },
];
