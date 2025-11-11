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
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
}: SearchInputProps) {
  const controller = usePromptInputController();
  const inputValue = controller.textInput.value;

  // Sync external value prop with internal state
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      controller.textInput.setInput(value);
    }
  }, [value, inputValue, controller]);

  // Sync internal state changes with external onChange
  useEffect(() => {
    if (inputValue !== undefined && inputValue !== value) {
      onChange(inputValue);
    }
  }, [inputValue, onChange, value]);

  const handleSubmit = async (
    message: { text: string; files?: unknown[] },
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const trimmedValue = message.text.trim();
    if (!trimmedValue || disabled) {
      return;
    }
    // Update internal state to match submitted text
    if (trimmedValue !== inputValue) {
      controller.textInput.setInput(trimmedValue);
      onChange(trimmedValue);
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
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        disabled={disabled}
      />
    </PromptInputProvider>
  );
}

