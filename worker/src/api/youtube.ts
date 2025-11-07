import { Resource } from '../types';

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
      publishedAt: string;
    };
  }>;
}

/**
 * Fetches YouTube videos using YouTube Data API v3
 * @param query - Search query string
 * @param apiKey - YouTube Data API v3 key
 * @param maxResults - Maximum number of results (default: 10)
 * @returns Array of normalized Resource objects
 */
export async function fetchYouTubeVideos(
  query: string,
  apiKey: string,
  maxResults: number = 10
): Promise<Resource[]> {
  if (!apiKey) {
    console.error('YouTube API key is missing');
    return [];
  }

  if (!query || query.trim().length === 0) {
    console.error('YouTube search query is empty');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      key: apiKey,
      order: 'relevance',
      videoCategoryId: '27', // Education category
    });

    const url = `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API error: ${response.status} - ${errorText}`);
      
      if (response.status === 403) {
        throw new Error('YouTube API key is invalid or quota exceeded');
      } else if (response.status === 400) {
        throw new Error('Invalid YouTube API request');
      } else {
        throw new Error(`YouTube API request failed: ${response.status}`);
      }
    }

    const data: YouTubeSearchResponse = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.warn('YouTube API returned invalid response format');
      return [];
    }

    return data.items.map((item) => {
      const thumbnail =
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        '';

      return {
        id: `youtube_${item.id.videoId}`,
        title: item.snippet.title,
        source: 'youtube' as const,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail,
        summary: item.snippet.description || '',
        publishedAt: item.snippet.publishedAt,
      };
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return empty array instead of throwing to allow other APIs to continue
    return [];
  }
}
