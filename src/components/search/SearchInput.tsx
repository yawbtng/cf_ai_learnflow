'use client';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
  usePromptInputController,
} from '@/components/ai-elements/prompt-input';
import { Search } from 'lucide-react';
import { useEffect } from 'react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

function SearchInputInner({
  onChange,
  onSubmit,
  placeholder,
  disabled,
}: Omit<SearchInputProps, 'value'>) {
  const controller = usePromptInputController();
  const inputValue = controller.textInput.value;

  // Sync external onChange with internal state
  useEffect(() => {
    if (inputValue !== undefined) {
      onChange(inputValue);
    }
  }, [inputValue, onChange]);

  const handleSubmit = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || disabled) {
      return;
    }
    onSubmit();
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-12 text-base"
          aria-label="Search for learning resources"
        />
        <PromptInputSubmit disabled={disabled || !inputValue.trim()} aria-label="Submit search">
          <Search className="size-4" />
        </PromptInputSubmit>
      </PromptInputBody>
    </PromptInput>
  );
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'What would you like to learn about?',
  disabled = false,
}: SearchInputProps) {
  return (
    <PromptInputProvider initialInput={value}>
      <SearchInputInner
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        disabled={disabled}
      />
    </PromptInputProvider>
  );
}

