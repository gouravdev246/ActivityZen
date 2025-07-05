
import ProtectedPage from "@/components/auth/protected-page";
import ActivitiesPageClient from "./activities-client";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ActivitiesPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col min-h-screen w-full">
                <DashboardHeader />
                <ActivitiesPageClient />
            </div>
        </ProtectedPage>
    );
}
