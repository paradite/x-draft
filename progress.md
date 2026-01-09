## Codebase Patterns

- **ESM Modules**: Project uses ES modules (`"type": "module"` in package.json)
- **File Reading**: Use `fs/promises` for async file operations
- **Tweet Storage**: Tweets stored as plain markdown files, one tweet per file
- **Config Loading**: dotenv loads from `.env.local` in project root
- **Testing**: vitest with inline tests (`.test.ts` alongside source files)

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
