
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PlusCircle, ListX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ActivityCard from '@/components/activity-zen/activity-card';
import ActivityForm from '@/components/activity-zen/activity-form';
import ActivityFilters from '@/components/activity-zen/activity-filters';
import { DashboardHeader } from '@/components/dashboard/header';
import { type Activity, type SortOption } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { isValid, parseISO } from 'date-fns';

const STORAGE_KEY = 'activity-zen-activities';

export default function ActivityZenPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<SortOption>('startTime_desc');

  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(STORAGE_KEY);
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          startTime: activity.startTime ? parseISO(activity.startTime) : null,
          endTime: activity.endTime ? parseISO(activity.endTime) : null,
          createdAt: activity.createdAt ? parseISO(activity.createdAt) : new Date(),
        }));
        setActivities(Array.isArray(parsedActivities) ? parsedActivities : []);
      }
    } catch (error) {
      console.error("Failed to load activities from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (error) {
            console.error("Failed to save activities to localStorage", error);
        }
    }
  }, [activities, isLoading]);

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
        const dateA = a.startTime && isValid(a.startTime) ? a.startTime.getTime() : 0;
        const dateB = b.startTime && isValid(b.startTime) ? b.startTime.getTime() : 0;
        const createdA = a.createdAt && isValid(a.createdAt) ? a.createdAt.getTime() : 0;
        const createdB = b.createdAt && isValid(b.createdAt) ? b.createdAt.getTime() : 0;

        switch (sortOption) {
            case 'startTime_asc':
                return dateA - dateB;
            case 'startTime_desc':
                return dateB - dateA;
            case 'title_asc':
                return a.title.localeCompare(b.title);
            case 'title_desc':
                return b.title.localeCompare(a.title);
            default:
                 return createdB - createdA;
        }
    });
  }, [activities, sortOption]);

  const handleActivitySubmit = (activityData: Omit<Activity, 'id' | 'createdAt'> | Activity) => {
    if ('id' in activityData && activityData.id) {
      setActivities(activities.map(t => (t.id === activityData.id ? activityData as Activity : t)));
      toast({ title: 'Activity Updated!', description: `"${activityData.title}" has been updated.` });
    } else {
      const newActivity: Activity = { ...(activityData as Omit<Activity, 'id' | 'createdAt'>), id: crypto.randomUUID(), createdAt: new Date() };
      setActivities([...activities, newActivity]);
      toast({ title: 'Activity Logged!', description: `"${newActivity.title}" has been logged.` });
    }
    setIsDialogOpen(false);
    setActivityToEdit(null);
  };
  
  const handleEdit = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      const activity = activities.find(t => t.id === activityToDelete);
      setActivities(activities.filter(t => t.id !== activityToDelete));
      setActivityToDelete(null);
      if (activity) {
        toast({ title: 'Activity Deleted', description: `"${activity.title}" has been deleted.` });
      }
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/40">
            <DashboardHeader />
            <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
                <p>Loading activities...</p>
            </main>
        </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-muted/40">
        <DashboardHeader />
        <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Activity Zen</h1>
                    <p className="text-muted-foreground">Focus and manage your activities with ease.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setActivityToEdit(null); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setActivityToEdit(null); setIsDialogOpen(true); }}>
                        <PlusCircle className="mr-2" />
                        Log Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{activityToEdit ? 'Edit Activity' : 'Log a new activity'}</DialogTitle>
                        </DialogHeader>
                        <ActivityForm 
                            onSubmit={handleActivitySubmit} 
                            activityToEdit={activityToEdit} 
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <ActivityFilters
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            
            {sortedActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedActivities.map(activity => (
                        <ActivityCard 
                            key={activity.id} 
                            activity={activity} 
                            onEdit={handleEdit} 
                            onDelete={(id) => setActivityToDelete(id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed bg-card">
                    <ListX className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Activities Found</h2>
                    <p className="text-muted-foreground mb-4">It looks like there are no activities here. <br /> Get started by logging a new one!</p>
                     <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setActivityToEdit(null); }}>
                        <DialogTrigger asChild>
                           <Button onClick={() => { setActivityToEdit(null); setIsDialogOpen(true); }}>
                                <PlusCircle className="mr-2" />
                                Log Your First Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                           <DialogHeader>
                                <DialogTitle>{activityToEdit ? 'Edit Activity' : 'Log a new activity'}</DialogTitle>
                            </DialogHeader>
                            <ActivityForm 
                                onSubmit={handleActivitySubmit} 
                                activityToEdit={activityToEdit}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </main>
      </div>
      <Toaster />
      <AlertDialog open={!!activityToDelete} onOpenChange={() => setActivityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the activity
              "{activities.find(t => t.id === activityToDelete)?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
