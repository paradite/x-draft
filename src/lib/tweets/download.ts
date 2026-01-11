/**
 * Tweet download utilities
 * Supports fetching tweets by URL and searching by keyword
 */

export interface TweetData {
  id: string;
  text: string;
  created_at?: string;
  user?: {
    name: string;
    screen_name: string;
    profile_image_url?: string;
  };
  favorite_count?: number;
  retweet_count?: number;
  reply_count?: number;
  media?: Array<{
    type: string;
    url: string;
  }>;
  lang?: string;
  entities?: {
    hashtags?: Array<{ text: string }>;
    urls?: Array<{ expanded_url: string }>;
    user_mentions?: Array<{ screen_name: string }>;
  };
}

/**
 * Extract tweet ID from a Twitter/X URL
 * Supports formats:
 * - https://twitter.com/user/status/123456789
 * - https://x.com/user/status/123456789
 * - https://mobile.twitter.com/user/status/123456789
 */
export function extractTweetId(url: string): string | null {
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i,
    /(?:mobile\.twitter\.com)\/\w+\/status\/(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch a tweet using Twitter's syndication API (no authentication required)
 * This API is used for Twitter embeds and is publicly accessible
 */
export async function fetchTweetBySyndication(
  tweetId: string
): Promise<TweetData | null> {
  const token = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${token}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(
        `Syndication API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    // Map syndication response to our TweetData interface
    return mapSyndicationResponse(data);
  } catch (error) {
    console.error('Error fetching tweet via syndication:', error);
    return null;
  }
}

/**
 * Map Twitter syndication API response to TweetData
 */
function mapSyndicationResponse(data: Record<string, unknown>): TweetData {
  const user = data.user as Record<string, unknown> | undefined;
  const entities = data.entities as Record<string, unknown> | undefined;
  const mediaDetails = data.mediaDetails as
    | Array<Record<string, unknown>>
    | undefined;

  return {
    id: String(data.id_str || data.id || ''),
    text: String(data.text || ''),
    created_at: data.created_at as string | undefined,
    user: user
      ? {
          name: String(user.name || ''),
          screen_name: String(user.screen_name || ''),
          profile_image_url: user.profile_image_url_https as string | undefined,
        }
      : undefined,
    favorite_count: data.favorite_count as number | undefined,
    retweet_count: data.retweet_count as number | undefined,
    reply_count: data.reply_count as number | undefined,
    lang: data.lang as string | undefined,
    media: mediaDetails?.map((m) => ({
      type: String(m.type || ''),
      url: String(m.media_url_https || m.url || ''),
    })),
    entities: entities
      ? {
          hashtags: (
            entities.hashtags as Array<{ text: string }> | undefined
          )?.map((h) => ({
            text: h.text,
          })),
          urls: (
            entities.urls as Array<{ expanded_url: string }> | undefined
          )?.map((u) => ({
            expanded_url: u.expanded_url,
          })),
          user_mentions: (
            entities.user_mentions as
              | Array<{ screen_name: string }>
              | undefined
          )?.map((m) => ({
            screen_name: m.screen_name,
          })),
        }
      : undefined,
  };
}

/**
 * Fetch a tweet by its URL
 */
export async function fetchTweetByUrl(url: string): Promise<TweetData | null> {
  const tweetId = extractTweetId(url);

  if (!tweetId) {
    console.error('Could not extract tweet ID from URL:', url);
    return null;
  }

  return fetchTweetBySyndication(tweetId);
}

/**
 * Format tweet data for display
 */
export function formatTweetForDisplay(tweet: TweetData): string {
  const lines: string[] = [];

  if (tweet.user) {
    lines.push(`@${tweet.user.screen_name} (${tweet.user.name})`);
    lines.push('─'.repeat(50));
  }

  lines.push(tweet.text);

  if (tweet.created_at) {
    lines.push('');
    lines.push(`Posted: ${new Date(tweet.created_at).toLocaleString()}`);
  }

  const stats: string[] = [];
  if (tweet.favorite_count !== undefined) {
    stats.push(`${tweet.favorite_count} likes`);
  }
  if (tweet.retweet_count !== undefined) {
    stats.push(`${tweet.retweet_count} retweets`);
  }
  if (tweet.reply_count !== undefined) {
    stats.push(`${tweet.reply_count} replies`);
  }

  if (stats.length > 0) {
    lines.push(stats.join(' | '));
  }

  return lines.join('\n');
}
