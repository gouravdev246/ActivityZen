"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { name: 'Week 1', value: 75 },
  { name: 'Week 2', value: 60 },
  { name: 'Week 3', value: 80 },
  { name: 'Week 4', value: 40 },
];

export function WeeklyActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Activity</CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">-5%</span>
          <span className="text-xs text-red-500">Last 4 Weeks -5%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
            <YAxis hide={true} domain={[0, 'dataMax + 20']} />
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
            <Bar dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.2} radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
