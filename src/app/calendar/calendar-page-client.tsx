
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ActivityForm from '@/components/activity-zen/activity-form';
import { type Activity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format, formatDistanceStrict, isValid, isSameDay, parseISO } from 'date-fns';
import { PlusCircle, Edit, Trash2, ListX } from 'lucide-react';

const STORAGE_KEY = 'activity-zen-activities';

export default function CalendarPageClient() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(STORAGE_KEY);
      if (storedActivities) {
        const parsedActivities: Activity[] = JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          startTime: activity.startTime ? parseISO(activity.startTime) : new Date(),
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

  const handleActivitySubmit = (activityData: Omit<Activity, 'id' | 'createdAt'> | Activity) => {
    if ('id' in activityData && activityData.id) {
      setActivities(activities.map(t => (t.id === activityData.id ? activityData as Activity : t)));
      toast({ title: 'Activity Updated!', description: `"${activityData.title}" has been updated.` });
    } else {
      const newActivity: Activity = { ...(activityData as Omit<Activity, 'id' | 'createdAt'>), id: crypto.randomUUID(), createdAt: new Date() };
      setActivities([newActivity, ...activities]);
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
        toast({ title: 'Activity Deleted', description: `"${activity.title}" has been deleted.`});
      }
    }
  };
  
  const handleAddNewActivity = () => {
    setActivityToEdit(null);
    setIsDialogOpen(true);
  };

  const activityDates = useMemo(() => {
    return activities
      .map(activity => activity.startTime)
      .filter((d): d is Date => d !== null && isValid(d));
  }, [activities]);

  const selectedDayActivities = useMemo(() => {
    if (!date) return [];
    return activities
      .filter(activity => isValid(activity.startTime) && isSameDay(activity.startTime, date))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [activities, date]);

  if (isLoading) {
    return (
        <main className="flex-1 p-8 flex items-center justify-center">
            <p>Loading calendar...</p>
        </main>
    );
  }

  return (
    <>
    <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Calendar</h1>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setActivityToEdit(null); }}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNewActivity}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Activity
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="shadow-sm">
                    <CardContent className="p-2 sm:p-4 md:p-6 flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="p-0"
                            modifiers={{ withActivity: activityDates }}
                            modifiersStyles={{
                                withActivity: { 
                                  border: "2px solid hsl(var(--primary))",
                                  borderRadius: 'var(--radius)'
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>
                            Activities on {date ? format(date, 'MMMM d') : 'selected day'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {selectedDayActivities.length > 0 ? (
                            selectedDayActivities.map(activity => (
                                <div key={activity.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold">{activity.title}</p>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(activity)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                             <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setActivityToDelete(activity.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {activity.description && <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>}
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {isValid(activity.startTime) ? format(activity.startTime, 'h:mm a') : 'No start time'}
                                        {activity.endTime && isValid(activity.endTime) ? ` - ${format(activity.endTime, 'h:mm a')}` : ''}
                                        {activity.endTime && isValid(activity.endTime) && isValid(activity.startTime) && ` (${formatDistanceStrict(activity.endTime, activity.startTime)})`}
                                    </p>
                                </div>
                            ))
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center py-10">
                                <ListX className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-1">No Activities</h3>
                                <p className="text-muted-foreground text-sm">No activities logged for this day.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </main>
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
