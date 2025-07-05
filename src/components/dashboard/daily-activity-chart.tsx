"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

const data = [
    { name: 'Mon', value: 22 },
    { name: 'Tue', value: 35 },
    { name: 'Wed', value: 18 },
    { name: 'Thu', value: 45 },
    { name: 'Fri', value: 30 },
    { name: 'Sat', value: 50 },
    { name: 'Sun', value: 42 },
];

export function DailyActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Daily Activity</CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">+10%</span>
          <span className="text-xs text-green-500">Last 7 Days +10%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
             <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
