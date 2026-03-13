import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { foundItemService } from "@/lib/services/foundItemService";
import { foundItemSchema } from "@/lib/validations/foundItemSchema";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["staff", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.hotelId) {
    return NextResponse.json({ error: "No hotel associated" }, { status: 400 });
  }
  const items = await foundItemService.getForHotel(session.user.hotelId);
  return NextResponse.json({ data: items });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["staff", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = foundItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const item = await foundItemService.create(session.user.id, parsed.data);
  return NextResponse.json({ data: item }, { status: 201 });
}
