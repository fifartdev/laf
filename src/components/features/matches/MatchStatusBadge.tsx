import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/types/models";

interface Props {
  status: MatchStatus;
}

const config: Record<MatchStatus, { label: string; variant: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  pending: { label: "Pending Review", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  resolved: { label: "Resolved", variant: "secondary" },
};

export function MatchStatusBadge({ status }: Props) {
  const { label, variant } = config[status] ?? { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}
