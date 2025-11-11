'use client';

import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type ViewMode = 'card' | 'table';

export interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-1 rounded-lg border bg-background p-1"
    >
      <motion.div
        className="absolute rounded-md bg-primary"
        layoutId="viewToggle"
        initial={false}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 'calc(50% - 4px)',
          height: 'calc(100% - 8px)',
          left: view === 'card' ? '4px' : 'calc(50% + 4px)',
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('card')}
        className={cn(
          'relative z-10 gap-2',
          view === 'card' ? 'text-primary-foreground' : 'text-muted-foreground'
        )}
        aria-label="Card view"
        aria-pressed={view === 'card'}
      >
        <LayoutGrid className="size-4" />
        <span className="hidden sm:inline">Card</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn(
          'relative z-10 gap-2',
          view === 'table' ? 'text-primary-foreground' : 'text-muted-foreground'
        )}
        aria-label="Table view"
        aria-pressed={view === 'table'}
      >
        <TableIcon className="size-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </motion.div>
  );
}

