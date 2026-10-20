---
service_id: freee
name: freee
status: lived
observer: human:synapse-arrows
last_verified: 2026-10-07
cards:
  - AWT-001
  - AWT-002
error_cards:
  - rest-403-forbiddenError-freee-invoices
  - mcp-na-na-freee-current-company-mismatch
sources:
  - https://kansei-link.com/insights/agent-field-notes.json
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-001
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-002
  - https://kansei-link.com/en/insights/agent-field-notes-2026-10.html
---

# freee — error card index (lived, one observer, no blame)

**What this is**: an index of the error cards for freee's official MCP server (`freee-mcp`). Each card is one observer's record; there are no rates, rankings or comparisons. Status `lived` means it happened in real work, not in a sealed probe.

**Connection**: freee-mcp (official) talks to the freee REST API (`/api/1/...`) under an OAuth app registered by the user. The MCP keeps a persisted "current company" (事業所) in its config file.

## Error cards

| error_key | error_text | environment | status | card |
|---|---|---|---|---|
| [rest-403-forbiddenError-freee-invoices](errors/rest-403-forbiddenError-freee-invoices.md) | 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです | Claude Code / rest | lived | AWT-002 |
| [mcp-na-na-freee-current-company-mismatch](errors/mcp-na-na-freee-current-company-mismatch.md) | freee_api_get error: company_id differs from the current company — use freee_set_current_company | Claude Code / stdio | lived | AWT-001 |

Search the error text you saw; each card's H1 is the error text verbatim.

### Quick pointers (the detail is in the cards)

- 403 forbiddenError on `GET /api/1/invoices` with auth working: the connected freee app lacks the invoice permission. Not a token problem; the wrapper's rate limiting hint is a red herring; 5 attempts, 5 failures; a human must grant the permission and re-consent (`human_step_required: yes`). An agent cannot fix this.
- `freee_api_get` rejecting a different `company_id`: switch with `freee_set_current_company` using the API `id` (8 digits, not the 10 digits 事業所番号), do the work, then switch back (`human_step_required: no`). `freee_list_companies` returns formatted text, not JSON.
  日本語: 事業所の識別子は二つある（API の id は 8桁・事業所番号は 10桁）。`freee_list_companies` の出力は整形テキストで JSON ではない。先に `freee_set_current_company` で切り替え（API の id を使う）、終わったら元の事業所に戻す。

## Last checked

Published 2026-10-07 (KanseiLINK agent field notes, first issue). Source schema: `kansei-agent-field-notes/v1`. Cards split out into `wiki/errors/` on 2026-10-20.
