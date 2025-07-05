'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Edit, Trash2, Clock } from 'lucide-react';
import { type Activity } from '@/lib/types';
import { format, formatDistanceStrict, isValid } from 'date-fns';

type TaskCardProps = {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
};

export default function TaskCard({ activity, onEdit, onDelete }: TaskCardProps) {
    
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{activity.title}</CardTitle>
          <Badge variant="outline" className="mt-2 font-normal">{activity.category}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(activity)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(activity.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        {activity.description && <p className="text-muted-foreground">{activity.description}</p>}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{isValid(activity.startTime) ? format(activity.startTime, 'MMM d, yyyy') : 'Invalid Date'}</span>
        </div>
        <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
           <span>
            {isValid(activity.startTime) ? format(activity.startTime, 'h:mm a') : 'Invalid Time'} - {activity.endTime && isValid(activity.endTime) ? format(activity.endTime, 'h:mm a') : 'Now'}
            {activity.endTime && isValid(activity.endTime) && isValid(activity.startTime) && ` (${formatDistanceStrict(activity.endTime, activity.startTime)})`}
           </span>
        </div>
      </CardFooter>
    </Card>
  );
}
