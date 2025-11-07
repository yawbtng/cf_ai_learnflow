import { fetchYouTubeVideos } from './api/youtube';
import { fetchSpotifyPodcasts } from './api/spotify';
import { fetchArticles } from './api/newsdata';
import { normalizeResources, filterValidResources, deduplicateResources } from './utils/normalize';
import { validateSearchInput, sanitizeTopic } from './utils/validation';
import { rankResources } from './ai/ranking';
import { SearchRequest, SearchResponse } from './types';

/**
 * Gets CORS headers based on request origin and allowed origins
 */
function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];
  
  // In development, allow all origins. In production, use ALLOWED_ORIGINS env var
  const corsOrigin = allowedOrigins.includes('*') || !origin
    ? '*'
    : allowedOrigins.includes(origin)
    ? origin
    : null;

  return {
    'Access-Control-Allow-Origin': corsOrigin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request, env);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Main API endpoint
    if (url.pathname === '/api/search' && request.method === 'POST') {
      try {
        const body = await request.json() as SearchRequest;
        const { topic, learningStyle } = body;

        // Validate and sanitize input
        const validation = validateSearchInput(topic, learningStyle);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error || 'Invalid request' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }
        
        // Sanitize topic to prevent injection
        const sanitizedTopic = sanitizeTopic(topic);

        // Normalize learning style to lowercase
        const normalizedLearningStyle = learningStyle.toLowerCase() as 'visual' | 'listener' | 'reader';

        // Fetch from all three APIs in parallel (using sanitized topic)
        const [youtubeResults, spotifyResults, articleResults] = await Promise.allSettled([
          fetchYouTubeVideos(sanitizedTopic, env.YOUTUBE_API_KEY || '', 10),
          fetchSpotifyPodcasts(sanitizedTopic, env.SPOTIFY_CLIENT_ID || '', env.SPOTIFY_CLIENT_SECRET || '', 10),
          fetchArticles(sanitizedTopic, env.NEWSDATA_API_KEY || '', 10),
        ]);

        // Extract successful results
        const youtubeResources = youtubeResults.status === 'fulfilled' ? youtubeResults.value : [];
        const spotifyResources = spotifyResults.status === 'fulfilled' ? spotifyResults.value : [];
        const articleResources = articleResults.status === 'fulfilled' ? articleResults.value : [];

        // Log any API failures
        if (youtubeResults.status === 'rejected') {
          console.error('YouTube API failed:', youtubeResults.reason);
        }
        if (spotifyResults.status === 'rejected') {
          console.error('Spotify API failed:', spotifyResults.reason);
        }
        if (articleResults.status === 'rejected') {
          console.error('NewsData.io API failed:', articleResults.reason);
        }

        // Normalize and merge all resources
        const allResources = normalizeResources([
          youtubeResources,
          spotifyResources,
          articleResources,
        ]);

        // Filter out invalid resources
        const validResources = filterValidResources(allResources);

        // Deduplicate by URL
        const uniqueResources = deduplicateResources(validResources);

        // If no resources found, return early
        if (uniqueResources.length === 0) {
          return new Response(
            JSON.stringify({
              resources: [],
              total: 0,
              message: 'No resources found for the given topic',
            } as SearchResponse),
            {
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        // Rank resources using AI
        let rankedResources = uniqueResources;
        try {
          if (env.AI) {
            rankedResources = await rankResources(
              uniqueResources,
              normalizedLearningStyle,
              sanitizedTopic,
              env.AI
            );
          } else {
            console.warn('Workers AI not available, skipping ranking');
            // Add default reasons if AI is not available
            rankedResources = uniqueResources.map((resource) => ({
              ...resource,
              reason: `This ${resource.source} resource may be useful for learning about ${sanitizedTopic}.`,
            }));
          }
        } catch (error) {
          console.error('AI ranking failed, using unranked resources:', error);
          // Continue with unranked resources if AI fails
          rankedResources = uniqueResources.map((resource) => ({
            ...resource,
            reason: `This ${resource.source} resource may be useful for learning about ${sanitizedTopic}.`,
          }));
        }

        // Format response
        const response: SearchResponse = {
          resources: rankedResources,
          total: rankedResources.length,
        };

        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error('Search endpoint error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // 404 for unknown routes
    return new Response('Not Found', { status: 404 });
  },
};

interface Env {
  AI: {
    run(
      model: string,
      input: {
        prompt: string;
        max_tokens?: number;
        temperature?: number;
      }
    ): Promise<{ response: string }>;
  };
  YOUTUBE_API_KEY?: string;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  NEWSDATA_API_KEY?: string;
  ALLOWED_ORIGINS?: string; // Comma-separated list of allowed CORS origins (e.g., "https://example.com,https://app.example.com")
}
