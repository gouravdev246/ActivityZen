
import ProtectedPage from "@/components/auth/protected-page";
import { DashboardHeader } from "@/components/dashboard/header";
import ReportsPageClient from "./reports-client";

export default function ReportsPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col min-h-screen w-full bg-background">
                <DashboardHeader />
                <ReportsPageClient />
            </div>
        </ProtectedPage>
    );
}
