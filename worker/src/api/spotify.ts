import { Resource } from '../types';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifySearchResponse {
  shows: {
    items: Array<{
      id: string;
      name: string;
      description: string;
      images: Array<{ url: string }>;
      publisher: string;
      external_urls: { spotify: string };
    }>;
  };
  episodes?: {
    items: Array<{
      id: string;
      name: string;
      description: string;
      images: Array<{ url: string }>;
      external_urls: { spotify: string };
      release_date: string;
      show: {
        name: string;
        publisher: string;
      };
    }>;
  };
}

// In-memory token cache (for Cloudflare Workers, this is per-request)
// In production, consider using Cloudflare KV for token caching across requests
interface TokenCache {
  token: string | null;
  expiresAt: number;
}

let tokenCache: TokenCache = {
  token: null,
  expiresAt: 0,
};

/**
 * Gets Spotify access token using Client Credentials flow
 * @param clientId - Spotify Client ID
 * @param clientSecret - Spotify Client Secret
 * @returns Access token string
 */
export async function getSpotifyAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error('Spotify Client ID and Secret are required');
  }

  // Check if cached token is still valid (with 60 second buffer)
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token;
  }

  try {
    const credentials = btoa(`${clientId}:${clientSecret}`);
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify auth error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error('Spotify Client ID or Secret is invalid');
      } else {
        throw new Error(`Spotify authentication failed: ${response.status}`);
      }
    }

    const data: SpotifyTokenResponse = await response.json();
    
    // Cache the token
    tokenCache.token = data.access_token;
    tokenCache.expiresAt = now + (data.expires_in * 1000);

    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

/**
 * Fetches Spotify podcasts using Spotify Web API
 * @param query - Search query string
 * @param clientId - Spotify Client ID
 * @param clientSecret - Spotify Client Secret
 * @param maxResults - Maximum number of results (default: 10)
 * @returns Array of normalized Resource objects
 */
export async function fetchSpotifyPodcasts(
  query: string,
  clientId: string,
  clientSecret: string,
  maxResults: number = 10
): Promise<Resource[]> {
  if (!clientId || !clientSecret) {
    console.error('Spotify credentials are missing');
    return [];
  }

  if (!query || query.trim().length === 0) {
    console.error('Spotify search query is empty');
    return [];
  }

  try {
    // Get access token
    const accessToken = await getSpotifyAccessToken(clientId, clientSecret);

    // Search for podcasts (shows) and episodes
    const searchParams = new URLSearchParams({
      q: query,
      type: 'show,episode',
      limit: maxResults.toString(),
      market: 'US',
    });

    const url = `https://api.spotify.com/v1/search?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        // Token expired, clear cache and retry once
        tokenCache.token = null;
        tokenCache.expiresAt = 0;
        const newToken = await getSpotifyAccessToken(clientId, clientSecret);
        const retryResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Accept': 'application/json',
          },
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Spotify API request failed: ${retryResponse.status}`);
        }
        
        const retryData: SpotifySearchResponse = await retryResponse.json();
        return parseSpotifyResponse(retryData);
      } else if (response.status === 403) {
        throw new Error('Spotify API access forbidden');
      } else {
        throw new Error(`Spotify API request failed: ${response.status}`);
      }
    }

    const data: SpotifySearchResponse = await response.json();
    
    // Debug logging to understand response structure
    console.log('Spotify API response:', JSON.stringify({
      hasShows: !!data.shows,
      showsCount: data.shows?.items?.length || 0,
      hasEpisodes: !!data.episodes,
      episodesCount: data.episodes?.items?.length || 0,
    }));
    
    return parseSpotifyResponse(data);
  } catch (error) {
    console.error('Error fetching Spotify podcasts:', error);
    // Return empty array instead of throwing to allow other APIs to continue
    return [];
  }
}

/**
 * Parses Spotify API response into Resource array
 */
function parseSpotifyResponse(data: SpotifySearchResponse): Resource[] {
  const resources: Resource[] = [];

  // Process shows (podcast series)
  if (data.shows?.items && data.shows.items.length > 0) {
    for (const show of data.shows.items) {
      const thumbnail = show.images && show.images.length > 0 
        ? show.images[0].url 
        : '';

      resources.push({
        id: `spotify_show_${show.id}`,
        title: show.name,
        source: 'spotify' as const,
        url: show.external_urls.spotify,
        thumbnail,
        summary: show.description || '',
        publishedAt: undefined, // Shows don't have a single publish date
      });
    }
  }

  // Process episodes (individual podcast episodes)
  if (data.episodes?.items && data.episodes.items.length > 0) {
    for (const episode of data.episodes.items) {
      const thumbnail = episode.images && episode.images.length > 0 
        ? episode.images[0].url 
        : '';

      resources.push({
        id: `spotify_episode_${episode.id}`,
        title: `${episode.show.name}: ${episode.name}`,
        source: 'spotify' as const,
        url: episode.external_urls.spotify,
        thumbnail,
        summary: episode.description || '',
        publishedAt: episode.release_date,
      });
    }
  }

  return resources;
}
