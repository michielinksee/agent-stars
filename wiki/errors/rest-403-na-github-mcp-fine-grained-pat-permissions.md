---
error_key: rest-403-na-github-mcp-fine-grained-pat-permissions
error_text: "Resource not accessible by personal access token (GitHub MCP server with a fine-grained PAT) — which repository permissions does each tool need?"
service_id: github
component: github/github-mcp-server (official; local Docker or remote https://api.githubcopilot.com/mcp/) with a fine-grained personal access token
environments: [Cursor, Claude Code, Claude Desktop, other]
transport: streamable-http
organ_stopped: 接続
symptom_class: permission_missing
applies_when: fine-grained PAT（classic でない）で GitHub MCP を動かし、特定のツールだけ権限エラーや 404 になる、または必要な権限表を探しているとき
first_check: PAT の Repository permissions に Contents / Issues / Pull requests / Actions があるか
what_was_true: 公式 README はツールごとに classic の OAuth スコープしか書かない。fine-grained の対応表 docs/tool-permissions.md は PR #1486 で追加されたが、main 上のそのパスは経路記録の時点で 404（確認できない）。表は PR の diff かコミットの raw でのみ読めた。
how_resolved: |
  - Read files (get_file_contents, search_code): Contents: Read.
  - Create issues (create_issue / issue_write): Issues: Read and write.
  - Open PRs (create_pull_request): Pull requests: Read and write; add Contents: Read and write if the server must push branches or files (create_branch, push_files, create_or_update_file).
  - Read Actions logs (get_job_logs, get_workflow_run_logs, list_workflow_runs): Actions: Read.
  - Metadata: Read is added automatically to every fine-grained PAT.
  - If the official table cannot be fetched on main, map tool → REST endpoint → GitHub's "permissions required for fine-grained personal access tokens" page.
success_check: PAT を入れた Cursor から read / issue / PR / Actions log の 4 ツールが 200 を返す
if_not_resolved: private repo で 404 なら Contents: read 不足の可能性（未観測）。org なら fine-grained PAT の許可を確認
human_step_required: "yes: GitHub の設定画面で PAT の権限を付け直す（org リポジトリなら org 管理者の承認が要ることがある）"
status: unverified
sources:
  - https://github.com/github/github-mcp-server
  - https://github.com/github/github-mcp-server/pull/1486/files
  - https://patch-diff.githubusercontent.com/raw/github/github-mcp-server/pull/1486.diff
  - https://raw.githubusercontent.com/github/github-mcp-server/5789475dba874160a6592d871d4da52bd3c0c651/docs/tool-permissions.md
  - https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens
  - https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md
source_count: 6
last_verified:
search_terms_seen:
  - "github/github-mcp-server fine-grained personal access token permissions required read files create issues pull requests actions"
  - "github-mcp-server \"tool-permissions.md\" fine-grained Contents Issues \"Pull requests\" Actions read"
  - "github-mcp-server fine-grained personal access token required permissions contents issues pull requests actions"
  - "github mcp server fine-grained PAT permissions issues pull requests actions"
  - "github-mcp-server fine-grained personal access token \"actions\" permission read workflow logs README"
  - "GitHub MCP server Cursor fine-grained personal access token mcp.json config"
  - "github-mcp-server fine-grained personal access token which permissions required Contents Issues Pull requests"
trail:
  - "A5 C-05 (2026-10-20): install-cursor.md + README; the per-tool fine-grained table was not found"
  - "arm0-claude-run1-g2 (2026-10-20): PR #1486 files view showed only the filename; the full table was read from the PR diff at patch-diff.githubusercontent.com"
  - "arm0-claude-run2-g2 (2026-10-20): docs/tool-permissions.md on main → 404; the raw file at the PR's commit (5789475…) returned the table"
  - "arm0-claude-run3-g2 (2026-10-20): both main paths → 404; fell back to GitHub's REST fine-grained permissions page"
  - "Dead ends seen: a third-party page mixing classic scopes with fine-grained names, a glama entry that was a different (unofficial) GitHub MCP server"
retests: []
---

# Resource not accessible by personal access token (GitHub MCP server with a fine-grained PAT) — which repository permissions does each tool need?

The GitHub REST API answers a fine-grained PAT that lacks a permission with HTTP 403 and the message above, or with 404 on a private repository. This card is about mapping github-mcp-server tools to fine-grained permissions; the error message itself was not observed in the route records (unverified).

## 症状

- Running github/github-mcp-server from Cursor with a fine-grained PAT. Some tools fail with a permission error (403) or "Not Found" (404) on a private repository, or the user cannot find which permissions to grant.
- fine-grained PAT で動かすと一部のツールだけ 403 / 404 になる。README はツールごとの classic スコープしか書かない。

## 該当条件

fine-grained PAT（classic でない）で GitHub MCP を動かし、特定のツールだけ権限エラーや 404 になる、または必要な権限表を探しているとき。

## 最初の確認

PAT の Repository permissions に Contents / Issues / Pull requests / Actions のどれが付いているか。Metadata: Read は自動で付く。

## 解決手順

| 目的 | ツール（例） | fine-grained Repository permission |
|---|---|---|
| read files | get_file_contents, search_code | Contents: Read |
| create issues | create_issue / issue_write | Issues: Read and write |
| open PRs | create_pull_request | Pull requests: Read and write (+ Contents: Read and write if the server pushes branches or files) |
| read Actions logs | get_job_logs, get_workflow_run_logs, list_workflow_runs | Actions: Read |

- Metadata: Read is added automatically to every fine-grained PAT.
- The official per-tool table (`docs/tool-permissions.md`, added in PR #1486) could not be fetched at that path on `main` in the 2026-10-20 route records (404). It was readable only through the PR diff or the raw file at the PR's commit. Whether it has since been moved or merged under another path: 確認できない.
- If the table cannot be fetched, map tool → REST endpoint → GitHub's "permissions required for fine-grained personal access tokens" page.
- Cursor: set `GITHUB_PERSONAL_ACCESS_TOKEN` in the env of the server entry (`docs/installation-guides/install-cursor.md`).

## 成功の確認

Cursor の mcp.json に GITHUB_PERSONAL_ACCESS_TOKEN を入れた状態で、4 種のツール（read / issue / PR / Actions log）がそれぞれ 200 を返す。

## 根拠

- https://github.com/github/github-mcp-server (official README; classic scopes per tool, Cursor install guide link)
- https://github.com/github/github-mcp-server/pull/1486/files (PR that added docs/tool-permissions.md)
- https://patch-diff.githubusercontent.com/raw/github/github-mcp-server/pull/1486.diff (the table, readable as a diff)
- https://raw.githubusercontent.com/github/github-mcp-server/5789475dba874160a6592d871d4da52bd3c0c651/docs/tool-permissions.md (the table at the PR's commit)
- https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens (GitHub REST permissions per endpoint)
- https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md
- 確認日: none (no independent KanseiLINK check of the table's current location). 環境: Cursor and other MCP clients, remote (streamable-http) or local Docker (stdio).

## 解決しなかった場合

- private repo で 404 が返るとき: Contents: read が無いと 404 (not 403) になり wrong repo name に見える可能性がある。この挙動は本カードでは未観測（確認できない）。権限を見直してから repo 名を疑う。
- org リポジトリなら、org が fine-grained PAT を許可しているか、PAT が承認待ちでないかを確認。
- human_step_required: yes

## 調査の軌跡

- A5 C-05 (2026-10-20): install-cursor.md + README; the per-tool fine-grained table was not found.
- arm0-claude-run1-g2 (2026-10-20): PR #1486 files view showed only the filename; the full table was read from the PR diff at patch-diff.githubusercontent.com.
- arm0-claude-run2-g2 (2026-10-20): `docs/tool-permissions.md` on main → 404; the raw file at the PR's commit returned the table.
- arm0-claude-run3-g2 (2026-10-20): both main paths → 404; fell back to GitHub's REST fine-grained permissions page.
- Dead ends seen: a third-party page mixing classic scopes with fine-grained names; a glama entry that was a different (unofficial) GitHub MCP server.

## 追試

(none yet)

## この記録の状態

status: `unverified` — extracted from the official repository, a merged PR and GitHub docs via route records; the error message and the 404-vs-403 behaviour have not been observed by KanseiLINK. It does not affect any grade. No rates, no rankings.
