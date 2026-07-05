# AI-SmartBook-R1-PR4 Hermes Engineering Plan

日期：2026-07-04
作者：Hermes Agent
模式：第 0 階段分析 / 規劃文件，非實作

## 0. 前置說明

本文件依據「本機可驗證內容」產出，重點是先分析 `ai_tutor_helper_OAUTH` 系列 SmartBook 模組如何運作，並評估是否能安全導入 `AI-SmartBook-R1-PR4`。

本次實際可驗證來源：
- 來源工作樹：`/home/b822726/project/ai_tutor_helper_20260704_TUFA16`
- OAUTH handoff：`/home/b822726/project/ai_tutor_helper_20260704_TUFA16/docs/handoff/20260704_oauth_smartbooks_handoff.md`
- 目標工作樹：`/home/b822726/project/AI-SmartBook-R1-PR4`

重要現況：
- 使用者提供的 GitHub branch 為 `docs/pr4-main-architecture-sqlite-policy`，且指出有新增 docs。
- 但本機 `AI-SmartBook-R1-PR4` 工作樹目前實測 branch 是 `main`，本機與 origin 都未看到 `docs/pr4-main-architecture-sqlite-policy` ref。
- 因此，本文件是依「目前本機可讀 repo 狀態」與 OAUTH handoff 內容完成，不假設未同步到本機的 docs 分支內容已存在。

## 1. 分析範圍與本次選定的 9 個模組

根據 OAUTH handoff 與 SmartBook 主流程檔案，這次先分析 9 個最核心且最適合做 PR4 dispatch 的模組：

1. 書籍列表模組（SmartBooks / BookList）
2. 單書頁殼層模組（BookDetail / tabs shell）
3. 章節學習與 Ask AI 模組（ChapterLearning）
4. 進度儀表板模組（ProgressDashboard）
5. 知識點 / Lesson Points 模組
6. 筆記與 PDF 註記模組（SavedNotebook / pdfHighlights / pdfImageNotes）
7. 精選考題模組（BookQuizTab）
8. 書內 Q&A / Essay 模組（BookQATab / BookQATabWithEssay）
9. 後台 SmartBooks 管理與上傳模組（AdminSmartBooks / batchUpload）

選這 9 個模組的原因：
- 它們直接構成 SmartBook 的主使用者旅程。
- 它們覆蓋你要求關注的項目：書籍列表、單書頁、PDF Reader、手機 PDF、進度 panel、知識點 panel、知識點完成狀態、筆記功能、Ask AI、後台管理、上傳功能、API routes、DB schema、AI/RAG/embedding。
- 它們也是最容易拆成後續 OpenClaw / Claude Code / Codex CLI 任務的邊界。

## 2. 共通架構總結

### 2.1 前端入口與殼層

主要前端檔案：
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookDetail.tsx`
- `client/src/pages/SmartBooksChapterLearning.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`
- `client/src/components/PdfViewer.tsx`
- `client/src/pages/AdminSmartBooks.tsx`

### 2.2 tRPC / API 主入口

主要 router 掛載於：
- `server/routers.ts`

本次相關核心 router：
- `smartBookAdmin`
- `smartBookStudent`
- `smartBookLearning`
- `smartBookLearningAdmin`
- `lessonPointsStudent`
- `lessonPointsAdmin`
- `pdfHighlights`
- `pdfImageNotes`
- `bookAccess`
- `featureToggles`

### 2.3 資料表主體

主要 schema 定義：
- `drizzle/schema.ts`

本次相關表：
- `smart_book_categories`
- `smart_books`
- `smart_book_chapters`
- `smart_book_settings`
- `smart_book_verifications`
- `smart_book_conversations`
- `smart_book_progress`
- `pdf_highlights`
- `pdf_image_notes`
- `knowledge_chunks`
- `credit_transactions`
- lesson points 相關表（由 `lessonPointsRouter.ts` 使用）

### 2.4 AI / Gemini / RAG / embedding 共通路徑

已驗證存在：
- `server/embeddingHelper.ts` 被多處 import
- `knowledge_chunks` 表存在
- `learningMaterials.ts` / `routers.ts` / GUI API 路徑有 embedding 寫入流程
- `smartBookStudent.sendMessage` 是書內 Ask AI 核心入口

結論：
- OAUTH 來源不是純前端展示專案，而是完整 SmartBook + AI Tutor + PDF + RAG stack。
- `AI-SmartBook-R1-PR4` 本機現況已內含大部分對應功能；後續工作重點較像「精準搬移經驗證補丁與安全收斂」，而不是整套重做。

## 3. 9 個模組逐一分析

---

## 模組 1：書籍列表模組（SmartBooks / BookList）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`

外觀/互動特徵：
- 左右或卡片式書籍列表
- 先取分類，再取書本
- 顯示分類 icon / name、書名、權限/規則資訊
- 支援 handouts / books 分流
- 支援多書選取與進入單書頁

