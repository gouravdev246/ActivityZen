
import ProtectedPage from "@/components/auth/protected-page";
import { DashboardHeader } from "@/components/dashboard/header";
import ProfilePageClient from "./settings-client";

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <DashboardHeader />
        <ProfilePageClient />
      </div>
    </ProtectedPage>
  );
}
