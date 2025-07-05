"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface TimeAllocationChartProps {
  data: {
    name: string;
    value: number; // minutes
  }[];
}

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = Math.floor(data.value / 60);
    const minutes = data.value % 60;
    const timeString = `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
    return (
      <div className="p-2 text-sm bg-background border rounded-lg shadow-sm">
        <p className="font-bold">{`${data.name}`}</p>
        <p>{`Time: ${timeString} (${((payload[0].percent || 0) * 100).toFixed(0)}%)`}</p>
      </div>
    );
  }
  return null;
};

export function TimeAllocationChart({ data }: TimeAllocationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Allocation</CardTitle>
        <CardDescription>How time is spent across different activities.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 ? (
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
                stroke="hsl(var(--border))"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No activity time to display.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