OAUTH handoff 額外指出：
- 曾有類別 icon 亂碼問題（`ðŸ“š`）
- 後來改成 `client/public/icons/books.png`
- 新增 `client/src/lib/smartBookCategoryDisplay.ts`
- 來源已停止直接 render `cat.icon`
- 分類 API 回傳已清洗資料

### 2) 使用者按下功能後，程式怎麼跑

流程：
1. 進入 `SmartBooks.tsx`
2. `trpc.smartBookStudent.list.useQuery()` 取書單
3. `trpc.smartBookStudent.listCategories.useQuery()` 取分類
4. 使用者點某一本書
5. 將 selected book 傳給 `SmartBooksBookDetail.tsx`

### 3) API / tRPC 呼叫哪裡

前端主要 query：
- `trpc.smartBookStudent.list.useQuery()`
- `trpc.smartBookStudent.listCategories.useQuery()`
- `trpc.bookAccess.getItemRules.useQuery()`

### 4) Backend router / service 怎麼處理

主要在：
- `server/routers/smartBookRouter.ts`
  - `smartBookStudent.list`
  - `smartBookStudent.listCategories`
- 類別清洗補丁也在 `smartBookRouter.ts`

### 5) 寫入或讀取哪些資料庫 table

讀取：
- `smart_book_categories`
- `smart_books`
- 可能連動 `bookAccess` 規則 / 驗證狀態

### 6) 回傳資料如何渲染回 UI

- Router 回傳 categories + books
- 前端依 category 分組渲染卡片
- 使用清洗後的分類名稱 / icon 資料組裝 UI

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `AI-SmartBook-R1-PR4/client/src/pages/SmartBooks.tsx` 已存在
- `AI-SmartBook-R1-PR4/client/src/pages/SmartBooksBookTabs.tsx` 已存在
- `AI-SmartBook-R1-PR4/server/routers/smartBookRouter.ts` 已存在

但差異點：
- 目標缺少來源 OAUTH 已修正的分類顯示清洗邏輯
- 這是已知 hotfix，而非新模組

### 8) 是否能在 SQLite baseline 下安全導入

部分可。
- UI 顯示修正：安全，可直接導入
- 若涉及既有 MySQL schema 的查詢語意、JSON 欄位、排序策略，需確認 SQLite schema 映射

結論：
- 「分類清洗 / icon 顯示修正」可列為 SQLite baseline 安全導入
- 「書本資料模型本身」不屬 SQLite-safe 新增項，需要 baseline 已有 smart book schema 或替代表

### 9) 是否需要另開 implementation issue 與人工核准

需要。
- 建議開 issue：`SmartBooks category display normalization`
- 這是低風險、小範圍、可獨立驗收的 UI/API 一致性修補
- 可由人工核准後交給 Claude Code

---

## 模組 2：單書頁殼層模組（BookDetail / tabs shell）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksBookDetail.tsx`

特徵：
- 單書頁 header
- tabs：`chapters | notebook | credits | quiz | qa | exam | live-practice`
- 可開 progress modal
- 可切 `splitNoteMode`（邊看 PDF 邊寫筆記）

### 2) 使用者按下功能後，程式怎麼跑

1. 書籍列表選書
2. 進入 `BookDetail`
3. `BookDetail` 根據 activeTab 切不同子模組
4. 某些 tab 再向下呼叫更多 tRPC

### 3) API / tRPC 呼叫哪裡

在殼層看到：
- `trpc.smartBookLearning.getCreditHistory.useQuery(...)`
- 其他子模組各自 query

### 4) Backend router / service 怎麼處理

- `smartBookLearningRouter.ts`：點數歷史/學習狀態
- `smartBookRouter.ts`：書本與章節主資料

### 5) 寫入或讀取哪些資料庫 table

- `smart_books`
- `smart_book_chapters`
- `smart_book_progress`
- `credit_transactions`
- `smart_book_settings`

### 6) 回傳資料如何渲染回 UI

- 先顯示 book metadata
- 再依 activeTab 掛載對應子元件
- `showProgress` 時顯示 `ProgressDashboard`

### 7) AI-SmartBook-R1#4 是否已有對應功能

有，且結構幾乎一致。

### 8) 是否能在 SQLite baseline 下安全導入

殼層本身可；但其依賴的 tabs 若連動 MySQL 專屬表，仍不可視為完全 SQLite-safe。

### 9) 是否需要另開 implementation issue 與人工核准

不一定需要獨立 issue。
- 若只是微調 tabs 顯示/開關，可併入 UI issue
- 若涉及 tabConfig / smart_book_settings / credits 相依，應拆 issue 並人工核准

---

## 模組 3：章節學習與 Ask AI 模組（ChapterLearning）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksChapterLearning.tsx`
- `client/src/components/PdfViewer.tsx`

特徵：
- 主學習畫面
- 左右區塊包含 PDF、章節內容、AI 對話、知識點、工具按鈕
- 有 `isMobile` 分支處理手機畫面
- 支援 `splitPageMode`、PDF page 定位、image upload/capture

