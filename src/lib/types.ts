export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
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
