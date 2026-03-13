import type { DefaultSession } from "next-auth";
import type { UserRole } from "./models";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      hotelId?: string;
    };
  }

  interface User {
    role: UserRole;
    hotelId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    hotelId?: string;
  }
}
