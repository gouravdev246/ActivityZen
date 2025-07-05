'use client';

import { useState, useEffect } from 'react';
import { type DateRange } from 'react-day-picker';
import { subDays, format, eachDayOfInterval, isWithinInterval, differenceInMinutes, isValid, parseISO } from 'date-fns';
import { type Activity, type Task, taskStatuses, type ReportData } from '@/lib/types';

import { ReportConfiguration } from "@/components/reports/report-configuration";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityTrendsChart } from "@/components/reports/activity-trends-chart";
import { TimeAllocationChart } from "@/components/reports/time-allocation-chart";
import { ActivityFrequencyChart } from "@/components/reports/activity-frequency-chart";
import { ReportExport } from "@/components/reports/report-export";
import { Skeleton } from '@/components/ui/skeleton';

const ACTIVITY_STORAGE_KEY = 'activity-zen-activities';
const TASK_STORAGE_KEY = 'task-manager-tasks';

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
}

export default function ReportsPageClient() {
    const [allActivities, setAllActivities] = useState<Activity[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<ReportData | null>(null);

    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 29),
        to: new Date(),
    });
    const [reportType, setReportType] = useState('all');

    useEffect(() => {
        try {
            const storedActivities = localStorage.getItem(ACTIVITY_STORAGE_KEY);
            if (storedActivities) {
                const parsedActivities: Activity[] = JSON.parse(storedActivities).map((activity: any) => ({
                    ...activity,
                    startTime: activity.startTime ? parseISO(activity.startTime) : new Date(),
                    endTime: activity.endTime ? parseISO(activity.endTime) : null,
                }));
                setAllActivities(Array.isArray(parsedActivities) ? parsedActivities : []);
            }
            
            const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);
            if (storedTasks) {
                const parsedTasks: Task[] = JSON.parse(storedTasks).map((task: any) => ({
                    ...task,
                    dueDate: task.dueDate ? parseISO(task.dueDate) : null,
                    createdAt: task.createdAt ? parseISO(task.createdAt) : new Date(),
                }));
                setAllTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
            }

        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateReport = () => {
        if (!date?.from || isLoading) return;

        const interval = { start: date.from, end: date.to || date.from };

        // Filter data
        const filteredActivities = allActivities.filter(a => a.endTime && isValid(a.endTime) && isWithinInterval(a.endTime, interval));
        const filteredTasks = allTasks.filter(t => t.status === 'done' && t.dueDate && isValid(t.dueDate) && isWithinInterval(t.dueDate, interval));

        // Calculate stats
        const totalTimeSpent = filteredActivities.reduce((acc, activity) => {
            if (activity.endTime && activity.startTime && isValid(activity.endTime) && isValid(activity.startTime)) {
                return acc + differenceInMinutes(activity.endTime, activity.startTime);
            }
            return acc;
        }, 0);

        // Generate Trends Data
        const daysInInterval = eachDayOfInterval(interval);
        const trendsData = daysInInterval.map(day => {
            const dateStr = format(day, 'MMM d');
            const activitiesCount = filteredActivities.filter(a => a.endTime && format(a.endTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
            const tasksCount = filteredTasks.filter(t => t.dueDate && format(t.dueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
            return { date: dateStr, activities: activitiesCount, tasks: tasksCount };
        });

        // Generate Time Allocation Data
        const timeByActivity: { [key: string]: number } = {};
        filteredActivities.forEach(activity => {
            if (activity.endTime && activity.startTime && isValid(activity.endTime) && isValid(activity.startTime)) {
                const duration = differenceInMinutes(activity.endTime, activity.startTime);
                timeByActivity[activity.title] = (timeByActivity[activity.title] || 0) + duration;
            }
        });
        const timeAllocationData = Object.entries(timeByActivity)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value)
            .slice(0, 5); // top 5

        // Task Status Data
        const tasksForStatusChart = allTasks.filter(t => t.createdAt && isValid(t.createdAt) && isWithinInterval(t.createdAt, interval));
        const statusCounts = tasksForStatusChart.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const taskStatusData = taskStatuses.map(s => ({
            name: s.label,
            value: statusCounts[s.value] || 0,
        }));
        
        const dataToShow: ReportData = {
            stats: {
                totalActivities: reportType === 'tasks' ? 0 : filteredActivities.length,
                totalTasks: reportType === 'activities' ? 0 : filteredTasks.length,
                totalTimeSpent: reportType === 'tasks' ? 'N/A' : formatDuration(totalTimeSpent),
            },
            trendsData: trendsData.map(d => ({
                ...d,
                activities: reportType === 'tasks' ? 0 : d.activities,
                tasks: reportType === 'activities' ? 0 : d.tasks,
            })),
            timeAllocationData: reportType === 'tasks' ? [] : timeAllocationData,
            taskStatusData: reportType === 'activities' ? [] : taskStatusData,
        };
        
        setReportData(dataToShow);
    };

    // Generate initial report
    useEffect(() => {
        if (!isLoading) {
            generateReport();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const showActivities = reportType === 'all' || reportType === 'activities';
    const showTasks = reportType === 'all' || reportType === 'tasks';

    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">Analyze your activity data with custom reports and visualizations.</p>
            </div>

            <div className="space-y-8">
                <ReportConfiguration 
                    date={date}
                    setDate={setDate}
                    reportType={reportType}
                    setReportType={setReportType}
                    onGenerate={generateReport}
                />

                {!reportData || isLoading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-96 w-full" />
                        <div className="grid gap-8 lg:grid-cols-2">
                          <Skeleton className="h-96 w-full" />
                          <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Report Summary</h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {showActivities && <StatCard title="Total Completed Activities" value={reportData.stats.totalActivities.toString()} />}
                                {showTasks && <StatCard title="Total Completed Tasks" value={reportData.stats.totalTasks.toString()} />}
                                {showActivities && <StatCard title="Total Time Spent" value={reportData.stats.totalTimeSpent} />}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Trends</h2>
                            <ActivityTrendsChart data={reportData.trendsData} />
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                             {showActivities && reportData.timeAllocationData.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Time Allocation</h2>
                                    <TimeAllocationChart data={reportData.timeAllocationData} />
                                </div>
                            )}
                            {showTasks && reportData.taskStatusData.some(d => d.value > 0) &&(
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Task Status</h2>
                                    <ActivityFrequencyChart data={reportData.taskStatusData} />
                                </div>
                            )}
                        </div>
                        
                        <ReportExport reportData={reportData} reportType={reportType} dateRange={date} />
                    </>
                )}
            </div>
        </main>
    );
}
