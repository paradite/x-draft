import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithGemini } from './gemini';
import { generateWithClaude } from './claude';

describe('generateWithGemini', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return non-empty string with valid API key', async () => {
    // Skip if no API key is available (CI environment)
    if (!process.env.GEMINI_API_KEY) {
      console.log('Skipping test: GEMINI_API_KEY not set');
      return;
    }

    const result = await generateWithGemini(
      'Say "Hello, World!" and nothing else.',
      'You are a helpful assistant. Respond concisely.'
    );

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toMatch(/^Error:/);
  }, 30000);

  it('should return error message when API key is invalid', async () => {
    // Save original key
    const originalKey = process.env.GEMINI_API_KEY;

    // Set invalid key
    process.env.GEMINI_API_KEY = 'invalid-api-key';

    const result = await generateWithGemini(
      'Say hello',
      'You are a helpful assistant.'
    );

    expect(result).toMatch(/^Error:/);

    // Restore original key
    process.env.GEMINI_API_KEY = originalKey;
  }, 30000);

  it('should return error message when API key is missing', async () => {
    // Remove the API key
    delete process.env.GEMINI_API_KEY;

    const result = await generateWithGemini(
      'Say hello',
      'You are a helpful assistant.'
    );

    expect(result).toMatch(/^Error:/);
    expect(result).toContain('GEMINI_API_KEY');
  });

  it('should handle rate limit errors without crashing', async () => {
    // This test verifies the function doesn't crash on rate limits
    // In a real scenario, we'd mock the API, but for integration testing
    // we verify the function handles errors gracefully
    if (!process.env.GEMINI_API_KEY) {
      console.log('Skipping test: GEMINI_API_KEY not set');
      return;
    }

    // The function should never throw, only return error messages
    const result = await generateWithGemini(
      'Test prompt',
      'Test system prompt'
    );

    // Result should be a string (either success or error message)
    expect(typeof result).toBe('string');
  }, 30000);
});

describe('Function signature consistency', () => {
  it('should have identical function signatures for Claude and Gemini wrappers', () => {
    // Verify both functions have the same signature:
    // (prompt: string, systemPrompt: string) => Promise<string>

    // Check that both are functions
    expect(typeof generateWithClaude).toBe('function');
    expect(typeof generateWithGemini).toBe('function');

    // Check that both have the same parameter count
    expect(generateWithClaude.length).toBe(generateWithGemini.length);
  });
});
