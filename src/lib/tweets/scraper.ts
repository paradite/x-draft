/**
 * Twitter scraper utilities using @the-convocation/twitter-scraper
 * Only includes functionality that works without authentication
 */

import { Scraper } from '@the-convocation/twitter-scraper';
import type { TweetData } from './download.js';

// Singleton scraper instance
let scraperInstance: Scraper | null = null;

/**
 * Get or create a scraper instance
 */
export async function getScraper(): Promise<Scraper> {
  if (!scraperInstance) {
    scraperInstance = new Scraper();
  }
  return scraperInstance;
}

/**
 * Get a single tweet by ID using the scraper
 * This works without authentication
 */
export async function getTweetById(tweetId: string): Promise<TweetData | null> {
  try {
    const scraper = await getScraper();
    const tweet = await scraper.getTweet(tweetId);

    if (!tweet) {
      return null;
    }

    return mapScraperTweet(tweet);
  } catch (error) {
    console.error('Failed to get tweet:', error);
    return null;
  }
}

/**
 * Map twitter-scraper Tweet to our TweetData interface
 */
function mapScraperTweet(tweet: {
  id?: string;
  text?: string;
  timeParsed?: Date;
  username?: string;
  name?: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  photos?: Array<{ url?: string }>;
  videos?: Array<{ url?: string }>;
  hashtags?: string[];
  urls?: string[];
  mentions?: Array<{ username?: string }>;
}): TweetData {
  return {
    id: tweet.id || '',
    text: tweet.text || '',
    created_at: tweet.timeParsed?.toISOString(),
    user: tweet.username
      ? {
          name: tweet.name || tweet.username,
          screen_name: tweet.username,
        }
      : undefined,
    favorite_count: tweet.likes,
    retweet_count: tweet.retweets,
    reply_count: tweet.replies,
    media: [
      ...(tweet.photos?.map((p) => ({
        type: 'photo',
        url: p.url || '',
      })) || []),
      ...(tweet.videos?.map((v) => ({
        type: 'video',
        url: v.url || '',
      })) || []),
    ],
    entities: {
      hashtags: tweet.hashtags?.map((h) => ({ text: h })),
      urls: tweet.urls?.map((u) => ({ expanded_url: u })),
      user_mentions: tweet.mentions?.map((m) => ({
        screen_name: m.username || '',
      })),
    },
  };
}
