import { Badge } from "@/components/ui/badge";
import type { FoundItemStatus } from "@/types/models";

interface Props {
  status: FoundItemStatus;
}

const config: Record<FoundItemStatus, { label: string; variant: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  unclaimed: { label: "Unclaimed", variant: "warning" },
  matched: { label: "Matched", variant: "success" },
  claimed: { label: "Claimed", variant: "secondary" },
  donated: { label: "Donated", variant: "outline" },
  disposed: { label: "Disposed", variant: "outline" },
};

export function FoundItemStatusBadge({ status }: Props) {
  const { label, variant } = config[status] ?? { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}
