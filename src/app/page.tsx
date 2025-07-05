
import ProtectedPage from "@/components/auth/protected-page";
import { DashboardHeader } from "@/components/dashboard/header";
import DashboardPageClient from "./page-client";

export default function Dashboard() {
  return (
    <ProtectedPage>
      <div className="min-h-screen w-full bg-background text-foreground">
        <DashboardHeader />
        <DashboardPageClient />
      </div>
    </ProtectedPage>
  );
}
