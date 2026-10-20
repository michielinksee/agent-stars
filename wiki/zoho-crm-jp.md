---
service_id: zoho-crm-jp
name: Zoho CRM Japan
status: verified
observer: human:kanseilink
last_verified: 2026-09-18
category: crm
grade: AAA (ARI Award 2026 Summer, frozen, independently rated by KanseiLINK, read-only)
sources:
  - https://kansei-link.com/agent-wiki/services/zoho-crm-jp.html
  - https://www.zoho.com/mcp/
  - https://www.zoho.com/jp/crm/developer/
  - https://www.zoho.com/crm/developer/docs/
---

# Zoho CRM Japan — agent connection summary

**What works**: auth is OAuth 2.0 (provenance: independently_observed, checked 2026-09-18, source www.zoho.com/mcp/). Developer docs are public.

**Limits**: the source record lists no public MCP endpoint URL for this service (not found in the source as of 2026-09-18). The API is REST (v8); the endpoint host depends on the account's data center (JP etc.).

## Connection

| Item | Value | Provenance |
|---|---|---|
| Public MCP | not recorded in source | — |
| Auth | oauth2 | independently_observed, 2026-09-18, www.zoho.com/mcp/ |
| Developer docs (JA) | https://www.zoho.com/jp/crm/developer/ | independently_observed |
| Developer docs (EN, current) | https://www.zoho.com/crm/developer/docs/ | source note, 2026-09-18 |
| Category | crm | independently_observed |

## Known pitfalls

## 404 https://www.zoho.com/jp/crm/developer/docs/api/v8/

The Japanese docs (under `/jp/`) are partly outdated; the JA API v8 path returned 404 on 2026-09-18. Use the English docs (`https://www.zoho.com/crm/developer/docs/`) for API v8 and the OAuth 2.0 procedure.

## Wrong data center host

Point requests at the data center that matches the account (JP etc.). A mismatch is a `wrong_target` class failure.

## Last checked

2026-09-18 (KanseiLINK independent observation). License of the source record: CC BY 4.0.
