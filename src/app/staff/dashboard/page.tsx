import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import { foundItemService } from "@/lib/services/foundItemService";
import { matchService } from "@/lib/services/matchService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ClipboardList, PackageSearch, GitMerge, AlertTriangle } from "lucide-react";

export default async function StaffDashboardPage() {
  const session = await auth();
  if (!session?.user?.hotelId) return null;

  const [lostReports, foundItems, matches] = await Promise.all([
    lostItemService.getForHotel(session.user.hotelId),
    foundItemService.getForHotel(session.user.hotelId),
    matchService.getAll(session.user.hotelId),
  ]);

  const openReports = lostReports.filter((r) => r.status === "open").length;
  const unclaimedFound = foundItems.filter((f) => f.status === "unclaimed").length;
  const pendingMatches = matches.filter((m) => m.status === "pending").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {session.user.name}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{openReports}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PackageSearch className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Unclaimed Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{unclaimedFound}</p>
          </CardContent>
        </Card>
        <Card className={pendingMatches > 0 ? "border-yellow-400" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitMerge className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingMatches}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending matches */}
      {pendingMatches > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-md border border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {pendingMatches} match{pendingMatches > 1 ? "es" : ""} need{pendingMatches === 1 ? "s" : ""} review.{" "}
            <Link href="/staff/matches" className="font-medium underline">
              View matches
            </Link>
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent lost reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Reports</CardTitle>
            <Link href="/staff/lost-reports" className="text-xs text-hotel-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {lostReports.slice(0, 5).map((r) => (
              <Link key={r.id} href={`/staff/lost-reports/${r.id}`} className="flex items-center justify-between hover:bg-accent rounded-md px-2 py-1 -mx-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.guest.name} · {formatDate(r.dateLastSeen)}</p>
                </div>
                <LostItemStatusBadge status={r.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Matches</CardTitle>
            <Link href="/staff/matches" className="text-xs text-hotel-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {matches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matches yet.</p>
            ) : (
              matches.slice(0, 5).map((m) => (
                <Link key={m.id} href={`/staff/matches/${m.id}`} className="flex items-center justify-between hover:bg-accent rounded-md px-2 py-1 -mx-2 transition-colors">
                  <p className="text-sm font-medium truncate flex-1">Match #{m.id.slice(-6)}</p>
                  <MatchStatusBadge status={m.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
