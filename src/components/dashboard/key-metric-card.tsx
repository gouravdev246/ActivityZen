import { Card, CardContent } from '@/components/ui/card';

interface KeyMetricCardProps {
  title: string;
  value: string;
}

export function KeyMetricCard({ title, value }: KeyMetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
