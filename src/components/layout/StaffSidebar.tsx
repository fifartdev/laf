"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PackageSearch,
  ClipboardList,
  GitMerge,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/found-items", label: "Found Items", icon: PackageSearch },
  { href: "/staff/lost-reports", label: "Lost Reports", icon: ClipboardList },
  { href: "/staff/matches", label: "Matches", icon: GitMerge },
  { href: "/staff/settings", label: "Settings", icon: Settings },
];

export function StaffSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-background min-h-screen">
        <div className="flex h-14 items-center border-b px-4 gap-2">
          <Search className="h-5 w-5 text-hotel-primary" />
          <span className="font-semibold text-hotel-primary">LAF Staff</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-hotel-primary text-white font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3 flex items-center gap-2">
          <NotificationBell href="/staff/notifications" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="md:hidden sticky top-0 z-40 border-b bg-background flex h-14 items-center justify-between px-4">
        <span className="font-semibold text-hotel-primary">LAF Staff</span>
        <div className="flex items-center gap-1">
          <NotificationBell href="/staff/notifications" />
          <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
    </>
  );
}
