# X-Draft Development Roadmap

A drafting command line tool for X (Twitter) to create tweets that perform well.

## Overview

X-Draft helps users create high-performing tweets by analyzing successful content patterns and generating drafts using multiple AI models. The tool mimics user writing style while incorporating viral tweet characteristics, then uses AI evaluation to select the best drafts.

### Core Value Proposition

- **Content Analysis**: Study patterns from popular tweets to understand what performs well
- **Multi-Model Generation**: Generate drafts using Claude Opus 4.5 and Gemini 2.5 Pro with varied prompts
- **AI-Powered Review**: Use LLM-as-evaluator to score and rank drafts objectively
- **Style Preservation**: Maintain user's authentic voice while improving engagement potential

### Target Use Cases

1. **Content Creators**: Writers seeking to improve tweet engagement
2. **Thought Leaders**: Professionals sharing insights who want broader reach
3. **Marketers**: Teams creating social content at scale

---

## Phase 1: Project Foundation (001-003)

Core infrastructure and CLI setup.

| Task | Summary                                      |
| ---- | -------------------------------------------- |
| 001  | Project Bootstrap - CLI, TypeScript, ESLint  |
| 002  | Configuration System - API keys, settings    |
| 003  | Data Storage - Local JSON storage for tweets |

### 001: Project Bootstrap

- Initialize TypeScript project with ESLint and Prettier
- Set up CLI framework (Commander.js or similar)
- Create basic project structure (`src/cli`, `src/lib`, `src/types`)
- Add build and dev scripts
- Set up environment variable handling for API keys

### 002: Configuration System

- Create config file structure (`~/.x-draft/config.json`)
- Store API keys for Claude, Gemini, and X API (optional)
- Add `config set` and `config get` CLI commands
- Support environment variable overrides

### 003: Data Storage

- Design storage schema for tweets (user tweets, reference tweets)
- Create `data/` directory structure for local JSON storage
- Add utility functions for reading/writing tweet data
- Support import from JSON/CSV formats

---

## Phase 2: Tweet Collection (004-006)

Manual and optional automated tweet collection.

| Task | Summary                                          |
| ---- | ------------------------------------------------ |
| 004  | Manual Tweet Import - JSON/CSV input             |
| 005  | User Tweet Storage - Store user's own tweets     |
| 006  | Reference Tweet Storage - Popular tweet examples |

### 004: Manual Tweet Import

- Create `import` CLI command for bulk tweet import
- Support JSON format with tweet text, metrics, and metadata
- Support CSV format for simple text-only import
- Validate imported data structure

### 005: User Tweet Storage

- Create `tweets add` command for adding user's own tweets
- Store with metadata: text, date, engagement metrics (optional)
- Create `tweets list` command to view stored tweets
- Add `tweets delete` command for cleanup

### 006: Reference Tweet Storage

- Create `reference add` command for popular tweet examples
- Store tweets categorized by topic/style
- Create `reference list` command with filtering
- Support tagging for organization (e.g., "tech", "humor", "thread")

---

## Phase 3: Draft Generation (007-010)

Multi-model draft creation with varied prompts.

| Task | Summary                                        |
| ---- | ---------------------------------------------- |
| 007  | Claude Integration - Opus 4.5 API setup        |
| 008  | Gemini Integration - 2.5 Pro API setup         |
| 009  | Prompt Templates - Multiple generation styles  |
| 010  | Draft Generation CLI - Generate drafts command |

### 007: Claude Integration

- Set up Anthropic SDK for Claude Opus 4.5
- Create wrapper function for tweet generation
- Handle API errors and rate limiting
- Add retry logic with exponential backoff

### 008: Gemini Integration

- Set up Google AI SDK for Gemini 2.5 Pro
- Create wrapper function matching Claude interface
- Handle API errors and rate limiting
- Ensure consistent output format between models

### 009: Prompt Templates

- Design base system prompt for tweet generation
- Create 3-5 distinct prompt variations:
  - **Direct**: Straightforward, information-focused
  - **Engaging**: Hook-focused, curiosity-driven
  - **Conversational**: Casual, relatable tone
  - **Controversial**: Hot takes, opinion-driven
  - **Story**: Narrative-based, personal angle
- Include user tweet examples in prompts for style mimicking
- Include reference tweets for pattern learning

### 010: Draft Generation CLI

