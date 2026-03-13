import { auth } from "@/lib/auth/auth";
import { lostItemService } from "@/lib/services/lostItemService";
import Link from "next/link";
import { LostItemStatusBadge } from "@/components/features/lost-items/LostItemStatusBadge";
import { formatDate } from "@/lib/utils";
import { PlusCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function GuestDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const reports = await lostItemService.getForGuest(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Link
          href="/guest/report/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-hotel-primary text-white rounded-md text-sm font-medium hover:bg-hotel-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Report lost item
        </Link>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No reports yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Lost something? Report it and we&apos;ll help you find it.
            </p>
            <Link
              href="/guest/report/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-hotel-primary text-white rounded-md text-sm font-medium hover:bg-hotel-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Report a lost item
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link key={report.id} href={`/guest/report/${report.id}`}>
              <Card className="hover:border-hotel-primary/50 transition-colors cursor-pointer">
                <CardContent className="py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{report.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Last seen: {report.locationLastSeen} on{" "}
                      {formatDate(report.dateLastSeen)}
                    </p>
                  </div>
                  <LostItemStatusBadge status={report.status} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
