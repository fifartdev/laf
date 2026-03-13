import type { Match } from "@/types/models";
import type { IRepository } from "../types";
import { seedMatches } from "@/lib/mock-data/matches";
import { generateId, nowISO } from "@/lib/utils";

class MockMatchRepo implements IRepository<Match> {
  private items: Match[] = [...seedMatches];

  async findAll(
    filters?: Partial<Record<string, unknown>>
  ): Promise<Match[]> {
    let result = [...this.items];
    if (filters?.hotelId) result = result.filter((m) => m.hotelId === filters.hotelId);
    if (filters?.status) result = result.filter((m) => m.status === filters.status);
    if (filters?.lostItemId) result = result.filter((m) => m.lostItemId === filters.lostItemId);
    if (filters?.foundItemId) result = result.filter((m) => m.foundItemId === filters.foundItemId);
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<Match | null> {
    return this.items.find((m) => m.id === id) ?? null;
  }

  async create(
    data: Omit<Match, "id" | "createdAt" | "updatedAt">
  ): Promise<Match> {
    const now = nowISO();
    const match: Match = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(match);
    return match;
  }

  async update(
    id: string,
    data: Partial<Match>
  ): Promise<Match | null> {
    const index = this.items.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data, updatedAt: nowISO() };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}

const g = globalThis as unknown as { _matchRepo?: MockMatchRepo };
export const matchRepo = g._matchRepo ?? (g._matchRepo = new MockMatchRepo());
