# AI-SmartBook-R1-PR4 Agent Workflow Policy

> Purpose: define the PR4 agent workflow, execution boundaries, SQLite policy, and acceptance rules before any agent modifies code.
>
> Source reference repo: `b827262-cell/ai_tutor_helper_OAUTH`
>
> Target repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Target branch: `docs/pr4-main-architecture-sqlite-policy`

---

## 1. Core Decision

AI-SmartBook-R1 is the source-of-truth architecture for PR4.

PR4 must remain an AI-SmartBook-R1 based project. The reference repo `b827262-cell/ai_tutor_helper_OAUTH` may be used only as a read-only implementation reference and hotfix reference. It must not become the new architecture of PR4.

The OAuth reference repo is useful for comparing small fixes, fallback patterns, and operational handoff style. It is not approval to port OAuth, TiDB, MySQL, production secret handling, or large backend architecture changes into PR4.

---

## 2. Database Boundary

The target database architecture for PR4 first-phase work is SQLite.

Agents must not port TiDB, MySQL, or MySQL-compatible assumptions from `ai_tutor_helper_OAUTH` into PR4.

The first phase must not change:

- database schema files
- migration files
- production database setup
- `docker-compose.yml` database services
- ORM architecture
- local `.env` behavior
- OAuth runtime requirements

Any database-related fix in the first phase must be a SQLite-compatible fallback or read-only verification note.

---

## 3. Allowed Reference Usage

Agents may inspect `b827262-cell/ai_tutor_helper_OAUTH` only for these limited categories:

1. SQLite-compatible backend fallback behavior.
2. Optional-table missing fallback, such as `smart_book_settings`, `credit_transactions`, or `user_warnings`.
3. Category display normalization.
4. Category icon mojibake repair.
5. Small frontend display helper logic.
6. Read-only verification commands and handoff/report style.
7. OAuth-related documentation style only, not OAuth implementation.

The reference repo must not be copied wholesale into PR4.

---

## 4. Prohibited First-Phase Changes

The following changes are prohibited in the first phase:

1. Porting Google OAuth as a main architecture change.
2. Adding OAuth login as part of this PR4 first-phase task.
3. Adding or requiring TiDB/MySQL behavior.
4. Changing SQLite runtime assumptions.
5. Changing `drizzle/schema.ts`.
6. Adding or editing migration files.
7. Editing `docker-compose.yml` for OAuth or DB architecture.
8. Replacing `server/_core/env.ts`, `server/_core/oauth.ts`, `server/_core/googleOAuth.ts`, or `server/routers.ts` wholesale.
9. Refactoring the PDF reader.
10. Refactoring Ask AI core flow.
11. Refactoring lesson-point completion logic.
12. Broad-copying files from the reference project.
13. Submitting secrets, OAuth client secrets, tokens, local `.env` values, or API keys.
14. Changing the main route contract without explicit approval.

---

## 5. Work Arrangement

### P0: Backend SQLite-Compatible Fallback

Owner: OpenClaw or Codex coding agent 1.

Goal: prevent runtime 500 errors when optional tables are missing in a SQLite runtime.

Allowed files:

- `server/routers/smartBookRouter.ts`
- `server/routers/smartBookLearningRouter.ts`
- `server/routers/featureTogglesRouter.ts` only if needed
- minimal helper files only if required and explicitly reported

Rules:

- Keep tRPC route names unchanged.
- Keep API input/output shapes unchanged.
- Keep SQLite compatibility.
- Do not add MySQL/TiDB-specific code.
- Do not change schema or migration files.
- Do not change frontend files in P0.
- Use small, targeted guards instead of large router rewrites.

Expected behavior:

- If `smart_book_settings` does not exist, return safe default SmartBook settings.
- If `credit_transactions` does not exist, degrade gracefully where needed.
- If `user_warnings` does not exist, return safe defaults or empty results where needed.
- Do not crash frontend pages with `TRPCClientError 500` for optional missing tables.

Suggested verification:

```bash
pnpm -w build
pnpm -w test || true
git diff --name-only main...HEAD
git diff -- drizzle/schema.ts
```

---

### P1: SmartBook Category Display Repair

Owner: Claude Code, OpenClaw frontend agent, or Codex coding agent 2.

Goal: fix category icon mojibake and normalize display names without changing backend architecture.

Allowed files:

