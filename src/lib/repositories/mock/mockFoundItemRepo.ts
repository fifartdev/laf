import type { FoundItem } from "@/types/models";
import type { IRepository } from "../types";
import { seedFoundItems } from "@/lib/mock-data/foundItems";
import { generateId, nowISO } from "@/lib/utils";

class MockFoundItemRepo implements IRepository<FoundItem> {
  private items: FoundItem[] = [...seedFoundItems];

  async findAll(
    filters?: Partial<Record<string, unknown>>
  ): Promise<FoundItem[]> {
    let result = [...this.items];
    if (filters?.hotelId) result = result.filter((i) => i.hotelId === filters.hotelId);
    if (filters?.status) result = result.filter((i) => i.status === filters.status);
    if (filters?.category) result = result.filter((i) => i.category === filters.category);
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<FoundItem | null> {
    return this.items.find((i) => i.id === id) ?? null;
  }

  async create(
    data: Omit<FoundItem, "id" | "createdAt" | "updatedAt">
  ): Promise<FoundItem> {
    const now = nowISO();
    const item: FoundItem = {
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
    data: Partial<FoundItem>
  ): Promise<FoundItem | null> {
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

const g = globalThis as unknown as { _foundItemRepo?: MockFoundItemRepo };
export const foundItemRepo = g._foundItemRepo ?? (g._foundItemRepo = new MockFoundItemRepo());
