import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReportConfiguration } from "@/components/reports/report-configuration";
import { ActivityTrendsChart } from "@/components/reports/activity-trends-chart";
import { TimeAllocationChart } from "@/components/reports/time-allocation-chart";
import { ActivityFrequencyChart } from "@/components/reports/activity-frequency-chart";
import { ReportExport } from "@/components/reports/report-export";

export default function ReportsPage() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <DashboardHeader />
            <main className="container mx-auto p-4 sm:p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">Analyze your activity data with custom reports and visualizations.</p>
                </div>

                <div className="space-y-8">
                    <ReportConfiguration />

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Report Summary</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            <StatCard title="Total Activities" value="150" />
                            <StatCard title="Total Time Spent" value="75 hours" />
                            <StatCard title="Average Time Per Activity" value="30 minutes" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Activity Trends</h2>
                        <ActivityTrendsChart />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Time Allocation</h2>
                            <TimeAllocationChart />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Activity Frequency</h2>
                            <ActivityFrequencyChart />
                        </div>
                    </div>
                    
                    <ReportExport />
                </div>
            </main>
        </div>
    );
}
