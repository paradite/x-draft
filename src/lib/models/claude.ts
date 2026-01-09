import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey } from '../config';
import { MODEL_REGISTRY } from '../../types';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determines if an error is transient and should be retried
 */
function isTransientError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError) {
    // Retry on rate limits (429) and server errors (5xx)
    return error.status === 429 || (error.status >= 500 && error.status < 600);
  }
  return false;
}

/**
 * Generates text using Claude Opus 4.5.
 *
 * @param prompt - The user prompt to send to Claude
 * @param systemPrompt - The system prompt to configure Claude's behavior
 * @returns The generated text, or an error message if generation fails
 */
export async function generateWithClaude(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  let client: Anthropic;

  try {
    const apiKey = getAnthropicApiKey();
    client = new Anthropic({ apiKey });
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Failed to initialize Anthropic client'}`;
  }

  const modelConfig = MODEL_REGISTRY['claude-opus-4.5'];
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: modelConfig.modelId,
        max_tokens: modelConfig.maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text from response
      const textContent = response.content.find((block) => block.type === 'text');
      if (textContent && textContent.type === 'text') {
        return textContent.text;
      }

      return 'Error: No text content in response';
    } catch (error) {
      lastError = error;

      // Check if error is transient and we should retry
      if (isTransientError(error) && attempt < MAX_RETRIES - 1) {
        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delayMs);
        continue;
      }

      // For non-transient errors or final attempt, break out
      break;
    }
  }

  // Return error message for the last error
  if (lastError instanceof Anthropic.APIError) {
    if (lastError.status === 401) {
      return 'Error: Invalid API key';
    }
    if (lastError.status === 429) {
      return 'Error: Rate limit exceeded';
    }
    return `Error: API error (${lastError.status}): ${lastError.message}`;
  }

  return `Error: ${lastError instanceof Error ? lastError.message : 'Unknown error occurred'}`;
}
