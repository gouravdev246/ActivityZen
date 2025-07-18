
import ProtectedPage from "@/components/auth/protected-page";
import { DashboardHeader } from "@/components/dashboard/header";
import CalendarPageClient from "./calendar-page-client";

export default function CalendarPage() {
  return (
    <ProtectedPage>
        <div className="flex flex-col min-h-screen w-full bg-background">
            <DashboardHeader />
            <CalendarPageClient />
        </div>
    </ProtectedPage>
  );
}
