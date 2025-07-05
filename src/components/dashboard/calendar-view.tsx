'use client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { type Task } from '@/lib/types';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const taskDueDates = useMemo(() => {
    return tasks
      .map(task => task.dueDate)
      .filter((d): d is Date => d !== null);
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          modifiers={{ due: taskDueDates }}
          modifiersStyles={{
            due: { 
              border: "1px solid hsl(var(--primary))",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