### 2) 使用者按下功能後，程式怎麼跑

1. 使用者從 BookDetail 點章節
2. `ChapterLearning` 載入章節、當前頁、知識點、已完成狀態
3. 使用者輸入問題 / 點快捷按鈕
4. 呼叫 `smartBookStudent.sendMessage`
5. 後端根據 book/chapter/page/lesson point 組 prompt 與 context
6. 回傳 AI 回應、來源內容、可能的狀態變化
7. 前端更新 chat 區、知識點狀態、頁面定位

### 3) API / tRPC 呼叫哪裡

核心：
- `trpc.smartBookStudent.sendMessage...`
- `trpc.lessonPointsStudent.getPublished...`
- `trpc.lessonPointsStudent.getProgress...`
- 章節資料通常來自 `smartBookStudent.getChapters`

### 4) Backend router / service 怎麼處理

主要在：
- `server/routers/smartBookRouter.ts`
  - `smartBookStudent.getChapters`
  - `smartBookStudent.sendMessage`
- `server/routers/lessonPointsRouter.ts`
  - `lessonPointsStudent.getPublished`
  - `lessonPointsStudent.getProgress`
- `server/routers/smartBookLearningRouter.ts`
  - 補充學習設定與學生開關

### 5) 寫入或讀取哪些資料庫 table

主要：
- `smart_books`
- `smart_book_chapters`
- `smart_book_conversations`
- `smart_book_progress`
- `smart_book_settings`
- `knowledge_chunks`
- lesson points 相關表
- 可能扣點：`credit_transactions`

### 6) 回傳資料如何渲染回 UI

- AI 回應顯示在聊天區
- 若有頁碼/章節資訊，前端同步定位 PDF
- 若有 lesson point 進度，更新 completed 狀態
- 若有額外按鈕或建議，顯示在對話工具區

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `SmartBooksChapterLearning.tsx` 存在
- `smartBookStudent.sendMessage` 存在
- `lessonPointsRouter.ts` 存在

### 8) 是否能在 SQLite baseline 下安全導入

不建議直接視為 SQLite-safe。
原因：
- 高度依賴 chapter / settings / progress / conversation / credits / lesson points / embeddings
- schema 為 MySQL 風格 Drizzle 定義
- 部分 JSON 欄位與 enum 欄位需先做 SQLite compatibility mapping

結論：
- Ask AI 主鏈屬高風險導入項
- 除非 baseline 已有對應表與兼容 service，否則不應直接納入第一批施工

### 9) 是否需要另開 implementation issue 與人工核准

需要，且必須人工核准。
建議 issue：
- `SmartBook ChapterLearning runtime dependency audit`
- `SmartBook Ask AI / sendMessage portability under SQLite baseline`

---

## 模組 4：進度儀表板模組（ProgressDashboard）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksBookTabs.tsx`

特徵：
- modal/panel 顯示整本書的總進度
- 顯示 completed chapters / overall progress / per chapter progress

### 2) 使用者按下功能後，程式怎麼跑

1. 在單書頁點開進度
2. `ProgressDashboard` 以 `bookId` query 進度
3. 顯示各章節完成度

### 3) API / tRPC 呼叫哪裡

- `trpc.smartBookStudent.getProgress`

### 4) Backend router / service 怎麼處理

- `server/routers/smartBookRouter.ts`
  - `smartBookStudent.getProgress`

### 5) 寫入或讀取哪些資料庫 table

- `smart_book_progress`
- `smart_book_chapters`
- lesson point / chapter status 聚合結果

### 6) 回傳資料如何渲染回 UI

- 回傳整體百分比與章節列表
- 前端依章節 map 為進度條 / badge / 完成數字

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `ProgressDashboard` 在目標同檔存在
- `smartBookStudent.getProgress` 也存在

### 8) 是否能在 SQLite baseline 下安全導入

若只是 UI/聚合格式調整，可。
若要完整搬進度統計邏輯，須先確認 baseline 是否已有 `smart_book_progress` 及關聯章節資料。

### 9) 是否需要另開 implementation issue 與人工核准

建議開 issue，但優先級低於 ChapterLearning。
- 這是可驗證、邊界清楚的功能
- 若資料表已存在，可在後端穩定後很快導入

---

