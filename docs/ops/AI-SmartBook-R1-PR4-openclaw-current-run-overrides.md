# AI-SmartBook-R1-PR4 OpenClaw Current Run Overrides

> Purpose: define current-run overrides that take precedence over older agent assignment wording.
>
> Repo: `b827262-cell/AI-SmartBook-R1-PR4`
>
> Branch: `docs/pr4-main-architecture-sqlite-policy`
>
> Date: 2026-07-05

---

## 1. OpenClaw Model Override

For the current AI-SmartBook-R1-PR4 dispatch cycle, use:

```text
OpenClaw model: GPT-5.4 Low
```

This replaces older references to:

```text
OpenClaw GPT-5.4 Mini xhigh
```

Current-run precedence rule:

```text
If any older planning document says OpenClaw GPT-5.4 Mini xhigh, treat it as OpenClaw GPT-5.4 Low for this run.
```

---

## 2. Execution Mode

OpenClaw remains a constrained project operator.

OpenClaw must not implement A1 or A2 until the workspace is fully ready and the user gives explicit approval.

Required flow:

```text
read planning docs
  ↓
run readiness / preflight
  ↓
report success, failure, blocker, permission-halt
  ↓
wait for explicit approval
  ↓
only then implement approved files
```

---

## 3. Current Blocker Handling

If OpenClaw is on branch `main`, readiness is blocker.

Correct target branch:

```text
docs/pr4-main-architecture-sqlite-policy
```

Correct target path:

```text
/home/b822726/project/AI-SmartBook-R1-PR4
```

Correct target remote:

```text
target https://github.com/b827262-cell/AI-SmartBook-R1-PR4.git
```

---

## 4. Required Planning Docs

OpenClaw should read these after switching to the correct branch:

```text
docs/ops/AI-SmartBook-R1-PR4-openclaw-execution-control.md
docs/ops/AI-SmartBook-R1-PR4-issue-splitting-and-approval-list.md
docs/ops/AI-SmartBook-R1-PR4-agent-assignment-matrix.md
docs/ops/AI-SmartBook-R1-PR4-hermes-engineering-plan.md
```

If any are missing after the branch is correct, report blocker.

---

## 5. Termination Report

Every OpenClaw run must finish in Traditional Chinese:

```markdown
- 狀態
  - success: <完成項目>
  - failure: <失敗項目，沒有則寫「無」>
  - blocker: <阻礙項目，沒有則寫「無」>
  - permission-halt: <權限或需人工確認項目，沒有則寫「無」>
```
