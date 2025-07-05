import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReportExport() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Export</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="outline">Export as PDF</Button>
                <Button variant="outline">Export as CSV</Button>
            </CardContent>
        </Card>
    );
}
