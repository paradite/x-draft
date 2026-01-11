/**
 * Tweet download utilities
 *
 * Available methods (no authentication required):
 *
 * 1. SYNDICATION API
 *    - fetchTweetByUrl(url) - Fetch a single tweet by its URL
 *    - fetchTweetBySyndication(id) - Fetch a single tweet by ID
 *
 * 2. TWITTER SCRAPER
 *    - getTweetById(id) - Fetch a single tweet by ID (more detailed stats)
 *
 * LIMITATIONS:
 * - Search by keyword is NOT supported (requires Twitter login)
 * - User timeline fetching is NOT supported (requires Twitter login)
 */

// Syndication API exports
export {
  fetchTweetByUrl,
  fetchTweetBySyndication,
  extractTweetId,
  formatTweetForDisplay,
  type TweetData,
} from './download.js';

// Scraper exports (only methods that work without auth)
export { getTweetById, getScraper } from './scraper.js';
