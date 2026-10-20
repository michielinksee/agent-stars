---
error_key: mcp-504-na-notion-hosted-large-database-timeout
error_text: "Notion hosted MCP (mcp.notion.com) times out / 504 Gateway Timeout when querying a large database (thousands of rows, formula columns)"
service_id: notion
component: Notion hosted MCP server (mcp.notion.com); makenotion/notion-mcp-server (open source, stdio)
environments: [Claude Desktop, Claude Code, Cursor, other]
transport: streamable-http
organ_stopped: 完遂
symptom_class: other
applies_when: 数千行・formula/rollup 列の多い Notion データベースを MCP 経由で一括で読もうとして、ツール呼び出しがタイムアウトするとき
first_check: 呼び出しにフィルタと page_size を付けているか（データベースページごと notion-fetch していないか）
what_was_true: Notion の MCP ガイドにタイムアウト値や page size の指針はない（確認できない）。公開されているのは API 側の事実: 大きなデータソースは 504・formula/rollup は遅い経路・1 クエリ最大 10,000 件・page_size 最大 100。open-source の Issue はホスト型の窓口ではない。
how_resolved: |
  - Query narrowly: filter on simple properties (status / date / last_edited_time / created_time), set page_size to 25–50, paginate with start_cursor.
  - Avoid notion-fetch on the database page itself; use the query tool (notion-query-data-sources where the plan offers it).
  - Move formula/rollup logic out of the query path (compute client-side) and retry with backoff on timeouts.
  - For bulk reads use the REST API directly (/v1/data_sources/{id}/query) with your own page_size and HTTP timeout.
  - Hosted-server bugs go to Notion support, not the open-source repo's Issues.
success_check: 同じデータベースに対して、フィルタ＋page_size 付きの呼び出しが結果と next_cursor を返し、タイムアウトしない
if_not_resolved: 429 rate_limited なら別の詰まり。タイムアウト値を測るなら経過秒・行数・列数を記録して追試へ
human_step_required: "no"
status: unverified
sources:
  - https://developers.notion.com/docs/mcp
  - https://developers.notion.com/guides/data-apis/query-large-data-sources
  - https://www.notion.com/en-gb/help/optimize-database-load-times-and-performance
  - https://github.com/makenotion/notion-mcp-server
  - https://community.softr.io/t/notion-integration-timing-out-for-complex-large-databases/15651
  - https://community.make.com/t/notion-api-bad-gateway/16455?page=3
source_count: 6
last_verified:
search_terms_seen:
  - "mcp.notion.com hosted MCP timeout large database query limit workaround"
  - "Notion MCP server large database query timeout \"formula\" pagination page_size 100 limit developers.notion.com MCP"
  - "makenotion/notion-mcp-server issue timeout large database thousands of rows"
  - "developers.notion.com Notion MCP \"notion-fetch\" \"notion-search\" database limits timeout rows hosted MCP documentation"
  - "Notion MCP mcp.notion.com timeout large database query limit workaround"
  - "Notion MCP \"notion-mcp-server\" timeout thousands of rows formula database query slow issue"
  - "developers.notion.com Notion MCP hosted mcp.notion.com tools notion-query-data-source limits timeout"
  - "Notion MCP mcp.notion.com timeout large database query limit"
  - "makenotion notion-mcp-server timeout large database formula properties issue"
  - "developers.notion.com Notion MCP hosted server limitations database query timeout"
  - "\"mcp.notion.com\" timeout database query site:github.com OR site:community.notion.com"
  - "Notion MCP timeout large database workaround"
  - "makenotion notion-mcp-server github issue timeout database query"
  - "Notion MCP \"timed out\" OR timeout large database Claude github issues site:github.com makenotion"
trail:
  - "A7 T-07 (2026-10-20): Notion MCP guide + Softr/Make community threads; no matching GitHub issue found"
  - "arm0-claude-run1-g2 (2026-10-20): four searches; developers.notion.com never surfaced; answer built from community threads and a third-party rate-limit page"
  - "arm0-claude-run2-g2 (2026-10-20): reached developers.notion.com query-large-data-sources (10,000-result cap, pagination) and a hosted tool list; no documented timeout"
  - "arm0-claude-run3-g2 (2026-10-20): reached Notion's performance help page (row/property limits, formula/rollup slow path); GitHub/community search for a timeout issue returned nothing"
  - "Dead ends seen: generic MCP-timeout tutorials, makenotion issues that were about create failures not timeouts"
