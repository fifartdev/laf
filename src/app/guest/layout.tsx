import { NotificationProvider } from "@/context/NotificationContext";
import { GuestNav } from "@/components/layout/GuestNav";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        <GuestNav />
        <main className="container mx-auto px-4 py-6 max-w-4xl">{children}</main>
      </div>
    </NotificationProvider>
  );
}
