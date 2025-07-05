"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { name: 'Work', value: 45 },
  { name: 'Exercise', value: 10 },
  { name: 'Leisure', value: 20 },
  { name: 'Learning', value: 15 },
  { name: 'Social', value: 5 },
];

export function TimeAllocationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">Time Spent Per Activity</CardTitle>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">75 hours</p>
            <p className="text-sm text-green-500 font-semibold">+15%</p>
        </div>
        <p className="text-xs text-muted-foreground">Last 30 Days</p>
      </CardHeader>
      <CardContent className="h-80">
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
            <Bar dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
