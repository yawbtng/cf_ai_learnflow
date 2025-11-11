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
import { motion } from 'motion/react';

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
  const setInputRef = useRef(setInput);

  // Keep refs up to date
  useEffect(() => {
    onChangeRef.current = onChange;
    setInputRef.current = setInput;
  }, [onChange, setInput]);

  // Sync external value prop with internal state (only when value changes externally)
  useEffect(() => {
    // Skip if this is an internal update
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      prevValueRef.current = value;
      prevInputValueRef.current = value;
      return;
    }

    // Only sync if value changed externally and differs from current input
    if (value !== prevValueRef.current && value !== inputValue) {
      setInputRef.current(value);
      prevValueRef.current = value;
      prevInputValueRef.current = value;
    } else {
      // Update ref to track current value even if no sync needed
      prevValueRef.current = value;
    }
  }, [value, inputValue]);

  // Sync internal state changes with external onChange (only when inputValue changes internally)
  useEffect(() => {
    // Skip if values haven't changed or already match
    if (inputValue === prevInputValueRef.current) {
      return;
    }

    // Skip if this matches the external value (means it was set externally)
    if (inputValue === value) {
      prevInputValueRef.current = inputValue;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <PromptInputTextarea
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-12 text-base"
              aria-label="Search for learning resources"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <PromptInputSubmit disabled={disabled || !inputValue.trim()} aria-label="Submit search">
              <Search className="size-4" />
            </PromptInputSubmit>
          </motion.div>
        </PromptInputBody>
      </PromptInput>
    </motion.div>
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

