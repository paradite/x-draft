import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';
import { getGeminiApiKey } from '../config';
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
  if (error instanceof GoogleGenerativeAIError) {
    const message = error.message.toLowerCase();
    // Retry on rate limits (429) and server errors (5xx)
    return (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('quota') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504') ||
      message.includes('internal')
    );
  }
  // Also check for generic errors that might indicate transient issues
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('quota') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504')
    );
  }
  return false;
}

/**
 * Generates text using Gemini 2.5 Pro.
 *
 * @param prompt - The user prompt to send to Gemini
 * @param systemPrompt - The system prompt to configure Gemini's behavior
 * @returns The generated text, or an error message if generation fails
 */
export async function generateWithGemini(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  let client: GoogleGenerativeAI;

  try {
    const apiKey = getGeminiApiKey();
    client = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Failed to initialize Gemini client'}`;
  }

  const modelConfig = MODEL_REGISTRY['gemini-2.5-pro'];
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const model = client.getGenerativeModel({
        model: modelConfig.modelId,
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: modelConfig.maxTokens,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (text) {
        return text;
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
  if (lastError instanceof Error) {
    const message = lastError.message.toLowerCase();

    if (message.includes('api key') || message.includes('invalid') || message.includes('401')) {
      return 'Error: Invalid API key';
    }
    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      return 'Error: Rate limit exceeded';
    }

    return `Error: API error: ${lastError.message}`;
  }

  return `Error: ${lastError instanceof Error ? lastError.message : 'Unknown error occurred'}`;
}
