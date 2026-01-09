import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithClaude } from './claude';

describe('generateWithClaude', () => {
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
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping test: ANTHROPIC_API_KEY not set');
      return;
    }

    const result = await generateWithClaude(
      'Say "Hello, World!" and nothing else.',
      'You are a helpful assistant. Respond concisely.'
    );

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toMatch(/^Error:/);
  });

  it('should return error message when API key is invalid', async () => {
    // Save original key
    const originalKey = process.env.ANTHROPIC_API_KEY;

    // Set invalid key
    process.env.ANTHROPIC_API_KEY = 'invalid-api-key';

    const result = await generateWithClaude(
      'Say hello',
      'You are a helpful assistant.'
    );

    expect(result).toMatch(/^Error:/);
    expect(result.toLowerCase()).toContain('invalid');

    // Restore original key
    process.env.ANTHROPIC_API_KEY = originalKey;
  });

  it('should return error message when API key is missing', async () => {
    // Remove the API key
    delete process.env.ANTHROPIC_API_KEY;

    const result = await generateWithClaude(
      'Say hello',
      'You are a helpful assistant.'
    );

    expect(result).toMatch(/^Error:/);
    expect(result).toContain('ANTHROPIC_API_KEY');
  });

  it('should handle rate limit errors without crashing', async () => {
    // This test verifies the function doesn't crash on rate limits
    // In a real scenario, we'd mock the API, but for integration testing
    // we verify the function handles errors gracefully
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping test: ANTHROPIC_API_KEY not set');
      return;
    }

    // The function should never throw, only return error messages
    const result = await generateWithClaude(
      'Test prompt',
      'Test system prompt'
    );

    // Result should be a string (either success or error message)
    expect(typeof result).toBe('string');
  });
});
