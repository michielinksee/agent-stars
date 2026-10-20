---
service_id: square
name: Square
status: verified
observer: human:kanseilink
last_verified: 2026-09-18
category: payment
grade: AAA (ARI Award 2026 Summer, frozen, independently rated by KanseiLINK, read-only)
sources:
  - https://kansei-link.com/agent-wiki/services/square.html
  - https://developer.squareup.com/docs/mcp
  - https://developer.squareup.com/
---

# Square — agent connection summary

**What works**: an official hosted MCP server exists (provenance: independently_observed, checked 2026-09-18, source developer.squareup.com/docs/mcp). Auth is OAuth 2.0.

**Limits**: this page records only publicly verifiable facts (MCP availability, auth method, docs). No agent success-rate figures are published here.

## Connection

| Item | Value | Provenance |
|---|---|---|
| Public MCP | `https://mcp.squareup.com/mcp` (official) | independently_observed, 2026-09-18, developer.squareup.com |
| Auth | oauth2 | independently_observed, 2026-09-18, developer.squareup.com |
| Developer docs | https://developer.squareup.com/ | independently_observed |
| Category | payment | independently_observed |

## Known pitfalls

## Official docs say /mcp, official GitHub README still says /sse

Official developer docs (checked 2026-09-18) give `https://mcp.squareup.com/mcp` as the endpoint. The official GitHub README still lists `https://mcp.squareup.com/sse`, so the two official sources disagree. This page treats the docs value (`/mcp`) as the current recommended endpoint.

## Last checked

2026-09-18 (KanseiLINK independent observation). License of the source record: CC BY 4.0.
