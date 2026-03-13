import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { notificationService } from "@/lib/services/notificationService";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notifications = await notificationService.getForUser(session.user.id);
  const unreadCount = await notificationService.countUnread(session.user.id);
  return NextResponse.json({ data: notifications, unreadCount });
}
