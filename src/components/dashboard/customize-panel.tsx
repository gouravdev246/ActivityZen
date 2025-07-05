import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function CustomizePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="total-activities" defaultChecked />
          <Label htmlFor="total-activities" className="font-normal">Total Activities</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="time-spent" defaultChecked />
          <Label htmlFor="time-spent" className="font-normal">Time Spent</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="goal-progress" defaultChecked />
          <Label htmlFor="goal-progress" className="font-normal">Goal Progress</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="activity-trends" defaultChecked />
          <Label htmlFor="activity-trends" className="font-normal">Activity Trends</Label>
        </div>
      </CardContent>
    </Card>
  );
}
