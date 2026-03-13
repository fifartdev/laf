import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import { matchService } from "@/lib/services/matchService";
import { foundItemService } from "@/lib/services/foundItemService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { FoundItemStatusBadge } from "@/components/features/found-items/FoundItemStatusBadge";
import { CreateMatchButton } from "@/components/features/matches/CreateMatchButton";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Tag, User, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LostReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const reports = await lostItemService.getForHotel(session.user.hotelId!);
  const report = reports.find((r) => r.id === id);
  if (!report) notFound();

  const matchDetails = report.matchId
    ? await matchService.getById(report.matchId)
    : null;

  const unclaimedFoundItems = !matchDetails
    ? (await foundItemService.getForHotel(report.hotelId, { status: "unclaimed" }))
    : [];

  return (
    <div>
      <Link
        href="/staff/lost-reports"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to lost reports
      </Link>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Reported {formatDate(report.createdAt)}
          </p>
        </div>
        <LostItemStatusBadge status={report.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Item details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{report.description}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4 shrink-0" />
              <span className="capitalize">{report.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Last seen: {formatDate(report.dateLastSeen)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{report.locationLastSeen}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guest info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{report.guest.name}</span>
              </div>
              <p className="text-muted-foreground">{report.guest.email}</p>
              {report.guest.roomNumber && (
                <p className="text-muted-foreground">Room {report.guest.roomNumber}</p>
              )}
            </CardContent>
          </Card>

          {matchDetails ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Current match</CardTitle>
                  <MatchStatusBadge status={matchDetails.status} />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="font-medium">{matchDetails.foundItem.title}</p>
                <p className="text-muted-foreground">
                  Confidence: {matchDetails.matchScore ?? "N/A"}%
                </p>
                <Link
                  href={`/staff/matches/${matchDetails.id}`}
                  className="text-hotel-primary hover:underline font-medium"
                >
                  View match →
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No match yet. Select a found item below to create one.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {!matchDetails && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PackageSearch className="h-5 w-5" />
            Create a manual match
          </h2>
          {unclaimedFoundItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No unclaimed found items at this hotel.{" "}
              <Link href="/staff/found-items/new" className="text-hotel-primary hover:underline">
                Log a found item →
              </Link>
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unclaimedFoundItems.map((fi) => (
                <Card key={fi.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{fi.title}</CardTitle>
                    <FoundItemStatusBadge status={fi.status} />
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p className="line-clamp-2">{fi.description}</p>
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span className="capitalize">{fi.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Found: {formatDate(fi.dateFound)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{fi.locationFound}</span>
                    </div>
                    <div className="pt-2">
                      <CreateMatchButton
                        lostItemId={report.id}
                        foundItemId={fi.id}
                        hotelId={report.hotelId}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
