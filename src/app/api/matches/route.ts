import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { matchService } from "@/lib/services/matchService";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["staff", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.hotelId) {
    return NextResponse.json({ error: "No hotel associated" }, { status: 400 });
  }
  const matches = await matchService.getAll(session.user.hotelId);
  return NextResponse.json({ data: matches });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["staff", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { lostItemId, foundItemId, hotelId, notes } = body;
  if (!lostItemId || !foundItemId || !hotelId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const match = await matchService.createMatch(
    lostItemId,
    foundItemId,
    hotelId,
    session.user.id,
    notes
  );
  return NextResponse.json({ data: match }, { status: 201 });
}
