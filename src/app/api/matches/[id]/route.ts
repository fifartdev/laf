import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { matchService } from "@/lib/services/matchService";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const match = await matchService.getById(id);
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: match });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { status, notes } = body;

  const updated = await matchService.updateStatus(
    id,
    status,
    session.user.id,
    notes
  );
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
