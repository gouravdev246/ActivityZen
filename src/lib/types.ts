export const taskStatuses = ['To Do', 'In Progress', 'Done'] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: string;
  dueDate: Date | null;
  createdAt: Date;
}

export const sortOptions = [
    { value: 'dueDate_asc', label: 'Date (Oldest)' },
    { value: 'dueDate_desc', label: 'Date (Newest)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'status', label: 'Status' },
] as const;

export type SortOption = typeof sortOptions[number]['value'];
