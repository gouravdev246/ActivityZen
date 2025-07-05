'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { type ReportData } from "@/lib/types";

interface ReportExportProps {
    reportData: ReportData | null;
    reportType: string;
    dateRange: DateRange | undefined;
}

export function ReportExport({ reportData, reportType, dateRange }: ReportExportProps) {

    const showActivities = reportType === 'all' || reportType === 'activities';
    const showTasks = reportType === 'all' || reportType === 'tasks';

    const getFormattedDateRange = () => {
        if (!dateRange || !dateRange.from) return "N/A";
        if (dateRange.to) {
            return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
        }
        return format(dateRange.from, "LLL dd, y");
    };

    const handleExportCSV = () => {
        if (!reportData) return;

        const csvData: (string | number)[][] = [];

        csvData.push(['Activity and Task Report']);
        csvData.push([`Date Range: ${getFormattedDateRange()}`]);
        csvData.push([]); // blank row

        // Summary
        csvData.push(['Report Summary']);
        csvData.push(['Metric', 'Value']);
        if (showActivities) csvData.push(['Total Completed Activities', reportData.stats.totalActivities]);
        if (showTasks) csvData.push(['Total Completed Tasks', reportData.stats.totalTasks]);
        if (showActivities) csvData.push(['Total Time Spent', reportData.stats.totalTimeSpent]);
        csvData.push([]);

        // Trends
        if (reportData.trendsData.length > 0) {
            csvData.push(['Trends']);
            const trendsHeader = ['Date'];
            if(showActivities) trendsHeader.push('Completed Activities');
            if(showTasks) trendsHeader.push('Completed Tasks');
            csvData.push(trendsHeader);

            reportData.trendsData.forEach(d => {
                const row = [d.date];
                if(showActivities) row.push(d.activities);
                if(showTasks) row.push(d.tasks);
                csvData.push(row);
            });
            csvData.push([]);
        }

        // Time Allocation
        if (showActivities && reportData.timeAllocationData.length > 0) {
            csvData.push(['Time Allocation (Top 5)']);
            csvData.push(['Activity', 'Time Spent (minutes)']);
            reportData.timeAllocationData.forEach(d => {
                csvData.push([d.name, d.value]);
            });
            csvData.push([]);
        }

        // Task Status
        if (showTasks && reportData.taskStatusData.some(d => d.value > 0)) {
            csvData.push(['Task Status Distribution']);
            csvData.push(['Status', 'Count']);
            reportData.taskStatusData.forEach(d => {
                if (d.value > 0) csvData.push([d.name, d.value]);
            });
        }

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'activity_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (!reportData) return;

        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(18);
        doc.text('Activity and Task Report', 14, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.text(`Date Range: ${getFormattedDateRange()}`, 14, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.text('Report Summary', 14, yPos);
        yPos += 7;
        doc.setFontSize(10);
        if (showActivities) {
            doc.text(`Total Completed Activities: ${reportData.stats.totalActivities}`, 14, yPos);
            yPos += 5;
            doc.text(`Total Time Spent: ${reportData.stats.totalTimeSpent}`, 14, yPos);
            yPos += 5;
        }
        if (showTasks) {
            doc.text(`Total Completed Tasks: ${reportData.stats.totalTasks}`, 14, yPos);
            yPos += 5;
        }
        yPos += 5; 

        if (reportData.trendsData.length > 0) {
            const trendsHeader = ['Date'];
            if(showActivities) trendsHeader.push('Activities');
            if(showTasks) trendsHeader.push('Tasks');
            
            const trendsBody = reportData.trendsData.map(d => {
                const row: (string|number)[] = [d.date];
                if(showActivities) row.push(d.activities);
                if(showTasks) row.push(d.tasks);
                return row;
            });
            
            autoTable(doc, {
                head: [trendsHeader],
                body: trendsBody,
                startY: yPos,
                headStyles: { fillColor: [3, 105, 161] } // primary color
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        const hasTimeData = showActivities && reportData.timeAllocationData.length > 0;
        const hasStatusData = showTasks && reportData.taskStatusData.some(d => d.value > 0);

        if (hasTimeData) {
             const timeBody = reportData.timeAllocationData.map(d => [d.name, d.value]);
             autoTable(doc, {
                head: [['Top 5 Activities', 'Minutes']],
                body: timeBody,
                startY: yPos,
                headStyles: { fillColor: [3, 105, 161] }
            });
             yPos = (doc as any).lastAutoTable.finalY + 10;
        } 
        
        if (hasStatusData) {
            const statusBody = reportData.taskStatusData.filter(d => d.value > 0).map(d => [d.name, d.value]);
             autoTable(doc, {
                head: [['Task Status', 'Count']],
                body: statusBody,
                startY: yPos,
                headStyles: { fillColor: [3, 105, 161] }
            });
             yPos = (doc as any).lastAutoTable.finalY + 10;
        }


        doc.save('activity_report.pdf');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Export</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="outline" onClick={handleExportPDF} disabled={!reportData}>Export as PDF</Button>
                <Button variant="outline" onClick={handleExportCSV} disabled={!reportData}>Export as CSV</Button>
            </CardContent>
        </Card>
    );
}
