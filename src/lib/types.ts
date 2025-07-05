export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
}

export const sortOptions = [
    { value: 'startTime_desc', label: 'Start Time (Newest)' },
    { value: 'startTime_asc', label: 'Start Time (Oldest)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
] as const;

export type SortOption = typeof sortOptions[number]['value'];

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export const taskStatuses: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export type TaskPriority = 'low' | 'medium' | 'high';

export const taskPriorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];


export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date;
}

export interface ReportData {
    stats: {
        totalActivities: number;
        totalTasks: number;
        totalTimeSpent: string;
    };
    trendsData: { date: string; activities: number; tasks: number }[];
    timeAllocationData: { name: string; value: number }[];
    taskStatusData: { name: string; value: number }[];
}
