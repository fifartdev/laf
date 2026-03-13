import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const isAuthenticated = !!req.auth;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const destination = role === "guest" ? "/guest/dashboard" : "/staff/dashboard";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // Guard guest routes
  if (pathname.startsWith("/guest") && role !== "guest") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Guard staff/admin routes
  if (
    pathname.startsWith("/staff") &&
    role !== "staff" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/guest/:path*", "/staff/:path*", "/login", "/register"],
};
