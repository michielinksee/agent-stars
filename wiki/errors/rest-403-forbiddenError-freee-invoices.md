---
error_key: rest-403-forbiddenError-freee-invoices
error_text: "403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです"
service_id: freee
component: freee-mcp 0.26 series (official) + the observer's own freee app (OAuth registration)
environments: [Claude Code]
transport: rest
organ_stopped: 接続
symptom_class: permission_missing
applies_when: 認証は通り freee_list_companies で事業所も見えるのに、請求書の API（GET /api/1/invoices）だけが 403 forbiddenError で拒否される
first_check: freee の開発者画面で、接続中のアプリに「請求書」の権限（参照／更新）が付いているか
what_was_true: 接続している freee アプリ（OAuth の登録）に請求書の権限が付いていなかった。トークンの期限や接続先・事業所の問題ではない。freee 側の問題ではなく、観測者側の設定の不備。エラー文から自力で診断できる型。
how_resolved: |
  - unresolved at the time of observation. An agent cannot fix this.
  - A human adds the invoice permission to the app in the freee developer console, then re-consents (re-authorizes) the app.
  - After re-consent, call GET /api/1/invoices again.
success_check: GET /api/1/invoices が 200 で請求書一覧を返す
if_not_resolved: 事業所の不一致なら mcp-na-na-freee-current-company-mismatch。権限を付けたのに 403 なら再同意が済んでいるかを確認
human_step_required: "yes: アプリへの権限付与と再同意（grant the permission on the app and re-consent）"
status: lived
sources:
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-002
  - https://kansei-link.com/insights/agent-field-notes.json
  - https://github.com/freee/freee-mcp
  - https://developer.freee.co.jp/reference/40x-checkpoint
source_count: 4
last_verified: 2026-09-20
search_terms_seen:
  - "freee API 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです invoices"
  - "\"このアプリケーションにはアクセス権限がないエンドポイントです\" freee"
  - "freee 請求書API アプリケーション 権限 スコープ developers.freee.co.jp 403 アクセス権限がないエンドポイント"
  - "freee API forbiddenError \"アクセス権限がないエンドポイント\" アプリ 権限設定 developers.freee.co.jp"
  - "freee 請求書API アプリ 権限 エンドポイント 403 developers.freee.co.jp"
  - "freee API forbiddenError アプリケーション エンドポイント 権限 スコープ 請求書 developer.freee.co.jp"
  - "freee API 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです"
  - "freee developers アプリ 権限設定 エンドポイント アクセス権限がない 403 請求書 スコープ"
trail:
  - "A6 T-01 (2026-10-20): search with the error text verbatim → Qiita article + freee-mcp issue #169; issue #169 turned out to be a 401 company_not_found, not this 403; support.freee.co.jp returned 403 to the fetcher"
  - "arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): the same error-text search three times; support.freee.co.jp blocked the fetcher each time; developer.freee.co.jp 40x-checkpoint reached once; the 'wrapper rate-limit hint' and 'human step' points were missing from all three answers"
  - "Dead ends seen: FreeAgent forum results (different product), lobehub redirect, freee-mcp issue #169 (401, not 403)"
retests: []
---

# 403 forbiddenError このアプリケーションにはアクセス権限がないエンドポイントです

freee REST API, `GET /api/1/invoices`, called through freee-mcp. The wrapper (freee-mcp) adds a hint about possible rate limiting / re-authentication; that hint is a red herring for this card.

## 症状

- Auth succeeds and companies are visible, but only the invoices API is rejected with a permission error. 5 attempts, 5 failures.
- 認証は通り、事業所も見えるのに、請求書の API だけが権限エラーで拒否される。

## 該当条件

- 認証は通り freee_list_companies で事業所も見えるのに、請求書の API（GET /api/1/invoices）だけが 403 forbiddenError で拒否される。
- Not applicable when the error is 401 (token) or when the message mentions `freee_set_current_company` (see [mcp-na-na-freee-current-company-mismatch](mcp-na-na-freee-current-company-mismatch.md)).

## 最初の確認

freee の開発者画面で、接続中のアプリに「請求書」の権限（参照／更新）が付いているか。

## 解決手順

- unresolved at the time of observation. An agent cannot fix this.
- A human adds the invoice permission to the app in the freee developer console, then re-consents (re-authorizes) the app.
- After re-consent, call `GET /api/1/invoices` again.
- 日本語: 人がアプリの設定で請求書の権限を付け、再同意する。エージェントからは直せない。

Not a token-expiry or wrong-endpoint problem. Not a freee-side problem; a mis-configuration on the observer's side. Diagnosable from the error text alone. The wrapper's rate limiting hint does not apply here.

## 成功の確認

`GET /api/1/invoices` が 200 で請求書一覧を返す。

## 根拠

- 出所: AWT-002 (lived, observer human:synapse-arrows, observed 2026-09-20, published 2026-10-07) — https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-002 ; machine-readable https://kansei-link.com/insights/agent-field-notes.json
- freee-mcp (official): https://github.com/freee/freee-mcp
- freee developer reference on 40x: https://developer.freee.co.jp/reference/40x-checkpoint
- 確認日: 2026-09-20（観測）/ 2026-10-07（公開）
- 環境: Claude Code, transport rest (freee-mcp 0.26 series)

## 解決しなかった場合

- 事業所の不一致なら [mcp-na-na-freee-current-company-mismatch](mcp-na-na-freee-current-company-mismatch.md)。
- 権限を付けたのに 403 が続くなら、再同意（re-consent）が済んでいるか、同意したアプリが接続中のアプリと同じかを確認。
- human_step_required: yes

## 調査の軌跡

- A6 T-01 (2026-10-20): search with the error text verbatim → Qiita article + freee-mcp issue #169; issue #169 turned out to be a 401 company_not_found, not this 403; support.freee.co.jp returned 403 to the fetcher.
- arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): the same error-text search three times; support.freee.co.jp blocked the fetcher each time; developer.freee.co.jp 40x-checkpoint reached once; the "wrapper rate-limit hint" and "human step" points were missing from all three answers.
- Dead ends seen: FreeAgent forum results (different product), lobehub redirect, freee-mcp issue #169 (401, not 403).

## 追試

(none yet)

## この記録の状態

status: `lived` — one observer's record from real work. It is not `verified` and does not affect any grade. No rates, no rankings.
