---
error_key: rest-na-na-chatwork-api-token-screen
error_text: "CHATWORK_API_TOKEN (chatwork-mcp-server) — where in the Chatwork UI is the API token issued, and does the organization administrator have to approve it?"
service_id: chatwork
component: chatwork/chatwork-mcp-server (official, npm @chatwork/mcp-server); Chatwork web UI サービス連携 → API Token
environments: [Claude Desktop, Claude Code, Cursor, other]
transport: stdio
organ_stopped: 接続
symptom_class: permission_missing
applies_when: chatwork-mcp-server の README が環境変数名しか書かず、トークンの発行画面と管理者の関与が分からないとき
first_check: 右上の自分のアイコン →「サービス連携」に「API Token」の項目が出ているか
what_was_true: 発行は右上の利用者名 → サービス連携 → API Token（パスワード再入力あり）。パーソナル以外の契約では組織管理者への API 利用申請と承認が要る（developer.chatwork.com）。OAuth アプリ登録は不要。公式ヘルプは検索に返らず、承認側の画面は確認できない。
how_resolved: |
  - Chatwork にログイン → 画面右上の自分のアイコン（利用者名） → 「サービス連携」 → 左メニュー「API Token」 → パスワードを入力して表示 → コピー。
  - パーソナルプランなら申請不要。会社契約（ビジネス／エンタープライズ等）では同じ画面から API 利用申請を送り、組織管理者が承認してからトークンが表示される。
  - claude_desktop_config.json 等の mcpServers に npx -y @chatwork/mcp-server と env CHATWORK_API_TOKEN を書く。OAuth アプリ登録は不要。
  - 再発行すると旧トークンは無効になる（他ツールで同じトークンを使っていると止まる）。
success_check: chatwork-mcp-server が起動し、自分のルーム一覧が返る
if_not_resolved: API の項目が出ない／未承認なら組織管理者に API 利用の許可を依頼。タブ自体が出ない可能性は未観測
human_step_required: "yes: 自分でトークンを発行し、会社契約なら組織管理者の承認を得る"
status: extracted_from_issue
sources:
  - https://github.com/chatwork/chatwork-mcp-server
  - https://developer.chatwork.com/docs/getting-started
  - https://go.chatwork.com/ja/integrate/zapier.html
  - https://library.libecity.com/articles/01KMS5E6KGJMRZQ7S9HBQ78JWY
  - https://intercom.help/yoom/ja/articles/14605252
source_count: 5
last_verified:
search_terms_seen:
  - "Chatwork API トークン 発行 画面 管理者 許可"
  - "chatwork-mcp-server CHATWORK_API_TOKEN"
  - "Chatwork ヘルプ APIトークン 発行 サービス連携 API利用申請 組織管理者"
  - "APIトークンを発行する help.chatwork.com (allowed_domains: help.chatwork.com, developer.chatwork.com, go.chatwork.com, www.chatwork.com)"
  - "Chatwork APIトークン 発行 画面 管理者 承認"
  - "help.chatwork.com APIトークン 発行 API利用申請 組織管理者"
  - "chatwork-mcp-server CHATWORK_API_TOKEN README"
  - "Chatwork ヘルプ APIトークン 発行方法 API利用申請 組織管理者"
  - "Chatwork 管理者設定 API 利用制限 承認 \"APIトークン\" help.chatwork.com"
  - "Chatwork MCP 設定 claude_desktop_config APIトークン"
  - "Chatwork MCP サーバー 公式 GitHub chatwork-mcp-server"
  - "Chatwork APIトークン 発行方法 ヘルプ"
trail:
  - "A5 C-04 (2026-10-20): README + a directory page; the help-center search returned nothing official"
  - "arm0-claude-run1-g4 (2026-10-20): restricting the search to official domains reached developer.chatwork.com getting-started (UI path, admin application) and an official integration page; help.chatwork.com articles were referenced but never returned"
  - "arm0-claude-run2-g4 / run3-g4 (2026-10-20): help.chatwork.com and developer.chatwork.com never returned; answers built from third-party walkthroughs; the admin-side approval screen was not confirmed"
  - "Dead ends seen: an unsourced page claiming a new 'API管理' menu with expiring scoped tokens (contradicted by official docs); 2014-era articles; a different vendor's integration guide"
