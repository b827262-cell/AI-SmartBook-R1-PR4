# AI Agent Boundary Template

Purpose: give AGY / Codex / Claude Code clear engineering boundaries before implementation.

## Core idea

Do not give a vague request such as:

```text
請幫我把 PDF 截圖問 AI 做好。
```

Use a bounded request:

```text
請做 PDF 截圖問 AI。
只改學生端 Reader 相關檔案。
不要改 Admin、DB、AI provider、pnpm-lock。
做完跑 Student/Admin typecheck 和 build。
```

## Minimal template

```text
任務：
請實作＿＿＿＿＿＿＿＿。

所屬模組：
＿＿＿＿＿＿＿＿。

允許修改：
- ＿＿＿＿＿＿＿＿
- ＿＿＿＿＿＿＿＿

禁止修改：
- ＿＿＿＿＿＿＿＿
- ＿＿＿＿＿＿＿＿
- pnpm-lock.yaml
- DB migration
- AI provider runtime

完成後驗證：
- pnpm --filter AI-Stu-R1 typecheck
- pnpm --filter AI-Stu-R1 build
- pnpm --filter AI-adm-D1 typecheck
- pnpm --filter AI-adm-D1 build

完成後回報：
- 改了哪些檔案
- 有沒有碰禁止區
- 驗證有沒有通過
- PR URL
```

## Example: PDF screenshot ask AI

```text
任務：
請實作 PDF screenshot ask AI。

所屬模組：
pdf-reader-ai-core。

請不要直接 merge 舊分支。
請把舊分支 feat/r2-pdf-screenshot-ask-ai-core 當作 prototype / reference implementation。
請拆解舊分支中可用的截圖、圖片轉換、AI 問答、答案顯示邏輯，並依照目前 main 的 R2 架構重新封裝。

允許修改：
- apps/AI-Stu-R1/src/pages/BookReaderPage.tsx
- apps/AI-Stu-R1/src/components/reader/*
- apps/AI-Stu-R1/src/lib/*
- apps/AI-Stu-R1/src/api/*
- packages/schema/src/*
- docs/r2/*

禁止修改：
- apps/AI-adm-D1/*
- packages/db/src/schema.ts
- packages/db/src/migrations/*
- AI provider runtime unrelated files
- pnpm-lock.yaml
- package.json
- Dockerfile
- nginx config
- deployment config

功能需求：
1. 在學生端 PDF Reader 加入「截圖問 AI」入口。
2. 可截取目前 PDF 頁面或目前可視區域。
3. 將截圖送到既有 AI 問答流程或新增最小 API wrapper。
4. AI 回答要顯示在 Reader 的 AI 回答區或既有問 AI 面板中。
5. 操作失敗時要顯示明確錯誤。
6. 手機版不能破壞現有 PDF Reader 版面。
7. 不要新增 DB migration。
8. 不要改 Admin FilesTab。
9. 不要接新的 AI provider，只使用既有 provider / API 抽象。

完成後請執行：
- pnpm --filter AI-Stu-R1 typecheck
- pnpm --filter AI-Stu-R1 build
- pnpm --filter AI-adm-D1 typecheck
- pnpm --filter AI-adm-D1 build

完成後請回報：
- Branch
- Commit SHA
- Changed files
- 是否有修改 Admin UI
- 是否有修改 DB schema / migration
- 是否有修改 AI provider runtime
- Validation result
- Manual smoke test steps
- PR URL
```

## One-sentence rule

```text
不要下模糊指令；每次都要先定義任務、模組、允許修改、禁止修改、驗證與回報格式。
```
