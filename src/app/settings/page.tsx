import { DashboardHeader } from "@/components/dashboard/header";
import SettingsClientPage from "./settings-client";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <DashboardHeader />
      <SettingsClientPage />
    </div>
  );
}
