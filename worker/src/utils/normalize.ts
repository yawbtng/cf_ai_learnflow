import { Resource } from '../types';

/**
 * Normalizes and merges resources from multiple API responses
 * Ensures all resources have required fields and handles missing optional fields
 * @param resources - Array of Resource arrays from different APIs
 * @returns Merged and normalized Resource array
 */
export function normalizeResources(resources: Resource[][]): Resource[] {
  const merged: Resource[] = [];
  
  // Flatten all resources into a single array
  for (const resourceArray of resources) {
    if (Array.isArray(resourceArray)) {
      merged.push(...resourceArray);
    }
  }

  // Normalize each resource to ensure consistency
  return merged.map((resource, index) => {
    // Ensure required fields exist
    const normalized: Resource = {
      id: resource.id || `resource_${index}_${Date.now()}`,
      title: resource.title || 'Untitled',
      source: resource.source || 'article',
      url: resource.url || '#',
      // Optional fields with defaults
      thumbnail: resource.thumbnail || undefined,
      summary: resource.summary || '',
      reason: resource.reason || undefined,
      publishedAt: resource.publishedAt || undefined,
    };

    // Validate URL format
    if (!normalized.url.startsWith('http')) {
      console.warn(`Invalid URL for resource ${normalized.id}: ${normalized.url}`);
    }

    // Ensure summary doesn't exceed reasonable length (for AI processing)
    if (normalized.summary && normalized.summary.length > 500) {
      normalized.summary = normalized.summary.substring(0, 497) + '...';
    }

    return normalized;
  });
}

/**
 * Deduplicates resources by URL (keeps first occurrence)
 * @param resources - Array of resources
 * @returns Deduplicated Resource array
 */
export function deduplicateResources(resources: Resource[]): Resource[] {
  const seen = new Set<string>();
  const deduplicated: Resource[] = [];

  for (const resource of resources) {
    const key = resource.url.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(resource);
    }
  }

  return deduplicated;
}

/**
 * Filters resources to ensure minimum quality
 * Removes resources with missing critical fields
 * @param resources - Array of resources
 * @returns Filtered Resource array
 */
export function filterValidResources(resources: Resource[]): Resource[] {
  return resources.filter((resource) => {
    // Must have id, title, and url
    if (!resource.id || !resource.title || !resource.url) {
      return false;
    }

    // Title must not be empty
    if (resource.title.trim().length === 0) {
      return false;
    }

    // URL must be valid
    if (!resource.url.startsWith('http')) {
      return false;
    }

    return true;
  });
}
