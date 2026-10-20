---
service_id: jooto
name: Jooto
status: verified
observer: human:kanseilink
last_verified: 2026-09-18
category: project_management
grade: AA (ARI Award 2026 Summer, frozen, independently rated by KanseiLINK, read-only)
sources:
  - https://kansei-link.com/agent-wiki/services/jooto.html
  - https://www.jooto.com/news/20260529_mcp-cli/
  - https://www.jooto.com/
---

# Jooto — agent connection summary

**What works**: an official MCP server plus CLI, released 2026-05-29, running locally over stdio (provenance: independently_observed, checked 2026-09-18, source www.jooto.com/news/20260529_mcp-cli/). Auth is an API key (Business plan).

**Limits**: there is no remote MCP endpoint URL. The vendor (PR TIMES, Inc.) announced on 2026-08-06 that general availability of Jooto ends on 2027-07-31 (official news / PR TIMES, confirmed 2026-09-18).

## Connection

| Item | Value | Provenance |
|---|---|---|
| Public MCP | none (local stdio MCP server + CLI only) | source note, 2026-09-18 |
| Auth | api_key (Business plan) | independently_observed, 2026-09-18, www.jooto.com |
| Developer docs | https://www.jooto.com/ | independently_observed |
| Category | project_management | independently_observed |

## Known pitfalls

## No remote MCP URL — the server is local (stdio) only

Do not look for a hosted endpoint; install the official local MCP server / CLI.

## API key requires the Business plan

Accounts without the Business plan cannot issue the key (`permission_missing` class).

## Service end-of-life announced for 2027-07-31

Announced 2026-08-06 by the vendor. Plan integrations accordingly.

## Last checked

2026-09-18 (KanseiLINK independent observation). License of the source record: CC BY 4.0.