retests: []
---

# CHATWORK_API_TOKEN (chatwork-mcp-server) — where in the Chatwork UI is the API token issued, and does the organization administrator have to approve it?

## 症状

- chatwork-mcp-server に `CHATWORK_API_TOKEN` を入れたいが、README は環境変数名だけで、Chatwork の画面のどこでトークンを出すか、会社の管理者に何か頼む必要があるかが分からない。
- The official help center pages are referenced by official pages but never appear in search results; third-party pages disagree on the menu label.

## 該当条件

chatwork-mcp-server の README が環境変数名しか書かず、トークンの発行画面と管理者の関与が分からないとき。

## 最初の確認

右上の自分のアイコン →「サービス連携」に「API Token」の項目が出ているか。

## 解決手順

- Chatwork にログイン → 画面右上の自分のアイコン（利用者名） → 「サービス連携」（ページによっては「API設定」と表記） → 左メニュー「API Token」 → パスワードを入力して表示 → コピー。
- パーソナルプランなら申請不要で自分で出せる。会社契約（ビジネス／エンタープライズ等、パーソナル以外）では、同じ画面から API 利用申請を送り、組織管理者が承認してからトークンが表示される（developer.chatwork.com: 組織管理者への申請が必要）。管理者はトークンを代わりに発行するのではなく、申請を承認する。
- `claude_desktop_config.json` 等の `mcpServers` に `npx -y @chatwork/mcp-server` と `env.CHATWORK_API_TOKEN` を書く。MCP サーバーは API トークン方式で、OAuth アプリ登録は不要。http transport のときは Authorization: Bearer で渡す。
- トークンには有効期限がなくアカウントの機能にフルアクセスできる。再発行すると旧トークンは無効になる。

## 成功の確認

chatwork-mcp-server が起動し、自分のルーム一覧が返る。

## 根拠

- https://github.com/chatwork/chatwork-mcp-server (official README; variable name only)
- https://developer.chatwork.com/docs/getting-started (official; UI path, admin application required except personal plan, no expiry)
- https://go.chatwork.com/ja/integrate/zapier.html (official; alternate menu label 「API設定」, company contracts need 組織管理者)
- https://library.libecity.com/articles/01KMS5E6KGJMRZQ7S9HBQ78JWY and https://intercom.help/yoom/ja/articles/14605252 (third-party walkthroughs; same UI path, admin approval on organization plans)
- 確認日: none. The admin-side approval screen (help.chatwork.com 「APIの利用申請を承認・却下する」) could not be fetched: 確認できない. 環境: any MCP client running the server over stdio.

## 解決しなかった場合

- 「サービス連携」に API の項目が出ない、または承認されていない旨が出るなら、組織管理者に API 利用の許可を依頼する。
- 管理者が許可していない組織では API Token のタブ自体が出ない（menu is absent / not shown、エラーではなく メニューが無い）という可能性: 未観測・確認できない（契約種別と観測日が付いたら「追試」へ）。
- human_step_required: yes

## 調査の軌跡

- A5 C-04 (2026-10-20): README + a directory page; the help-center search returned nothing official.
- arm0-claude-run1-g4 (2026-10-20): restricting the search to official domains reached developer.chatwork.com getting-started and an official integration page; help.chatwork.com articles were referenced but never returned.
- arm0-claude-run2-g4 / run3-g4 (2026-10-20): help.chatwork.com and developer.chatwork.com never returned; answers built from third-party walkthroughs; the admin-side approval screen was not confirmed.
- Dead ends seen: an unsourced page claiming a new "API管理" menu with expiring scoped tokens (contradicted by official docs); 2014-era articles; a different vendor's integration guide.

## 追試

(none yet)

## この記録の状態

status: `extracted_from_issue` — extracted from official pages and third-party walkthroughs via route records; no lived observation on a business-plan organization. It does not affect any grade. No rates, no rankings.
