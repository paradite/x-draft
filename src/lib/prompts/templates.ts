import { PromptStyle } from '../../types';

/**
 * Base system prompt template for tweet generation
 */
const BASE_SYSTEM_PROMPT = `You are an expert tweet writer who creates engaging, high-performing tweets.
Your goal is to help users craft tweets that resonate with their audience while maintaining their authentic voice.

Guidelines:
- Keep tweets under 280 characters
- Be concise and impactful
- Avoid hashtags unless specifically requested
- Write naturally, as a real person would`;

/**
 * Style-specific instructions for each prompt variation
 */
const STYLE_INSTRUCTIONS: Record<PromptStyle, string> = {
  direct: `Style: Direct
- Be straightforward and information-focused
- Lead with the main point
- Use clear, simple language
- No fluff or filler words
- Get to the point immediately`,

  engaging: `Style: Engaging
- Start with a compelling hook
- Create curiosity that makes people want to read more
- Use power words that grab attention
- Ask questions or make bold statements
- Make readers stop scrolling`,

  conversational: `Style: Conversational
- Write as if talking to a friend
- Use casual, relatable language
- Include personal touches
- Feel approachable and authentic
- Use contractions and informal phrasing`,

  controversial: `Style: Controversial
- Take a bold stance or hot take
- Challenge conventional wisdom
- Express a strong opinion
- Be provocative but not offensive
- Spark discussion and debate`,

  story: `Style: Story
- Use a narrative-based approach
- Share a personal angle or experience
- Create an emotional connection
- Paint a picture with words
- Make it memorable and relatable`,
};

/**
 * Returns an array of all available prompt style names.
 */
export function getPromptStyles(): PromptStyle[] {
  return ['direct', 'engaging', 'conversational', 'controversial', 'story'];
}

/**
 * Builds a formatted prompt for tweet generation.
 *
 * @param style - The prompt style to use
 * @param topic - The topic or idea for the tweet
 * @param userTweets - Optional array of user's previous tweets for style reference
 * @param popularTweets - Optional array of popular tweets for pattern learning
 * @returns An object containing the user prompt and system prompt
 */
export function buildPrompt(
  style: PromptStyle,
  topic: string,
  userTweets: string[] = [],
  popularTweets: string[] = []
): { userPrompt: string; systemPrompt: string } {
  // Build the system prompt with style instructions
  let systemPrompt = BASE_SYSTEM_PROMPT + '\n\n' + STYLE_INSTRUCTIONS[style];

  // Add user tweet examples if provided
  if (userTweets.length > 0) {
    systemPrompt += '\n\n## User\'s Writing Style\nHere are examples of the user\'s previous tweets. Mimic their tone and voice:\n';
    userTweets.forEach((tweet, index) => {
      systemPrompt += `\nExample ${index + 1}:\n"${tweet.trim()}"\n`;
    });
  }

  // Add popular tweet examples if provided
  if (popularTweets.length > 0) {
    systemPrompt += '\n\n## Popular Tweet Patterns\nHere are examples of high-performing tweets. Learn from their structure and engagement patterns:\n';
    popularTweets.forEach((tweet, index) => {
      systemPrompt += `\nExample ${index + 1}:\n"${tweet.trim()}"\n`;
    });
  }

  // Build the user prompt
  const userPrompt = `Write a tweet about the following topic:\n\n${topic}\n\nRespond with only the tweet text, no explanations or alternatives.`;

  return { userPrompt, systemPrompt };
}
