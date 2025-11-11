import type { Resource } from './types';

/**
 * Color classes for resource source badges
 */
export const sourceColors: Record<Resource['source'], string> = {
  youtube: 'bg-red-500 text-white',
  spotify: 'bg-green-500 text-white',
  article: 'bg-blue-500 text-white',
};

/**
 * Display labels for resource sources
 */
export const sourceLabels: Record<Resource['source'], string> = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  article: 'Article',
};

