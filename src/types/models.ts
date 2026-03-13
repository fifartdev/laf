// ─── Enums / Union Types ───────────────────────────────────────────────────────

export type UserRole = "guest" | "staff" | "admin";

export type LostItemStatus = "open" | "matched" | "resolved" | "closed";

export type FoundItemStatus =
  | "unclaimed"
  | "matched"
  | "claimed"
  | "donated"
  | "disposed";

export type MatchStatus = "pending" | "confirmed" | "rejected" | "resolved";

export type NotificationType =
  | "match_found"
  | "match_confirmed"
  | "match_rejected"
  | "item_returned"
  | "report_received";

export type ItemCategory =
  | "electronics"
  | "clothing"
  | "accessories"
  | "documents"
  | "keys"
  | "luggage"
  | "jewelry"
  | "other";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  hotelId?: string; // For staff: which hotel they belong to
  phone?: string;
  roomNumber?: string; // For guests: room at check-in time
  checkInDate?: string; // ISO 8601 date
  checkOutDate?: string; // ISO 8601 date
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  logoUrl?: string;
  contactEmail: string;
  holdingPeriodDays: number; // How long to hold items before disposal
  createdAt: string;
}

export interface LostItemReport {
  id: string;
  guestId: string; // FK → User.id
  hotelId: string; // FK → Hotel.id
  title: string;
  description: string;
  category: ItemCategory;
  dateLastSeen: string; // ISO 8601 date
  locationLastSeen: string; // e.g. "Room 402", "Pool area"
  photoUrls: string[];
  status: LostItemStatus;
  matchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoundItem {
  id: string;
  loggedByStaffId: string; // FK → User.id
  hotelId: string;
  title: string;
  description: string;
  category: ItemCategory;
  dateFound: string; // ISO 8601 date
  locationFound: string;
  storageLocation: string; // e.g. "Front desk locker 3"
  photoUrls: string[];
  status: FoundItemStatus;
  matchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  hotelId: string;
  status: MatchStatus;
  matchScore?: number; // 0–100 confidence
  matchedByStaffId?: string; // null if auto-matched
  staffNotes?: string;
  guestConfirmed?: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string; // FK → User.id
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedMatchId?: string;
  relatedLostItemId?: string;
  relatedFoundItemId?: string;
  createdAt: string;
}

// ─── Derived / View Types ─────────────────────────────────────────────────────

export interface MatchWithDetails extends Match {
  lostItem: LostItemReport;
  foundItem: FoundItem;
  guest: Pick<User, "id" | "name" | "email" | "phone">;
  staffMember?: Pick<User, "id" | "name">;
}

export interface LostItemReportWithGuest extends LostItemReport {
  guest: Pick<User, "id" | "name" | "email" | "roomNumber">;
}

export interface FoundItemWithStaff extends FoundItem {
  loggedBy: Pick<User, "id" | "name">;
}
