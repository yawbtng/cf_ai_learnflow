// Placeholder for input validation
export function validateSearchInput(topic: string, learningStyle: string): { valid: boolean; error?: string } {
  if (!topic || topic.trim().length === 0) {
    return { valid: false, error: 'Topic is required' };
  }
  if (topic.length > 200) {
    return { valid: false, error: 'Topic is too long (max 200 characters)' };
  }
  const validStyles = ['visual', 'listener', 'reader'];
  if (!validStyles.includes(learningStyle.toLowerCase())) {
    return { valid: false, error: 'Invalid learning style' };
  }
  return { valid: true };
}
