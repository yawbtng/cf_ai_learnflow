'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      {learningStyles.map((style, index) => {
        const isSelected = selectedStyle === style.value;
        return (
          <motion.div
            key={style.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
            className="flex-1"
          >
            <motion.div
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => !disabled && onSelect(style.value)}
                disabled={disabled}
                className={cn(
                  'w-full py-4 px-6 text-base font-semibold transition-all relative overflow-hidden',
                  isSelected
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-2 hover:bg-accent hover:text-accent-foreground',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`Select ${style.label} learning style`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selectedStyle"
                    className="absolute inset-0 bg-primary rounded-md"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <motion.span
                    className="text-xl"
                    aria-hidden="true"
                    animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {style.icon}
                  </motion.span>
                  <span>{style.label}</span>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