## 模組 5：知識點 / Lesson Points 模組

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksChapterLearning.tsx`

特徵：
- 顯示章節知識點清單
- 顯示當前 lesson index
- 顯示完成 / 未完成狀態
- 支援引導式學習節奏

### 2) 使用者按下功能後，程式怎麼跑

1. 進入章節學習
2. 呼叫 `getPublished(chapterId)` 取得已發布知識點
3. 呼叫 `getProgress(chapterId)` 取得此學生完成進度
4. 點擊知識點後，可能觸發 AI 對話或切換畫面上下文

### 3) API / tRPC 呼叫哪裡

- `trpc.lessonPointsStudent.getPublished`
- `trpc.lessonPointsStudent.getProgress`

### 4) Backend router / service 怎麼處理

- `server/routers/lessonPointsRouter.ts`

### 5) 寫入或讀取哪些資料庫 table

- lesson points 主表
- lesson points 狀態 / 完成表
- 可能關聯 `smart_book_chapters`

### 6) 回傳資料如何渲染回 UI

- published points -> 左/右 panel list
- progress -> `completedLessonIds` set
- 前端用 badge / checkbox / current pointer 表示完成狀態

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `lessonPointsRouter.ts` 存在
- `getPublished` / `getProgress` 都存在

### 8) 是否能在 SQLite baseline 下安全導入

中高風險。
- 若 baseline 沒有 lesson points 結構，不適合直接導入
- 若只是前端完成狀態顯示修正，可在既有 API 下安全處理

### 9) 是否需要另開 implementation issue 與人工核准

需要。
- 這是學習體驗核心功能
- 牽涉內容生成、進度追蹤、與 Ask AI 的聯動
- 必須人工核准資料模型是否採納

---

## 模組 6：筆記與 PDF 註記模組（SavedNotebook / pdfHighlights / pdfImageNotes）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksBookTabs.tsx` -> `SavedNotebook`
- `client/src/pages/SmartBooksBookDetail.tsx` -> `splitNoteMode`
- `client/src/components/PdfViewer.tsx`
- `client/src/pages/Notes.tsx`

特徵：
- 文字筆記與圖片筆記雙分頁
- PDF 螢光筆
- PDF 截圖 / 圖片註記
- 邊看 PDF 邊寫筆記模式
- Notes 頁提供個人筆記入口

OAUTH 差異：
- `Notes.tsx` 來源有 Google login 入口；目標沒有

### 2) 使用者按下功能後，程式怎麼跑

1. 使用者在單書頁打開 notebook 或 split note mode
2. PDF 上畫 highlight / 擷取圖片 / 寫文字筆記
3. 前端呼叫 `pdfHighlights` 或 `pdfImageNotes` router
4. 重新 query 顯示最新筆記與圖片

### 3) API / tRPC 呼叫哪裡

- `pdfHighlightsRouter`
- `pdfImageNotesRouter`
- 可能還有 saved answers / learning notes 類 router

### 4) Backend router / service 怎麼處理

- `server/routers/pdfHighlightsRouter.ts`
- `server/routers/pdfImageNotesRouter.ts`
- 部分一般筆記在 `learningMaterials.ts` / saved answers 路徑

### 5) 寫入或讀取哪些資料庫 table

- `pdf_highlights`
- `pdf_image_notes`
- 可能還有 saved answers / learning notes 表

### 6) 回傳資料如何渲染回 UI

- 取得 highlights 後畫回 PDF overlay
- 取得 image notes 後渲染在 notebook tab
- Notes 頁以列表方式顯示時間、內容、繼續提問入口

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `pdfHighlightsRouter.ts` 存在
- `pdfImageNotesRouter.ts` 存在
- `SavedNotebook` / split note mode 都存在

### 8) 是否能在 SQLite baseline 下安全導入

分兩類：
- UI 行為與顯示修正：可
- 新增/依賴 PDF note tables：須先確認 baseline 是否已有等價表

### 9) 是否需要另開 implementation issue 與人工核准

需要，但可拆兩張：
- `Notebook UI / navigation fixes`（低風險）
- `PDF annotations data portability`（中風險，需人工核准）

---

## 模組 7：精選考題模組（BookQuizTab）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksBookTabs.tsx`

特徵：
- mode：`select | doing | result`
- quizType：`chapter | mock | wrong`
- 從書本章節衍生題目練習

### 2) 使用者按下功能後，程式怎麼跑

1. 使用者進 quiz tab
2. 選 quiz 模式/範圍
3. 請求後端產題 / 取題 / 批改
4. 顯示結果

### 3) API / tRPC 呼叫哪裡

- 主要走 smartBook 路徑與 quiz 相關 procedure
- 細節實作在 `SmartBooksBookTabs.tsx` + `smartBookRouter.ts`

### 4) Backend router / service 怎麼處理

- `smartBookRouter.ts`
- 可能連動 AI 出題、快取、錯題與 mock exam 資料

### 5) 寫入或讀取哪些資料庫 table

高度可能涉及：
- `smart_book_chapter_quizzes` 類型資料
- `quiz_history`
- `quiz_wrong_questions`
- `credit_transactions`

### 6) 回傳資料如何渲染回 UI

- 題目列表 -> 做題畫面 -> 結果畫面
- 顯示分數、解析、錯題

### 7) AI-SmartBook-R1#4 是否已有對應功能

有，UI 與主路徑都在。

### 8) 是否能在 SQLite baseline 下安全導入

不建議列為第一批 SQLite-safe 導入。
- 依賴 quiz / history / wrong question / credits
- 對資料模型要求高

