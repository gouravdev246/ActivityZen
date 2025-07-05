import { DashboardHeader } from "@/components/dashboard/header";
import ProfilePageClient from "./settings-client";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <DashboardHeader />
      <ProfilePageClient />
    </div>
  );
}
