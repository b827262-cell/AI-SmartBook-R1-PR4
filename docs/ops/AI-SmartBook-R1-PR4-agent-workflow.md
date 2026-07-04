# AI-SmartBook-R1-PR4 Agent Workflow Policy

> Purpose: establish the main engineering boundary for PR4 work before any agent modifies code.

## 1. Core Decision

AI-SmartBook-R1 is the source-of-truth architecture for PR4.

The PR4 target must remain an AI-SmartBook-R1 based project. The `ai_tutor_helper_20260704_TUFA16` project may only be used as a hotfix reference. It must not become the new architecture of PR4.

## 2. Database Boundary

The target database architecture is SQLite.

Agents must not port TiDB, MySQL, or MySQL-compatible assumptions from the reference project into PR4.

The first phase must not change database schema, migration files, production DB setup, docker-compose database services, or ORM architecture.

## 3. Allowed Reference Usage

The reference project may be used only for these limited hotfix categories:

1. SQLite-compatible backend fallback behavior.
2. Optional-table missing fallback, such as `smart_book_settings`, `credit_transactions`, or `user_warnings`.
3. Category display normalization.
4. Category icon mojibake repair.
5. Small frontend display helper logic.
6. Verification commands and read-only comparison notes.

The reference project must not be used to replace the PR4 architecture.

## 4. Prohibited First-Phase Changes

The following changes are prohibited in the first phase:

1. Porting Google OAuth as a main architecture change.
2. Adding or requiring TiDB/MySQL behavior.
3. Changing SQLite runtime assumptions.
4. Changing `drizzle/schema.ts`.
5. Adding or editing migration files.
6. Editing `docker-compose.yml` for OAuth or DB architecture.
7. Replacing `server/_core/env.ts`, `server/_core/oauth.ts`, or `server/routers.ts` wholesale.
8. Refactoring the PDF reader.
9. Refactoring Ask AI core flow.
10. Refactoring lesson-point completion logic.
11. Broad-copying files from the reference project.
12. Submitting secrets, OAuth client secrets, tokens, or local `.env` values.

## 5. Phase Plan

### P0: Backend SQLite-Compatible Fallback

Goal: prevent runtime 500 errors when optional tables are missing in a SQLite runtime.

Allowed files:

- `server/routers/smartBookRouter.ts`
- `server/routers/smartBookLearningRouter.ts`
- `server/routers/featureTogglesRouter.ts` only if needed

Rules:

- Keep tRPC route names unchanged.
- Keep API input/output shapes unchanged.
- Keep SQLite compatibility.
- Do not add MySQL/TiDB-specific code.
- Do not change schema or migration files.
- Do not change frontend files in P0.

Expected behavior:

- If `smart_book_settings` does not exist, return safe default SmartBook settings.
- If `credit_transactions` does not exist, degrade gracefully where needed.
- If `user_warnings` does not exist, return safe defaults or empty results where needed.
- Do not crash frontend pages with `TRPCClientError 500` for optional missing tables.

### P1: SmartBook Category Display Repair

Goal: fix category icon mojibake and normalize display names without changing backend architecture.

Allowed files:

- `client/src/lib/smartBookCategoryDisplay.ts`
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`
- `client/src/pages/AdminSmartBooks.tsx` only if needed

Rules:

- Do not change backend API contracts.
- Do not change schema.
- Do not change PDF reader behavior.
- Do not change Ask AI behavior.
- Do not change learning progress logic.
- Keep changes limited to category name/icon display.

Expected behavior:

- Mojibake strings such as `ðŸ“š` must not be rendered to users.
- Category display name and icon should be stable across book list, single-book page, and admin category display if touched.
- Prefer a small shared frontend display helper over duplicated ad-hoc cleanup code.

### P2: Read-Only Verification

Goal: prove PR4 remains AI-SmartBook-R1 + SQLite based after P0/P1.

Verification must check:

- `drizzle/schema.ts` unchanged.
- No migration files changed.
- No TiDB/MySQL assumptions introduced.
- No OAuth files changed.
- No docker-compose changes.
- Only allowed P0/P1 files changed.
- Book list opens.
- Single-book page opens.
- PDF reader loads.
- Mobile PDF layout is not broken.
- Category icon mojibake is fixed.

### P3: OAuth and Formal DB Migration

OAuth and formal DB migration are not part of the first phase.

They require separate planning, local `.env` configuration, redirect URI verification, secret-scan checks, and explicit approval.

## 6. Agent Assignment

### OpenClaw

Primary role: backend SQLite-compatible fallback.

OpenClaw must only work on P0 unless explicitly reassigned.

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

### Claude Code

Primary role: frontend category display repair.

Claude Code must only work on P1 unless explicitly reassigned.

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- current branch
- commit SHA if committed
- changed files
- validation commands
- validation result
- before/after display behavior
- confirmation that backend/API/schema files were not changed

### Codex CLI

Primary role: read-only verification and checklist generation.

Codex CLI must not modify feature code during verification.

Allowed output:

- Markdown report under `docs/verification/`
- Verification-only shell commands or scripts if explicitly needed

Required final report in Traditional Chinese:

- status: success / failure / blocker / permission-halt
- current branch
- commit SHA if report committed
- changed files
- exact verification commands
- result summary
- no-feature-code-change confirmation
- recommended next action

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
