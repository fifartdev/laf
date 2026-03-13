import { Search } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hotel-accent p-4">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 text-hotel-primary font-bold text-xl"
      >
        <Search className="h-6 w-6" />
        LAF Out Loud
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
