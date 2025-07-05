'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Edit, Trash2, ListTodo, Construction, CheckCircle2 } from 'lucide-react';
import { type Task, type TaskStatus } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateStatus: (task: Task) => void;
};

const statusConfig: { [key in TaskStatus]: { variant: 'default' | 'secondary' | 'outline' | 'destructive', icon: React.ReactNode } } = {
  'To Do': { variant: 'secondary', icon: <ListTodo className="h-3 w-3" /> },
  'In Progress': { variant: 'default', icon: <Construction className="h-3 w-3" /> },
  'Done': { variant: 'outline', icon: <CheckCircle2 className="h-3 w-3 text-green-500" /> },
};


export default function TaskCard({ task, onEdit, onDelete, onUpdateStatus }: TaskCardProps) {
    
  const handleStatusChange = (status: TaskStatus) => {
    onUpdateStatus({ ...task, status });
  }
    
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{task.title}</CardTitle>
          <Badge variant="outline" className="mt-2 font-normal">{task.category}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        {task.description && <p className="text-muted-foreground">{task.description}</p>}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          {task.dueDate && (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(task.dueDate, 'MMM d, yyyy')} ({formatDistanceToNow(task.dueDate, { addSuffix: true })})</span>
            </>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Badge variant={statusConfig[task.status].variant} className="cursor-pointer transition-colors">
                <div className="flex items-center gap-1.5">
                    {statusConfig[task.status].icon}
                    {task.status}
                </div>
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('To Do')}>To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('In Progress')}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Done')}>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
