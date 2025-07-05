"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

type ChartData = {
  name: string;
  value: number;
}[];

interface WeeklyActivityChartProps {
    data: ChartData;
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">in the last 4 weeks</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          {data.some(d => d.value > 0) ? (
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
              <YAxis hide={true} domain={[0, 'dataMax + 5']} />
              <Tooltip 
                cursor={{fill: 'hsl(var(--muted))'}} 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
                labelClassName="font-bold"
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No completed tasks in the last 4 weeks.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
