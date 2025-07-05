'use client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-07-05'));

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
          numberOfMonths={2}
          className="p-0"
          defaultMonth={new Date('2024-07-01')}
        />
      </CardContent>
    </Card>
  );
}
