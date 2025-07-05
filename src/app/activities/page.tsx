'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { ChevronDown, Search, PlusCircle, ListX } from "lucide-react";
import { type Task, type TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import TaskForm from '@/components/activity-zen/task-form';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const STORAGE_KEY = 'activity-zen-tasks';

export default function ActivityLogPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if ((key === 'dueDate' || key === 'createdAt') && value) return new Date(value);
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
  
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const searchMatch = searchTerm.length > 0 
          ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const statusMatch = statusFilter === 'all' || task.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
        return searchMatch && statusMatch && categoryMatch;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, searchTerm, statusFilter, categoryFilter]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
    if ('id' in taskData && taskData.id) {
      setTasks(tasks.map(t => (t.id === taskData.id ? taskData as Task : t)));
      toast({ title: 'Activity Updated!', description: `"${taskData.title}" has been updated.` });
    } else {
      const newTask: Task = { ...taskData, id: crypto.randomUUID(), createdAt: new Date() };
      setTasks([...tasks, newTask]);
      toast({ title: 'Activity Created!', description: `"${newTask.title}" has been added.` });
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
        toast({ title: 'Activity Deleted', description: `"${task.title}" has been deleted.`, variant: 'destructive' });
      }
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <DashboardHeader />
            <main className="flex-1 p-8 flex items-center justify-center">
                <p>Loading activities...</p>
            </main>
        </div>
    );
  }

  return (
    <>
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
        <div className="flex items-center justify-between my-6">
          <h1 className="text-3xl font-bold">Activities</h1>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setTaskToEdit(null); }}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                      <DialogTitle>{taskToEdit ? 'Edit Activity' : 'Create a new activity'}</DialogTitle>
                  </DialogHeader>
                  <TaskForm 
                      onSubmit={handleTaskSubmit} 
                      taskToEdit={taskToEdit} 
                      categories={categories.filter(c => c !== 'all')} 
                  />
              </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activities..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">Status: {statusFilter === 'all' ? 'All' : statusFilter} <ChevronDown className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setStatusFilter('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('To Do')}>To Do</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('In Progress')}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('Done')}>Done</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">Category: {categoryFilter === 'all' ? 'All' : categoryFilter} <ChevronDown className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((cat) => (
                      <DropdownMenuItem key={cat} onSelect={() => setCategoryFilter(cat)}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="text-muted-foreground">{task.status}</TableCell>
                      <TableCell className="text-muted-foreground">{task.category}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-xs">{task.description || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="p-0 h-auto text-primary" onClick={() => handleEdit(task)}>Edit</Button>
                        <span className="mx-1 text-muted-foreground">|</span>
                        <Button variant="link" className="p-0 h-auto text-destructive" onClick={() => setTaskToDelete(task.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <ListX className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Activities Found</h2>
                    <p className="text-muted-foreground">Your activity log is empty. Start by adding a new activity.</p>
                </div>
            )}
          </CardContent>
          {filteredTasks.length > 0 && (
            <CardFooter>
              <Pagination />
            </CardFooter>
          )}
        </Card>
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
