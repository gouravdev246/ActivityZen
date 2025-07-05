"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

type ChartData = {
  name: string;
  value: number;
}[];

interface DailyActivityChartProps {
  data: ChartData;
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">in the last 7 days</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          {data.some(d => d.value > 0) ? (
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
              <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 2']} />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
                labelClassName="font-bold"
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">
              No completed tasks in the last 7 days.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