### 9) 是否需要另開 implementation issue 與人工核准

需要，且應延後。
- 先完成基礎書本、章節、知識點、筆記後再處理

---

## 模組 8：書內 Q&A / Essay 模組（BookQATab / BookQATabWithEssay）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/SmartBooksBookTabs.tsx`

特徵：
- lecture / essay 子分頁
- 顯示已整理的章節問答、申論題
- 與點數變化連動

### 2) 使用者按下功能後，程式怎麼跑

1. 進入 QA tab
2. 請求 qaData / essayQuestions
3. 點選某題查看詳細解析
4. 可能扣點 / 記錄查看狀態

### 3) API / tRPC 呼叫哪裡

- smartBookLearning / smartBookStudent 路徑
- 可能含 credits 歷史與題目詳情 procedure

### 4) Backend router / service 怎麼處理

- `smartBookLearningRouter.ts`
- `smartBookRouter.ts`
- 視資料來源可能再連 exam/question 相關 service

### 5) 寫入或讀取哪些資料庫 table

- SmartBook 章節 QA / essay 相關表
- `credit_transactions`
- 可能有 viewed QA / cache 類資料

### 6) 回傳資料如何渲染回 UI

- 以列表或 accordion 顯示
- 切換 lecture / essay 內容
- 更新點數狀態

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `BookQATab`、`BookQATabWithEssay` 都存在

### 8) 是否能在 SQLite baseline 下安全導入

中高風險。
- 若只是顯示層修補可
- 若涉及點數扣款、QA cache、essay question storage，不宜直接導入

### 9) 是否需要另開 implementation issue 與人工核准

需要。
- 尤其凡是牽涉 credits 扣點與申論資料模型，都應人工核准

---

## 模組 9：後台 SmartBooks 管理與上傳模組（AdminSmartBooks / batchUpload）

### 1) 前端外觀怎麼設計

來源檔案：
- `client/src/pages/AdminSmartBooks.tsx`
- `client/src/pages/AdminSmartBooksBookEditor.tsx`
- `client/src/pages/AdminSmartBooksChapterEditor.tsx`

特徵：
- 書本列表管理
- 書本編輯、分類管理、設定、上下架
- 單本/批次上傳
- 一條龍處理：抽字、偵測章節、拆節、整理重點、出題

OAUTH 差異：
- 類別顯示有 normalize / clean display 補丁

### 2) 使用者按下功能後，程式怎麼跑

1. 管理員開啟 AdminSmartBooks
2. 載入列表與分類
3. 選擇上傳檔案
4. `batchUpload` mutation 建立書與背景處理
5. 前端輪詢或刷新顯示處理進度

### 3) API / tRPC 呼叫哪裡

- `trpc.smartBookAdmin.list`
- `trpc.smartBookAdmin.listCategories`
- `trpc.smartBookAdmin.batchUpload`
- 其他編輯 / 刪除 / 排序 / publish 類 procedure

### 4) Backend router / service 怎麼處理

主要在：
- `server/routers/smartBookRouter.ts`
  - `smartBookAdminRouter`
  - `batchUpload`
- 背景產生章節、lesson points、quiz、處理狀態

### 5) 寫入或讀取哪些資料庫 table

- `smart_book_categories`
- `smart_books`
- `smart_book_chapters`
- `smart_book_settings`
- 可能衍生 quiz / qa / progress 初始資料

### 6) 回傳資料如何渲染回 UI

- mutation 回傳 successCount / failCount / results
- UI 顯示 toast、進度、卡片狀態

### 7) AI-SmartBook-R1#4 是否已有對應功能

有。
- `AdminSmartBooks.tsx` 存在
- `smartBookAdminRouter` 存在
- `batchUpload` 存在

但差異點：
- 目標缺來源 OAUTH 的分類顯示清洗修正
- 目標少部分缺表 fallback 補丁

### 8) 是否能在 SQLite baseline 下安全導入

不適合直接列為 SQLite-safe。
- 後台上傳一條龍是高資料相依、高背景處理相依模組
- 若 baseline 是 SQLite，需先回答：檔案儲存、章節抽取、settings 表、quiz 產生、embedding 寫入如何落地

### 9) 是否需要另開 implementation issue 與人工核准

需要，而且必須人工核准。
建議至少拆成：
- `AdminSmartBooks category display normalization`
- `AdminSmartBooks batchUpload portability assessment`
- `smart_book_settings missing-table fallback port`

## 4. 指定項目總表

### 書籍列表
- 來源：有
- 目標：有
- 建議：搬 OAUTH 類別清洗與 icon 顯示修補

### 單書頁
- 來源：有
- 目標：有
- 建議：維持殼層，不要重做

### PDF Reader
- 來源：有（`client/src/components/PdfViewer.tsx`）
- 目標：有
- 建議：只做行為修補，不要碰底層 render 架構

