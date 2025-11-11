'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type LearningStyle = 'visual' | 'listener' | 'reader';

export interface LearningStyleSelectorProps {
  selectedStyle: LearningStyle | null;
  onSelect: (style: LearningStyle) => void;
  disabled?: boolean;
}

const learningStyles: Array<{ value: LearningStyle; label: string; icon: string }> = [
  { value: 'visual', label: 'Visual', icon: '🎥' },
  { value: 'listener', label: 'Listener', icon: '🎧' },
  { value: 'reader', label: 'Reader', icon: '📖' },
];

export function LearningStyleSelector({
  selectedStyle,
  onSelect,
  disabled = false,
}: LearningStyleSelectorProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {learningStyles.map((style) => {
        const isSelected = selectedStyle === style.value;
        return (
          <Button
            key={style.value}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => !disabled && onSelect(style.value)}
            disabled={disabled}
            className={cn(
              'flex-1 py-4 px-6 text-base font-semibold transition-all',
              isSelected
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-2 hover:bg-accent hover:text-accent-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Select ${style.label} learning style`}
            aria-pressed={isSelected}
          >
            <span className="mr-2 text-xl" aria-hidden="true">
              {style.icon}
            </span>
            {style.label}
          </Button>
        );
      })}
    </div>
  );
}

