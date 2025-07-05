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
import { type Task, type TaskStatus, type SortOption } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'activity-zen-tasks';

export default function ActivityZenPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('dueDate_asc');

  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if (key === 'dueDate' && value) return new Date(value);
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
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }
    
    return [...filtered].sort((a, b) => {
        switch (sortOption) {
            case 'dueDate_asc':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(a.dueDate).getTime();
            case 'dueDate_desc':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            case 'title_asc':
                return a.title.localeCompare(b.title);
            case 'title_desc':
                return b.title.localeCompare(a.title);
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

  }, [tasks, statusFilter, categoryFilter, sortOption]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData && taskData.id) {
      setTasks(tasks.map(t => (t.id === taskData.id ? taskData : t)));
      toast({ title: 'Task Updated!', description: `"${taskData.title}" has been updated.` });
    } else {
      const newTask = { ...taskData, id: crypto.randomUUID() };
      setTasks([...tasks, newTask]);
      toast({ title: 'Task Created!', description: `"${newTask.title}" has been added.` });
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
        toast({ title: 'Task Deleted', description: `"${task.title}" has been deleted.`, variant: 'destructive' });
      }
    }
  };

  const handleUpdateStatus = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    toast({ title: 'Status Updated!', description: `"${updatedTask.title}" is now "${updatedTask.status}".` });
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/40">
            <DashboardHeader />
            <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
                <p>Loading tasks...</p>
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
                    <p className="text-muted-foreground">Focus and manage your tasks with ease.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setTaskToEdit(null); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setTaskToEdit(null); setIsDialogOpen(true); }}>
                        <PlusCircle className="mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create a new task'}</DialogTitle>
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
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
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
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed bg-card">
                    <ListX className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Tasks Found</h2>
                    <p className="text-muted-foreground mb-4">It looks like there are no tasks here. <br /> Get started by adding a new one!</p>
                     <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setTaskToEdit(null); }}>
                        <DialogTrigger asChild>
                           <Button onClick={() => { setTaskToEdit(null); setIsDialogOpen(true); }}>
                                <PlusCircle className="mr-2" />
                                Add Your First Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                           <DialogHeader>
                                <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create a new task'}</DialogTitle>
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
              This action cannot be undone. This will permanently delete the task
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
