"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

const data = [
    { name: 'Day 1', value: 22 },
    { name: 'Day 5', value: 35 },
    { name: 'Day 10', value: 18 },
    { name: 'Day 15', value: 45 },
    { name: 'Day 20', value: 30 },
    { name: 'Day 25', value: 50 },
    { name: 'Day 30', value: 42 },
];

export function ActivityTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">Daily Activity Time</CardTitle>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">75 hours</p>
            <p className="text-sm text-green-500 font-semibold">+15%</p>
        </div>
        <p className="text-xs text-muted-foreground">Last 30 Days</p>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
             <defs>
              <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
            <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
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
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
