import Link from "next/link";
import { Search, PackageSearch, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hotel-accent">
      {/* Header */}
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-hotel-primary" />
          <span className="font-bold text-hotel-primary text-lg">LAF Out Loud</span>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-hotel-primary hover:underline"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium bg-hotel-primary text-white rounded-md hover:bg-hotel-primary/90 transition-colors"
          >
            Report a lost item
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-hotel-primary mb-4">
          Lost something at your hotel?
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Report your missing item in minutes. We&apos;ll connect you with hotel staff
          and notify you as soon as it&apos;s found.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-hotel-primary text-white font-medium rounded-md hover:bg-hotel-primary/90 transition-colors text-lg"
        >
          <Search className="h-5 w-5" />
          Report a lost item
        </Link>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Search className="h-8 w-8 text-hotel-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Report in seconds</h3>
            <p className="text-muted-foreground text-sm">
              Describe your item, when and where you last saw it. Our form makes
              it simple.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <PackageSearch className="h-8 w-8 text-hotel-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Smart matching</h3>
            <p className="text-muted-foreground text-sm">
              We automatically match your description with items found by hotel
              staff.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Bell className="h-8 w-8 text-hotel-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Instant notifications</h3>
            <p className="text-muted-foreground text-sm">
              Get notified the moment a match is found so you can retrieve your
              item.
            </p>
          </div>
        </div>
      </main>

      {/* Demo credentials */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white border rounded-xl p-6 max-w-md mx-auto text-sm">
          <p className="font-semibold mb-3 text-hotel-primary">Demo credentials</p>
          <div className="space-y-1.5 text-muted-foreground">
            <p><strong>Guest:</strong> alice@example.com / password123</p>
            <p><strong>Staff:</strong> staff@grandseaside.com / password123</p>
            <p><strong>Admin:</strong> admin@grandseaside.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
