import { Resource } from '../types';

/**
 * Learning style descriptions for AI context
 */
const LEARNING_STYLE_DESCRIPTIONS = {
  visual: {
    name: 'Visual',
    description: 'Prefers visual content like videos, diagrams, infographics, and visual demonstrations. Learns best through seeing and observing.',
    preferences: ['YouTube videos', 'visual tutorials', 'diagrams', 'infographics', 'video explanations'],
  },
  listener: {
    name: 'Listener',
    description: 'Prefers audio content like podcasts, audiobooks, and audio lectures. Learns best through hearing and listening.',
    preferences: ['podcasts', 'audio content', 'Spotify shows', 'audio lectures', 'spoken explanations'],
  },
  reader: {
    name: 'Reader',
    description: 'Prefers written content like articles, blog posts, documentation, and text-based resources. Learns best through reading.',
    preferences: ['articles', 'blog posts', 'written documentation', 'text-based resources', 'detailed explanations'],
  },
};

/**
 * Builds a comprehensive prompt for AI ranking based on learning style
 * @param topic - The search topic
 * @param learningStyle - The user's learning style preference
 * @param resources - Array of resources to rank
 * @returns Formatted prompt string for AI
 */
export function buildRankingPrompt(
  topic: string,
  learningStyle: 'visual' | 'listener' | 'reader',
  resources: Resource[]
): string {
  const style = LEARNING_STYLE_DESCRIPTIONS[learningStyle];
  
  // Format resources for the prompt
  const resourcesText = resources
    .map((resource, index) => {
      const sourceType = resource.source === 'youtube' ? 'Video' 
        : resource.source === 'spotify' ? 'Podcast' 
        : 'Article';
      
      return `
${index + 1}. [${sourceType}] ${resource.title}
   URL: ${resource.url}
   Summary: ${resource.summary || 'No summary available'}
   Published: ${resource.publishedAt || 'Unknown date'}
   ID: ${resource.id}`;
    })
    .join('\n');

  const prompt = `You are an AI assistant that ranks educational resources based on learning style preferences.

**Topic:** ${topic}
**Learning Style:** ${style.name} Learner
**Description:** ${style.description}
**Preferred Content Types:** ${style.preferences.join(', ')}

**Task:**
Rank the following ${resources.length} educational resources from most relevant to least relevant for a ${style.name.toLowerCase()} learner interested in "${topic}".

For each resource, provide:
1. A relevance score (1-10, where 10 is most relevant)
2. A brief explanation of why this resource was recommended (2-3 sentences)
3. How it aligns with ${style.name.toLowerCase()} learning preferences

**Resources to Rank:**
${resourcesText}

**Output Format:**
Return a JSON array with the following structure:
[
  {
    "id": "resource_id",
    "rank": 1,
    "relevanceScore": 9,
    "reason": "Brief explanation of why this resource is recommended for a ${style.name.toLowerCase()} learner..."
  },
  ...
]

**Ranking Criteria:**
- Relevance to the topic "${topic}"
- Alignment with ${style.name.toLowerCase()} learning preferences
- Content quality and educational value
- Recency (newer content preferred if equally relevant)
- Source type preference (${style.preferences.join(' > ')})

**Important:**
- Rank all ${resources.length} resources
- Provide unique, specific reasons for each recommendation
- Consider how each resource type (video/podcast/article) fits ${style.name.toLowerCase()} learning
- Ensure the ranking reflects true relevance, not just source type

Return ONLY valid JSON, no additional text or markdown formatting.`;

  return prompt.trim();
}

/**
 * Alternative prompt for simpler ranking (if JSON parsing fails)
 */
export function buildSimpleRankingPrompt(
  topic: string,
  learningStyle: 'visual' | 'listener' | 'reader',
  resources: Resource[]
): string {
  const style = LEARNING_STYLE_DESCRIPTIONS[learningStyle];
  
  const resourcesText = resources
    .map((resource, index) => `${index + 1}. ${resource.title} (${resource.source}) - ${resource.url}`)
    .join('\n');

  return `Rank these educational resources about "${topic}" for a ${style.name.toLowerCase()} learner.

Learning style: ${style.description}
Preferred content: ${style.preferences.join(', ')}

Resources:
${resourcesText}

Return ranked list with brief explanations.`;
}

/**
 * Gets the base ranking prompt template
 */
export const RANKING_PROMPT = `
You are an AI assistant that ranks educational resources based on learning style preferences.
Given a list of resources and a learning style (Visual, Listener, or Reader), 
rank them by relevance and explain why each resource was recommended.
`.trim();
