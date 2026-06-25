# AI-SmartBook-R2 模組治理與整合架構方案釋出

Date: 2026-06-25
Repository: `b827262-cell/AI-SmartBook-R1-PR4`
Source of truth: `main`

## 決策確認

最終整合 repo 是 `AI-SmartBook-R1-PR4`，主線是 `main`。

後續不再使用其他 repo 或 `master` 作為整合主線。

## 五大模組

1. `pdf-reader-ai-core`
2. `book-content-pipeline`
3. `admin-files-settings`
4. `smart-ai-backend`
5. `question-bank-solve`

## 整合順序

1. baseline validation
2. schema / repository foundation
3. book-content-pipeline
4. pdf-reader-ai-core
5. question-bank-solve
6. admin-files-settings
7. smart-ai-backend
8. acceptance / rollback drill

## 後台狀態

每支功能 PR 都要能在後台 R2 模組整合中心反映狀態：綠、黃、紅、灰。
