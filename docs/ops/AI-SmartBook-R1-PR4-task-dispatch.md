# AI-SmartBook-R1-PR4 Task Dispatch Entrypoint

> Dispatch status: READY
>
> Target repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Target branch: `docs/pr4-main-architecture-sqlite-policy`
>
> Reference repo: `b827262-cell/ai_tutor_helper_OAUTH`

---

## 1. Purpose

This document is the task dispatch entrypoint for PR4 agents.

Use it to assign work after the PR4 workflow policy has been reviewed. It does not replace the workflow policy. It points each agent to the correct source document, phase, allowed scope, and final report format.

---

## 2. Canonical Documents Under `docs/ops`

Use these files as the dispatch package:

1. `docs/ops/AI-SmartBook-R1-PR4-agent-workflow.md`
   - Main human-readable workflow policy.
   - Defines the PR4 architecture boundary, SQLite baseline, allowed reference usage, prohibited first-phase changes, phase ownership, agent prompts, verification guardrails, and Traditional Chinese termination report format.

2. `docs/ops/AI-SmartBook-R1-PR4-agent-workflow.schema.json`
   - Machine-checkable workflow schema.
   - Use it for structured validation of agent reports, allowed phases, required fields, and policy guardrails.

3. `docs/ops/AI-SmartBook-R1-PR4-task-dispatch.md`
   - This dispatch entrypoint.
   - Use it to select the next agent task and copy the correct task instructions.

---

## 3. Non-Negotiable Guardrails

All dispatched tasks must preserve the following boundaries:

- PR4 remains based on AI-SmartBook-R1 architecture.
- SQLite remains the first-phase database baseline.
- `b827262-cell/ai_tutor_helper_OAUTH` is read-only reference material only.
- Do not port OAuth into this first-phase branch.
- Do not port TiDB, MySQL, or MySQL-compatible runtime assumptions.
- Do not change `drizzle/schema.ts`.
- Do not add or edit migration files.
- Do not change `docker-compose.yml` for OAuth or database architecture.
- Do not commit secrets, tokens, OAuth client secrets, `.env` values, or API keys.
- Do not refactor PDF reader, Ask AI, or lesson-point completion logic unless explicitly approved in a separate task.

---

## 4. Dispatch Order

Recommended execution order:

1. P0 Backend SQLite-Compatible Fallback
2. P1 SmartBook Category Display Repair
3. P2 Read-Only Verification
4. AGY Final Acceptance Review
5. P3 OAuth and Formal DB Migration only after a separate branch and explicit approval

P3 is not part of this first-phase SQLite policy branch.

---

## 5. Agent Task Cards

### 5.1 P0 Backend SQLite-Compatible Fallback

Assign to: OpenClaw backend agent or Codex coding agent.

Task:

```text
Repo: b827262-cell/AI-SmartBook-R1-PR4
Branch: docs/pr4-main-architecture-sqlite-policy
Reference repo: b827262-cell/ai_tutor_helper_OAUTH

Task: Implement only P0 backend SQLite-compatible fallback for optional missing tables.
Do not port OAuth. Do not port TiDB/MySQL behavior. Do not change schema, migrations, docker-compose, env core, OAuth core, PDF reader, Ask AI, or lesson-point completion logic.

GitHub execution in English.
Final termination report in Traditional Chinese.
Termination report must include success, failure, blocker, and permission-halt.
```

Allowed first review files:

- `server/routers/smartBookRouter.ts`
- `server/routers/smartBookLearningRouter.ts`
- `server/routers/featureTogglesRouter.ts` only if needed

Expected result:

- Missing optional tables such as `smart_book_settings`, `credit_transactions`, or `user_warnings` do not crash SmartBook pages.
- API route names and input/output shapes remain unchanged.

---

### 5.2 P1 SmartBook Category Display Repair

Assign to: frontend agent, Claude Code, OpenClaw frontend agent, or Codex coding agent.

Task:

```text
Repo: b827262-cell/AI-SmartBook-R1-PR4
Branch: docs/pr4-main-architecture-sqlite-policy
Reference repo: b827262-cell/ai_tutor_helper_OAUTH

Task: Implement only P1 SmartBook category display repair. Fix mojibake icons and normalize category display names with minimal frontend changes.
Do not change backend API contracts. Do not change schema, migrations, OAuth, docker-compose, PDF reader, Ask AI, or lesson-point completion logic.

GitHub execution in English.
Final termination report in Traditional Chinese.
Termination report must include success, failure, blocker, and permission-halt.
```

