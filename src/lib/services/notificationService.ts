import { notificationRepo } from "@/lib/repositories/mock/mockNotificationRepo";
import type { Notification, NotificationType } from "@/types/models";

export const notificationService = {
  async getForUser(recipientId: string): Promise<Notification[]> {
    return notificationRepo.findAll({ recipientId });
  },

  async countUnread(recipientId: string): Promise<number> {
    return notificationRepo.countUnread(recipientId);
  },

  async markRead(id: string): Promise<Notification | null> {
    return notificationRepo.update(id, { read: true });
  },

  async markAllRead(recipientId: string): Promise<void> {
    const notifications = await notificationRepo.findAll({
      recipientId,
      read: false,
    });
    await Promise.all(
      notifications.map((n) => notificationRepo.update(n.id, { read: true }))
    );
  },

  async create(data: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedMatchId?: string;
    relatedLostItemId?: string;
    relatedFoundItemId?: string;
  }): Promise<Notification> {
    return notificationRepo.create({ ...data, read: false });
  },
};
