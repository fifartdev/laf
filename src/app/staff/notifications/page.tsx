import { auth } from "@/lib/auth/auth";
import { notificationService } from "@/lib/services/notificationService";
import { formatDateTime } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function StaffNotificationsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const notifications = await notificationService.getForUser(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No notifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={n.read ? "opacity-60" : "border-hotel-primary/50"}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
