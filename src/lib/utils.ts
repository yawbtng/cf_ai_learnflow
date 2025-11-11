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
        // Improved relevance heuristic:
        // 1. Resources with both reason and summary are more relevant
        // 2. Resources with reason are more relevant than those without
        // 3. Among resources with reason, shorter reasons may indicate higher confidence
        const aHasReason = !!a.reason;
        const bHasReason = !!b.reason;
        const aHasSummary = !!a.summary;
        const bHasSummary = !!b.summary;
        
        // Score: reason (2 points) + summary (1 point) - reason length penalty (normalized)
        const aScore = (aHasReason ? 2 : 0) + (aHasSummary ? 1 : 0) - (a.reason?.length || 0) / 100;
        const bScore = (bHasReason ? 2 : 0) + (bHasSummary ? 1 : 0) - (b.reason?.length || 0) / 100;
        
        comparison = aScore - bScore;
        break;
      default:
        return 0;
    }

    return config.order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
