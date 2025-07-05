'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function CalendarPageClient() {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-10-05'));

  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Calendar</h1>
          <Button variant="outline">Add Activity</Button>
        </div>
        
        <Card className="mb-12 shadow-sm">
            <CardContent className="p-2 sm:p-4 md:p-6 flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="p-0"
                    defaultMonth={new Date('2024-10-01')}
                />
            </CardContent>
        </Card>

        <div className="w-full max-w-5xl text-center">
          <h2 className="text-2xl font-bold mb-4">Activity Summary</h2>
          <p className="text-muted-foreground">
            No activities logged for the selected day. Click 'Add Activity' to start tracking your daily routines.
          </p>
        </div>
      </div>
    </main>
  );
}
