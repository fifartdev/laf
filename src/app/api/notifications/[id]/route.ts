import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { notificationService } from "@/lib/services/notificationService";

export async function PATCH(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const updated = await notificationService.markRead(id);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
