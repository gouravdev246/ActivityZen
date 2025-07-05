'use client';

import * as React from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TaskForm from '@/components/activity-zen/task-form';
import TaskCard from '@/components/activity-zen/task-card';
import TaskFilters from '@/components/activity-zen/task-filters';
import { type Task, type TaskStatus, type SortOption } from '@/lib/types';
import Logo from '@/components/logo';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q3 report',
    description: 'Compile sales data and draft the quarterly report for management review.',
    category: 'Work',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'In Progress',
  },
  {
    id: '2',
    title: 'Schedule dentist appointment',
    description: '',
    category: 'Health',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'To Do',
  },
  {
    id: '3',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and cheese.',
    category: 'Personal',
    dueDate: new Date(),
    status: 'To Do',
  },
  {
    id: '4',
    title: 'Pay electricity bill',
    description: 'Due by the end of the week.',
    category: 'Finance',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'Done',
  },
  {
    id: '5',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation.',
    category: 'Leisure',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'In Progress',
  },
  {
    id: '6',
    title: 'Go for a run',
    description: '30-minute jog in the park.',
    category: 'Health',
    dueDate: new Date(),
    status: 'Done',
  },
];

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<Date | null>(null);
  const [sortOption, setSortOption] = React.useState<SortOption>('dueDate_asc');

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: new Date().toISOString() }]);
    setIsSheetOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setIsSheetOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const categories = React.useMemo(() => ['all', ...Array.from(new Set(tasks.map(t => t.category)))], [tasks]);

  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = [...tasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.toDateString() === dateFilter.toDateString();
      });
    }

    switch (sortOption) {
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'dueDate_asc':
        filtered.sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));
        break;
      case 'dueDate_desc':
        filtered.sort((a, b) => (b.dueDate?.getTime() || 0) - (a.dueDate?.getTime() || 0));
        break;
      case 'status':
        const statusOrder: { [key in TaskStatus]: number } = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
    }

    return filtered;
  }, [tasks, statusFilter, categoryFilter, dateFilter, sortOption]);

  const handleAddNew = () => {
    setEditingTask(null);
    setIsSheetOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold md:text-3xl">
              ActivityZen
            </h1>
          </div>
          <Button onClick={handleAddNew} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <TaskFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          filteredAndSortedTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onUpdateStatus={handleUpdateTask}
                />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="font-headline text-2xl font-semibold">All Clear!</h3>
              <p className="text-muted-foreground">No tasks match the current filters. <br/> How about adding a new one?</p>
            </div>
          )
        )}
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </SheetTitle>
          </SheetHeader>
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            taskToEdit={editingTask}
            categories={categories.filter(c => c !== 'all')}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
