---
error_key: oauth-401-na-moneyforward-refresh-token-rotation
error_text: "Money Forward Cloud API: access token expires every time (401) — how to refresh, and how long does the refresh token itself last?"
service_id: moneyforward
component: Money Forward Cloud API (developers.biz.moneyforward.com), OAuth 2.0 app registered in the App Portal; token endpoint https://api.biz.moneyforward.com/token
environments: [Claude Code, Codex, other]
transport: rest
organ_stopped: 接続
symptom_class: token_expired
applies_when: developers.biz.moneyforward.com 系の OAuth アプリで、アクセストークンが 1 時間ごとに切れ、リフレッシュの扱いが分からないとき
first_check: 直前のリフレッシュで返った新しい refresh_token を保存して上書きしているか
what_was_true: 公式チュートリアル STEP 2: アクセストークンは 1 時間（expires_in 3600）・リフレッシュトークンは 540 日・変更不可。リフレッシュトークンは一度きり（ローテーション）で、使うたびに新しい refresh_token が返る。第三者記事の「30 日・id.moneyforward.com」は旧 API 向け。
how_resolved: |
  - 401 が返ったら POST https://api.biz.moneyforward.com/token に grant_type=refresh_token&refresh_token=<保存値>、Content-Type: application/x-www-form-urlencoded、クライアント認証は Basic（client_id:client_secret。App Portal の設定が CLIENT_SECRET_POST ならボディ）。
  - レスポンスの access_token と新しい refresh_token を必ず両方保存して上書きする。
  - expires_in から期限を計算し、1 時間以内は同じアクセストークンを使い回す（トークンエンドポイントにレート制限がある）。
  - リフレッシュトークンが 540 日で切れた、または使い回して無効化したときは、エンドユーザーの再認可が要る。
  - 認可フローを避けたい場合は API キー方式（Mf-API-Key / /auth/exchange）も公式にある。
success_check: リフレッシュ後の access_token で API が 200 を返し、次のリフレッシュが新しい refresh_token で成功する
if_not_resolved: refresh で invalid_grant なら古い refresh_token の使い回しを確認。並列の同時リフレッシュは未観測
human_step_required: "yes: リフレッシュトークンが切れたときの再認可（ブラウザで同意）"
status: unverified
sources:
  - https://developers.biz.moneyforward.com/docs/tutorials/getting-started-api-call-manually/step-2/
  - https://developers.biz.moneyforward.com/docs/common/oauth/app-portal-overview/
  - https://developers.biz.moneyforward.com/docs/mcp-common/authentication
  - https://biz.moneyforward.com/support/app-portal/?p=337
source_count: 4
last_verified:
search_terms_seen:
  - "マネーフォワード クラウド API リフレッシュトークン 有効期限 developers.biz.moneyforward.com"
  - "developers.biz.moneyforward.com OAuth アクセストークン 有効期限 refresh_token grant_type"
  - "マネーフォワード クラウド API ドキュメント 認証 リフレッシュトークン 30日 アクセストークン 1時間 id.moneyforward.com/oauth/token"
  - "developers.biz.moneyforward.com リフレッシュトークン アクセストークン 有効期限 OAuth マネーフォワード クラウド請求書 API"
  - "アクセストークン リフレッシュトークン 有効期限 認可 (allowed_domains: developers.biz.moneyforward.com)"
  - "マネーフォワード クラウド API OAuth refresh_token 有効期限 アクセストークン 30日 developers.biz.moneyforward.com oauth"
  - "developers.biz.moneyforward.com OAuth リフレッシュトークン (allowed_domains=developers.biz.moneyforward.com)"
  - "マネーフォワード クラウド API アクセストークン 有効期限 リフレッシュトークン"
  - "developers.biz.moneyforward.com OAuth access token expires_in refresh token マネーフォワードクラウド会計 API"
trail:
  - "A7 T-08 (2026-10-20): official tutorial STEP 2 reached (incl. the 540-day value); general search returned support pages, not developer docs"
  - "arm0-claude-run1-g3 (2026-10-20): developers.biz.moneyforward.com never returned by search; a Qiita article gave 30 days for the older API; the lifetime was left as 'not confirmed'"
  - "arm0-claude-run2-g3 / run3-g3 (2026-10-20): restricting the search to developers.biz.moneyforward.com reached STEP 2 (1 hour / 540 days / one-time rotation / rate limit on the token endpoint)"
  - "Dead ends seen: support pages with scopes only, app-portal overview with no lifetimes, other vendors' OAuth docs"
