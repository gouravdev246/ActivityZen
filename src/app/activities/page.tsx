import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { ChevronDown, Search } from "lucide-react";

const activities = [
  { activity: 'Morning Run', startTime: '7:00 AM', endTime: '8:00 AM', duration: '1 hour', notes: '5 miles' },
  { activity: 'Work Session', startTime: '9:00 AM', endTime: '12:00 PM', duration: '3 hours', notes: 'Project Alpha' },
  { activity: 'Lunch Break', startTime: '12:00 PM', endTime: '1:00 PM', duration: '1 hour', notes: 'relaxing' },
  { activity: 'Meeting with Team', startTime: '2:00 PM', endTime: '3:00 PM', duration: '1 hour', notes: 'Project Beta Discussion' },
  { activity: 'Coding', startTime: '3:00 PM', endTime: '5:00 PM', duration: '2 hours', notes: 'Debugging' },
  { activity: 'Dinner', startTime: '6:00 PM', endTime: '7:00 PM', duration: '1 hour', notes: 'Family Dinner' },
  { activity: 'Reading', startTime: '8:00 PM', endTime: '9:00 PM', duration: '1 hour', notes: 'Science Fiction' },
  { activity: 'Evening Walk', startTime: '9:00 PM', endTime: '10:00 PM', duration: '1 hour', notes: 'Relaxing Walk' },
  { activity: 'Project Planning', startTime: '10:00 AM', endTime: '11:00 AM', duration: '1 hour', notes: 'Planning next steps' },
  { activity: 'Grocery Shopping', startTime: '11:00 AM', endTime: '12:00 PM', duration: '1 hour', notes: 'Weekly groceries' },
];

export default function ActivityLogPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
        <div className="flex items-center justify-between my-6">
          <h1 className="text-3xl font-bold">Activities</h1>
          <Button>Add Activity</Button>
        </div>
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activities" className="pl-10" />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">Date Range <ChevronDown className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem>This month</DropdownMenuItem>
                    <DropdownMenuItem>Custom</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">Activity Type <ChevronDown className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Work</DropdownMenuItem>
                    <DropdownMenuItem>Personal</DropdownMenuItem>
                    <DropdownMenuItem>Fitness</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">Tags <ChevronDown className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuItem>Urgent</DropdownMenuItem>
                     <DropdownMenuItem>Important</DropdownMenuItem>
                     <DropdownMenuItem>Quick</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Activity</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.activity}</TableCell>
                    <TableCell className="text-muted-foreground">{item.startTime}</TableCell>
                    <TableCell className="text-muted-foreground">{item.endTime}</TableCell>
                    <TableCell className="text-muted-foreground">{item.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{item.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="p-0 h-auto text-primary">Edit</Button>
                      <span className="mx-1 text-muted-foreground">|</span>
                      <Button variant="link" className="p-0 h-auto text-destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Pagination />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
