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
import React, { useEffect, useRef } from 'react';

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
  const setInput = controller.textInput.setInput;

  // Track previous values to detect external vs internal changes
  const prevValueRef = useRef(value);
  const prevInputValueRef = useRef(inputValue);
  const isInternalUpdateRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value prop with internal state (only when value changes externally)
  useEffect(() => {
    // Skip if this is an internal update
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      prevValueRef.current = value;
      return;
    }

    // Only sync if value changed externally and differs from current input
    if (value !== prevValueRef.current && value !== inputValue) {
      setInput(value);
      prevValueRef.current = value;
      prevInputValueRef.current = value;
    }
  }, [value, inputValue, setInput]);

  // Sync internal state changes with external onChange (only when inputValue changes internally)
  useEffect(() => {
    // Skip if this is an external update or if values match
    if (inputValue === prevInputValueRef.current || inputValue === value) {
      return;
    }

    // Mark as internal update to prevent feedback loop
    isInternalUpdateRef.current = true;
    onChangeRef.current(inputValue);
    prevInputValueRef.current = inputValue;
  }, [inputValue, value]);

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

