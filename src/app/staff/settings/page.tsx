import { auth } from "@/lib/auth/auth";
import { seedHotels } from "@/lib/mock-data/hotels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.hotelId) return null;

  const hotel = seedHotels.find((h) => h.id === session.user.hotelId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Hotel configuration</CardTitle>
          <CardDescription>
            Manage your property settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {hotel ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotel name</span>
                <span>{hotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="text-right max-w-xs">{hotel.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact email</span>
                <span>{hotel.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item holding period</span>
                <span>{hotel.holdingPeriodDays} days</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Hotel not found.</p>
          )}
        </CardContent>
      </Card>

      {session.user.role === "admin" && (
        <div className="mt-6">
          <Card className="max-w-lg border-muted">
            <CardHeader>
              <CardTitle className="text-base">Admin tools</CardTitle>
              <CardDescription>
                Full configuration is available in a future phase with Payload CMS.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Staff management, holding period configuration, and branding will be available
              once the Payload CMS backend is integrated.
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