- `client/src/lib/smartBookCategoryDisplay.ts`
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`
- `client/src/pages/AdminSmartBooks.tsx` only if needed
- minimal frontend type/helper files only if required and explicitly reported

Rules:

- Do not change backend API contracts.
- Do not change schema.
- Do not change PDF reader behavior.
- Do not change Ask AI behavior.
- Do not change learning progress logic.
- Keep changes limited to category name/icon display.
- Prefer a small shared frontend display helper over duplicated cleanup code.

Expected behavior:

- Mojibake strings such as `ðŸ“š` must not be rendered to users.
- Category display name and icon should be stable across book list, single-book page, and admin category display if touched.
- Unknown categories should degrade to safe text/icon fallback.

Suggested verification:

```bash
pnpm -w build
git diff --name-only main...HEAD
git diff -- client/src/lib/smartBookCategoryDisplay.ts
```

---

### P2: Read-Only Verification

Owner: Codex CLI, AGY, or Gemini verification agent.

Goal: prove PR4 remains AI-SmartBook-R1 + SQLite based after P0/P1.

Verification must check:

- `drizzle/schema.ts` unchanged.
- No migration files changed.
- No TiDB/MySQL assumptions introduced.
- No OAuth files changed.
- No docker-compose changes.
- Only approved P0/P1 files changed.
- Book list opens.
- Single-book page opens.
- PDF reader loads.
- Mobile PDF layout is not broken.
- Category icon mojibake is fixed.
- Optional missing tables do not crash SmartBook pages.

Allowed output:

- Markdown report under `docs/verification/`.
- Verification-only shell commands or scripts if explicitly needed.

Suggested verification commands:

```bash
git status --short
git branch --show-current
git rev-parse --short HEAD
git diff --name-only main...HEAD
git diff -- drizzle/schema.ts
git diff --name-only main...HEAD | grep -E '(^drizzle/|migration|docker-compose|\.env|server/_core/(env|oauth|googleOAuth)\.ts)' || true
pnpm -w build
```

---

### P3: OAuth and Formal DB Migration

OAuth and formal DB migration are not part of the first phase.

They require a separate branch, separate planning, redirect URI verification, local `.env` setup, secret-scan checks, and explicit approval.

Do not mix OAuth implementation into this PR4 SQLite policy branch.

---

## 6. Agent Assignment and Execution Prompts

### 6.1 OpenClaw Backend Agent

Primary role: backend SQLite-compatible fallback.

Execution prompt:

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

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- current branch
- commit SHA if committed
- changed files
- validation commands
- validation result
- confirmation that SQLite architecture was preserved
- confirmation that `drizzle/schema.ts` was unchanged
- confirmation that no OAuth / docker-compose / migration files changed

---

### 6.2 Frontend Category Agent

Primary role: frontend category display repair.

Execution prompt:

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

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- current branch
- commit SHA if committed
- changed files
- validation commands
- validation result
- before/after display behavior
- confirmation that backend/API/schema files were not changed

---

### 6.3 Codex Verification Agent

Primary role: read-only verification and checklist generation.

Execution prompt:

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

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- current branch
- commit SHA if report committed
- changed files
- exact verification commands
- result summary
- no-feature-code-change confirmation
- recommended next action

---

### 6.4 AGY Final Review Agent

Primary role: final acceptance review.

Execution prompt:

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

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- branch and commit SHA reviewed
- changed files reviewed
- accepted items
- rejected or risky items
- validation commands
- final merge recommendation

---

## 7. Required Guardrails Before Merge

Before merging any agent branch into `main`, verify:

```bash
git status --short
git diff --name-only main...HEAD
git diff -- drizzle/schema.ts
git diff --name-only main...HEAD | grep -E '(^drizzle/|migration|docker-compose|\.env|server/_core/(env|oauth|googleOAuth)\.ts)' || true
```

Expected result:

- No dirty working tree.
- Only approved files changed.
- `drizzle/schema.ts` has no diff.
- No migration, OAuth, docker-compose, or secret/config files changed in first phase.

---

## 8. Final Acceptance Criteria

PR4 first-phase work is acceptable only when all of the following are true:

1. AI-SmartBook-R1 remains the main architecture.
2. SQLite remains the database baseline.
3. No TiDB/MySQL-specific architecture is introduced.
4. Schema and migrations are unchanged.
5. OAuth is not mixed into the first phase.
6. Backend optional-table fallback is SQLite-compatible.
7. Category mojibake is repaired.
8. Book list, single-book page, PDF reader, and mobile PDF remain functional.
9. Agent reports are written in Traditional Chinese.
10. Secrets are not committed.
11. The reference repo `b827262-cell/ai_tutor_helper_OAUTH` was used only as a read-only reference.

---

## 9. Termination Report Template

Every agent must finish with this Traditional Chinese report format:

```markdown
## 最終報告（繁體中文）

- 狀態
  - success: <完成項目>
  - failure: <失敗項目，沒有則寫「無」>
  - blocker: <阻礙項目，沒有則寫「無」>
  - permission-halt: <權限或需人工確認項目，沒有則寫「無」>

- current branch
  - <branch>

- current commit SHA
  - <sha 或「未提交」>

- reference repo
  - b827262-cell/ai_tutor_helper_OAUTH

- changed files
  - <file list>

- validation commands
  - <commands>

- validation result
  - <result>

- architecture confirmation
  - AI-SmartBook-R1 main architecture preserved: yes/no
  - SQLite baseline preserved: yes/no
  - drizzle/schema.ts unchanged: yes/no
  - migrations unchanged: yes/no
  - OAuth not ported: yes/no
  - docker-compose unchanged: yes/no
  - secrets not committed: yes/no

- recommended next action
  - <next action>
```
