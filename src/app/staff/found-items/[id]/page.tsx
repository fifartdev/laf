import { auth } from "@/lib/auth/auth";
import { foundItemService } from "@/lib/services/foundItemService";
import { matchService } from "@/lib/services/matchService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FoundItemStatusBadge } from "@/components/features/found-items/FoundItemStatusBadge";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Tag, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FoundItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const item = await foundItemService.getById(id);
  if (!item) notFound();

  const matchDetails = item.matchId
    ? await matchService.getById(item.matchId)
    : null;

  return (
    <div>
      <Link
        href="/staff/found-items"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to found items
      </Link>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Logged {formatDate(item.createdAt)}
          </p>
        </div>
        <FoundItemStatusBadge status={item.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Item details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{item.description}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4 shrink-0" />
              <span className="capitalize">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Found on {formatDate(item.dateFound)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Found at: {item.locationFound}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Archive className="h-4 w-4 shrink-0" />
              <span>Stored at: {item.storageLocation}</span>
            </div>
          </CardContent>
        </Card>

        {matchDetails ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Matched report</CardTitle>
                <MatchStatusBadge status={matchDetails.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{matchDetails.lostItem.title}</p>
              <p className="text-muted-foreground">{matchDetails.lostItem.description}</p>
              <p className="text-muted-foreground">
                Guest: {matchDetails.guest.name} ({matchDetails.guest.email})
              </p>
              {matchDetails.matchScore != null && (
                <p className="text-muted-foreground">
                  Match confidence: {matchDetails.matchScore}%
                </p>
              )}
              <Link
                href={`/staff/matches/${matchDetails.id}`}
                className="text-hotel-primary hover:underline text-sm font-medium"
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
              <p>No match for this item yet.</p>
              <Link
                href="/staff/lost-reports"
                className="text-hotel-primary hover:underline mt-2 inline-block"
              >
                Browse lost reports to create a manual match →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
