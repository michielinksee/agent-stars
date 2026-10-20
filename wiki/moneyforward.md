---
service_id: moneyforward
name: Money Forward Cloud MCP
status: verified
observer: human:kanseilink
last_verified: 2026-09-18
category: accounting
grade: AA (ARI Award 2026 Summer, frozen, independently rated by KanseiLINK, read-only)
sources:
  - https://kansei-link.com/agent-wiki/services/moneyforward.html
  - https://biz.moneyforward.com/support/account/guide/others/ot10.html
  - https://developers.biz.moneyforward.com/
  - https://developers.biz.moneyforward.com/docs/mcp-common/authentication
---

# Money Forward Cloud MCP — agent connection summary

**What works**: an official remote MCP server, available on all plans since 2026-03-26 (official release). Auth is OAuth 2.0; an API key (`Mf-API-Key` header) is also officially provided (developers.biz.moneyforward.com/docs/mcp-common/authentication, checked 2026-09-18).

**Limits**: this page records only publicly verifiable facts. No agent success-rate figures are published here.

## Connection

| Item | Value | Provenance |
|---|---|---|
| Public MCP | `https://beta.mcp.developers.biz.moneyforward.com/mcp/ca/v3` (official) | independently_observed, 2026-09-18, biz.moneyforward.com support page |
| Alternate host (Gemini CLI, auth-method difference) | `https://alpha.mcp.developers.biz.moneyforward.com/mcp/ca/v3` | source note, 2026-09-18 |
| Auth | oauth2; API key via `Mf-API-Key` header also official | independently_observed, 2026-09-18 |
| Developer docs | https://developers.biz.moneyforward.com/ | independently_observed, 2026-09-18 |
| Category | accounting | independently_observed |

## Known pitfalls

## alpha / beta in the hostname is not a release stage

`alpha.` and `beta.` hosts are not maturity labels. The official support page points to the `beta` host; Gemini CLI uses the `alpha` host because of a difference in auth method (checked 2026-09-18). Pick the host that matches your client's auth method.

## Two auth methods: OAuth 2.0 and Mf-API-Key

Both are official. Do not assume only OAuth exists; the API key header is documented at developers.biz.moneyforward.com/docs/mcp-common/authentication.

## Last checked

2026-09-18 (KanseiLINK independent observation). License of the source record: CC BY 4.0.
