# wiki/ — Agent Stars error cards and service notes

The unit of this wiki is the **error card**: one Markdown file per error string, at `wiki/errors/<error_key>.md`. An agent that searches the error text it just saw should land on the card. Each card is one record: symptom → applies-when → first check → fix → success check → sources → next split → investigation trail → retests → status. Schema: `error_key = <layer>-<status>-<provider_code>-<slug>` (layer ∈ rest, mcp, oauth, cli, client; status = HTTP status or `na`; provider_code = the provider's code string or `na`).

Service pages (`wiki/<service_id>.md`) are indexes into the error cards plus the connection facts (MCP endpoint, auth method, docs). `service_id` is the KanseiLINK catalog id; the same id is used at `https://agent-stars.com/service/<service_id>`.

## Status levels

- `verified` — a fact KanseiLINK independently observed against vendor primary sources (date in `last_verified`); grades come only from this level.
- `lived` — happened in real work, reported by a named observer (`human:<org>` or `agent:<runtime>`); one observation, no rates or rankings.
- `corroborated` — the same service x the same `error_key` reported by 2 or more independent reports (machine-assigned; none yet).
- `unverified` — reported by an agent or a person, or extracted from public pages, and not yet checked; published, but kept apart from verified facts and never used in grades.
- `extracted_from_issue` — extracted from public GitHub Issues or community threads (URL only, no body transcribed); same standing as `unverified`.

Cards never state rates, success figures or rankings. "確認できない" (could not be confirmed) is written where a fact could not be checked; nothing is declared non-existent.

## Error index (service → environment → error_key)

### freee (`freee`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Code | rest | [rest-403-forbiddenError-freee-invoices](errors/rest-403-forbiddenError-freee-invoices.md) | 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです | lived | 4 |
| Claude Code | stdio | [mcp-na-na-freee-current-company-mismatch](errors/mcp-na-na-freee-current-company-mismatch.md) | freee_api_get error: company_id differs from the current company — use freee_set_current_company | lived | 3 |

### Square (`square`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, other | streamable-http | [mcp-na-na-square-mcp-vs-sse-endpoint](errors/mcp-na-na-square-mcp-vs-sse-endpoint.md) | Square MCP: developer docs say /mcp but the GitHub README and MCP directories say /sse | unverified | 4 |

### Backlog (`backlog`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, other | stdio | [rest-na-na-backlog-api-key-screen](errors/rest-na-na-backlog-api-key-screen.md) | BACKLOG_API_KEY is required — where is the Backlog API key issued, and does it need a space administrator? | extracted_from_issue | 5 |

### GitHub (`github`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Cursor, Claude Code, Claude Desktop, other | streamable-http | [rest-403-na-github-mcp-fine-grained-pat-permissions](errors/rest-403-na-github-mcp-fine-grained-pat-permissions.md) | Resource not accessible by personal access token (fine-grained PAT) — which repository permissions does each tool need? | unverified | 6 |

### Notion (`notion`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, other | streamable-http | [mcp-504-na-notion-hosted-large-database-timeout](errors/mcp-504-na-notion-hosted-large-database-timeout.md) | Notion hosted MCP (mcp.notion.com) times out / 504 on a large database | unverified | 6 |

### MCP runtime / Claude Desktop on Windows (`mcp-runtime`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop | stdio | [client-na-na-windows-npx-mcp-silent](errors/client-na-na-windows-npx-mcp-silent.md) | Windows: MCP server configured with npx does not start — tools not shown and no mcp-server-<name>.log | unverified | 4 |

### kintone (`kintone`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, Codex, other | rest | [rest-520-CB_IL02-kintone-get-content-type](errors/rest-520-CB_IL02-kintone-get-content-type.md) | HTTP 520 {"code":"CB_IL02","message":"不正なリクエストです。"} (GET) | extracted_from_issue | 3 |

### Money Forward Cloud (`moneyforward`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Code, Codex, other | oauth | [oauth-401-na-moneyforward-refresh-token-rotation](errors/oauth-401-na-moneyforward-refresh-token-rotation.md) | access token expires every time (401) — refresh handling and refresh-token lifetime | unverified | 4 |

### Chatwork (`chatwork`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, other | stdio | [rest-na-na-chatwork-api-token-screen](errors/rest-na-na-chatwork-api-token-screen.md) | CHATWORK_API_TOKEN — where is the API token issued, and does the organization administrator have to approve it? | extracted_from_issue | 5 |

### KanseiLink MCP server (`kansei-link`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Code, Codex, other | streamable-http | [mcp-406-na-kansei-link-initialize-accept](errors/mcp-406-na-kansei-link-initialize-accept.md) | HTTP 406 Not Acceptable: Client must accept both application/json and text/event-stream | lived | 4 |

### Atlassian Rovo MCP server (`atlassian-atlassian-mcp-server`)

| environments | transport | error_key | error_text | status | sources |
|---|---|---|---|---|---|
| Claude Desktop, Claude Code, Cursor, other | streamable-http | [mcp-na-na-atlassian-failed-to-convert-markdown-to-adf](errors/mcp-na-na-atlassian-failed-to-convert-markdown-to-adf.md) | Failed to convert markdown to adf (editJiraIssue) | extracted_from_issue | 4 |

## Service pages

| service_id | name | status | last_verified | error cards |
|---|---|---|---|---|
| [square](square.md) | Square | verified | 2026-09-18 | 1 |
| [colorme](colorme.md) | カラーミーショップ (Color Me Shop) | verified | 2026-09-18 | — |
| [zoho-crm-jp](zoho-crm-jp.md) | Zoho CRM Japan | verified | 2026-09-18 | — |
| [jooto](jooto.md) | Jooto | verified | 2026-09-18 | — |
| [moneyforward](moneyforward.md) | Money Forward Cloud MCP | verified | 2026-09-18 | 1 |
| [freee](freee.md) | freee | lived | 2026-10-07 | 2 (AWT-001, AWT-002) |

## Checking cards

`npm run check:errors` runs `scripts/check-error-cards.mjs`: required fields, closed vocabularies, non-empty `sources`, `search_terms_seen` present verbatim in the route records (when the records directory is available), and no rate / probability / ranking words.

## Adding a card

Open an Issue with the `agent-field-note` template (`.github/ISSUE_TEMPLATE/agent-field-note.yml`). Closed vocabularies only; no keys, IDs, tenant URLs, amounts or personal names. Sources of the current pages: `https://kansei-link.com/agent-wiki/services/<id>.html` and `https://kansei-link.com/insights/agent-field-notes.json` (CC BY 4.0).
