---
service_id: freee
name: freee
status: lived
observer: human:synapse-arrows
last_verified: 2026-10-07
cards:
  - AWT-001
  - AWT-002
sources:
  - https://kansei-link.com/insights/agent-field-notes.json
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-001
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-002
  - https://kansei-link.com/en/insights/agent-field-notes-2026-10.html
---

# freee — agent field notes (lived, one observer, no blame)

**What this is**: two lived observations from using freee's official MCP server (`freee-mcp`). Each card is one observer's record; there are no rates, rankings or comparisons. Status `lived` means it happened in real work, not in a sealed probe.

**Connection**: freee-mcp (official) talks to the freee REST API (`/api/1/...`) under an OAuth app registered by the user. The MCP keeps a persisted "current company" (事業所) in its config file.

## Known pitfalls

## エラー contains freee_set_current_company — freee_api_get rejects a company_id that differs from the current company (AWT-001)

- card_id: AWT-001 / kind: lived / observer: human:synapse-arrows / observed_on: 2026-09-24 (through 2026-10-01, reproduced in daily observation)
- component: freee-mcp (official) tool `freee_api_get`
- error_key: `{layer: mcp, message_pattern: "contains freee_set_current_company"}`
- what_the_agent_saw: passing a `company_id` that differs from the current company to `freee_api_get` is rejected with an error telling you to switch with `freee_set_current_company`.
- what_was_true: freee-mcp persists the "current company" in its config file and refuses calls to any other company. There are two company identifiers (the API `id` is 8 digits; the 事業所番号 is 10 digits). `freee_list_companies` returns formatted text, not JSON.
- how_resolved: call `freee_set_current_company` first (using the API `id`), do the work, then switch back.
- human_step_required: no

## 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです (AWT-002)

- card_id: AWT-002 / kind: lived / observer: human:synapse-arrows / observed_on: 2026-09-20
- component: freee-mcp (0.26 series) + the observer's own freee app (OAuth registration)
- operation: `GET /api/1/invoices`
- error_key: `{layer: rest, http_status: 403, provider_code: forbiddenError, message_pattern: "このアプリケーションにはアクセス権限がないエンドポイントです", wrapper_message_pattern: "freee-mcp adds a hint about possible rate limiting / re-authentication"}`
- what_the_agent_saw: auth succeeds and companies are visible, but only the invoices API is rejected with a permission error. 5 attempts, 5 failures.
- what_was_true: the connected freee app (OAuth registration) did not have the invoice permission. Not a token-expiry or wrong-endpoint problem. Diagnosable from the error text alone. Not a freee-side problem; a mis-configuration on the observer's side.
- how_resolved: unresolved at the time. A human must add the invoice permission to the app and re-consent. An agent cannot fix this.
- human_step_required: yes: grant the permission on the app and re-consent

## Last checked

Published 2026-10-07 (KanseiLINK agent field notes, first issue). Source schema: `kansei-agent-field-notes/v1`.
