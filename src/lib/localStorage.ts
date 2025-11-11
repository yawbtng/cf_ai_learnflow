import type { Resource } from './types';

const FAVORITES_KEY = 'learnflow_favorites';

/**
 * Get all favorites from localStorage
 * @returns Array of favorited resources
 */
export function getFavorites(): Resource[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as Resource[];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

/**
 * Save a resource to favorites in localStorage
 * @param resource - The resource to save
 */
export function saveFavorite(resource: Resource): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const favorites = getFavorites();
    // Check if already favorited
    if (!favorites.some((fav) => fav.id === resource.id)) {
      favorites.push(resource);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorite to localStorage:', error);
  }
}

/**
 * Remove a resource from favorites in localStorage
 * @param resourceId - The ID of the resource to remove
 */
export function removeFavorite(resourceId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== resourceId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite from localStorage:', error);
  }
}

/**
 * Check if a resource is favorited
 * @param resourceId - The ID of the resource to check
 * @returns True if the resource is favorited
 */
export function isFavorite(resourceId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.id === resourceId);
  } catch (error) {
    console.error('Error checking favorite in localStorage:', error);
    return false;
  }
}

/**
 * Toggle favorite status of a resource
 * @param resource - The resource to toggle
 */
export function toggleFavorite(resource: Resource): void {
  if (isFavorite(resource.id)) {
    removeFavorite(resource.id);
  } else {
    saveFavorite(resource);
  }
}

