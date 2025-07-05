'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sortOptions, type SortOption } from '@/lib/types';

type ActivityFiltersProps = {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
};

export default function ActivityFilters({
  sortOption,
  setSortOption,
}: ActivityFiltersProps) {
  return (
    <div className="mb-6 flex justify-end">
      <div className="w-full max-w-xs">
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
