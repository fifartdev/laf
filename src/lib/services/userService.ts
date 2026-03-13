import { userRepo } from "@/lib/repositories/mock/mockUserRepo";
import type { User, UserRole } from "@/types/models";
import { generateId, nowISO } from "@/lib/utils";

export const userService = {
  async authenticate(
    email: string,
    password: string
  ): Promise<Omit<User, "passwordHash"> | null> {
    const user = await userRepo.findByEmail(email);
    if (!user || user.passwordHash !== password) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async findById(id: string): Promise<Omit<User, "passwordHash"> | null> {
    const user = await userRepo.findById(id);
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    hotelId?: string;
    phone?: string;
    roomNumber?: string;
    checkInDate?: string;
    checkOutDate?: string;
  }): Promise<Omit<User, "passwordHash">> {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");

    const now = nowISO();
    const user = await userRepo.create({
      email: data.email,
      name: data.name,
      passwordHash: data.password, // In production: hash with bcrypt
      role: data.role ?? "guest",
      hotelId: data.hotelId,
      phone: data.phone,
      roomNumber: data.roomNumber,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },
};
