import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import { lostItemSchema } from "@/lib/validations/lostItemSchema";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "guest") {
    const items = await lostItemService.getForGuest(session.user.id);
    return NextResponse.json({ data: items });
  }

  if (
    (session.user.role === "staff" || session.user.role === "admin") &&
    session.user.hotelId
  ) {
    const items = await lostItemService.getForHotel(session.user.hotelId);
    return NextResponse.json({ data: items });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "guest") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = lostItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const item = await lostItemService.create(session.user.id, parsed.data);
  return NextResponse.json({ data: item }, { status: 201 });
}
