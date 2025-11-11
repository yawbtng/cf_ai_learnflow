import type { SearchRequest, SearchResponse, SearchError } from './types';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || '';

if (!WORKER_URL) {
  console.warn('NEXT_PUBLIC_WORKER_URL is not set. API calls will fail.');
}

/**
 * Search for learning resources using the Cloudflare Worker API
 * @param topic - The topic to search for
 * @param learningStyle - The learning style preference (visual, listener, reader)
 * @returns Promise resolving to SearchResponse or throwing SearchError
 */
export async function searchResources(
  topic: string,
  learningStyle: 'visual' | 'listener' | 'reader'
): Promise<SearchResponse> {
  if (!WORKER_URL) {
    throw new Error('Worker URL is not configured. Please set NEXT_PUBLIC_WORKER_URL.');
  }

  const requestBody: SearchRequest = {
    topic: topic.trim(),
    learningStyle,
  };

  try {
    const response = await fetch(`${WORKER_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as SearchError;
      throw new Error(
        errorData.message || errorData.error || `API request failed with status ${response.status}`
      );
    }

    const data = (await response.json()) as SearchResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while searching for resources');
  }
}

