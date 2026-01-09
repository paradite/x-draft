# Ralph Agent Instructions

## Your Task

1. Read `prd.md`
2. Read `progress.md`
   (check Codebase Patterns first)
3. Pick highest priority task that is still not completed
4. Implement that ONE task
5. Run typecheck and tests
6. Commit: `feat: [ID] - [Title]`
7. Update prd.md to indicate it is completed
8. Append learnings to `progress.md`

## Progress Format

APPEND to `progress.md`:

## [Date] - [Task ID]

- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered
  - Gotchas encountered

---

## Codebase Patterns

Add reusable patterns to the TOP
of `progress.txt`:

## Stop Condition

If ALL stories are completed, reply:
<promise>COMPLETE</promise>

Otherwise end normally.
