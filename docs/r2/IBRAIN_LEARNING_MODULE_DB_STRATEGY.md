# iBrain Learning Module Database Strategy

## Decision

At the current stage, do not create a separate website and do not split the product into multiple SQLite databases too early.

Use this initial architecture:

```text
One website
One main SQLite database
Three feature pages / modules
```

The three modules are:

```text
1. 智能影音
   - AWS video link or YouTube link
   - knowledge points
   - video Q&A

2. 高點考古題學習
   - PDF URL or local PDF
   - exam learning
   - question explanation

3. 課程答疑
   - PDF / image / Word / screenshot input
   - AI course Q&A
```

## Reason

These three features look different on the UI, but they share the same product core:

```text
learning resource + AI Q&A + notes + favorites + course context
```

Therefore, they should first be implemented as modules inside the same website instead of separate systems.

## Why not split too early

Creating a separate website or multiple SQLite databases too early will increase development burden:

```text
more routing
more deployment work
more duplicated user/account logic
more duplicated course/resource logic
more cross-database sync issues
more maintenance cost
```

At this stage, simple and maintainable is more important than premature separation.

## Recommended phase 1

Use one main SQLite database:

```text
app.sqlite
```

Suggested logical tables:

```text
users
courses
learning_resources
video_sources
document_sources
uploaded_files
knowledge_points
ai_chat_sessions
ai_chat_messages
notes
favorites
question_bank_items
job_status
```

The key shared abstraction is:

```text
LearningResource
```

A learning resource may come from:

```text
video | pdf | image | word | screenshot
```

## When to add AI index database / Qdrant / embeddings

Only add a second AI index layer when one of the following becomes true:

```text
1. Video transcripts, PDF chunks, OCR results, and embeddings become large enough to slow down the main SQLite database.
2. Retrieval needs become complex enough to require vector search.
3. Different modules need significantly different search indexes.
4. Different user groups require clearly separated data boundaries.
5. Different teams need to develop and deploy parts independently.
```

At that time, use:

```text
app.sqlite
+ ai_content.sqlite or Qdrant / Chroma / SQLite-vec
```

Suggested responsibility split:

```text
app.sqlite
- users
- courses
- learning_resources
- files
- notes
- favorites
- question_bank
- ai_chat_sessions
- job_status

ai_content.sqlite / vector store
- transcripts
- document_chunks
- OCR results
- knowledge point extraction
- embedding metadata
- retrieval index
```

## Architecture rule

Start simple:

```text
One website + one SQLite + three module pages
```

Scale later only when real bottlenecks appear:

```text
AI index DB / Qdrant / embeddings
```

## Main lesson from R1

R1 showed that features can grow faster than the system can absorb them.

For R2 and iBrain, the goal is:

```text
Do not split too early.
Do not over-engineer too early.
Keep one main structure.
Make modules clear.
Add AI index infrastructure only when necessary.
```

## Final summary

The current best architecture is:

```text
Same website
Same main system
One main SQLite database
Three modular pages
Future AI index layer only when data volume and retrieval complexity require it
```
