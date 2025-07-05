'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "../ui/date-range-picker";
import type { DateRange } from "react-day-picker";

interface ReportConfigurationProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    reportType: string;
    setReportType: (type: string) => void;
    onGenerate: () => void;
}

export function ReportConfiguration({ date, setDate, reportType, setReportType, onGenerate }: ReportConfigurationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="grid gap-2">
                        <Label htmlFor="data-type">Data Type</Label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger id="data-type">
                                <SelectValue placeholder="Select data type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="activities">Activities</SelectItem>
                                <SelectItem value="tasks">Tasks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="date-range">Date Range</Label>
                        <DateRangePicker date={date} setDate={setDate} />
                    </div>
                </div>
                <Button onClick={onGenerate}>Generate Report</Button>
            </CardContent>
        </Card>
    );
}