### 手機 PDF
- 來源：有 mobile state / 響應式邏輯
- 目標：有
- 建議：若要修，應走 UI issue，不應動資料層

### 進度 panel
- 來源：有
- 目標：有
- 建議：後端穩定後再微調

### 知識點 panel
- 來源：有
- 目標：有
- 建議：先做資料相依盤點

### 知識點完成狀態
- 來源：有
- 目標：有
- 建議：只在 baseline 已有 progress model 時搬

### 筆記功能
- 來源：有
- 目標：有
- 建議：先搬 UI/登入入口修補，再碰 PDF note data model

### Ask AI
- 來源：有
- 目標：有
- 建議：高風險，需獨立 issue + 人工核准

### 後台管理
- 來源：有
- 目標：有
- 建議：先搬分類顯示修補與缺表 fallback

### 上傳功能
- 來源：有
- 目標：有
- 建議：只做評估，不列第一批施工

### reader_toc
- 本次未觀察到獨立 `reader_toc` router/table 成為主模組
- 實際是：`pdfToc` / `tocCodeCache` / `tocCode` 這條線
- 若未來要搬，需重新定義 target data model 對應

### API routes
- 來源與目標都已具備 SmartBook/PDF/lesson points 相關 routes
- 差異集中在 hotfix / fallback / 顯示正規化

### DB schema
- `drizzle/schema.ts` 來源與目標主體高度相似
- 但 schema 風格明顯是 MySQL-first，不是 SQLite-first

### AI / Gemini / RAG / embedding
- 來源有完整鏈路
- 目標也已有大部分對應能力
- 但這一層最不適合在 SQLite baseline 下直接追加導入

## 5. SQLite baseline 導入安全分級

### A 級：可直接評估導入（低風險）
1. SmartBooks 分類名稱/icon 顯示清洗
2. TutorHome / SmartBooks / AdminSmartBooks UI 一致性修補
3. Notes 頁登入入口修補（若 target 保留同 OAuth 模型）

### B 級：需先確認 target 現有表與 API（中風險）
4. ProgressDashboard 聚合格式與 UI 修補
5. SavedNotebook 顯示層修補
6. lesson points 完成狀態前端表現修補

### C 級：不可直接當 SQLite-safe 搬移（高風險）
7. ChapterLearning / Ask AI 主鏈
8. BookQuizTab
9. BookQATab / Essay
10. AdminSmartBooks batchUpload 一條龍
11. PDF annotations 新資料模型落地
12. credits / autoGrant / warnings 相關表相依

## 6. implementation issue 與人工核准建議

### 建議立即開 issue（可先做）
1. `SmartBooks category display normalization from OAUTH`
   - 類型：implementation issue
   - 人工核准：需要
   - 原因：雖小，但會動 UI + category API 輸出

2. `smart_book_settings fallback port for PR4`
   - 類型：implementation issue
   - 人工核准：需要
   - 原因：會動 server router 行為

3. `Notes login entry parity audit`
   - 類型：implementation issue
   - 人工核准：需要
   - 原因：涉及 OAuth flow，不應默默變更

### 建議先開分析 issue、暫不施工
4. `ChapterLearning / Ask AI portability under SQLite baseline`
5. `Lesson points data model compatibility audit`
6. `PDF annotations data portability audit`
7. `AdminSmartBooks batchUpload portability audit`
8. `Credits and warnings schema dependency audit`

## 7. 建議 dispatch 順序

### 第一批：只搬已驗證 hotfix，不碰核心資料模型
1. SmartBooks / SmartBooksBookTabs / AdminSmartBooks 分類顯示修補
2. smartBookRouter 類別資料 normalize
3. featureTogglesRouter / smartBookLearningRouter / smartBookRouter 的 `smart_book_settings` fallback

### 第二批：補使用者體驗一致性
4. TutorHome icon/類別顯示一致性
5. Notes 登入入口一致性
6. ProgressDashboard / notebook 純 UI 修補

### 第三批：獨立審核高風險模組
7. ChapterLearning / Ask AI
8. lesson points data model
9. PDF annotations persistence
10. batchUpload / auto-process
11. credits / warnings / grant tables

## 8. 建議交給各代理的第一任務

### OpenClaw 第一任務

任務：搬移 `smart_book_settings` 缺表 fallback 與 server normalize 補丁

範圍：
- `server/routers/smartBookLearningRouter.ts`
- `server/routers/featureTogglesRouter.ts`
- `server/routers/smartBookRouter.ts`

理由：
- 純後端小範圍
- 直接降低 TRPCClientError / 缺表炸頁風險
- 不動 DB schema，不動 UI 設計

驗收：
- diff 只限上述 router
- route 名稱與 input/output 不擴散
- 若 `smart_book_settings` 缺失，前端主要頁面仍可打開

### Claude Code 第一任務

任務：搬移 SmartBooks / TutorHome / AdminSmartBooks 類別顯示修補

