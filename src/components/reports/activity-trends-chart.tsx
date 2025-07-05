"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

interface ActivityTrendsChartProps {
  data: {
    date: string;
    activities: number;
    tasks: number;
  }[];
}

export function ActivityTrendsChart({ data }: ActivityTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity & Task Trends</CardTitle>
        <CardDescription>Completed items per day over the selected period.</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
                labelClassName="font-bold"
              />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              <Bar dataKey="activities" fill="hsl(var(--chart-1))" name="Completed Activities" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tasks" fill="hsl(var(--chart-2))" name="Completed Tasks" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for the selected period.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
