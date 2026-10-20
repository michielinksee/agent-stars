---
error_key: rest-520-CB_IL02-kintone-get-content-type
error_text: "HTTP 520 {\"code\":\"CB_IL02\",\"message\":\"不正なリクエストです。\"} (kintone REST API, GET)"
service_id: kintone
component: kintone REST API (/k/v1/record.json, /k/v1/records.json); any HTTP client that adds Content-Type by default
environments: [Claude Desktop, Claude Code, Cursor, Codex, other]
transport: rest
organ_stopped: 接続
symptom_class: wrong_method
applies_when: パラメータをクエリ文字列で渡す GET に Content-Type: application/json を付けていて、API トークンは正しいとき
first_check: GET リクエストのヘッダに Content-Type: application/json が付いていないか
what_was_true: ボディ無しの GET に Content-Type: application/json を付けると、kintone は空ボディを JSON として解釈しようとして HTTP 520・CB_IL02「不正なリクエストです。」を返す。認証エラーなら CB_WA01 になるので認証は無関係。520 は kintone 独自の状態で Cloudflare の 520 ではない。
how_resolved: |
  - GET では Content-Type を外し、X-Cybozu-API-Token（または X-Cybozu-Authorization）だけを送る。パラメータはクエリ文字列で渡す。
  - HTTP クライアントや SDK が既定で Content-Type を付ける場合は明示的に削除する。
  - ボディで JSON を渡したいなら POST + X-HTTP-Method-Override: GET にし、そのときだけ Content-Type: application/json を付ける。
success_check: 同じ GET から Content-Type を外すと 200 でレコードが返る
if_not_resolved: CB_WA01 なら認証（トークン／アプリの権限）。どのクライアントが既定で Content-Type を付けるかは未観測（確認できない）
human_step_required: "no"
status: extracted_from_issue
sources:
  - https://community.cybozu.dev/t/topic/3227
  - https://cybozu.dev/ja/kintone/docs/rest-api/overview/kintone-rest-api-overview/
  - https://github.com/kintone/mcp-server
source_count: 3
last_verified:
search_terms_seen:
  - "kintone REST API 520 CB_IL02 不正なリクエストです 原因"
  - "kintone REST API 520 CB_IL02 不正なリクエストです GET"
  - "kintone API 520 CB_IL02 エラー 原因"
  - "cybozu.dev kintone REST API 共通エラー 一覧 CB_IL02 不正なリクエストです"
trail:
  - "A7 T-06 (2026-10-20): community.cybozu.dev thread + official REST overview; solved"
  - "arm0-claude-run1-g3 / run2-g3 / run3-g3 (2026-10-20): one search each; the same community thread (exact reproduction: GET record.json with Content-Type: application/json → 520 CB_IL02; removing the header fixed it) reached every time; the official docs in the results did not document CB_IL02"
  - "Dead ends seen: a second community thread about 520 from GAS with no diagnosis; jp.cybozu.help error list (Garoon, not kintone REST)"
retests: []
---

# HTTP 520 {"code":"CB_IL02","message":"不正なリクエストです。"} (kintone REST API, GET)

## 症状

- kintone REST API を GET で叩くと HTTP 520、`code: CB_IL02`「不正なリクエストです。」が返る。API トークンは合っている。
- The same request works from some clients and fails from others; the difference is a default `Content-Type` header.

## 該当条件

パラメータをクエリ文字列で渡す GET に `Content-Type: application/json` を付けていて、API トークンは正しいとき。

## 最初の確認

GET リクエストのヘッダに `Content-Type: application/json` が付いていないか。

## 解決手順

- GET では `Content-Type` を外し、`X-Cybozu-API-Token`（または `X-Cybozu-Authorization`）だけを送る。パラメータはクエリ文字列で渡す（例: `/k/v1/record.json?app=1&id=1`）。
- HTTP クライアントや SDK が既定で `Content-Type` を付ける場合は明示的に削除する。
- ボディで JSON を渡したいなら POST + `X-HTTP-Method-Override: GET` にし、そのときだけ `Content-Type: application/json` を付ける。
- 認証が壊れているときは `CB_WA01` になるので、`CB_IL02` のときに認証は無関係。520 は kintone が API エラー時に返す独自の状態で、Cloudflare の 520 ではない。

## 成功の確認

同じ GET から `Content-Type` を外すと 200 でレコードが返る。

## 根拠

- https://community.cybozu.dev/t/topic/3227 (cybozu developer community; exact reproduction and the fix, C# / Postman / JavaScript)
- https://cybozu.dev/ja/kintone/docs/rest-api/overview/kintone-rest-api-overview/ (official REST overview; the error list gives CB_IL02 one line without this cause)
- https://github.com/kintone/mcp-server (official kintone MCP server; not reproduced through it yet)
- 確認日: none (not reproduced by KanseiLINK). 環境: any client calling the REST API directly.

## 解決しなかった場合

- `CB_WA01` なら認証（トークン／アプリの権限）の詰まり。
- どのクライアント（HTTP ライブラリ／MCP ラッパーの版）が既定で `Content-Type` を付けるかは未観測・確認できない。再現できたら版と日付を「追試」へ。
- human_step_required: no

## 調査の軌跡

- A7 T-06 (2026-10-20): community.cybozu.dev thread + official REST overview; solved.
- arm0-claude-run1-g3 / run2-g3 / run3-g3 (2026-10-20): one search each; the same community thread reached every time; the official docs in the results did not document CB_IL02.
- Dead ends seen: a second community thread about 520 from GAS with no diagnosis; jp.cybozu.help error list (Garoon, not kintone REST).

## 追試

(none yet)

## この記録の状態

status: `extracted_from_issue` — extracted from a community thread and official pages via route records; not reproduced by KanseiLINK. It does not affect any grade. No rates, no rankings.
