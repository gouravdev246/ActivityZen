'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Edit, Trash2, Clock } from 'lucide-react';
import { type Task } from '@/lib/types';
import { format, formatDistanceStrict } from 'date-fns';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    
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
      <CardFooter className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(task.startTime, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
           <span>
            {format(task.startTime, 'h:mm a')} - {task.endTime ? format(task.endTime, 'h:mm a') : 'Now'}
            {task.endTime && ` (${formatDistanceStrict(task.endTime, task.startTime)})`}
           </span>
        </div>
      </CardFooter>
    </Card>
  );
}