retests: []
---

# Notion hosted MCP (mcp.notion.com) times out / 504 Gateway Timeout when querying a large database (thousands of rows, formula columns)

## 症状

- A tool call against a large Notion database (thousands of rows, formula columns) through the hosted MCP server does not return before the client's tool-call timeout; other integrations see the same shape as HTTP 504 Gateway Timeout from the Notion API.
- The open-source makenotion/notion-mcp-server Issues on this topic are unanswered.

## 該当条件

数千行・formula/rollup 列の多い Notion データベースを MCP 経由で一括で読もうとして、ツール呼び出しがタイムアウトするとき。

## 最初の確認

呼び出しにフィルタと page_size を付けているか。データベースページごと `notion-fetch` していないか。

## 解決手順

- Query narrowly: filter on simple properties (status / date / last_edited_time / created_time), set page_size to 25–50, paginate with start_cursor.
- Avoid `notion-fetch` on the database page itself; use the query tool (`notion-query-data-sources` where the plan offers it).
- Move formula/rollup logic out of the query path (compute client-side) and retry with backoff on timeouts.
- For bulk reads use the REST API directly (`/v1/data_sources/{id}/query`) with your own page_size and HTTP timeout.
- Hosted-server bugs go to Notion support, not the open-source repo's Issues; do not wait on them.

What is documented (Notion API, not the MCP server): a query returns at most 10,000 results (request_status "incomplete" when capped), page_size up to 100, filtering/sorting on formula or rollup properties is the slow path, databases can hold up to 250,000 rows and 500 properties. A timeout value for mcp.notion.com itself: 確認できない (no official page states one).

## 成功の確認

同じデータベースに対して、フィルタ＋page_size 付きの呼び出しが結果と next_cursor を返し、タイムアウトしない。

## 根拠

- https://developers.notion.com/docs/mcp (official MCP guide; no timeout or page-size guidance)
- https://developers.notion.com/guides/data-apis/query-large-data-sources (10,000-result cap, pagination, time windowing)
- https://www.notion.com/en-gb/help/optimize-database-load-times-and-performance (row/property limits, formula/rollup slow path)
- https://github.com/makenotion/notion-mcp-server (open-source server; not the hosted server's support channel)
- https://community.softr.io/t/notion-integration-timing-out-for-complex-large-databases/15651 and https://community.make.com/t/notion-api-bad-gateway/16455?page=3 (third-party reports: 504 on large/formula-heavy databases, smaller page size helped)
- 確認日: none (no lived observation by KanseiLINK; the hosted-MCP cutoff has not been timed). 環境: hosted MCP over streamable-http from any client.

## 解決しなかった場合

- 429 `rate_limited` なら別の詰まり（Retry-After に従う）。
- ホスト型のタイムアウト値を測りたい場合は、失敗した呼び出しの経過秒・行数・列数・エラー文を記録して「追試」に書く（まだ誰も測っていない）。
- human_step_required: no

## 調査の軌跡

- A7 T-07 (2026-10-20): Notion MCP guide + Softr/Make community threads; no matching GitHub issue found.
- arm0-claude-run1-g2 (2026-10-20): four searches; developers.notion.com never surfaced; answer built from community threads and a third-party rate-limit page.
- arm0-claude-run2-g2 (2026-10-20): reached developers.notion.com query-large-data-sources and a hosted tool list; no documented timeout.
- arm0-claude-run3-g2 (2026-10-20): reached Notion's performance help page; GitHub/community search for a timeout issue returned nothing.
- Dead ends seen: generic MCP-timeout tutorials; makenotion issues that were about create failures, not timeouts.

## 追試

(none yet)

## この記録の状態

status: `unverified` — extracted from official Notion API pages and community threads via route records; no lived observation. It does not affect any grade. No rates, no rankings.
