'use client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { type Activity } from '@/lib/types';

interface CalendarViewProps {
  activities: Activity[];
}

export function CalendarView({ activities }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const activityStartDates = useMemo(() => {
    return activities
      .map(activity => activity.startTime)
      .filter((d): d is Date => d !== null);
  }, [activities]);

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
          modifiers={{ due: activityStartDates }}
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
