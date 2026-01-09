# Ralph Agent Instructions

## Your Task

1. Read `prd.md`
2. Read `progress.md`
   (check Codebase Patterns first)
3. Pick the next task that has status "Not Started"
4. Implement that ONE task
5. Run typecheck and tests
6. Commit: `feat: [ID] - [Title]`
7. Update `prd.md` to indicate the task status as "Completed"
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

If ALL tasks are completed, reply:
<promise>ALL TASKS TESTED AND PASS ACCEPTANCE CRITERIA. ALL COMPLETED.</promise>

Otherwise end normally.
