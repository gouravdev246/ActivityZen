
import ProtectedPage from "@/components/auth/protected-page";
import { DashboardHeader } from "@/components/dashboard/header";
import TaskManagerPageClient from "./tasks-client";

export default function TaskManagerPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col min-h-screen w-full bg-muted/40">
                <DashboardHeader />
                <TaskManagerPageClient />
            </div>
        </ProtectedPage>
    )
}
