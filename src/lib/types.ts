// TypeScript types for the frontend
// These types match the worker types for consistency

export interface Resource {
  id: string;
  title: string;
  source: 'youtube' | 'spotify' | 'article';
  url: string;
  thumbnail?: string;
  summary?: string;
  reason?: string;
  publishedAt?: string;
}

export interface SearchRequest {
  topic: string;
  learningStyle: 'visual' | 'listener' | 'reader';
}

export interface SearchResponse {
  resources: Resource[];
  total: number;
  message?: string;
}

export interface SearchError {
  error: string;
  message?: string;
}

