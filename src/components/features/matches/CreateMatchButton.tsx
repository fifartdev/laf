"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GitMerge } from "lucide-react";

interface Props {
  lostItemId: string;
  foundItemId: string;
  hotelId: string;
}

export function CreateMatchButton({ lostItemId, foundItemId, hotelId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lostItemId, foundItemId, hotelId }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to create match");
      return;
    }
    const json = await res.json();
    router.push(`/staff/matches/${json.data.id}`);
  }

  return (
    <div>
      {error && <p className="text-xs text-destructive mb-1">{error}</p>}
      <Button size="sm" loading={loading} onClick={handleCreate}>
        <GitMerge className="h-3.5 w-3.5" />
        Create match
      </Button>
    </div>
  );
}
