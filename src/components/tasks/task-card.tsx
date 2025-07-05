'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Edit, Trash2, Flag } from 'lucide-react';
import { type Task, type TaskPriority } from '@/lib/types';
import { format, isValid } from 'date-fns';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

const priorityVariant: Record<TaskPriority, BadgeProps['variant']> = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline'
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    
  return (
    <Card className="transition-all hover:shadow-lg bg-background">
      <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
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
      <CardContent className="pb-4">
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {task.dueDate && isValid(task.dueDate) ? (
            <div className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" />
                <span>{format(task.dueDate, 'MMM d')}</span>
            </div>
           ) : null}
        </div>
        <Badge variant={priorityVariant[task.priority]} className="capitalize">
            <Flag className="mr-1.5 h-3 w-3" />
            {task.priority}
        </Badge>
      </CardFooter>
    </Card>
  );
}
