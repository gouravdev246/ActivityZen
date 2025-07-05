'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type TaskStatus, sortOptions, type SortOption } from '@/lib/types';

type TaskFiltersProps = {
  statusFilter: TaskStatus | 'all';
  setStatusFilter: (status: TaskStatus | 'all') => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
};

export default function TaskFilters({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  sortOption,
  setSortOption,
}: TaskFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-muted-foreground">Filter by Status</label>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}
        >
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="category-filter" className="mb-2 block text-sm font-medium text-muted-foreground">Filter by Category</label>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat, index) => (
                <SelectItem key={index} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="sort-order" className="mb-2 block text-sm font-medium text-muted-foreground">Sort by</label>
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger id="sort-order">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