Allowed first review files:

- `client/src/lib/smartBookCategoryDisplay.ts`
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`
- `client/src/pages/AdminSmartBooks.tsx` only if needed

Expected result:

- Mojibake strings such as `ðŸ“š` are not rendered to users.
- Category names and icons are stable on book list, single-book page, and admin display if touched.

---

### 5.3 P2 Read-Only Verification

Assign to: Codex CLI, AGY, Gemini verification agent, or another read-only reviewer.

Task:

```text
Repo: b827262-cell/AI-SmartBook-R1-PR4
Branch: docs/pr4-main-architecture-sqlite-policy
Reference repo: b827262-cell/ai_tutor_helper_OAUTH

Task: Perform P2 read-only verification. Do not modify feature code. Create or update only a Markdown verification report under docs/verification/ if a committed report is requested.
Verify that PR4 remains AI-SmartBook-R1 based and SQLite based. Confirm no OAuth, TiDB/MySQL, docker-compose, schema, or migration changes were introduced.

GitHub execution in English.
Final termination report in Traditional Chinese.
Termination report must include success, failure, blocker, and permission-halt.
```

Minimum verification commands:

```bash
git status --short
git branch --show-current
git rev-parse --short HEAD
git diff --name-only main...HEAD
git diff -- drizzle/schema.ts
git diff --name-only main...HEAD | grep -E '(^drizzle/|migration|docker-compose|\.env|server/_core/(env|oauth|googleOAuth)\.ts)' || true
pnpm -w build
```

Expected result:

- Only approved P0/P1 files changed.
- `drizzle/schema.ts` has no diff.
- No migration, OAuth, docker-compose, or secret/config file changes are present.

---

### 5.4 AGY Final Acceptance Review

Assign to: AGY final reviewer or senior verification agent.

Task:

```text
Repo: b827262-cell/AI-SmartBook-R1-PR4
Branch: docs/pr4-main-architecture-sqlite-policy
Reference repo: b827262-cell/ai_tutor_helper_OAUTH

Task: Perform final PR4 acceptance review after P0/P1/P2. Verify the SQLite policy, allowed file boundaries, no OAuth porting, no schema/migration changes, no docker-compose changes, and user-facing SmartBook behavior.
Do not modify code unless explicitly approved. Prefer a final Markdown acceptance report.

GitHub execution in English.
Final termination report in Traditional Chinese.
Termination report must include success, failure, blocker, and permission-halt.
```

Expected result:

- Final merge recommendation is explicitly stated.
- Risky or rejected items are listed.
- User-facing acceptance criteria are checked.

---

## 6. Final Termination Report Requirement

Every agent must finish in Traditional Chinese and include these four fields:

```markdown
- 狀態
  - success: <完成項目>
  - failure: <失敗項目，沒有則寫「無」>
  - blocker: <阻礙項目，沒有則寫「無」>
  - permission-halt: <權限或需人工確認項目，沒有則寫「無」>
```

The full report template is defined in:

- `docs/ops/AI-SmartBook-R1-PR4-agent-workflow.md`

---

## 7. Dispatch Ready Checklist

Before assigning a task, confirm:

- [ ] The assigned agent reads `docs/ops/AI-SmartBook-R1-PR4-agent-workflow.md` first.
- [ ] The agent uses `b827262-cell/ai_tutor_helper_OAUTH` only as read-only reference material.
- [ ] The agent follows the correct P0/P1/P2/AGY task card.
- [ ] The agent does not mix OAuth or database migration work into the first-phase branch.
- [ ] The final report is written in Traditional Chinese.
- [ ] The final report includes success, failure, blocker, and permission-halt.

---

## 8. Current Dispatch Recommendation

Start with P0 if backend SmartBook pages still show optional-table runtime errors.

Start with P1 if the visible blocker is category icon mojibake or inconsistent category display.

Run P2 after any P0 or P1 code change.

Run AGY final review only after P0, P1, and P2 reports are available.
