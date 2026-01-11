import { describe, it, expect } from 'vitest';
import { getTweetById, getScraper } from './scraper.js';
import { formatTweetForDisplay } from './download.js';

describe('twitter-scraper', () => {
  it('creates a scraper instance', async () => {
    const scraper = await getScraper();
    expect(scraper).toBeDefined();
  }, 30000);

  it('gets a tweet by ID', async () => {
    console.log('\n--- Getting tweet by ID ---\n');

    const tweet = await getTweetById('2010215226978042218');

    if (tweet) {
      console.log(formatTweetForDisplay(tweet));
    } else {
      console.log('Could not fetch tweet');
    }

    expect(tweet).not.toBeNull();
    expect(tweet?.id).toBe('2010215226978042218');
  }, 30000);
});
