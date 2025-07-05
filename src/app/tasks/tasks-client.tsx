
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import TaskCard from '@/components/tasks/task-card';
import TaskForm from '@/components/tasks/task-form';
import { type Task, type TaskStatus, taskStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { parseISO } from 'date-fns';

const STORAGE_KEY = 'task-manager-tasks';

export default function TaskManagerPageClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? parseISO(task.dueDate) : null,
          createdAt: task.createdAt ? parseISO(task.createdAt) : new Date(),
        }));
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
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

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
    if ('id' in taskData && taskData.id) {
      setTasks(tasks.map(t => (t.id === taskData.id ? taskData as Task : t)));
      toast({ title: 'Task Updated!', description: `"${taskData.title}" has been updated.` });
    } else {
      const newTask: Task = { ...(taskData as Omit<Task, 'id' | 'createdAt'>), id: crypto.randomUUID(), createdAt: new Date() };
      setTasks([...tasks, newTask]);
      toast({ title: 'Task Added!', description: `"${newTask.title}" has been added.` });
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
        toast({ title: 'Task Deleted', description: `"${task.title}" has been deleted.` });
      }
    }
  };

  const tasksByStatus = useMemo(() => {
    const sortedTasks = [...tasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  if (isLoading) {
    return (
        <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <p>Loading tasks...</p>
        </main>
    );
  }

  return (
    <>
      <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                  <h1 className="text-3xl font-bold">Task Manager</h1>
                  <p className="text-muted-foreground">Organize your work and life.</p>
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
                          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Add a new task'}</DialogTitle>
                      </DialogHeader>
                      <TaskForm 
                          onSubmit={handleTaskSubmit} 
                          taskToEdit={taskToEdit} 
                      />
                  </DialogContent>
              </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {taskStatuses.map(statusInfo => (
              <div key={statusInfo.value} className="bg-card rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold p-4 border-b">{statusInfo.label}</h2>
                <div className="p-4 space-y-4 h-[calc(100vh-250px)] overflow-y-auto">
                  {(tasksByStatus[statusInfo.value] || []).length > 0 ? (
                    tasksByStatus[statusInfo.value].map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={handleEdit} 
                        onDelete={(id) => setTaskToDelete(id)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No tasks here.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      </main>
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
