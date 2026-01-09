## Codebase Patterns

- **ESM Modules**: Project uses ES modules (`"type": "module"` in package.json)
- **File Reading**: Use `fs/promises` for async file operations
- **Tweet Storage**: Tweets stored as plain markdown files, one tweet per file
- **Config Loading**: dotenv loads from `.env.local` in project root
- **Testing**: vitest with inline tests (`.test.ts` alongside source files)
- **Model Integration**: Model wrappers go in `src/lib/models/` with matching test files
- **Error Handling**: Return error message strings instead of throwing for graceful degradation
- **Retry Logic**: Use exponential backoff for transient API errors (429, 5xx)
- **Google AI SDK**: Use `@google/generative-ai` package with `systemInstruction` for system prompts
- **Test Timeouts**: API calls to AI models may need longer test timeouts (30s for Gemini)

---

## 2026-01-10 - 001: Project Bootstrap

- What was implemented:
  - TypeScript project with package.json, tsconfig.json
  - ESLint and Prettier configuration
  - Commander.js CLI framework with help command
  - Project structure: src/cli, src/lib, src/types, src/lib/models, src/lib/prompts
  - dotenv configuration to load .env.local
  - readTweets() utility function for reading markdown tweet files
  - Vitest test suite for readTweets functionality

- Files changed:
  - package.json (new)
  - tsconfig.json (new)
  - .eslintrc.json (new)
  - .prettierrc (new)
  - src/cli/index.ts (new)
  - src/lib/config.ts (new)
  - src/lib/tweets.ts (new)
  - src/lib/tweets.test.ts (new)
  - src/types/index.ts (new)

- **Learnings:**
  - Commander.js requires minimal setup for basic CLI functionality
  - Vitest works out of the box with TypeScript and ESM
  - readdir + filter for .md files is clean approach for reading tweet folders
  - Returning empty array for ENOENT errors makes the utility more robust

---

## 2026-01-10 - 002: Claude Integration

- What was implemented:
  - Installed @anthropic-ai/sdk dependency
  - Created `generateWithClaude(prompt, systemPrompt)` wrapper function
  - Added retry logic with exponential backoff (3 retries, 1s/2s/4s delays)
  - Handles API errors gracefully (401 invalid key, 429 rate limit, 5xx server errors)
  - Test suite covering valid key, invalid key, and error handling scenarios

- Files changed:
  - package.json (modified - added @anthropic-ai/sdk)
  - package-lock.json (modified)
  - src/lib/models/claude.ts (new)
  - src/lib/models/claude.test.ts (new)

- **Learnings:**
  - Anthropic SDK provides typed error classes (Anthropic.APIError) with status codes
  - Using `response.content.find()` is cleaner than indexing for extracting text
  - Returning error strings (not throwing) allows callers to handle errors without try/catch
  - Tests can conditionally skip if API key isn't available for CI environments

---

## 2026-01-10 - 003: Gemini Integration

- What was implemented:
  - Installed @google/generative-ai dependency
  - Created `generateWithGemini(prompt, systemPrompt)` wrapper function with identical signature to Claude
  - Added retry logic with exponential backoff (3 retries, 1s/2s/4s delays)
  - Handles API errors gracefully (invalid key, rate limit, server errors)
  - Test suite covering valid key, invalid key, error handling, and function signature consistency

- Files changed:
  - package.json (modified - added @google/generative-ai)
  - package-lock.json (modified)
  - src/lib/models/gemini.ts (new)
  - src/lib/models/gemini.test.ts (new)

- **Learnings:**
  - Google AI SDK uses `GoogleGenerativeAIError` but error handling differs from Anthropic (message parsing vs status codes)
  - System prompts in Gemini use `systemInstruction` in model config, not a separate parameter
  - Gemini API calls can be slower than Claude, requiring longer test timeouts (30s vs 5s default)
  - String-based error detection (message.includes()) needed for Google SDK vs typed status codes in Anthropic SDK

---
