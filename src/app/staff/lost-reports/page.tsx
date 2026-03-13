import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default async function LostReportsPage() {
  const session = await auth();
  if (!session?.user?.hotelId) return null;

  const reports = await lostItemService.getForHotel(session.user.hotelId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lost Reports</h1>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No lost reports yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => (
            <Link key={report.id} href={`/staff/lost-reports/${report.id}`}>
              <Card className="hover:border-hotel-primary/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{report.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {report.guest.name} · Room {report.guest.roomNumber ?? "N/A"} ·{" "}
                        last seen {formatDate(report.dateLastSeen)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {report.category} · {report.locationLastSeen}
                      </p>
                    </div>
                    <LostItemStatusBadge status={report.status} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
