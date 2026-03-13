import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/userService";
import { registerSchema } from "@/lib/validations/authSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const user = await userService.register({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: "guest",
      hotelId: parsed.data.hotelId,
      phone: parsed.data.phone,
      roomNumber: parsed.data.roomNumber,
      checkInDate: parsed.data.checkInDate,
      checkOutDate: parsed.data.checkOutDate,
    });
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
