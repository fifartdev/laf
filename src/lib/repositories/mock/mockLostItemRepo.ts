import type { LostItemReport } from "@/types/models";
import type { IRepository } from "../types";
import { seedLostItems } from "@/lib/mock-data/lostItems";
import { generateId, nowISO } from "@/lib/utils";

class MockLostItemRepo implements IRepository<LostItemReport> {
  private items: LostItemReport[] = [...seedLostItems];

  async findAll(
    filters?: Partial<Record<string, unknown>>
  ): Promise<LostItemReport[]> {
    let result = [...this.items];
    if (filters?.guestId) result = result.filter((i) => i.guestId === filters.guestId);
    if (filters?.hotelId) result = result.filter((i) => i.hotelId === filters.hotelId);
    if (filters?.status) result = result.filter((i) => i.status === filters.status);
    if (filters?.category) result = result.filter((i) => i.category === filters.category);
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<LostItemReport | null> {
    return this.items.find((i) => i.id === id) ?? null;
  }

  async create(
    data: Omit<LostItemReport, "id" | "createdAt" | "updatedAt">
  ): Promise<LostItemReport> {
    const now = nowISO();
    const item: LostItemReport = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async update(
    id: string,
    data: Partial<LostItemReport>
  ): Promise<LostItemReport | null> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data, updatedAt: nowISO() };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}

const g = globalThis as unknown as { _lostItemRepo?: MockLostItemRepo };
export const lostItemRepo = g._lostItemRepo ?? (g._lostItemRepo = new MockLostItemRepo());
