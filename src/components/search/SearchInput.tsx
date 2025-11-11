'use client';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from '@/components/ai-elements/prompt-input';
import { Search } from 'lucide-react';
import { useState } from 'react';

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
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || disabled) {
      return;
    }
    onChange(trimmedValue);
    onSubmit();
  };

  return (
    <PromptInputProvider initialInput={value}>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              onChange(newValue);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-12 text-base"
          />
          <PromptInputSubmit disabled={disabled || !inputValue.trim()}>
            <Search className="size-4" />
          </PromptInputSubmit>
        </PromptInputBody>
      </PromptInput>
    </PromptInputProvider>
  );
}

