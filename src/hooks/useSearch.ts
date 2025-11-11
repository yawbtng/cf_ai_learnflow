'use client';

import { useState, useCallback } from 'react';
import { searchResources } from '@/lib/api';
import type { Resource, SearchResponse } from '@/lib/types';

export interface UseSearchReturn {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  search: (topic: string, learningStyle: 'visual' | 'listener' | 'reader') => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing search state and executing searches
 */
export function useSearch(): UseSearchReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (topic: string, learningStyle: 'visual' | 'listener' | 'reader') => {
      if (!topic.trim()) {
        setError('Please enter a topic to search');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: SearchResponse = await searchResources(topic, learningStyle);
        setResources(response.resources || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search for resources';
        setError(errorMessage);
        setResources([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resources,
    loading,
    error,
    search,
    clearError,
  };
}

