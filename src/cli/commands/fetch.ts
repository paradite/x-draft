import { Command } from 'commander';
import {
  fetchTweetByUrl,
  formatTweetForDisplay,
  getTweetById,
} from '../../lib/tweets/index.js';

interface FetchOptions {
  id?: string;
  json?: boolean;
}

/**
 * Fetch a single tweet by URL
 */
async function fetchByUrl(url: string, showJson: boolean): Promise<void> {
  console.log(`\nFetching tweet from: ${url}\n`);

  const tweet = await fetchTweetByUrl(url);

  if (tweet) {
    console.log(formatTweetForDisplay(tweet));
    if (showJson) {
      console.log('\n--- Raw JSON ---');
      console.log(JSON.stringify(tweet, null, 2));
    }
  } else {
    console.error(
      'Failed to fetch tweet. It may be protected, deleted, or the URL is invalid.'
    );
  }
}

/**
 * Fetch a tweet by ID
 */
async function fetchById(id: string, showJson: boolean): Promise<void> {
  console.log(`\nFetching tweet by ID: ${id}\n`);

  // Try syndication API first (faster)
  let tweet = await fetchTweetByUrl(`https://x.com/i/status/${id}`);

  // Fall back to scraper if syndication fails
  if (!tweet) {
    console.log('Syndication API failed, trying scraper...');
    tweet = await getTweetById(id);
  }

  if (tweet) {
    console.log(formatTweetForDisplay(tweet));
    if (showJson) {
      console.log('\n--- Raw JSON ---');
      console.log(JSON.stringify(tweet, null, 2));
    }
  } else {
    console.error('Failed to fetch tweet.');
  }
}

/**
 * Main fetch action
 */
async function fetchAction(
  urlOrId: string | undefined,
  options: FetchOptions
): Promise<void> {
  const showJson = options.json ?? false;

  if (options.id) {
    await fetchById(options.id, showJson);
  } else if (urlOrId) {
    if (urlOrId.startsWith('http')) {
      await fetchByUrl(urlOrId, showJson);
    } else if (/^\d+$/.test(urlOrId)) {
      await fetchById(urlOrId, showJson);
    } else {
      console.error('Invalid input. Please provide a tweet URL or numeric ID.');
      console.log('\nExamples:');
      console.log(
        '  npx tsx src/cli/index.ts fetch https://x.com/user/status/123456789'
      );
      console.log('  npx tsx src/cli/index.ts fetch 123456789');
      console.log('  npx tsx src/cli/index.ts fetch --id 123456789');
    }
  } else {
    console.error('Please provide a tweet URL or ID.');
    console.log('\nUsage:');
    console.log('  x-draft fetch <url>     Fetch tweet by URL');
    console.log('  x-draft fetch <id>      Fetch tweet by numeric ID');
    console.log('  x-draft fetch --id <id> Fetch tweet by ID');
    console.log('\nOptions:');
    console.log('  --json                  Show raw JSON output');
  }
}

/**
 * Creates and configures the fetch command
 */
export function createFetchCommand(): Command {
  const fetchCmd = new Command('fetch')
    .description('Fetch a tweet by URL or ID')
    .argument('[url-or-id]', 'Tweet URL or tweet ID')
    .option('--id <id>', 'Fetch a specific tweet by ID')
    .option('--json', 'Show raw JSON output')
    .action(fetchAction);

  return fetchCmd;
}

export { fetchAction };
