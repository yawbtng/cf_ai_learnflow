'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { SortField, SortOrder } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ResourceFiltersProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

const sortFields: Array<{ value: SortField; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title', label: 'Title' },
  { value: 'date', label: 'Date' },
  { value: 'source', label: 'Source' },
];

export function ResourceFilters({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}: ResourceFiltersProps) {
  const reducedMotion = useReducedMotion();
  
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Select value={sortField} onValueChange={(value) => onSortFieldChange(value as SortField)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortFields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        whileHover={reducedMotion ? {} : { scale: 1.05 }}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
        transition={{ 
          type: reducedMotion ? 'tween' : 'spring', 
          stiffness: 400, 
          damping: 17,
          duration: reducedMotion ? 0 : undefined
        }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="gap-2"
          aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}
          <span className="hidden sm:inline">
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
}

