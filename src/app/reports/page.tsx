import { DashboardHeader } from "@/components/dashboard/header";
import ReportsPageClient from "./reports-client";

export default function ReportsPage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            <DashboardHeader />
            <ReportsPageClient />
        </div>
    );
}
