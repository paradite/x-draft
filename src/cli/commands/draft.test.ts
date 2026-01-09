import { describe, it, expect } from 'vitest';
import { parseModels, parseStyles } from './draft';

describe('parseModels', () => {
  it('should return all models when no option provided', () => {
    const models = parseModels(undefined);
    expect(models).toContain('claude-opus-4.5');
    expect(models).toContain('gemini-2.5-pro');
    expect(models.length).toBe(2);
  });

  it('should parse "claude" shorthand', () => {
    const models = parseModels('claude');
    expect(models).toEqual(['claude-opus-4.5']);
  });

  it('should parse "gemini" shorthand', () => {
    const models = parseModels('gemini');
    expect(models).toEqual(['gemini-2.5-pro']);
  });

  it('should parse full model names', () => {
    const models = parseModels('claude-opus-4.5');
    expect(models).toEqual(['claude-opus-4.5']);
  });

  it('should parse comma-separated list', () => {
    const models = parseModels('claude,gemini');
    expect(models).toContain('claude-opus-4.5');
    expect(models).toContain('gemini-2.5-pro');
  });

  it('should ignore invalid model names', () => {
    const models = parseModels('invalid,claude');
    expect(models).toEqual(['claude-opus-4.5']);
  });

  it('should return all models if only invalid names provided', () => {
    const models = parseModels('invalid,also-invalid');
    expect(models).toContain('claude-opus-4.5');
    expect(models).toContain('gemini-2.5-pro');
  });
});

describe('parseStyles', () => {
  it('should return all styles when no option provided', () => {
    const styles = parseStyles(undefined);
    expect(styles).toContain('direct');
    expect(styles).toContain('engaging');
    expect(styles).toContain('conversational');
    expect(styles).toContain('controversial');
    expect(styles).toContain('story');
    expect(styles.length).toBe(5);
  });

  it('should parse single style', () => {
    const styles = parseStyles('direct');
    expect(styles).toEqual(['direct']);
  });

  it('should parse comma-separated list', () => {
    const styles = parseStyles('direct,engaging');
    expect(styles).toContain('direct');
    expect(styles).toContain('engaging');
    expect(styles.length).toBe(2);
  });

  it('should ignore invalid style names', () => {
    const styles = parseStyles('invalid,direct');
    expect(styles).toEqual(['direct']);
  });

  it('should return all styles if only invalid names provided', () => {
    const styles = parseStyles('invalid');
    expect(styles.length).toBe(5);
  });

  it('should handle whitespace in style list', () => {
    const styles = parseStyles('direct, engaging, story');
    expect(styles).toContain('direct');
    expect(styles).toContain('engaging');
    expect(styles).toContain('story');
  });
});

describe('draft command integration', () => {
  it('should have correct function signatures for parseModels and parseStyles', () => {
    // Test that the exported functions work correctly
    expect(typeof parseModels).toBe('function');
    expect(typeof parseStyles).toBe('function');
  });
});
