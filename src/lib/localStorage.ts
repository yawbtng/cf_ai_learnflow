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

/**
 * Favorites storage key
 */
const FAVORITES_KEY = 'learnflow_favorites';

/**
 * Retrieves favorites from localStorage with validation
 */
export function getFavorites(): import('./types').Resource[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) return [];
    
    // Validate each item has required fields
    return parsed.filter((item: unknown) => {
      if (typeof item !== 'object' || item === null) return false;
      const resource = item as Record<string, unknown>;
      return (
        typeof resource.id === 'string' &&
        typeof resource.title === 'string' &&
        typeof resource.source === 'string' &&
        typeof resource.url === 'string'
      );
    }) as import('./types').Resource[];
  } catch {
    return [];
  }
}

/**
 * Saves favorites to localStorage
 */
function saveFavorites(favorites: import('./types').Resource[]): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggles a favorite resource in localStorage
 */
export function toggleFavorite(resource: import('./types').Resource): void {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex((fav) => fav.id === resource.id);
  
  if (existingIndex >= 0) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
  } else {
    // Add to favorites
    favorites.push(resource);
  }
  
  saveFavorites(favorites);
}
