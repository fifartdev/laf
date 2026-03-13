import { auth } from "@/lib/auth/auth";
import { userService } from "@/lib/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function GuestProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await userService.findById(session.user.id);
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span>{user.phone}</span>
            </div>
          )}
          {user.roomNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span>{user.roomNumber}</span>
            </div>
          )}
          {user.checkInDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>{formatDate(user.checkInDate)}</span>
            </div>
          )}
          {user.checkOutDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span>{formatDate(user.checkOutDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
