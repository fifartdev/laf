import { NotificationProvider } from "@/context/NotificationContext";
import { StaffSidebar } from "@/components/layout/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen">
        <StaffSidebar />
        <main className="flex-1 p-6 max-w-5xl">{children}</main>
      </div>
    </NotificationProvider>
  );
}
