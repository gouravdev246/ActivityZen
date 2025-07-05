"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Work', value: 80 },
  { name: 'Exercise', value: 30 },
  { name: 'Leisure', value: 50 },
  { name: 'Learning', value: 25 },
  { name: 'Social', value: 90 },
];

export function ActivityFrequencyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">Frequency of Activities</CardTitle>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">150</p>
            <p className="text-sm text-green-500 font-semibold">+15%</p>
        </div>
        <p className="text-xs text-muted-foreground">Last 30 Days</p>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                style={{ fontSize: '12px' }}
                width={60}
            />
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
            <Bar dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.2} radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
