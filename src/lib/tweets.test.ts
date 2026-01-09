import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readTweets } from './tweets';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';

describe('readTweets', () => {
  const testDir = join(process.cwd(), 'test-tweets-temp');

  beforeAll(async () => {
    // Create test directory with sample tweet files
    await mkdir(testDir, { recursive: true });
    await writeFile(join(testDir, 'tweet1.md'), 'This is tweet 1\nWith multiple lines');
    await writeFile(join(testDir, 'tweet2.md'), 'This is tweet 2');
    await writeFile(join(testDir, 'not-a-tweet.txt'), 'This should be ignored');
  });

  afterAll(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  it('should read tweets from markdown files in a directory', async () => {
    const tweets = await readTweets(testDir);
    expect(tweets).toHaveLength(2);
    expect(tweets).toContain('This is tweet 1\nWith multiple lines');
    expect(tweets).toContain('This is tweet 2');
  });

  it('should return empty array for non-existent directory', async () => {
    const tweets = await readTweets('/non/existent/path');
    expect(tweets).toEqual([]);
  });

  it('should read tweets from data/user-tweets/', async () => {
    const tweets = await readTweets('data/user-tweets/');
    expect(Array.isArray(tweets)).toBe(true);
    expect(tweets.length).toBeGreaterThanOrEqual(2);
  });

  it('should read tweets from data/popular-tweets/', async () => {
    const tweets = await readTweets('data/popular-tweets/');
    expect(Array.isArray(tweets)).toBe(true);
    expect(tweets.length).toBeGreaterThanOrEqual(2);
  });
});
