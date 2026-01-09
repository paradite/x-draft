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

### 003: Gemini Integration

- Set up Google AI SDK for Gemini 2.5 Pro
- Create wrapper function matching Claude interface
- Handle API errors and rate limiting
- Ensure consistent output format between models

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

### 005: Draft Generation CLI

- Create `draft` command with topic/idea input
- Generate drafts using all model + prompt combinations
- Output all generated drafts to console
- Support `--models` flag to select specific models
- Support `--styles` flag to select specific prompt styles

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