- Create `draft` command with topic/idea input
- Generate drafts using all model + prompt combinations
- Store drafts with metadata (model, prompt style, timestamp)
- Output preview of generated drafts
- Support `--models` flag to select specific models
- Support `--styles` flag to select specific prompt styles

---

## Phase 4: Draft Review System (011-014)

AI-powered evaluation and ranking.

| Task | Summary                                        |
| ---- | ---------------------------------------------- |
| 011  | Review Criteria Definition - Scoring rubric    |
| 012  | LLM Evaluator - Model-based draft scoring      |
| 013  | Review CLI - Review and rank drafts            |
| 014  | Best Pick Selection - Automated top pick logic |

### 011: Review Criteria Definition

- Define scoring criteria (1-10 scale):
  - **Hook Strength**: Does the first line grab attention?
  - **Clarity**: Is the message clear and concise?
  - **Engagement Potential**: Would people reply/retweet?
  - **Authenticity**: Does it match user's voice?
  - **Brevity**: Is it appropriately concise for X?
- Create weighted scoring formula
- Document criteria in prompts for evaluator

### 012: LLM Evaluator

- Create evaluation prompt with rubric and reference tweets
- Use Claude for evaluation (cross-model evaluation)
- Return structured scores per criterion
- Include reasoning/explanation for scores
- Handle edge cases (too long, off-topic, etc.)

### 013: Review CLI

- Create `review` command to evaluate pending drafts
- Display scores in table format
- Sort by total score or specific criteria
- Support `--criteria` flag to weight specific aspects
- Store review results with drafts

### 014: Best Pick Selection

- Implement top-pick selection algorithm
- Consider score variance across criteria
- Flag drafts with polarized scores (high hook, low clarity)
- Create `review --top N` to show top N drafts
- Add `review --pick` to select and export best draft

---

## Phase 5: Workflow Integration (015-017)

End-to-end workflow and export.

| Task | Summary                                      |
| ---- | -------------------------------------------- |
| 015  | Draft Export - Copy to clipboard/file        |
| 016  | Workflow Command - Combined generate+review  |
| 017  | History and Iteration - Track draft versions |

### 015: Draft Export

- Add `export` command to copy selected draft to clipboard
- Support file export for batch workflows
- Include draft metadata in export (scores, model used)
- Format for easy paste into X composer

### 016: Workflow Command

- Create `create` command combining draft + review steps
- Single command: topic → drafts → review → top picks
- Interactive mode to select from top picks
- Support `--auto` flag to automatically select best
- Streamlined output for quick iteration

### 017: History and Iteration

- Store all generated drafts with timestamps
- Create `history` command to view past sessions
- Support `regenerate` to create more drafts for a topic
- Track which drafts were exported/used
- Add `history clear` for cleanup

---

## Future Enhancements (Backlog)

| Task | Summary                                               |
| ---- | ----------------------------------------------------- |
| F01  | X API Integration - Fetch user's actual tweet metrics |
| F02  | Thread Support - Multi-tweet thread generation        |
| F03  | Scheduling Integration - Queue drafts for posting     |
| F04  | A/B Testing Tracking - Track performance of variants  |
| F05  | GUI Interface - Web-based draft management            |
| F06  | Custom Model Support - Add new models easily          |
| F07  | Prompt Tuning - Learn from user feedback on drafts    |

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
│   │   ├── prompts/        # Prompt templates
│   │   ├── storage/        # Data persistence
│   │   └── review/         # Evaluation logic
│   └── types/              # TypeScript type definitions
├── data/                   # Local data storage
│   ├── user-tweets/        # User's tweet examples
│   ├── references/         # Popular tweet examples
│   └── drafts/             # Generated drafts
├── tasks/                  # Task planning documents
└── reference/              # Project documentation
```

### Key Types

```typescript
interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
  tags?: string[];
}

interface Draft {
  id: string;
  text: string;
  topic: string;
  model: "claude-opus-4.5" | "gemini-2.5-pro";
  promptStyle:
    | "direct"
    | "engaging"
    | "conversational"
    | "controversial"
    | "story";
  createdAt: string;
  review?: ReviewResult;
}

interface ReviewResult {
  scores: {
    hookStrength: number;
    clarity: number;
    engagementPotential: number;
    authenticity: number;
    brevity: number;
  };
  totalScore: number;
  reasoning: string;
  evaluatedAt: string;
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
