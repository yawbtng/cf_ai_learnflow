import { Resource } from '../types';

interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_id: string;
  source_name: string;
  category: string[];
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

/**
 * Fetches articles from NewsData.io API
 * @param query - Search query string
 * @param apiKey - NewsData.io API key
 * @param maxResults - Maximum number of results (default: 10)
 * @returns Array of normalized Resource objects
 */
export async function fetchArticles(
  query: string,
  apiKey: string,
  maxResults: number = 10
): Promise<Resource[]> {
  if (!apiKey) {
    console.error('NewsData.io API key is missing');
    return [];
  }

  if (!query || query.trim().length === 0) {
    console.error('NewsData.io search query is empty');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      apikey: apiKey,
      q: query,
      language: 'en',
      size: Math.min(maxResults, 10).toString(), // NewsData.io free tier limits to 10
    });

    const url = `https://newsdata.io/api/1/news?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NewsData.io API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error('NewsData.io API key is invalid');
      } else if (response.status === 429) {
        throw new Error('NewsData.io API rate limit exceeded');
      } else if (response.status === 400) {
        throw new Error('Invalid NewsData.io API request');
      } else {
        throw new Error(`NewsData.io API request failed: ${response.status}`);
      }
    }

    const data: NewsDataResponse = await response.json();

    if (data.status !== 'success') {
      console.warn(`NewsData.io API returned status: ${data.status}`);
      return [];
    }

    if (!data.results || !Array.isArray(data.results)) {
      console.warn('NewsData.io API returned invalid response format');
      return [];
    }

    return data.results.map((article) => ({
      id: `article_${article.article_id}`,
      title: article.title,
      source: 'article' as const,
      url: article.link,
      thumbnail: article.image_url || undefined,
      summary: article.description || '',
      publishedAt: article.pubDate,
    }));
  } catch (error) {
    console.error('Error fetching NewsData.io articles:', error);
    // Return empty array instead of throwing to allow other APIs to continue
    return [];
  }
}
