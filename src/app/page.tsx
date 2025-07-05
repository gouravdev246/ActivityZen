import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DailyActivityChart } from "@/components/dashboard/daily-activity-chart";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { KeyMetricCard } from "@/components/dashboard/key-metric-card";
import { CustomizePanel } from "@/components/dashboard/customize-panel";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <DashboardHeader />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your daily activity overview</p>
        </div>
        
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <StatCard title="Total Activities" value="25" />
          <StatCard title="Time Spent" value="4h 30m" />
          <StatCard title="Goal Progress" value="75%" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Activity Trends</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <DailyActivityChart />
            <WeeklyActivityChart />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <KeyMetricCard title="Most Frequent Activity" value="Running" />
                <KeyMetricCard title="Average Time per Activity" value="1h 15m" />
              </div>
            </div>
            <CustomizePanel />
          </div>
        </div>
      </main>
    </div>
  );
}
