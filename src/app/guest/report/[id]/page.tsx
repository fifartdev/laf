import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import { matchService } from "@/lib/services/matchService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function GuestReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const report = await lostItemService.getById(id);
  if (!report || report.guestId !== session?.user?.id) notFound();

  const matchDetails = report.matchId
    ? await matchService.getById(report.matchId)
    : null;

  return (
    <div>
      <Link
        href="/guest/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reports
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
              <span>Last seen on {formatDate(report.dateLastSeen)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{report.locationLastSeen}</span>
            </div>
          </CardContent>
        </Card>

        {/* Match details */}
        {matchDetails ? (
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Match found</CardTitle>
                <MatchStatusBadge status={matchDetails.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium">{matchDetails.foundItem.title}</p>
              <p className="text-muted-foreground">{matchDetails.foundItem.description}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Found at: {matchDetails.foundItem.locationFound}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Found on: {formatDate(matchDetails.foundItem.dateFound)}</span>
              </div>
              {matchDetails.status === "confirmed" && (
                <div className="rounded-md bg-green-100 dark:bg-green-900/40 px-3 py-2 mt-2">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Your item is ready for pickup!
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                    Storage location: {matchDetails.foundItem.storageLocation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Match status</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>No match found yet. Our staff is actively looking. We&apos;ll notify you as soon as something is found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
