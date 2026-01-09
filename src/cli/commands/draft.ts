import { Command } from 'commander';
import { resolve } from 'path';
import { ModelName, PromptStyle } from '../../types';
import { generateWithClaude } from '../../lib/models/claude';
import { generateWithGemini } from '../../lib/models/gemini';
import { getPromptStyles, buildPrompt } from '../../lib/prompts/templates';
import { readTweets } from '../../lib/tweets';

type ModelGenerator = (prompt: string, systemPrompt: string) => Promise<string>;

const MODEL_GENERATORS: Record<ModelName, ModelGenerator> = {
  'claude-opus-4.5': generateWithClaude,
  'gemini-2.5-pro': generateWithGemini,
};

const ALL_MODELS: ModelName[] = ['claude-opus-4.5', 'gemini-2.5-pro'];

interface DraftOptions {
  models?: string;
  styles?: string;
}

/**
 * Parses and validates model names from command line option
 */
function parseModels(modelsOption: string | undefined): ModelName[] {
  if (!modelsOption) {
    return ALL_MODELS;
  }

  const requestedModels = modelsOption.split(',').map((m) => m.trim().toLowerCase());
  const validModels: ModelName[] = [];

  for (const model of requestedModels) {
    if (model === 'claude') {
      validModels.push('claude-opus-4.5');
    } else if (model === 'gemini') {
      validModels.push('gemini-2.5-pro');
    } else if (model === 'claude-opus-4.5' || model === 'gemini-2.5-pro') {
      validModels.push(model as ModelName);
    }
  }

  return validModels.length > 0 ? validModels : ALL_MODELS;
}

/**
 * Parses and validates style names from command line option
 */
function parseStyles(stylesOption: string | undefined): PromptStyle[] {
  const allStyles = getPromptStyles();

  if (!stylesOption) {
    return allStyles;
  }

  const requestedStyles = stylesOption.split(',').map((s) => s.trim().toLowerCase());
  const validStyles: PromptStyle[] = [];

  for (const style of requestedStyles) {
    if (allStyles.includes(style as PromptStyle)) {
      validStyles.push(style as PromptStyle);
    }
  }

  return validStyles.length > 0 ? validStyles : allStyles;
}

/**
 * Generates a single draft using the specified model and style
 */
async function generateDraft(
  model: ModelName,
  style: PromptStyle,
  topic: string,
  userTweets: string[],
  popularTweets: string[]
): Promise<{ model: ModelName; style: PromptStyle; draft: string }> {
  const { userPrompt, systemPrompt } = buildPrompt(style, topic, userTweets, popularTweets);
  const generator = MODEL_GENERATORS[model];
  const draft = await generator(userPrompt, systemPrompt);

  return { model, style, draft };
}

/**
 * Main draft generation action
 */
async function draftAction(topic: string, options: DraftOptions): Promise<void> {
  if (!topic || topic.trim() === '') {
    console.error('Error: Topic is required');
    process.exit(1);
  }

  const models = parseModels(options.models);
  const styles = parseStyles(options.styles);

  // Load user and popular tweets
  const userTweetsPath = resolve(process.cwd(), 'data/user-tweets');
  const popularTweetsPath = resolve(process.cwd(), 'data/popular-tweets');

  const [userTweets, popularTweets] = await Promise.all([
    readTweets(userTweetsPath),
    readTweets(popularTweetsPath),
  ]);

  console.log(`\nGenerating drafts for topic: "${topic}"`);
  console.log(`Models: ${models.join(', ')}`);
  console.log(`Styles: ${styles.join(', ')}`);
  console.log(`User tweets loaded: ${userTweets.length}`);
  console.log(`Popular tweets loaded: ${popularTweets.length}`);
  console.log('\n' + '='.repeat(60) + '\n');

  // Generate all drafts
  for (const model of models) {
    for (const style of styles) {
      console.log(`[${model}] [${style}]`);
      console.log('-'.repeat(40));

      const result = await generateDraft(model, style, topic, userTweets, popularTweets);
      console.log(result.draft);
      console.log('\n' + '='.repeat(60) + '\n');
    }
  }
}

/**
 * Creates and configures the draft command
 */
export function createDraftCommand(): Command {
  const draftCmd = new Command('draft')
    .description('Generate tweet drafts for a given topic')
    .argument('<topic>', 'The topic or idea for the tweet')
    .option(
      '-m, --models <models>',
      'Comma-separated list of models to use (claude, gemini)'
    )
    .option(
      '-s, --styles <styles>',
      'Comma-separated list of styles to use (direct, engaging, conversational, controversial, story)'
    )
    .action(draftAction);

  return draftCmd;
}

// Export for testing
export { parseModels, parseStyles, draftAction };
