# AI-SmartBook-R1-PR4 Active Dispatch Issues

> Dispatch issued from `docs/ops/AI-SmartBook-R1-PR4-task-dispatch.md`.
>
> Repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Branch: `docs/pr4-main-architecture-sqlite-policy`
>
> Reference repo: `b827262-cell/ai_tutor_helper_OAUTH`

---

## Active Issue Dispatch Board

| Phase | Issue | Assigned agent role | Status |
| --- | --- | --- | --- |
| P0 | [#7 [PR4][P0] Backend SQLite-Compatible Fallback](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/7) | OpenClaw backend agent or Codex coding agent | Open |
| P1 | [#8 [PR4][P1] SmartBook Category Display Repair](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/8) | Frontend agent, Claude Code, OpenClaw frontend agent, or Codex coding agent | Open |
| P2 | [#9 [PR4][P2] Read-Only Verification](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/9) | Codex CLI, AGY, Gemini verification agent, or read-only reviewer | Open |
| Final | [#10 [PR4][Final] AGY Final Acceptance Review](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/10) | AGY final reviewer or senior verification agent | Open |

---

## Dispatch Order

1. Start #7 P0 first.
2. Start #8 P1 after or in parallel only if it does not overlap backend changes.
3. Run #9 P2 after #7 or #8 changes are available.
4. Run #10 Final review only after #7, #8, and #9 are complete.

---

## Required Completion Rule

Every assigned agent must finish with a Traditional Chinese termination report that includes:

- success
- failure
- blocker
- permission-halt

The full workflow policy remains defined in:

- `docs/ops/AI-SmartBook-R1-PR4-agent-workflow.md`
- `docs/ops/AI-SmartBook-R1-PR4-task-dispatch.md`
