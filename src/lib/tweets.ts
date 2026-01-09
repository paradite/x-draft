import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Reads all tweets from markdown files in a directory.
 * Each markdown file should contain a single tweet as plain text.
 *
 * @param dirPath - Path to the directory containing tweet markdown files
 * @returns Array of tweet strings
 */
export async function readTweets(dirPath: string): Promise<string[]> {
  try {
    const files = await readdir(dirPath);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    const tweets: string[] = [];

    for (const file of mdFiles) {
      const filePath = join(dirPath, file);
      const content = await readFile(filePath, 'utf-8');
      const trimmedContent = content.trim();
      if (trimmedContent) {
        tweets.push(trimmedContent);
      }
    }

    return tweets;
  } catch (error) {
    // If directory doesn't exist or can't be read, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
