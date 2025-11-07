import { Resource } from '../types';
import { buildRankingPrompt } from './prompts';

interface AIRankingResult {
  id: string;
  rank: number;
  relevanceScore: number;
  reason: string;
}

interface WorkersAI {
  run(
    model: string,
    input: {
      prompt: string;
      max_tokens?: number;
      temperature?: number;
    }
  ): Promise<{ response: string }>;
}

/**
 * Parses AI response JSON, handling various formats
 */
function parseAIResponse(response: string): AIRankingResult[] {
  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response;

    // Try to find JSON array in the response
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    const jsonArray = arrayMatch ? arrayMatch[0] : jsonText;

    const parsed = JSON.parse(jsonArray.trim());
    
    if (!Array.isArray(parsed)) {
      throw new Error('AI response is not an array');
    }

    return parsed.map((item: any) => ({
      id: item.id || '',
      rank: item.rank || 0,
      relevanceScore: item.relevanceScore || item.score || 0,
      reason: item.reason || item.explanation || '',
    }));
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Raw response:', response.substring(0, 500));
    throw error;
  }
}

/**
 * Ranks resources using Cloudflare Workers AI (Llama 3.3 8B Instruct)
 * @param resources - Array of resources to rank
 * @param learningStyle - User's learning style preference
 * @param topic - Search topic
 * @param ai - Workers AI binding
 * @returns Ranked resources with AI-generated explanations
 */
export async function rankResources(
  resources: Resource[],
  learningStyle: 'visual' | 'listener' | 'reader',
  topic: string,
  ai: WorkersAI
): Promise<Resource[]> {
  if (!resources || resources.length === 0) {
    return [];
  }

  // If only one resource, return it with a default reason
  if (resources.length === 1) {
    return [{
      ...resources[0],
      reason: `This ${resources[0].source} resource is recommended for learning about ${topic}.`,
    }];
  }

  try {
    // Build the ranking prompt
    const prompt = buildRankingPrompt(topic, learningStyle, resources);

    // Call Workers AI with Llama 3.3 8B Instruct model
    const aiResponse = await ai.run('@cf/meta/llama-3.3-8b-instruct', {
      prompt,
      max_tokens: 2000, // Allow enough tokens for ranking multiple resources
      temperature: 0.7, // Balance between creativity and consistency
    });

    if (!aiResponse || !aiResponse.response) {
      throw new Error('AI returned empty response');
    }

    // Parse the AI response
    const rankings = parseAIResponse(aiResponse.response);

    // Create a map of rankings by resource ID
    const rankingMap = new Map<string, AIRankingResult>();
    for (const ranking of rankings) {
      rankingMap.set(ranking.id, ranking);
    }

    // Apply rankings to resources
    const rankedResources: Resource[] = resources.map((resource) => {
      const ranking = rankingMap.get(resource.id);
      
      if (ranking) {
        return {
          ...resource,
          reason: ranking.reason || `Recommended for ${learningStyle} learners interested in ${topic}.`,
        };
      } else {
        // If AI didn't rank this resource, assign a default reason
        return {
          ...resource,
          reason: `This ${resource.source} resource may be useful for learning about ${topic}.`,
        };
      }
    });

    // Sort by rank (if provided) or maintain original order
    rankedResources.sort((a, b) => {
      const aRanking = rankingMap.get(a.id);
      const bRanking = rankingMap.get(b.id);
      
      if (aRanking && bRanking) {
        return aRanking.rank - bRanking.rank;
      } else if (aRanking) {
        return -1;
      } else if (bRanking) {
        return 1;
      }
      return 0;
    });

    return rankedResources;
  } catch (error) {
    console.error('Error ranking resources with AI:', error);
    
    // Fallback: return resources with default reasons based on learning style
    const stylePreferences = {
      visual: ['youtube'],
      listener: ['spotify'],
      reader: ['article'],
    };

    const preferredSource = stylePreferences[learningStyle][0];
    
    return resources.map((resource) => ({
      ...resource,
      reason: resource.source === preferredSource
        ? `This ${resource.source} resource is well-suited for ${learningStyle} learners interested in ${topic}.`
        : `This ${resource.source} resource may be useful for learning about ${topic}.`,
    })).sort((a, b) => {
      // Sort preferred source type first
      if (a.source === preferredSource && b.source !== preferredSource) return -1;
      if (a.source !== preferredSource && b.source === preferredSource) return 1;
      return 0;
    });
  }
}
