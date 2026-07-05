# AI-SmartBook-R1-PR4 Image Drive Sync Skill

> Purpose: when an AI-SmartBook-R1-PR4 related image is generated, also sync the image to the approved Google Drive folder.
>
> Repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Branch: `docs/pr4-main-architecture-sqlite-policy`
>
> Google Drive folder: `AI-SmartBook-R1#RP4`
>
> Folder ID: `1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_`
>
> Folder URL: `https://drive.google.com/drive/folders/1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_`

---

## 1. Trigger

Use this skill whenever a project-related image is created for AI-SmartBook-R1-PR4, including:

- architecture diagrams
- workflow diagrams
- agent division charts
- UI mockups
- SmartBook module maps
- validation screenshots that the user explicitly wants archived

The image should be uploaded to the Google Drive folder listed above.

---

## 2. Required Upload Target

All generated project images must be uploaded to:

```text
Folder name: AI-SmartBook-R1#RP4
Folder ID: 1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_
Folder URL: https://drive.google.com/drive/folders/1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_
```

---

## 3. File Naming Rule

Use this naming format:

```text
AI-SmartBook-R1-PR4-<topic>-<YYYYMMDD>-<sequence>.<ext>
```

Examples:

```text
AI-SmartBook-R1-PR4-agent-division-flow-20260705-001.png
AI-SmartBook-R1-PR4-smartbook-ui-map-20260705-001.png
AI-SmartBook-R1-PR4-hermes-roadmap-20260705-001.svg
```

Rules:

- Use English lowercase topic words separated by hyphens.
- Keep project prefix `AI-SmartBook-R1-PR4`.
- Use `.png` for raster images and `.svg` for vector diagrams.
- Avoid spaces and Chinese punctuation in file names.

---

## 4. Sync Procedure

### 4.1 After image generation

1. Confirm the generated image local path.
2. Confirm the image is project-related and safe to archive.
3. Upload to Google Drive folder ID `1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_`.
4. Record the uploaded Drive file URL in the final report.

### 4.2 Google Drive upload parameters

Use:

```text
parent_folder_id: 1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_
mime_type: image/png or image/svg+xml
```

---

## 5. Safety Rules

Do not upload images that contain:

- API keys
- OAuth client secrets
- tokens
- `.env` values
- private credentials
- private personal data not explicitly approved by the user
- screenshots of sensitive admin pages unless the user explicitly asks to archive them

If the image may contain sensitive data, stop and ask for manual approval before Drive sync.

---

## 6. GitHub Record Rule

When a generated image is important to project planning, also record it in GitHub docs or issue comments.

Recommended locations:

- `docs/ops/AI-SmartBook-R1-PR4-agent-division-flow.md`
- `docs/ops/AI-SmartBook-R1-PR4-agent-assignment-matrix.md`
- the relevant GitHub issue comment

Record:

```text
Image title:
Drive file URL:
Created date:
Related issue/doc:
```

---

## 7. Agent Responsibilities

| Agent | Responsibility |
| --- | --- |
| Hermes GPT-5.4 | Decide whether the image is part of planning docs and should be archived. |
| GPT-5.4 Medium | Check whether image content exposes forbidden information before upload. |
| Claude Sonnet 4.6 Thinking | Use synced UI/mockup images as visual reference for frontend planning. |
| AGY Gemini 3.5 Flash Medium | Verify the Drive file exists during fast QA. |
| AGY Gemini 3.1 Pro | Confirm important planning images are archived before final acceptance. |
| OpenClaw GPT-5.4 Mini xhigh | Do not upload images by default during coding; only upload if task explicitly requests image output. |

---

## 8. Completion Report Format

Every image-sync operation must finish in Traditional Chinese:

```markdown
- 狀態
  - success: <上傳成功項目與 Drive URL>
  - failure: <失敗項目，沒有則寫「無」>
  - blocker: <阻礙項目，沒有則寫「無」>
  - permission-halt: <需要人工核准項目，沒有則寫「無」>
```

Recommended extra fields:

- local image path
- Drive folder ID
- uploaded file ID
- uploaded file URL
- file name
- related GitHub doc or issue

---

## 9. Initial Verified Upload

Initial test upload completed:

```text
File name: AI-SmartBook-R1-PR4-agent-division-flow-20260705.png
Drive file ID: 1_njDbBEqGddVUR2a3UjL-qFXiuD-pb5p
Drive file URL: https://drive.google.com/file/d/1_njDbBEqGddVUR2a3UjL-qFXiuD-pb5p/view?usp=drivesdk
Parent folder ID: 1nx9YZHYEZzPxTWitAXgzOz3GS_YfF0A_
```

---

## 10. Next Use

Whenever a new AI-generated project image is created, run this skill and sync the generated file to the Drive folder before the final report.
