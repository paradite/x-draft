import { describe, it, expect } from 'vitest';
import { getPromptStyles, buildPrompt } from './templates';

describe('getPromptStyles', () => {
  it('should return at least 3 styles', () => {
    const styles = getPromptStyles();
    expect(styles.length).toBeGreaterThanOrEqual(3);
  });

  it('should return all 5 defined styles', () => {
    const styles = getPromptStyles();
    expect(styles).toContain('direct');
    expect(styles).toContain('engaging');
    expect(styles).toContain('conversational');
    expect(styles).toContain('controversial');
    expect(styles).toContain('story');
  });

  it('should return an array of strings', () => {
    const styles = getPromptStyles();
    expect(Array.isArray(styles)).toBe(true);
    styles.forEach((style) => {
      expect(typeof style).toBe('string');
    });
  });
});

describe('buildPrompt', () => {
  it('should include the topic in the user prompt', () => {
    const topic = 'artificial intelligence trends';
    const { userPrompt } = buildPrompt('direct', topic);
    expect(userPrompt).toContain(topic);
  });

  it('should include user tweet examples when provided', () => {
    const userTweets = [
      'This is my first tweet about coding',
      'Another tweet about tech life',
    ];
    const { systemPrompt } = buildPrompt('engaging', 'coding tips', userTweets);

    expect(systemPrompt).toContain('User\'s Writing Style');
    expect(systemPrompt).toContain('This is my first tweet about coding');
    expect(systemPrompt).toContain('Another tweet about tech life');
  });

  it('should include popular tweet examples when provided', () => {
    const popularTweets = [
      'Hot take: TypeScript is just JavaScript with extra steps',
      'The best code is no code at all',
    ];
    const { systemPrompt } = buildPrompt('controversial', 'programming', [], popularTweets);

    expect(systemPrompt).toContain('Popular Tweet Patterns');
    expect(systemPrompt).toContain('Hot take: TypeScript is just JavaScript');
    expect(systemPrompt).toContain('The best code is no code at all');
  });

  it('should produce different system prompts for different styles', () => {
    const topic = 'machine learning';

    const { systemPrompt: directPrompt } = buildPrompt('direct', topic);
    const { systemPrompt: engagingPrompt } = buildPrompt('engaging', topic);
    const { systemPrompt: conversationalPrompt } = buildPrompt('conversational', topic);
    const { systemPrompt: controversialPrompt } = buildPrompt('controversial', topic);
    const { systemPrompt: storyPrompt } = buildPrompt('story', topic);

    // All prompts should be different from each other
    const prompts = [directPrompt, engagingPrompt, conversationalPrompt, controversialPrompt, storyPrompt];
    const uniquePrompts = new Set(prompts);
    expect(uniquePrompts.size).toBe(5);
  });

  it('should return both userPrompt and systemPrompt', () => {
    const result = buildPrompt('direct', 'test topic');

    expect(result).toHaveProperty('userPrompt');
    expect(result).toHaveProperty('systemPrompt');
    expect(typeof result.userPrompt).toBe('string');
    expect(typeof result.systemPrompt).toBe('string');
  });

  it('should work with empty user tweets array', () => {
    const { systemPrompt } = buildPrompt('direct', 'test topic', []);

    expect(systemPrompt).not.toContain('User\'s Writing Style');
  });

  it('should work with empty popular tweets array', () => {
    const { systemPrompt } = buildPrompt('direct', 'test topic', [], []);

    expect(systemPrompt).not.toContain('Popular Tweet Patterns');
  });

  it('should include style-specific instructions', () => {
    const { systemPrompt: directPrompt } = buildPrompt('direct', 'test');
    expect(directPrompt).toContain('straightforward');
    expect(directPrompt).toContain('information-focused');

    const { systemPrompt: engagingPrompt } = buildPrompt('engaging', 'test');
    expect(engagingPrompt).toContain('hook');
    expect(engagingPrompt).toContain('curiosity');

    const { systemPrompt: conversationalPrompt } = buildPrompt('conversational', 'test');
    expect(conversationalPrompt).toContain('friend');
    expect(conversationalPrompt).toContain('casual');

    const { systemPrompt: controversialPrompt } = buildPrompt('controversial', 'test');
    expect(controversialPrompt).toContain('bold stance');
    expect(controversialPrompt).toContain('hot take');

    const { systemPrompt: storyPrompt } = buildPrompt('story', 'test');
    expect(storyPrompt).toContain('narrative');
    expect(storyPrompt).toContain('personal');
  });
});
