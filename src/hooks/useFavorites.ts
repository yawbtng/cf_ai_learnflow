'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '@/lib/localStorage';
import type { Resource } from '@/lib/types';

export interface UseFavoritesReturn {
  favorites: Resource[];
  isFavorite: (resourceId: string) => boolean;
  toggleFavorite: (resource: Resource) => void;
  refreshFavorites: () => void;
}

/**
 * Custom hook for managing favorites state with localStorage sync
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Resource[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const isFavorite = useCallback(
    (resourceId: string) => {
      return favorites.some((fav) => fav.id === resourceId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (resource: Resource) => {
      toggleFavoriteStorage(resource);
      refreshFavorites();
    },
    [refreshFavorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };
}

