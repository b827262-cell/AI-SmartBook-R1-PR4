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
| P0.5 | [#11 [PR4][P0.5] Reference Feature Gap Analysis from ai_tutor_helper](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/11) | Read-only comparison agent, Codex CLI, AGY, Gemini verification agent, or senior reviewer | Open |
| P1 | [#8 [PR4][P1] SmartBook Category Display Repair](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/8) | Frontend agent, Claude Code, OpenClaw frontend agent, or Codex coding agent | Open |
| P2 | [#9 [PR4][P2] Read-Only Verification](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/9) | Codex CLI, AGY, Gemini verification agent, or read-only reviewer | Open |
| Final | [#10 [PR4][Final] AGY Final Acceptance Review](https://github.com/b827262-cell/AI-SmartBook-R1-PR4/issues/10) | AGY final reviewer or senior verification agent | Open |

---

## Dispatch Order

1. Start #11 P0.5 comparison first if the goal is to compare `ai_tutor_helper` web design, SmartBook UI, intelligent book, reader, category, note, progress, and AI helper features before implementation.
2. Start #7 P0 backend fallback if backend SmartBook pages still have optional-table runtime errors.
3. Start #8 P1 after #11 identifies safe UI/category display items, or in parallel only if it does not overlap backend changes.
4. Run #9 P2 after #7 or #8 changes are available.
5. Run #10 Final review only after #7, #8, #9, and #11 are complete or explicitly deferred.

---

## Purpose of P0.5 Comparison

P0.5 exists to compare the current `AI-SmartBook-R1-PR4` project against the reference `ai_tutor_helper` implementation before porting anything.

The comparison should identify:

- Which web design and page appearance ideas are useful.
- Which SmartBook / intelligent book features are missing in PR4.
- Which reader, note, progress, category, and AI helper features can be safely added later.
- Which features require separate approval.
- Which features must not be added in the SQLite policy branch.

P0.5 must remain read-only planning unless a later implementation issue is explicitly approved.

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
