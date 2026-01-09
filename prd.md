# X-Draft Development Roadmap

A drafting command line tool for X (Twitter) to create tweets that perform well.

## Overview

X-Draft helps users create high-performing tweets by analyzing successful content patterns and generating drafts using multiple AI models. The tool mimics user writing style while incorporating viral tweet characteristics.

### Core Value Proposition

- **Content Analysis**: Study patterns from popular tweets to understand what performs well
- **Multi-Model Generation**: Generate drafts using Claude Opus 4.5 and Gemini 2.5 Pro with varied prompts
- **Style Preservation**: Maintain user's authentic voice while improving engagement potential

### Target Use Cases

1. **Content Creators**: Writers seeking to improve tweet engagement
2. **Thought Leaders**: Professionals sharing insights who want broader reach
3. **Marketers**: Teams creating social content at scale

---

## Phase 1: Project Foundation (001)

Core infrastructure and CLI setup.

| Task | Summary                                     |
| ---- | ------------------------------------------- |
| 001  | Project Bootstrap - CLI, TypeScript, ESLint |

### 001: Project Bootstrap

- Initialize TypeScript project with ESLint and Prettier
- Set up CLI framework (Commander.js or similar)
- Create basic project structure (`src/cli`, `src/lib`, `src/types`)
- Add build and dev scripts
- Use dotenv to load API keys from `.env.local`
- Add utility functions to read markdown files from `data/user-tweets/` and `data/popular-tweets/`

**Acceptance Criteria:**

- `npm run build` compiles without errors
- `npm run lint` passes with no errors
- CLI entry point runs: `npx tsx src/cli/index.ts --help` shows help
- Environment variables load from `.env.local`
- `readTweets('data/user-tweets/')` returns array of tweet strings
- `readTweets('data/popular-tweets/')` returns array of tweet strings

**Tests:**

- [ ] `npm run build` exits with code 0
- [ ] `npm run lint` exits with code 0
- [ ] CLI `--help` displays usage information
- [ ] Reading tweets from folder with 2+ markdown files returns correct count
- [ ] Reading tweets from empty folder returns empty array

---

## Phase 2: Draft Generation (002-005)

Multi-model draft creation with varied prompts.

| Task | Summary                                        |
| ---- | ---------------------------------------------- |
| 002  | Claude Integration - Opus 4.5 API setup        |
| 003  | Gemini Integration - 2.5 Pro API setup         |
| 004  | Prompt Templates - Multiple generation styles  |
| 005  | Draft Generation CLI - Generate drafts command |

### 002: Claude Integration

- Set up Anthropic SDK for Claude Opus 4.5
- Create wrapper function for tweet generation
- Handle API errors and rate limiting
- Add retry logic with exponential backoff

**Acceptance Criteria:**

