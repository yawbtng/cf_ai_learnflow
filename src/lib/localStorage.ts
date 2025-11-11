/**
 * Validates and retrieves theme from localStorage
 */
export function getStoredTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates and retrieves view mode from localStorage
 */
export function getStoredViewMode(): 'card' | 'table' | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('viewMode');
    if (stored === 'card' || stored === 'table') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Safely sets a value in localStorage
 */
export function setStoredValue(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
