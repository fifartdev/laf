import { foundItemRepo } from "@/lib/repositories/mock/mockFoundItemRepo";
import { userRepo } from "@/lib/repositories/mock/mockUserRepo";
import type { FoundItem, FoundItemWithStaff } from "@/types/models";
import type { CreateFoundItemDTO, UpdateFoundItemDTO } from "@/types/api";

export const foundItemService = {
  async getForHotel(hotelId: string, filters?: { status?: string; category?: string }): Promise<FoundItemWithStaff[]> {
    const items = await foundItemRepo.findAll({ hotelId, ...filters });
    return Promise.all(
      items.map(async (item) => {
        const staff = await userRepo.findById(item.loggedByStaffId);
        return {
          ...item,
          loggedBy: staff
            ? { id: staff.id, name: staff.name }
            : { id: item.loggedByStaffId, name: "Unknown" },
        };
      })
    );
  },

  async getById(id: string): Promise<FoundItem | null> {
    return foundItemRepo.findById(id);
  },

  async create(staffId: string, data: CreateFoundItemDTO): Promise<FoundItem> {
    return foundItemRepo.create({
      ...data,
      loggedByStaffId: staffId,
      status: "unclaimed",
      photoUrls: data.photoUrls ?? [],
    });
  },

  async update(
    id: string,
    data: UpdateFoundItemDTO
  ): Promise<FoundItem | null> {
    return foundItemRepo.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return foundItemRepo.delete(id);
  },
};
