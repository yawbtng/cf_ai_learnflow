'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'What would you like to learn about?',
  disabled = false,
}: SearchInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'h-12 text-base pr-12',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        )}
        aria-label="Search for learning resources"
      />
      <Button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="absolute right-2 h-8 w-8 shrink-0"
        size="icon-sm"
        aria-label="Submit search"
      >
        <Search className="size-4" />
      </Button>
    </div>
  );
}

