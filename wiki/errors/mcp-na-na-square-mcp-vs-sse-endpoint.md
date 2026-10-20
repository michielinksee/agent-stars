---
error_key: mcp-na-na-square-mcp-vs-sse-endpoint
error_text: "Square MCP: developer docs say https://mcp.squareup.com/mcp but the GitHub README and MCP directories say /sse"
service_id: square
component: Square remote MCP server (hosted, Beta); square/square-mcp-server README
environments: [Claude Desktop, Claude Code, Cursor, other]
transport: streamable-http
organ_stopped: 接続
symptom_class: wrong_target
applies_when: 設定に書く Square の MCP URL を決めるとき、公式ドキュメントと README・ディレクトリの値が食い違っている
first_check: developer.squareup.com/docs/mcp に書かれている URL（確認時点では /mcp のみ）
what_was_true: 公式ドキュメントは /mcp のみ。README は 2026-10-14 の PR #33 で /mcp に更新され、「/sse は既存の SSE 設定のために引き続き提供」と明記。ディレクトリは更新前の README を写したまま。KanseiLINK の seed は 2026-09-18（September 18）に /sse→/mcp へ変更済み。
how_resolved: |
  - Put https://mcp.squareup.com/mcp (Streamable HTTP) in the config.
  - stdio-only clients: npx mcp-remote https://mcp.squareup.com/mcp
  - /sse is the older transport, still served for existing SSE configurations; not the recommended value for a new config. No shutdown date is published (as of 2026-10-20).
success_check: /mcp への initialize が成功し tools/list に get_service_info などが出る
if_not_resolved: OAuth 登録で 400 invalid_redirect_uri が出るなら、クライアントが Square の許可リストにあるかを確認（本カードの範囲外）
human_step_required: "no"
status: unverified
sources:
  - https://developer.squareup.com/docs/mcp
  - https://github.com/square/square-mcp-server/blob/main/README.md
  - https://github.com/square/square-mcp-server/pull/33
  - https://kansei-link.com/agent-wiki/services/square.html
source_count: 4
last_verified: 2026-09-18
search_terms_seen:
  - "Square MCP server mcp.squareup.com/mcp vs /sse endpoint"
  - "developer.squareup.com Square MCP server streamable HTTP mcp.squareup.com/mcp"
  - "Square MCP server remote endpoint (allowed_domains: developer.squareup.com)"
  - "github square/square-mcp-server README sse"
  - "square-mcp-server mcp.squareup.com/sse README (allowed_domains: github.com)"
  - "Square MCP server mcp.squareup.com /mcp vs /sse endpoint"
  - "developer.squareup.com Square MCP server docs streamable HTTP https://mcp.squareup.com/mcp"
  - "Square MCP server documentation (allowed_domains: developer.squareup.com, github.com)"
  - "Square MCP mcp.squareup.com/mcp vs /sse endpoint"
  - "developer.squareup.com Square MCP server endpoint mcp.squareup.com"
  - "Square MCP server developer.squareup.com docs remote hosted \"mcp.squareup.com\" (allowed_domains: developer.squareup.com, github.com)"
  - "Square MCP server endpoint mcp.squareup.com /mcp /sse"
  - "developer.squareup.com MCP server documentation"
trail:
  - "A7 T-05 (2026-10-20): two searches; the first returned only directories, the second was restricted to the official domain → docs + README"
  - "arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): in every run the first searches surfaced only directory copies (mcpservers.org, mcp.so, playbooks, typingmind); restricting to developer.squareup.com / github.com reached the docs, the README and PR #33"
  - "Dead ends seen: mcpservers.org (403 to the fetcher), playbooks.com (404), mcpplaygroundonline.com (says /mcp, silent on /sse), docs-mcp.getzep.com (a different vendor's /sse deprecation)"
retests: []
---

# Square MCP: developer docs say https://mcp.squareup.com/mcp but the GitHub README and MCP directories say /sse

Which endpoint goes in the config, and is `/sse` dead?

## 症状

- Official developer docs give `https://mcp.squareup.com/mcp`; the GitHub README (before 2026-10-14) and several MCP directories give `https://mcp.squareup.com/sse`. The two official sources disagreed, and the directories copied the older README.
- 公式ドキュメントと公式 README が食い違い（2026-09-18 観測）、ディレクトリは古い README を写していた。

## 該当条件

設定に書く Square の MCP URL を決めるとき、公式ドキュメントと README・ディレクトリの値が食い違っている。

## 最初の確認

developer.squareup.com/docs/mcp に書かれている URL。確認時点（2026-09-18, 2026-10-20）では `/mcp` のみで、`/sse` には触れていない。

## 解決手順

- Put `https://mcp.squareup.com/mcp` (Streamable HTTP) in the config.
- stdio-only clients: `npx mcp-remote https://mcp.squareup.com/mcp`.
- `/sse` is the older transport. The README updated on 2026-10-14 (PR #33) states that the older `/sse` endpoint is still served for existing SSE configurations. It is not the recommended value for a new config, and no shutdown date is published.
- The conflict comes from the README and the directories lagging behind the docs; prefer the developer docs.
- KanseiLINK's own seed changed `/sse` → `/mcp` on 2026-09-18 (September 18) after confirming the official docs; on that date the README still listed `/sse`, and third-party directories carried the README value.

## 成功の確認

`/mcp` に対する initialize が成功し、tools/list に `get_service_info` / `get_type_info` / `make_api_request` が出る。

## 根拠

- https://developer.squareup.com/docs/mcp (official docs; `/mcp` only)
- https://github.com/square/square-mcp-server/blob/main/README.md (official README; `/mcp` since PR #33)
- https://github.com/square/square-mcp-server/pull/33 (merged 2026-10-14; README `/sse` → `/mcp`, notes `/sse` still served)
- https://kansei-link.com/agent-wiki/services/square.html (KanseiLINK service page; `/mcp`, checked 2026-09-18)
- 確認日: 2026-09-18 (KanseiLINK independent check of the docs); the README change was read in the 2026-10-20 route records, not re-verified by KanseiLINK.
- 環境: any MCP client using the hosted server (Claude Desktop, Claude Code, Cursor, Claude.ai integrations).

## 解決しなかった場合

- OAuth 登録で 400 invalid_redirect_uri が出るなら、クライアントが Square の許可リストにあるかを確認（別の詰まり・本カードの範囲外）。
- human_step_required: no

## 調査の軌跡

- A7 T-05 (2026-10-20): two searches; the first returned only directories, the second was restricted to the official domain → docs + README.
- arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): in every run the first searches surfaced only directory copies; restricting to developer.squareup.com / github.com reached the docs, the README and PR #33.
- Dead ends seen: mcpservers.org (403 to the fetcher), playbooks.com (404), mcpplaygroundonline.com (says `/mcp`, silent on `/sse`), docs-mcp.getzep.com (a different vendor's `/sse` deprecation).

## 追試

(none yet)

## この記録の状態

status: `unverified` — extracted from route records and the public pages they reached; the endpoint value itself was independently checked by KanseiLINK on 2026-09-18, but this card as a whole has not been re-verified. It does not affect any grade. No rates, no rankings.
