"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { MatchStatus } from "@/types/models";
import { CheckCircle, XCircle, PackageCheck } from "lucide-react";

interface Props {
  matchId: string;
  currentStatus: MatchStatus;
}

export function MatchActionBar({ matchId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: MatchStatus, notes?: string) {
    setLoading(status);
    setError(null);
    const res = await fetch(`/api/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setLoading(null);
    if (!res.ok) {
      setError("Failed to update match status");
      return;
    }
    router.refresh();
  }

  if (currentStatus === "resolved") {
    return (
      <div className="rounded-md bg-secondary px-4 py-3 text-sm text-muted-foreground">
        This match has been resolved.
      </div>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <div className="rounded-md bg-secondary px-4 py-3 text-sm text-muted-foreground">
        This match was rejected. Items returned to unmatched pool.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {currentStatus === "pending" && (
          <>
            <Button
              onClick={() => updateStatus("confirmed")}
              loading={loading === "confirmed"}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Confirm match
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus("rejected")}
              loading={loading === "rejected"}
            >
              <XCircle className="h-4 w-4" />
              Reject match
            </Button>
          </>
        )}
        {currentStatus === "confirmed" && (
          <Button
            onClick={() => updateStatus("resolved")}
            loading={loading === "resolved"}
            className="bg-hotel-primary hover:bg-hotel-primary/90 text-white"
          >
            <PackageCheck className="h-4 w-4" />
            Mark as returned
          </Button>
        )}
      </div>
    </div>
  );
}
