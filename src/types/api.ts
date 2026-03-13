import type {
  ItemCategory,
  LostItemReport,
  FoundItem,
  Match,
  Notification,
} from "./models";

// ─── Generic Response Wrappers ────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Lost Item DTOs ───────────────────────────────────────────────────────────

export type CreateLostItemDTO = Pick<
  LostItemReport,
  | "hotelId"
  | "title"
  | "description"
  | "category"
  | "dateLastSeen"
  | "locationLastSeen"
> & { photoUrls?: string[] };

export type UpdateLostItemDTO = Partial<
  Pick<
    LostItemReport,
    | "title"
    | "description"
    | "category"
    | "dateLastSeen"
    | "locationLastSeen"
    | "photoUrls"
    | "status"
  >
>;

// ─── Found Item DTOs ──────────────────────────────────────────────────────────

export type CreateFoundItemDTO = Pick<
  FoundItem,
  | "hotelId"
  | "title"
  | "description"
  | "category"
  | "dateFound"
  | "locationFound"
  | "storageLocation"
> & { photoUrls?: string[] };

export type UpdateFoundItemDTO = Partial<
  Pick<
    FoundItem,
    | "title"
    | "description"
    | "category"
    | "dateFound"
    | "locationFound"
    | "storageLocation"
    | "photoUrls"
    | "status"
  >
>;

// ─── Match DTOs ───────────────────────────────────────────────────────────────

export type CreateMatchDTO = Pick<Match, "lostItemId" | "foundItemId" | "hotelId"> & {
  staffNotes?: string;
};

export type UpdateMatchDTO = Partial<
  Pick<Match, "status" | "staffNotes" | "guestConfirmed" | "resolvedAt">
>;

// ─── Notification DTOs ────────────────────────────────────────────────────────

export type UpdateNotificationDTO = Pick<Notification, "read">;

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface LostItemFilters {
  status?: string;
  category?: ItemCategory;
  hotelId?: string;
  guestId?: string;
  search?: string;
}

export interface FoundItemFilters {
  status?: string;
  category?: ItemCategory;
  hotelId?: string;
  search?: string;
}

export interface MatchFilters {
  status?: string;
  hotelId?: string;
}
