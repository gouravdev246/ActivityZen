
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PlusCircle, ListX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import TaskCard from '@/components/activity-zen/task-card';
import TaskForm from '@/components/activity-zen/task-form';
import TaskFilters from '@/components/activity-zen/task-filters';
import { DashboardHeader } from '@/components/dashboard/header';
import { type Task, type SortOption } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'activity-zen-tasks';

export default function ActivityZenPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('startTime_desc');

  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if ((key === 'startTime' || key === 'endTime' || key === 'createdAt') && value) {
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

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }
  }, [tasks, isLoading]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(tasks.map(t => t.category).filter(Boolean)))], [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }
    
    return [...filtered].sort((a, b) => {
        // Defensively create Date objects to prevent errors from invalid data
        const dateA = a.startTime instanceof Date ? a.startTime : new Date(a.startTime);
        const dateB = b.startTime instanceof Date ? b.startTime : new Date(b.startTime);
        const createdA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const createdB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);

        switch (sortOption) {
            case 'startTime_asc':
                return dateA.getTime() - dateB.getTime();
            case 'startTime_desc':
                return dateB.getTime() - dateA.getTime();
            case 'title_asc':
                return a.title.localeCompare(b.title);
            case 'title_desc':
                return b.title.localeCompare(a.title);
            default:
                 return createdB.getTime() - createdA.getTime();
        }
    });

  }, [tasks, categoryFilter, sortOption]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
    if ('id' in taskData && taskData.id) {
      setTasks(tasks.map(t => (t.id === taskData.id ? taskData as Task : t)));
      toast({ title: 'Activity Updated!', description: `"${taskData.title}" has been updated.` });
    } else {
      const newTask: Task = { ...(taskData as Omit<Task, 'id' | 'createdAt'>), id: crypto.randomUUID(), createdAt: new Date() };
      setTasks([...tasks, newTask]);
      toast({ title: 'Activity Logged!', description: `"${newTask.title}" has been logged.` });
    }
    setIsDialogOpen(false);
    setTaskToEdit(null);
  };
  
  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      const task = tasks.find(t => t.id === taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setTaskToDelete(null);
      if (task) {
        toast({ title: 'Activity Deleted', description: `"${task.title}" has been deleted.` });
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Activity Zen</h1>
                    <p className="text-muted-foreground">Focus and manage your activities with ease.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setTaskToEdit(null); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setTaskToEdit(null); setIsDialogOpen(true); }}>
                        <PlusCircle className="mr-2" />
                        Log Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{taskToEdit ? 'Edit Activity' : 'Log a new activity'}</DialogTitle>
                        </DialogHeader>
                        <TaskForm 
                            onSubmit={handleTaskSubmit} 
                            taskToEdit={taskToEdit} 
                            categories={categories.filter(c => c !== 'all')} 
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <TaskFilters
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            
            {filteredAndSortedTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedTasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onEdit={handleEdit} 
                            onDelete={(id) => setTaskToDelete(id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed bg-card">
                    <ListX className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Activities Found</h2>
                    <p className="text-muted-foreground mb-4">It looks like there are no activities here. <br /> Get started by logging a new one!</p>
                     <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setTaskToEdit(null); }}>
                        <DialogTrigger asChild>
                           <Button onClick={() => { setTaskToEdit(null); setIsDialogOpen(true); }}>
                                <PlusCircle className="mr-2" />
                                Log Your First Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                           <DialogHeader>
                                <DialogTitle>{taskToEdit ? 'Edit Activity' : 'Log a new activity'}</DialogTitle>
                            </DialogHeader>
                            <TaskForm 
                                onSubmit={handleTaskSubmit} 
                                taskToEdit={taskToEdit} 
                                categories={categories.filter(c => c !== 'all')} 
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </main>
      </div>
      <Toaster />
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the activity
              "{tasks.find(t => t.id === taskToDelete)?.title}".
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
