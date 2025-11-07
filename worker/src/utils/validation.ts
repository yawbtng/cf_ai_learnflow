/**
 * Sanitizes topic input to prevent injection attacks
 * @param topic - Raw topic input
 * @returns Sanitized topic string
 */
export function sanitizeTopic(topic: string): string {
  return topic
    .trim()
    // Remove potential HTML/script tags
    .replace(/[<>]/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Limit length
    .substring(0, 200);
}

/**
 * Validates search input parameters
 * @param topic - Search topic
 * @param learningStyle - Learning style preference
 * @returns Validation result with error message if invalid
 */
export function validateSearchInput(topic: string, learningStyle: string): { valid: boolean; error?: string } {
  if (!topic || topic.trim().length === 0) {
    return { valid: false, error: 'Topic is required' };
  }
  
  // Sanitize and validate topic length
  const sanitizedTopic = sanitizeTopic(topic);
  if (sanitizedTopic.length === 0) {
    return { valid: false, error: 'Topic cannot be empty after sanitization' };
  }
  if (topic.length > 200) {
    return { valid: false, error: 'Topic is too long (max 200 characters)' };
  }
  
  // Validate learning style against whitelist
  const validStyles = ['visual', 'listener', 'reader'];
  const normalizedStyle = learningStyle.toLowerCase().trim();
  if (!validStyles.includes(normalizedStyle)) {
    return { valid: false, error: `Invalid learning style. Must be one of: ${validStyles.join(', ')}` };
  }
  
  return { valid: true };
}
