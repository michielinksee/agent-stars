---
error_key: mcp-na-na-atlassian-failed-to-convert-markdown-to-adf
error_text: "Failed to convert markdown to adf (editJiraIssue, Atlassian Rovo MCP server)"
service_id: atlassian-atlassian-mcp-server
component: atlassian/atlassian-mcp-server (Atlassian Rovo MCP Server, remote), tool editJiraIssue
environments: [Claude Desktop, Claude Code, Cursor, other]
transport: streamable-http
organ_stopped: 完遂
symptom_class: format
applies_when: editJiraIssue の description に ADF の JSON を渡して更新しようとしたとき（取得や作成は通る）
first_check: description に渡しているのが Markdown の文字列か、ADF の JSON オブジェクトか
what_was_true: Issue 2 件（#42 2026-01、#104 2026-03）が同じ文言で立ち、どちらも 2026-03-18 に closed（resolved）。両者とも description に ADF JSON を渡した場合の報告。ツールは Markdown を ADF に変換する前提。直った版や正確な入力仕様は Issue からは確認できない。
how_resolved: |
  - Pass the description as Markdown text (what the tool converts), not as an ADF JSON object.
  - If raw ADF is required, use the Jira REST API v3 directly (PUT /rest/api/3/issue/{key}) instead of the MCP tool.
  - Both Issues are closed as resolved on 2026-03-18; re-test on the current server before working around.
success_check: editJiraIssue が成功し、getJiraIssue で更新後の description が読める
if_not_resolved: ADF の中身が落ちる／メンションが平文なら #60, #136。media-heavy ADF の読み取りで hang なら #145
human_step_required: "no"
status: extracted_from_issue
sources:
  - https://github.com/atlassian/atlassian-mcp-server/issues/42
  - https://github.com/atlassian/atlassian-mcp-server/issues/104
  - https://github.com/atlassian/atlassian-mcp-server
  - https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/
source_count: 4
last_verified:
search_terms_seen: []
trail:
  - "2026-06-08 snapshot of GitHub Issues (180 days, 6 repositories): this error text is the most frequent quoted error string among services not already covered by another card — 2 Issues with the same message on atlassian/atlassian-mcp-server (#42, #104), both closed as resolved on 2026-03-18; 9 Issues in the same repository mention ADF in some form"
  - "Issue bodies were not transcribed; only the tool name, the field, the input shape and the close date were extracted"
  - "No route record (search) exists for this error"
retests: []
---

# Failed to convert markdown to adf (editJiraIssue, Atlassian Rovo MCP server)

## 症状

- `editJiraIssue` を使って Jira issue の description を更新すると、この文言で失敗する。issue の取得や作成は通る。
- Reported twice with the same message, both times when the caller passed an Atlassian Document Format (ADF) JSON document in the `description` field.

## 該当条件

`editJiraIssue` の description に ADF の JSON を渡して更新しようとしたとき（取得や作成は通る）。

## 最初の確認

description に渡しているのが Markdown の文字列か、ADF の JSON オブジェクトか。

## 解決手順

- Pass the description as Markdown text (the tool's name for the failure says it converts Markdown to ADF), not as an ADF JSON object.
- If raw ADF is required (mentions, media, task lists), call the Jira REST API v3 directly (`PUT /rest/api/3/issue/{key}`) instead of the MCP tool.
- Both Issues are closed as resolved on 2026-03-18. Whether the current server accepts ADF directly, and in which version it changed: 確認できない from the Issues alone — re-test on the current server before working around.

## 成功の確認

`editJiraIssue` が成功し、`getJiraIssue` で更新後の description が読める。

## 根拠

- https://github.com/atlassian/atlassian-mcp-server/issues/42 (opened 2026-01-20, closed 2026-03-18, resolved; 7 comments)
- https://github.com/atlassian/atlassian-mcp-server/issues/104 (opened 2026-03-11, closed 2026-03-18, resolved)
- https://github.com/atlassian/atlassian-mcp-server (official repository)
- https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/ (official getting-started)
- 確認日: none (not reproduced by KanseiLINK). Source snapshot: KanseiLINK's GitHub Issue intake of 2026-06-08 (180 days). 環境: remote MCP over streamable-http from any client.

## 解決しなかった場合

- ADF のリッチな内容が落ちる／メンションが平文になる場合は別の Issue 群（#60, #136）。
- media-heavy な ADF のコメント読み取りで hang する場合は #145。
- human_step_required: no

## 調査の軌跡

- 2026-06-08 snapshot of GitHub Issues (180 days, 6 repositories): this error text is the most frequent quoted error string among services not already covered by another card — 2 Issues with the same message (#42, #104), both closed as resolved on 2026-03-18; 9 Issues in the same repository mention ADF in some form.
- Issue bodies were not transcribed; only the tool name, the field, the input shape and the close date were extracted.
- No route record (search) exists for this error: `search_terms_seen` is empty.

## 追試

(none yet)

## この記録の状態

status: `extracted_from_issue` — extracted from two public GitHub Issues; not reproduced by KanseiLINK. It does not affect any grade. No rates, no rankings.
