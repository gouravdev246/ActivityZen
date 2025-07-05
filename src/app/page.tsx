'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DailyActivityChart } from "@/components/dashboard/daily-activity-chart";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { KeyMetricCard } from "@/components/dashboard/key-metric-card";
import { CustomizePanel } from "@/components/dashboard/customize-panel";
import { type Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays, eachDayOfInterval, format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('activity-zen-tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if ((key === 'dueDate' || key === 'createdAt') && value) {
              return new Date(value);
            }
            return value;
        });
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalActivities = tasks.length;
    const doneTasks = tasks.filter(task => task.status === 'Done');
    const goalProgress = totalActivities > 0 ? Math.round((doneTasks.length / totalActivities) * 100) : 0;
    
    const categoryCounts = tasks.reduce((acc, task) => {
        if(task.category) {
            acc[task.category] = (acc[task.category] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const mostFrequentCategory = Object.keys(categoryCounts).length > 0 
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] 
        : 'N/A';

    return {
        totalActivities: totalActivities.toString(),
        timeSpent: "N/A", 
        goalProgress: `${goalProgress}%`,
        mostFrequentCategory,
        averageTimePerActivity: "N/A"
    };
  }, [tasks]);

  const dailyChartData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const completedTasks = tasks.filter(t => t.status === 'Done' && t.dueDate);

    return last7Days.map(day => {
        const count = completedTasks.filter(t => format(t.dueDate!, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
        return { name: format(day, 'E'), value: count };
    });
  }, [tasks]);

  const weeklyChartData = useMemo(() => {
    const today = new Date();
    const completedTasks = tasks.filter(t => t.status === 'Done' && t.dueDate);
    
    const weeks = [
        { name: 'Week 1', interval: { start: startOfWeek(subWeeks(today, 3)), end: endOfWeek(subWeeks(today, 3)) } },
        { name: 'Week 2', interval: { start: startOfWeek(subWeeks(today, 2)), end: endOfWeek(subWeeks(today, 2)) } },
        { name: 'Week 3', interval: { start: startOfWeek(subWeeks(today, 1)), end: endOfWeek(subWeeks(today, 1)) } },
        { name: 'Week 4', interval: { start: startOfWeek(today), end: endOfWeek(today) } },
    ];

    return weeks.map(week => {
        const count = completedTasks.filter(t => t.dueDate && isWithinInterval(t.dueDate, week.interval)).length;
        return { name: week.name, value: count };
    });
  }, [tasks]);
  
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
          <StatCard title="Total Tasks" value={stats.totalActivities} />
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
            <CalendarView tasks={tasks} />
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
