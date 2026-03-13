import { lostItemRepo } from "@/lib/repositories/mock/mockLostItemRepo";
import { matchService } from "./matchService";
import { notificationService } from "./notificationService";
import { userRepo } from "@/lib/repositories/mock/mockUserRepo";
import type {
  LostItemReport,
  LostItemReportWithGuest,
} from "@/types/models";
import type { CreateLostItemDTO, UpdateLostItemDTO } from "@/types/api";

export const lostItemService = {
  async getForGuest(guestId: string): Promise<LostItemReport[]> {
    return lostItemRepo.findAll({ guestId });
  },

  async getForHotel(hotelId: string, filters?: { status?: string; category?: string }): Promise<LostItemReportWithGuest[]> {
    const items = await lostItemRepo.findAll({ hotelId, ...filters });
    return Promise.all(
      items.map(async (item) => {
        const guest = await userRepo.findById(item.guestId);
        return {
          ...item,
          guest: guest
            ? { id: guest.id, name: guest.name, email: guest.email, roomNumber: guest.roomNumber }
            : { id: item.guestId, name: "Unknown", email: "", roomNumber: undefined },
        };
      })
    );
  },

  async getById(id: string): Promise<LostItemReport | null> {
    return lostItemRepo.findById(id);
  },

  async create(guestId: string, data: CreateLostItemDTO): Promise<LostItemReport> {
    const item = await lostItemRepo.create({
      ...data,
      guestId,
      status: "open",
      photoUrls: data.photoUrls ?? [],
    });

    // Notify hotel staff
    await notificationService.create({
      recipientId: "user-staff-1", // In production: notify all staff for this hotel
      type: "report_received",
      title: "New lost item report",
      message: `A guest reported a lost ${item.title}.`,
      relatedLostItemId: item.id,
    });

    // Try auto-matching
    await matchService.runAutoMatch(item);

    return item;
  },

  async update(
    id: string,
    guestId: string,
    data: UpdateLostItemDTO
  ): Promise<LostItemReport | null> {
    const item = await lostItemRepo.findById(id);
    if (!item || item.guestId !== guestId) return null;
    if (item.status !== "open") throw new Error("Cannot edit a matched or resolved report");
    return lostItemRepo.update(id, data);
  },

  async close(id: string, guestId: string): Promise<LostItemReport | null> {
    const item = await lostItemRepo.findById(id);
    if (!item || item.guestId !== guestId) return null;
    return lostItemRepo.update(id, { status: "closed" });
  },
};
