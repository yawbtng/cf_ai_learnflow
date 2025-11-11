'use client';

import { useState, useCallback, useMemo } from 'react';
import { searchResources } from '@/lib/api';
import type { Resource, SearchResponse } from '@/lib/types';
import { sortResources, type SortField, type SortOrder, type SortConfig } from '@/lib/utils';

export interface UseSearchReturn {
  resources: Resource[];
  sortedResources: Resource[];
  loading: boolean;
  error: string | null;
  sortField: SortField;
  sortOrder: SortOrder;
  search: (topic: string, learningStyle: 'visual' | 'listener' | 'reader') => Promise<void>;
  clearError: () => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
}

/**
 * Custom hook for managing search state and executing searches
 */
export function useSearch(): UseSearchReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('relevance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedResources = useMemo(() => {
    if (resources.length === 0) return [];
    return sortResources(resources, { field: sortField, order: sortOrder });
  }, [resources, sortField, sortOrder]);

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
    sortedResources,
    loading,
    error,
    sortField,
    sortOrder,
    search,
    clearError,
    setSortField,
    setSortOrder,
  };
}

