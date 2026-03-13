import type { User } from "@/types/models";
import type { IRepository } from "../types";
import { seedUsers } from "@/lib/mock-data/users";
import { generateId, nowISO } from "@/lib/utils";

class MockUserRepo implements IRepository<User> {
  private users: User[] = [...seedUsers];

  async findAll(filters?: Partial<Record<string, unknown>>): Promise<User[]> {
    let result = [...this.users];
    if (filters?.role) result = result.filter((u) => u.role === filters.role);
    if (filters?.hotelId) result = result.filter((u) => u.hotelId === filters.hotelId);
    return result;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const now = nowISO();
    const user: User = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data, updatedAt: nowISO() };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

const g = globalThis as unknown as { _userRepo?: MockUserRepo };
export const userRepo = g._userRepo ?? (g._userRepo = new MockUserRepo());
