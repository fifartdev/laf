import { auth } from "@/lib/auth/auth";
import { matchService } from "@/lib/services/matchService";
import { MatchStatusBadge } from "@/components/features/matches/MatchStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { GitMerge } from "lucide-react";
import type { MatchWithDetails } from "@/types/models";

async function getMatchesWithDetails(hotelId: string): Promise<MatchWithDetails[]> {
  const matches = await matchService.getAll(hotelId);
  const details = await Promise.all(matches.map((m) => matchService.getById(m.id)));
  return details.filter((d): d is MatchWithDetails => d !== null);
}

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.hotelId) return null;

  const matches = await getMatchesWithDetails(session.user.hotelId);
  const pending = matches.filter((m) => m.status === "pending");
  const others = matches.filter((m) => m.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Matches</h1>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitMerge className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No matches yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Needs review ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                All matches
              </h2>
              <div className="space-y-2">
                {others.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function MatchRow({ match }: { match: MatchWithDetails }) {
  return (
    <Link href={`/staff/matches/${match.id}`}>
      <Card className="hover:border-hotel-primary/50 transition-colors cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{match.lostItem.title}</p>
                <span className="text-muted-foreground">↔</span>
                <p className="font-medium truncate">{match.foundItem.title}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Guest: {match.guest.name} · Confidence:{" "}
                {match.matchScore != null ? `${match.matchScore}%` : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(match.createdAt)}
              </p>
            </div>
            <MatchStatusBadge status={match.status} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
