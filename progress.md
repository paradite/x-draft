## Codebase Patterns

- **ESM Modules**: Project uses ES modules (`"type": "module"` in package.json)
- **File Reading**: Use `fs/promises` for async file operations
- **Tweet Storage**: Tweets stored as plain markdown files, one tweet per file
- **Config Loading**: dotenv loads from `.env.local` in project root
- **Testing**: vitest with inline tests (`.test.ts` alongside source files)
- **Model Integration**: Model wrappers go in `src/lib/models/` with matching test files
- **Error Handling**: Return error message strings instead of throwing for graceful degradation
- **Retry Logic**: Use exponential backoff for transient API errors (429, 5xx)

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
