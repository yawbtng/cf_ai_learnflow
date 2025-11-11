'use client';

import { useEffect, useState } from 'react';
import { getStoredTheme, setStoredValue } from '@/lib/localStorage';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage with validation or default to light
    const storedTheme = getStoredTheme();
    const initialTheme = storedTheme || 'light';
    setTheme(initialTheme);
    
    // Apply theme to document (script tag handles initial load, but this ensures sync)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStoredValue('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    theme,
    toggleTheme,
    mounted,
  };
}

