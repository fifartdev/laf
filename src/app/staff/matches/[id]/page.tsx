import { auth } from "@/lib/auth/auth";
import { matchService } from "@/lib/services/matchService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { FoundItemStatusBadge } from "@/components/features/found-items/FoundItemStatusBadge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Tag, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchActionBar } from "@/components/features/matches/MatchActionBar";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const match = await matchService.getById(id);
  if (!match) notFound();

  return (
    <div>
      <Link
        href="/staff/matches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Match #{id.slice(-8)}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Created {formatDate(match.createdAt)}
            {match.matchScore != null && ` · ${match.matchScore}% confidence`}
          </p>
        </div>
        <MatchStatusBadge status={match.status} />
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Lost item */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Lost item report</CardTitle>
              <LostItemStatusBadge status={match.lostItem.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">{match.lostItem.title}</p>
            <p className="text-muted-foreground">{match.lostItem.description}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4 shrink-0" />
              <span className="capitalize">{match.lostItem.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Last seen: {formatDate(match.lostItem.dateLastSeen)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{match.lostItem.locationLastSeen}</span>
            </div>
            <div className="border-t pt-3 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{match.guest.name}</p>
                <p className="text-muted-foreground">{match.guest.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Found item */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Found item</CardTitle>
              <FoundItemStatusBadge status={match.foundItem.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">{match.foundItem.title}</p>
            <p className="text-muted-foreground">{match.foundItem.description}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4 shrink-0" />
              <span className="capitalize">{match.foundItem.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Found: {formatDate(match.foundItem.dateFound)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{match.foundItem.locationFound}</span>
            </div>
            <p className="text-muted-foreground text-xs pt-1">
              Storage: {match.foundItem.storageLocation}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Staff notes */}
      {match.staffNotes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Staff notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{match.staffNotes}</CardContent>
        </Card>
      )}

      {/* Action bar — client component */}
      <MatchActionBar matchId={id} currentStatus={match.status} />
    </div>
  );
}
