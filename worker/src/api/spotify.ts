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
    console.log('Spotify: Got access token successfully');

    // Search for podcasts (shows) and episodes
    const searchParams = new URLSearchParams({
      q: query,
      type: 'show,episode',
      limit: maxResults.toString(),
      market: 'US',
    });

    const url = `https://api.spotify.com/v1/search?${searchParams.toString()}`;
    console.log('Spotify: Searching with query:', query);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });
    
    console.log('Spotify: API response status:', response.status);

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

    const data: any = await response.json();
    
    // Debug logging to understand response structure
    console.log('Spotify API response structure:', JSON.stringify({
      topLevelKeys: Object.keys(data),
      hasShows: !!data.shows,
      showsCount: data.shows?.items?.length || 0,
      hasEpisodes: !!data.episodes,
      episodesCount: data.episodes?.items?.length || 0,
      // Log first 200 chars of full response for debugging
      responseSample: JSON.stringify(data).substring(0, 200),
    }));
    
    // Handle potential different response structures
    const searchResponse: SpotifySearchResponse = {
      shows: data.shows || { items: [] },
      episodes: data.episodes || { items: [] },
    };
    
    const parsedResources = parseSpotifyResponse(searchResponse);
    console.log('Spotify: Parsed resources count:', parsedResources.length);
    
    return parsedResources;
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

  try {
    // Process shows (podcast series)
    if (data.shows?.items && Array.isArray(data.shows.items) && data.shows.items.length > 0) {
      console.log(`Spotify: Processing ${data.shows.items.length} shows`);
      for (const show of data.shows.items) {
        try {
          const thumbnail = show.images && Array.isArray(show.images) && show.images.length > 0 
            ? show.images[0].url 
            : '';

          resources.push({
            id: `spotify_show_${show.id}`,
            title: show.name || 'Untitled Podcast',
            source: 'spotify' as const,
            url: show.external_urls?.spotify || '#',
            thumbnail,
            summary: show.description || '',
            publishedAt: undefined, // Shows don't have a single publish date
          });
        } catch (err) {
          console.error('Error processing Spotify show:', err, show);
        }
      }
    } else {
      console.log('Spotify: No shows found or shows.items is not an array');
    }

    // Process episodes (individual podcast episodes)
    if (data.episodes?.items && Array.isArray(data.episodes.items) && data.episodes.items.length > 0) {
      console.log(`Spotify: Processing ${data.episodes.items.length} episodes`);
      for (const episode of data.episodes.items) {
        try {
          const thumbnail = episode.images && Array.isArray(episode.images) && episode.images.length > 0 
            ? episode.images[0].url 
            : '';

          resources.push({
            id: `spotify_episode_${episode.id}`,
            title: `${episode.show?.name || 'Unknown'}: ${episode.name || 'Untitled Episode'}`,
            source: 'spotify' as const,
            url: episode.external_urls?.spotify || '#',
            thumbnail,
            summary: episode.description || '',
            publishedAt: episode.release_date,
          });
        } catch (err) {
          console.error('Error processing Spotify episode:', err, episode);
        }
      }
    } else {
      console.log('Spotify: No episodes found or episodes.items is not an array');
    }
  } catch (error) {
    console.error('Error parsing Spotify response:', error);
  }

  console.log(`Spotify: Total resources parsed: ${resources.length}`);
  return resources;
}
