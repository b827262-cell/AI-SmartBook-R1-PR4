# AI-SmartBook-R1-PR4 ai_tutor_helper Module Analysis Spec

> Related issue: #12 `[PR4][Planning] Hermes Engineering Plan for SmartBook Feature Integration`
>
> Target repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Branch: `docs/pr4-main-architecture-sqlite-policy`
>
> Reference repo: `b827262-cell/ai_tutor_helper_OAUTH`

---

## 1. Goal

Hermes must analyze how the reference `ai_tutor_helper_OAUTH` project implements the learning-platform modules shown in the diagram, then write an engineering plan for safely integrating selected ideas into `AI-SmartBook-R1#4`.

This is analysis and planning only. Do not implement feature code in this task.

---

## 2. Modules to Analyze

1. 智能課堂
2. 智能知識
3. 智能書本
4. 智能影音
5. 智能練題
6. 智能題庫
7. 手寫筆記
8. 智能考情
9. 我的題庫

---

## 3. Required Per-Module Checklist

For every module, Hermes must identify:

- Frontend page or component path.
- Navigation route and menu entry.
- UI layout and visual style.
- Main user actions.
- Frontend state flow.
- API or tRPC call.
- Backend router or service.
- Database read tables.
- Database write tables.
- Insert, update, or delete events.
- Returned data shape.
- Equivalent feature in PR4, if any.
- Whether the feature can be added without schema change.
- Whether explicit approval is required.

---

## 4. Runtime Flow Template

For each module, use this format:

```text
UI page / component
  -> user action and frontend state
  -> API or tRPC call
  -> backend router / service
  -> database read/write
  -> returned response
  -> UI render result
```

---

## 5. Database Mapping Template

For each module, use this format:

```markdown
### <Module Name> Database Mapping

- Reference tables:
- Read behavior:
- Write behavior:
- User-specific data:
- Book/chapter/page/question/video linkage:
- PR4 equivalent:
- SQLite-first feasibility:
- Approval needed:
```

---

## 6. UI Design Mapping Template

For each module, use this format:

```markdown
### <Module Name> UI Design Mapping

- Navigation label:
- Icon style:
- Page layout:
- Card/table/list/tabs behavior:
- Active tab behavior:
- Loading/empty/error state:
- Mobile layout:
- Reusable components:
- PR4 reuse proposal:
```

---

## 7. Required Comparison Table

Hermes must include this table in the final engineering plan:

| Module | Existing in PR4 | Existing in ai_tutor_helper | Data write needed | UI work needed | Safe first phase? | Needs approval? |
| --- | --- | --- | --- | --- | --- | --- |
| 智能課堂 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能知識 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能書本 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能影音 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能練題 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能題庫 | TBD | TBD | TBD | TBD | TBD | TBD |
| 手寫筆記 | TBD | TBD | TBD | TBD | TBD | TBD |
| 智能考情 | TBD | TBD | TBD | TBD | TBD | TBD |
| 我的題庫 | TBD | TBD | TBD | TBD | TBD | TBD |

---

## 8. Required Output

Hermes must create:

```text
docs/ops/AI-SmartBook-R1-PR4-hermes-engineering-plan.md
```

The plan must include:

- Project goal and scope.
- Current PR4 architecture baseline.
- Reference analysis method.
- Per-module runtime flow.
- Per-module database mapping.
- Per-module UI design mapping.
- PR4 integration proposal.
- Phased roadmap.
- Acceptance criteria.
- Verification plan.
- Risk and rollback plan.
- Items requiring explicit approval.

---

## 9. Hard Boundaries

- Keep AI-SmartBook-R1 as the main architecture.
- Keep SQLite as the first-phase database baseline.
- Use `ai_tutor_helper_OAUTH` only as read-only reference material.
- Do not directly port OAuth.
- Do not directly port TiDB or MySQL architecture.
- Do not change schema, migrations, docker-compose, PDF reader core, Ask AI core, or lesson-point completion logic in this planning task.
- Do not commit secrets or environment values.

---

## 10. Final Report Requirement

Hermes final report must be in Traditional Chinese and include:

- success
- failure
- blocker
- permission-halt
- output file path
- analyzed modules
- recommended next step
