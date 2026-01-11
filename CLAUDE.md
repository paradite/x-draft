# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

X-Draft is a CLI tool for generating high-performing tweet drafts using Claude Opus 4.5 and Gemini 2.5 Pro. It analyzes user writing style and popular tweet patterns to create drafts across 5 distinct styles.

## Commands

```bash
# Build and type check
npm run build          # Compile TypeScript to dist/
npm run typecheck      # Type check without emitting

# Development
npm run dev            # Watch mode with tsx

# Testing
npm run test           # Run all tests once
npm run test:watch     # Run tests in watch mode

# Linting
npm run lint           # Check for lint errors
npm run lint:fix       # Auto-fix lint errors
npm run format         # Format with Prettier

# CLI usage (development)
npx tsx src/cli/index.ts draft "topic" [--models claude,gemini] [--styles direct,engaging,...]
```

## Architecture

```
src/
├── cli/
│   ├── index.ts              # CLI entry point, loads .env.local
│   └── commands/
│       └── draft.ts          # Draft generation command
├── lib/
│   ├── config.ts             # API key loading
│   ├── tweets.ts             # Tweet file reading utility
│   ├── models/
│   │   ├── claude.ts         # Claude wrapper with retry logic
│   │   └── gemini.ts         # Gemini wrapper with retry logic
│   └── prompts/
│       └── templates.ts      # 5 prompt style templates
└── types/
    └── index.ts              # Shared types (ModelName, PromptStyle, Draft)

data/
├── user-tweets/              # User's tweet examples (markdown files)
└── popular-tweets/           # Popular tweet patterns (markdown files)
```

## Key Patterns

- **ES Modules**: Project uses `"type": "module"` - use ES import/export syntax
- **Model wrappers**: Both `generateWithClaude` and `generateWithGemini` have identical signatures: `(prompt: string, systemPrompt: string) => Promise<string>`. Return error strings instead of throwing.
- **Tests**: Place `.test.ts` files alongside source files. Skip tests gracefully when API keys unavailable. Gemini tests need 30s timeouts.
- **Tweet storage**: Plain markdown files, one tweet per file
- **Error handling**: Return error message strings for graceful degradation, don't throw
- **Retry logic**: Exponential backoff for transient API errors (429, 5xx)

## Environment Setup

Create `.env.local` with:
```
ANTHROPIC_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## The Ralph Loop

The Ralph Loop is an iterative task execution workflow for AI agents to systematically implement features. It ensures consistent progress tracking, knowledge accumulation, and one-task-at-a-time focus.

This project was built during the livestream [Testing Ralph Loop with Claude Code](https://www.youtube.com/watch?v=Ps-zw755f8M) (1:28:10) by 16x Engineer, which covers:
- What is the Ralph Loop (8:21)
- Key components of a proper Ralph Loop (15:11)
- Why existing Ralph Loop implementations are flawed (19:17)

### Key Components

| File | Purpose |
|------|---------|
| `ralph.sh` | Runner script - executes the loop with Claude CLI |
| `PROMPT.md` | Workflow instructions - defines the loop steps and formats |
| `prd.md` | Task definitions with acceptance criteria and status tracking |
| `progress.md` | Living knowledge base - patterns (top) + implementation history (append) |

### Running the Loop

```bash
./ralph.sh [max_iterations]  # Default: 10 iterations
```

The script:
1. Pipes `PROMPT.md` to `claude -p --dangerously-skip-permissions`
2. Checks output for the completion signal (`<promise>ALL TASKS TESTED...</promise>`)
3. Exits early if all tasks complete, otherwise continues to next iteration
4. Logs progress to stderr and tracks in `progress.md`

### Workflow Steps

1. **Read requirements** - Check `prd.md` for task definitions and acceptance criteria
2. **Check patterns** - Read the "Codebase Patterns" section at the top of `progress.md` first
3. **Pick next task** - Select the next task with status "Not Started"
4. **Implement ONE task** - Focus on a single task to completion
5. **Validate** - Run `npm run typecheck && npm run test`
6. **Commit** - Use format: `feat: [ID] - [Title]` (e.g., `feat: 005 - Draft Generation CLI`)
7. **Update prd.md** - Change task status to "Completed"
8. **Document learnings** - Append implementation notes to `progress.md`

### Progress Documentation Format

When appending to `progress.md`, use this format:

```markdown
## [Date] - [Task ID]: [Title]

- What was implemented:
  - Feature 1
  - Feature 2

- Files changed:
  - path/to/file.ts (new/modified)

- **Learnings:**
  - Patterns discovered
  - Gotchas encountered
```

### Codebase Patterns

Reusable patterns discovered during implementation are added to the TOP of `progress.md`. These serve as conventions for future tasks:
- Module patterns (ES modules, file operations)
- Testing conventions (vitest, timeouts, mocking)
- Error handling approaches
- SDK-specific quirks

### Stop Condition

When ALL tasks in `prd.md` are completed, respond with:
```
<promise>ALL TASKS TESTED AND PASS ACCEPTANCE CRITERIA. ALL COMPLETED.</promise>
```

## Key Files

- `ralph.sh` - Runner script that executes the Ralph Loop
- `PROMPT.md` - Ralph Loop workflow instructions
- `prd.md` - Product requirements with task status (`[Not Started]`, `[Completed]`)
- `progress.md` - Codebase patterns (top) and implementation history (chronological)
- `backlog.md` - Future enhancements (F01-F09)