範圍：
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookTabs.tsx`
- `client/src/pages/AdminSmartBooks.tsx`
- `client/src/pages/TutorHome.tsx`
- 必要時新增或搬移 `client/src/lib/smartBookCategoryDisplay.ts`

理由：
- 這是 OAUTH handoff 明確驗證過的修正
- 低風險，高可見度
- 不需重做頁面架構

驗收：
- 不再直接 render 原始 `cat.icon`
- 分類名/圖示在書籍列表、後台、首頁一致
- 不更動其他 SmartBook 業務邏輯

### Codex CLI 第一任務

任務：做 PR4 SmartBook phase-0/phase-1 驗證腳本與 checklist

內容：
- 驗證目標 repo 是否存在 9 模組對應檔
- 驗證 OAUTH 與 PR4 差異是否只集中在既知 hotfix 檔
- 驗證 `drizzle/schema.ts` 是否未被非授權修改
- 驗證本階段變更不碰 batchUpload / Ask AI / quiz 大模組

理由：
- 避免施工範圍失控
- 適合做 read-only verification

## 9. 最終結論

1. `ai_tutor_helper_OAUTH` 的 SmartBook 核心 9 模組，本機可驗證版本已大多存在於 `AI-SmartBook-R1-PR4`。
2. PR4 當前缺口主要不是功能不存在，而是：
   - OAUTH 驗證過的 UI 顯示修補未完全帶入
   - `smart_book_settings` 缺表 fallback 等後端穩定性補丁未完全帶入
   - OAuth / Notes 入口一致性略有差異
3. 在 SQLite baseline 下，第一批只能安全導入「顯示層 + fallback 層 + 小型 UX 修補」。
4. ChapterLearning / Ask AI / lesson points persistence / PDF annotations persistence / batchUpload / credits 等都不應直接視為 SQLite-safe，必須拆 issue、人工核准、再決定是否施工。
5. 因本機未持有你提到的 docs 分支，本文件應視為「本機可驗證 engineering plan」；若之後同步到 `docs/pr4-main-architecture-sqlite-policy`，建議再做一次 branch-aware diff 確認。

## 10. 建議下一步

1. 先人工核准第一批低風險 hotfix：
   - category display normalization
   - smart_book_settings fallback port
2. 核准後派 OpenClaw 做 server fallback。
3. 再派 Claude Code 做 SmartBooks/TutorHome/AdminSmartBooks UI 修補。
4. 最後派 Codex CLI 做 read-only 驗證。
5. 高風險模組另開 issue，不在第一批施工內處理。

## 11. 接續回報（2026-07-05 追加驗證）

這一輪我補做了「來源 OAUTH vs 目標 PR4 本機樹」的實際檔案驗證，重點如下。

### 11.1 branch / docs 狀態

實測：
- `AI-SmartBook-R1-PR4` 目前 branch 是 `main`
- 本機未看到 `docs/pr4-main-architecture-sqlite-policy`

因此本文件仍然是「以本機可讀內容為準」的 phase-0 工程分析，而不是 branch-locked 分析。

### 11.2 9 模組對應檔，目標 repo 確實大多已存在

我再次驗證下列檔案在 source / target 兩邊都存在：
- `client/src/pages/SmartBooks.tsx`
- `client/src/pages/SmartBooksBookDetail.tsx`
- `client/src/pages/SmartBooksChapterLearning.tsx`
- `client/src/pages/AdminSmartBooks.tsx`
- `server/routers/smartBookRouter.ts`
- `server/routers/smartBookLearningRouter.ts`
- `server/routers/lessonPointsRouter.ts`
- `server/routers/pdfHighlightsRouter.ts`
- `server/routers/pdfImageNotesRouter.ts`
- `server/routers/featureTogglesRouter.ts`
- `drizzle/schema.ts`

補充一個重要結構差異：
- target 並不是把 `ProgressDashboard`、`SavedNotebook`、`BookQuizTab`、`BookQATab`、`BookQATabWithEssay` 分散成獨立 page 檔
- 而是集中定義在 `client/src/pages/SmartBooksBookTabs.tsx`，再由 `SmartBooksBookDetail.tsx` import 使用

這代表：
- 功能有對應，但搬 patch 時要用「元件實際所在檔」對齊，不能只照來源檔名硬套

### 11.3 前端主流程，這次有實際 code-level 對照

已確認 target 中：
- `SmartBooks.tsx` 仍走 `trpc.smartBookStudent.list.useQuery()` 與 `trpc.smartBookStudent.listCategories.useQuery()`
- `SmartBooks.tsx` 也會查 `trpc.bookAccess.getItemRules.useQuery()`
- `SmartBooksBookDetail.tsx` 內有 `activeTab`，並切 `chapters | notebook | credits | quiz | qa | exam | live-practice`
- `SmartBooksBookDetail.tsx` 直接 import：
  - `ProgressDashboard`
  - `BookQuizTab`
  - `BookQATab`
  - `BookQATabWithEssay`
  - `SavedNotebook`
  - `BookExamTab`
  - `BookLivePracticeTab`
- `SmartBooksBookDetail.tsx` 內已串：
  - `trpc.smartBookLearning.getCreditHistory.useQuery()`
  - `trpc.smartBookLearning.getCredits.useQuery()`
  - `trpc.smartBookStudent.getBookQA.useQuery()`
  - `trpc.examSetStudent.listEssayQuestions.useQuery()`
  - `trpc.pdfImageNotes.listByBook.useQuery()`
  - `trpc.pdfImageNotes.save.useMutation()`

所以前端使用者旅程可進一步具體化成：
1. SmartBooks 先抓 category + books + access rules
2. 點書後進 `BookDetail`
3. `BookDetail` 依 activeTab 切對應子模組
4. `splitNoteMode` 走 `PdfViewer + DrawingCanvas + pdfImageNotes.save`
5. QA / quiz / progress / notebook 再各自觸發 tRPC query / mutation

### 11.4 OAUTH 已驗證 patch，目標 repo 的確還沒完全帶進來

這次做了 source/target 差異抽查，得到的結論比前一版更明確：

1. SmartBooks 類別顯示 patch
- source 有 `@/lib/smartBookCategoryDisplay`
- target diff 仍看得到直接 render `cat.icon`
- 這與 handoff 提到的 `books.png + clean display` 修正一致

2. `smartBookRouter.ts` fallback / normalization patch
- source 有 `normalizeSmartBookCategoryForClient(...)`
- source 有 `smart_book_settings` 缺表判斷與 warning fallback
- target diff 中這些修補仍未對齊

3. `featureTogglesRouter.ts` fallback patch
- source 有 `smart_book_settings` 缺表容錯
- target 抽查差異顯示這段仍未完整對齊

4. `smartBookLearningRouter.ts` fallback patch
- source 有 `smartBookLearning.getBookSettings` 的缺表 fallback
- target 抽查差異顯示這段仍未完整對齊

所以目前最適合第一批搬移的，仍然是：
- category display normalization
- `smart_book_settings` missing-table fallback

### 11.5 SQLite baseline 風險，這次可更明確地下結論

我補查 `drizzle/schema.ts` 與相關 router，結果如下：

1. `drizzle/schema.ts` 使用的是 `mysqlTable`，不是 `sqliteTable`
- 這表示 target 現況的 schema 定義本身就是 MySQL-oriented
- 所以不能把「能在 MySQL fallback 跑」直接等同於「SQLite baseline 安全」

2. `pdfHighlightsRouter.ts` / `pdfImageNotesRouter.ts` 內含 MySQL 風格 DDL
- `CREATE TABLE IF NOT EXISTS pdf_highlights (...) id int AUTO_INCREMENT ...`
- `CREATE TABLE IF NOT EXISTS pdf_image_notes (...) id int AUTO_INCREMENT ...`
- `pdf_image_notes` 還會查 `INFORMATION_SCHEMA.COLUMNS`

這些都不是 SQLite baseline 可直接照搬的做法。

因此第 8 點現在可以更嚴格地改寫為：
- 純顯示層 hotfix：大多可視為 SQLite-safe
- 單純「遇缺表時 return default / [] / false」的容錯邏輯：通常可評估導入
- 任何直接依賴 `mysqlTable` schema、`AUTO_INCREMENT`、`INFORMATION_SCHEMA`、MySQL JSON/DDL 行為的 patch：不可直接視為 SQLite-safe

### 11.6 implementation issue / 人工核准，現在可以更細拆

建議拆成三層：

A. 可先開 implementation issue，待人工核准後再做
- `SmartBooks category display normalization from OAUTH`
- `smart_book_settings fallback parity for SmartBooks routers`

B. 先開 analysis issue，不直接施工
- `PDF annotations persistence portability under SQLite baseline`
- `Lesson points / guided learning persistence portability under SQLite baseline`
- `Credit transactions / credits tab portability under SQLite baseline`

C. 明確列為本批不做
- Ask AI / `sendMessage` 主流程搬運
- quiz / exam / live-practice 的 schema 擴張
- batchUpload / SmartBook ingestion pipeline 的 DB 補表

## 12. 本輪修正文檔後的最終判定

1. 9 個模組不是「PR4 沒有」，而是「PR4 已有大骨架，但 OAUTH 驗證過的小修補尚未完全同步」。
2. 目前最值得先做的是 UI normalization 與 missing-table fallback parity，不是大模組重做。
3. `smartBookRouter.ts`、`featureTogglesRouter.ts`、`smartBookLearningRouter.ts` 是最適合做 phase-1 小範圍 patch 的後端目標。
4. `pdfHighlights` / `pdfImageNotes` / lesson points / credits 雖然功能存在，但因 schema 與 runtime 明顯 MySQL-oriented，不能直接標成 SQLite baseline safe。
5. 若你要我下一步接著做，我建議只進到「issue 拆分 + patch 邊界定義」，先不要直接實作程式碼。
