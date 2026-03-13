import type { Notification } from "@/types/models";
import type { IRepository } from "../types";
import { seedNotifications } from "@/lib/mock-data/notifications";
import { generateId, nowISO } from "@/lib/utils";

class MockNotificationRepo implements IRepository<Notification> {
  private items: Notification[] = [...seedNotifications];

  async findAll(
    filters?: Partial<Record<string, unknown>>
  ): Promise<Notification[]> {
    let result = [...this.items];
    if (filters?.recipientId) {
      result = result.filter((n) => n.recipientId === filters.recipientId);
    }
    if (filters?.read !== undefined) {
      result = result.filter((n) => n.read === filters.read);
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<Notification | null> {
    return this.items.find((n) => n.id === id) ?? null;
  }

  async create(
    data: Omit<Notification, "id" | "createdAt">
  ): Promise<Notification> {
    const now = nowISO();
    // Notification doesn't have updatedAt in the model
    const notification = {
      ...data,
      id: generateId(),
      createdAt: now,
    } as Notification;
    this.items.push(notification);
    return notification;
  }

  async update(
    id: string,
    data: Partial<Notification>
  ): Promise<Notification | null> {
    const index = this.items.findIndex((n) => n.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((n) => n.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async countUnread(recipientId: string): Promise<number> {
    return this.items.filter(
      (n) => n.recipientId === recipientId && !n.read
    ).length;
  }
}

const g = globalThis as unknown as { _notificationRepo?: MockNotificationRepo };
export const notificationRepo = g._notificationRepo ?? (g._notificationRepo = new MockNotificationRepo());