- `generateWithClaude(prompt, systemPrompt)` returns generated text
- Function handles API errors gracefully (returns error message, doesn't crash)
- Retry logic attempts up to 3 times on transient failures

**Tests:**

- [ ] `generateWithClaude()` returns non-empty string with valid API key
- [ ] Function returns error message when API key is invalid
- [ ] Function handles rate limit errors without crashing

### 003: Gemini Integration

- Set up Google AI SDK for Gemini 2.5 Pro
- Create wrapper function matching Claude interface
- Handle API errors and rate limiting
- Ensure consistent output format between models

**Acceptance Criteria:**

- `generateWithGemini(prompt, systemPrompt)` returns generated text
- Function signature matches Claude wrapper for consistency
- Function handles API errors gracefully

**Tests:**

- [ ] `generateWithGemini()` returns non-empty string with valid API key
- [ ] Function returns error message when API key is invalid
- [ ] Both Claude and Gemini wrappers have identical function signatures

### 004: Prompt Templates

- Design base system prompt for tweet generation
- Create 3-5 distinct prompt variations:
  - **Direct**: Straightforward, information-focused
  - **Engaging**: Hook-focused, curiosity-driven
  - **Conversational**: Casual, relatable tone
  - **Controversial**: Hot takes, opinion-driven
  - **Story**: Narrative-based, personal angle
- Include user tweet examples in prompts for style mimicking
- Include popular tweets for pattern learning

**Acceptance Criteria:**

- `getPromptStyles()` returns array of available style names
- `buildPrompt(style, topic, userTweets, popularTweets)` returns formatted prompt
- Each style produces distinctly different prompts
- User tweets and popular tweets are incorporated into prompts

**Tests:**

- [ ] `getPromptStyles()` returns at least 3 styles
- [ ] `buildPrompt()` includes the topic in the output
- [ ] `buildPrompt()` includes user tweet examples when provided
- [ ] `buildPrompt()` includes popular tweet examples when provided
- [ ] Different styles produce different system prompts

### 005: Draft Generation CLI

- Create `draft` command with topic/idea input
- Generate drafts using all model + prompt combinations
- Output all generated drafts to console
- Support `--models` flag to select specific models
- Support `--styles` flag to select specific prompt styles

**Acceptance Criteria:**

- `npx tsx src/cli/index.ts draft "topic"` generates and displays drafts
- By default, generates drafts for all model + style combinations (2 models × 5 styles = 10 drafts)
- `--models claude` generates only Claude drafts
- `--models gemini` generates only Gemini drafts
- `--styles direct,engaging` generates only specified styles
- Output clearly labels each draft with model and style used

**Tests:**

- [ ] `draft "test topic"` outputs at least one draft
- [ ] `draft "test topic" --models claude` only uses Claude model
- [ ] `draft "test topic" --models gemini` only uses Gemini model
- [ ] `draft "test topic" --styles direct` only uses direct style
- [ ] Each draft output includes model name and style name
- [ ] `draft` without topic shows error message

---

## Future Enhancements (Backlog)

| Task | Summary                                               |
| ---- | ----------------------------------------------------- |
| F01  | Draft Review System - LLM-as-evaluator scoring        |
| F02  | Review CLI - Review and rank drafts                   |
| F03  | Best Pick Selection - Automated top pick logic        |
| F04  | Draft Export - Copy to clipboard/file                 |
| F05  | Workflow Command - Combined generate+review           |
| F06  | History and Iteration - Track draft versions          |
| F07  | X API Integration - Fetch user's actual tweet metrics |
| F08  | Thread Support - Multi-tweet thread generation        |
| F09  | GUI Interface - Web-based draft management            |

---

## Technical Architecture

### Directory Structure

```
x-draft/
├── src/
│   ├── cli/
│   │   ├── commands/       # CLI command implementations
│   │   └── index.ts        # CLI entry point
│   ├── lib/
│   │   ├── models/         # Model integrations (Claude, Gemini)
│   │   └── prompts/        # Prompt templates
│   └── types/              # TypeScript type definitions
├── data/
│   ├── user-tweets/        # User's tweet examples (markdown files)
│   └── popular-tweets/     # Popular tweet examples (markdown files)
├── tasks/                  # Task planning documents
└── reference/              # Project documentation
```

### Markdown Tweet Format

Each tweet is stored as a plain text markdown file:

```markdown
I think my CC "supervisor agent" is stuck.
Because my main Claude video agent is stuck.
Because of Gemini 2.5 Flash rate limit...
```

### Key Types

```typescript
interface Draft {
  text: string;
  topic: string;
  model: "claude-opus-4.5" | "gemini-2.5-pro";
  promptStyle:
    | "direct"
    | "engaging"
    | "conversational"
    | "controversial"
    | "story";
}
```

### Model Configuration

```typescript
const MODEL_REGISTRY = {
  "claude-opus-4.5": {
    provider: "anthropic",
    modelId: "claude-opus-4-5-20251101",
    maxTokens: 1024,
  },
  "gemini-2.5-pro": {
    provider: "google",
    modelId: "gemini-2.5-pro",
    maxTokens: 1024,
  },
};
```
