import { Badge } from "@/components/ui/badge";
import type { LostItemStatus } from "@/types/models";

interface Props {
  status: LostItemStatus;
}

const config: Record<LostItemStatus, { label: string; variant: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  open: { label: "Open", variant: "warning" },
  matched: { label: "Match Found", variant: "success" },
  resolved: { label: "Resolved", variant: "secondary" },
  closed: { label: "Closed", variant: "outline" },
};

export function LostItemStatusBadge({ status }: Props) {
  const { label, variant } = config[status] ?? { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}
