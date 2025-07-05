"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface TaskStatusChartProps {
  data: {
    name: string; // status
    value: number; // count
  }[];
}

const COLORS: { [key: string]: string } = {
  "To Do": "hsl(var(--chart-4))",
  "In Progress": "hsl(var(--chart-5))",
  "Done": "hsl(var(--chart-2))",
};

export function ActivityFrequencyChart({ data }: TaskStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
        <CardDescription>A breakdown of tasks by their current status.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 && data.some(d => d.value > 0) ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                 stroke="hsl(var(--border))"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || 'hsl(var(--muted))'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
              />
              <Legend wrapperStyle={{fontSize: "14px"}} />
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No tasks to display.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
