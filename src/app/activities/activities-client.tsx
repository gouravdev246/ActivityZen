
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Search, PlusCircle, ListX } from "lucide-react";
import { type Activity } from '@/lib/types';
import { format, formatDistanceStrict, isValid, parseISO, isSameDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ActivityForm from '@/components/activity-zen/activity-form';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';

const STORAGE_KEY = 'activity-zen-activities';
const ACTIVITIES_PER_PAGE = 15;

export default function ActivitiesPageClient() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredActivities = useMemo(() => {
    return activities
      .filter(activity => {
        const searchTermMatch = searchTerm.length > 0 
          ? activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        
        const dateMatch = filterDate
          ? isValid(activity.startTime) && isSameDay(activity.startTime, filterDate)
          : true;

        return searchTermMatch && dateMatch;
      })
      .sort((a, b) => {
          const dateA = a.createdAt instanceof Date && isValid(a.createdAt) ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date && isValid(b.createdAt) ? b.createdAt.getTime() : 0;
          return dateB - dateA;
      });
  }, [activities, searchTerm, filterDate]);

  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ACTIVITIES_PER_PAGE;
    return filteredActivities.slice(startIndex, startIndex + ACTIVITIES_PER_PAGE);
  }, [filteredActivities, currentPage]);

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

  useEffect(() => {
    if (filteredActivities.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredActivities, currentPage, totalPages]);

  const handleDateChange = (date: Date | undefined) => {
    setFilterDate(date);
    setCurrentPage(1);
  }
  
  if (isLoading) {
    return (
        <main className="flex-1 p-8 flex items-center justify-center">
            <p>Loading activities...</p>
        </main>
    );
  }

  return (
    <>
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
        <div className="flex items-center justify-between my-6">
          <h1 className="text-3xl font-bold">Activities</h1>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setActivityToEdit(null); }}>
              <DialogTrigger asChild>
                <Button>
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
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activities..." className="pl-10" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              </div>
              <DatePicker date={filterDate} setDate={handleDateChange} />
              {filterDate && <Button variant="ghost" size="sm" onClick={() => handleDateChange(undefined)}>Clear</Button>}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {paginatedActivities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {isValid(activity.startTime) ? format(activity.startTime, 'MMM d, h:mm a') : 'Invalid Date'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {activity.endTime && isValid(activity.endTime) ? format(activity.endTime, 'MMM d, h:mm a') : 'In Progress'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {activity.endTime && isValid(activity.endTime) && isValid(activity.startTime)
                          ? formatDistanceStrict(activity.endTime, activity.startTime) 
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="p-0 h-auto text-primary" onClick={() => handleEdit(activity)}>Edit</Button>
                        <span className="mx-1 text-muted-foreground">|</span>
                        <Button variant="link" className="p-0 h-auto text-destructive" onClick={() => setActivityToDelete(activity.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <ListX className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Activities Found</h2>
                    <p className="text-muted-foreground">{searchTerm || filterDate ? `No activities found for your filters.` : "Your activity log is empty. Start by logging a new activity."}</p>
                </div>
            )}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          )}
        </Card>
      </main>
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
