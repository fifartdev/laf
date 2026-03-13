import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userService } from "@/lib/services/userService";
import { loginSchema } from "@/lib/validations/authSchema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await userService.authenticate(
          parsed.data.email,
          parsed.data.password
        );
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hotelId: user.hotelId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["id"] = user.id as string;
        token["role"] = (user as { role: string }).role;
        token["hotelId"] = (user as { hotelId?: string }).hotelId;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token["id"] as string;
        session.user.role = token["role"] as "guest" | "staff" | "admin";
        session.user.hotelId = token["hotelId"] as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});
