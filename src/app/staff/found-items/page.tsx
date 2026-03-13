import { auth } from "@/lib/auth/auth";
import { foundItemService } from "@/lib/services/foundItemService";
import { FoundItemStatusBadge } from "@/components/features/found-items/FoundItemStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { PlusCircle, PackageSearch } from "lucide-react";

export default async function FoundItemsPage() {
  const session = await auth();
  if (!session?.user?.hotelId) return null;

  const items = await foundItemService.getForHotel(session.user.hotelId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Found Items</h1>
        <Link
          href="/staff/found-items/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-hotel-primary text-white rounded-md text-sm font-medium hover:bg-hotel-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Log found item
        </Link>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No found items logged yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link key={item.id} href={`/staff/found-items/${item.id}`}>
              <Card className="hover:border-hotel-primary/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Found {formatDate(item.dateFound)} at {item.locationFound}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Logged by {item.loggedBy.name} · Storage: {item.storageLocation}
                      </p>
                    </div>
                    <FoundItemStatusBadge status={item.status} />
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
