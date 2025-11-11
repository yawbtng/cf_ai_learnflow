'use client';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from '@/components/ai-elements/prompt-input';
import { Search } from 'lucide-react';

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
  const handleSubmit = async () => {
    if (!value.trim() || disabled) {
      return;
    }
    onSubmit();
  };

  return (
    <PromptInputProvider initialInput={value}>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-12 text-base"
            aria-label="Search for learning resources"
          />
          <PromptInputSubmit disabled={disabled || !value.trim()} aria-label="Submit search">
            <Search className="size-4" />
          </PromptInputSubmit>
        </PromptInputBody>
      </PromptInput>
    </PromptInputProvider>
  );
}

