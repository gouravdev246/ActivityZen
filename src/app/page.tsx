'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DailyActivityChart } from "@/components/dashboard/daily-activity-chart";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { KeyMetricCard } from "@/components/dashboard/key-metric-card";
import { CustomizePanel } from "@/components/dashboard/customize-panel";
import { type Activity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays, eachDayOfInterval, format, startOfWeek, endOfWeek, subWeeks, isWithinInterval, differenceInMinutes } from 'date-fns';

const STORAGE_KEY = 'activity-zen-activities';

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(STORAGE_KEY);
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities, (key, value) => {
            if ((key === 'startTime' || key === 'endTime' || key === 'createdAt') && value) {
              return new Date(value);
            }
            return value;
        });
        setActivities(parsedActivities);
      }
    } catch (error) {
      console.error("Failed to load activities from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(activity => activity.endTime);
    
    const totalTimeSpent = completedActivities.reduce((acc, activity) => {
        if (activity.endTime) {
            return acc + differenceInMinutes(activity.endTime, activity.startTime);
        }
        return acc;
    }, 0);

    const categoryCounts = activities.reduce((acc, activity) => {
        if(activity.category) {
            acc[activity.category] = (acc[activity.category] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const mostFrequentCategory = Object.keys(categoryCounts).length > 0 
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] 
        : 'N/A';
        
    const averageTimePerActivity = completedActivities.length > 0 
        ? formatDuration(Math.round(totalTimeSpent / completedActivities.length))
        : 'N/A';

    return {
        totalActivities: totalActivities.toString(),
        timeSpent: totalTimeSpent > 0 ? formatDuration(totalTimeSpent) : "N/A", 
        goalProgress: "N/A",
        mostFrequentCategory,
        averageTimePerActivity
    };
  }, [activities]);

  const dailyChartData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const completedActivities = activities.filter(t => t.endTime);

    return last7Days.map(day => {
        const count = completedActivities.filter(t => t.endTime && format(t.endTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
        return { name: format(day, 'E'), value: count };
    });
  }, [activities]);

  const weeklyChartData = useMemo(() => {
    const today = new Date();
    const completedActivities = activities.filter(t => t.endTime);
    
    const weeks = [
        { name: 'Week 1', interval: { start: startOfWeek(subWeeks(today, 3)), end: endOfWeek(subWeeks(today, 3)) } },
        { name: 'Week 2', interval: { start: startOfWeek(subWeeks(today, 2)), end: endOfWeek(subWeeks(today, 2)) } },
        { name: 'Week 3', interval: { start: startOfWeek(subWeeks(today, 1)), end: endOfWeek(subWeeks(today, 1)) } },
        { name: 'Week 4', interval: { start: startOfWeek(today), end: endOfWeek(today) } },
    ];

    return weeks.map(week => {
        const count = completedActivities.filter(t => t.endTime && isWithinInterval(t.endTime, week.interval)).length;
        return { name: week.name, value: count };
    });
  }, [activities]);
  
  if (isLoading) {
    return (
       <div className="min-h-screen w-full bg-background text-foreground">
        <DashboardHeader />
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>
             <div className="grid gap-6 mb-8 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
             <div className="mb-8">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-48" />
                </div>
            </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <DashboardHeader />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your daily activity overview</p>
        </div>
        
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <StatCard title="Total Activities" value={stats.totalActivities} />
          <StatCard title="Time Spent" value={stats.timeSpent} />
          <StatCard title="Goal Progress" value={stats.goalProgress} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Activity Trends</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <DailyActivityChart data={dailyChartData} />
            <WeeklyActivityChart data={weeklyChartData}/>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CalendarView activities={activities} />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <KeyMetricCard title="Most Frequent Category" value={stats.mostFrequentCategory} />
                <KeyMetricCard title="Average Time per Activity" value={stats.averageTimePerActivity} />
              </div>
            </div>
            <CustomizePanel />
          </div>
        </div>
      </main>
    </div>
  );
}
