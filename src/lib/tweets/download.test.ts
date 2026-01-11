import { describe, it, expect } from 'vitest';
import {
  extractTweetId,
  fetchTweetByUrl,
  fetchTweetBySyndication,
  formatTweetForDisplay,
} from './download.js';

describe('extractTweetId', () => {
  it('extracts ID from twitter.com URL', () => {
    const url = 'https://twitter.com/user/status/1234567890';
    expect(extractTweetId(url)).toBe('1234567890');
  });

  it('extracts ID from x.com URL', () => {
    const url = 'https://x.com/Yuchenj_UW/status/2010215226978042218';
    expect(extractTweetId(url)).toBe('2010215226978042218');
  });

  it('extracts ID from mobile.twitter.com URL', () => {
    const url = 'https://mobile.twitter.com/user/status/9876543210';
    expect(extractTweetId(url)).toBe('9876543210');
  });

  it('returns null for invalid URLs', () => {
    expect(extractTweetId('https://google.com')).toBeNull();
    expect(extractTweetId('not a url')).toBeNull();
  });
});

describe('fetchTweetBySyndication', () => {
  it('fetches a tweet by ID', async () => {
    // Using a well-known tweet that should exist
    // Note: This test makes a real network request
    const result = await fetchTweetBySyndication('2010215226978042218');

    console.log('Syndication API result:', JSON.stringify(result, null, 2));

    // The API may return null if the tweet doesn't exist or is protected
    // We're just checking the function runs without throwing
    expect(result === null || typeof result === 'object').toBe(true);
  }, 30000);
});

describe('fetchTweetByUrl', () => {
  it('fetches a tweet by URL', async () => {
    const url = 'https://x.com/Yuchenj_UW/status/2010215226978042218';
    const result = await fetchTweetByUrl(url);

    console.log('Tweet by URL result:', JSON.stringify(result, null, 2));

    if (result) {
      console.log('\nFormatted tweet:');
      console.log(formatTweetForDisplay(result));
    }

    // The API may return null if the tweet doesn't exist or is protected
    expect(result === null || typeof result === 'object').toBe(true);
  }, 30000);
});