retests: []
---

# Money Forward Cloud API: access token expires every time (401) — how to refresh, and how long does the refresh token itself last?

## 症状

- マネーフォワード クラウドの API（developers.biz.moneyforward.com）でアクセストークンが毎回切れる。リフレッシュトークンの正しい扱いと、その有効期限が分からない。
- Searches return support pages and a third-party article with a different lifetime and a different token endpoint (the older API).

## 該当条件

developers.biz.moneyforward.com 系の OAuth アプリ（App Portal で登録）で、アクセストークンが 1 時間ごとに切れ、リフレッシュの扱いが分からないとき。

## 最初の確認

直前のリフレッシュで返った新しい refresh_token を保存して上書きしているか。

## 解決手順

- アクセストークンは 1 時間（`expires_in` 3600）で切れるのが仕様。変更不可。
- 401 が返ったら `POST https://api.biz.moneyforward.com/token` に `grant_type=refresh_token&refresh_token=<保存値>`、`Content-Type: application/x-www-form-urlencoded`、クライアント認証は Basic（client_id:client_secret。App Portal の設定が CLIENT_SECRET_POST ならボディに入れる）。
- リフレッシュトークンは一度きり（ローテーション）。レスポンスの `access_token` と新しい `refresh_token` を必ず両方保存して上書きする。古いものを使い回すと失敗し、再認可が要る。
- `expires_in` から期限を計算し、1 時間以内は同じアクセストークンを使い回す。トークンエンドポイントにはレート制限がある。
- リフレッシュトークンの有効期限は 540 日（公式チュートリアル STEP 2・値は人が確認すること）。切れたらエンドユーザーの再認可。
- 認可フローを避けたい場合は API キー方式（`Mf-API-Key` ヘッダ / `/auth/exchange`）も公式にある。

## 成功の確認

リフレッシュ後の access_token で API が 200 を返し、次のリフレッシュが新しい refresh_token で成功する。

## 根拠

- https://developers.biz.moneyforward.com/docs/tutorials/getting-started-api-call-manually/step-2/ (official; access token 1 hour, refresh token 540 days, one-time rotation, token endpoint, rate limit)
- https://developers.biz.moneyforward.com/docs/common/oauth/app-portal-overview/ (official; client authentication method)
- https://developers.biz.moneyforward.com/docs/mcp-common/authentication (official; OAuth and API-key methods)
- https://biz.moneyforward.com/support/app-portal/?p=337 (official support; app registration, CLIENT_SECRET_BASIC recommended)
- 確認日: none for this card. KanseiLINK checked the MCP auth page on 2026-09-18 (see wiki/moneyforward.md); the token lifetimes were read from the route records, not re-verified. 環境: any OAuth client.

## 解決しなかった場合

- refresh で `invalid_grant` なら、古い refresh_token を使い回していないか、保存し損ねていないかを確認。
- 並列 (parallel) のワーカーが同じ refresh_token で同時に リフレッシュすると後着が失敗する race の可能性: 未観測・確認できない（観測した日付と回数が付いたら「追試」へ）。
- human_step_required: yes（再認可）

## 調査の軌跡

- A7 T-08 (2026-10-20): official tutorial STEP 2 reached; general search returned support pages, not developer docs.
- arm0-claude-run1-g3 (2026-10-20): developers.biz.moneyforward.com never returned by search; a Qiita article gave 30 days for the older API; the lifetime was left as "not confirmed".
- arm0-claude-run2-g3 / run3-g3 (2026-10-20): restricting the search to developers.biz.moneyforward.com reached STEP 2.
- Dead ends seen: support pages with scopes only, app-portal overview with no lifetimes, other vendors' OAuth docs.

## 追試

(none yet)

## この記録の状態

status: `unverified` — extracted from official pages via route records; the 540-day value has not been independently re-checked by KanseiLINK. It does not affect any grade. No rates, no rankings.
