import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Resource } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SortField = 'source' | 'title' | 'date' | 'relevance';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export function sortResources(resources: Resource[], config: SortConfig): Resource[] {
  const sorted = [...resources];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (config.field) {
      case 'source':
        comparison = a.source.localeCompare(b.source);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case 'relevance':
        // For relevance, we'll use a simple heuristic based on reason length
        // (shorter reasons might indicate higher relevance)
        const reasonA = a.reason?.length || 0;
        const reasonB = b.reason?.length || 0;
        comparison = reasonA - reasonB;
        break;
      default:
        return 0;
    }

    return config.order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
