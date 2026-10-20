---
error_key: rest-na-na-backlog-api-key-screen
error_text: "BACKLOG_API_KEY is required (nulab/backlog-mcp-server) — where is the Backlog API key issued, and does it need a space administrator?"
service_id: backlog
component: nulab/backlog-mcp-server (official); Backlog web UI 個人設定 → API
environments: [Claude Desktop, Claude Code, Cursor, other]
transport: stdio
organ_stopped: 接続
symptom_class: permission_missing
applies_when: backlog-mcp-server の README が環境変数名しか書かず、API キーの発行画面と権限が分からないとき
first_check: Backlog 右上の自分のアイコン → 個人設定 → 左メニュー「API」が出るか
what_was_true: 発行は個人設定（Personal Settings）→ API →「メモ」を入れて「登録」(Submit)。スペース設定ではない。一般ユーザーでも発行でき管理者権限は不要。キーは発行したユーザーの権限と制限をそのまま引き継ぐ。公式ヘルプセンター（support.nulab.com / support.backlog.com）はエージェントの WebFetch で 403 になり本文が届かない。
how_resolved: |
  - Backlog にログイン → 右上のプロフィールアイコン → 「個人設定」 → 左メニュー「API」。
  - 「メモ」に用途（例: backlog-mcp-server）を入れて「登録」（英語 UI では Submit）。
  - 「登録されたAPIキー」の一覧に出たキーを BACKLOG_API_KEY に、スペースのドメイン（xxx.backlog.com / xxx.backlog.jp）を BACKLOG_DOMAIN に入れる。
  - 管理者に頼むのは、操作したいプロジェクトへの参加や権限変更が必要な場合だけ。
success_check: backlog-mcp-server が起動し、自分が参加しているプロジェクトの一覧が返る
if_not_resolved: 「API」メニューが出ない／キーで何も取れないなら、スペース管理者の制限と参加プロジェクトを確認（管理者側の画面は確認できない）
human_step_required: "yes: 個人設定の画面でキーを発行し、必要なら管理者にプロジェクト参加を依頼"
status: extracted_from_issue
sources:
  - https://github.com/nulab/backlog-mcp-server
  - https://developer.nulab.com/docs/backlog/auth/
  - https://support.nulab.com/hc/en-us/articles/8783772200217
  - https://support.backlog.com/hc/en-us/articles/115015420567-API-Settings
  - https://codenote.net/ja/posts/backlog-api-key-for-ai-agents/
source_count: 5
last_verified:
search_terms_seen:
  - "Backlog API キー 発行 個人設定 画面"
  - "Backlog APIの設定 個人設定 support.nulab.com APIキー"
  - "Backlog スペース設定 APIキーの発行を制限 管理者 \"API\" 個人設定 ヘルプ"
  - "Backlog APIキー 発行 個人設定 API"
  - "Backlog ヘルプ APIの設定 個人設定 support.nulab.com"
  - "nulab/backlog-mcp-server BACKLOG_API_KEY README"
  - "Backlog APIキー 発行 個人設定 スペース管理者"
  - "Backlog ヘルプ APIの設定 個人設定 APIキー 発行 support.nulab.com"
  - "Backlog MCP サーバー 接続手順 APIキー 発行"
  - "Backlog APIキー 発行 個人設定 API ヘルプ nulab"
trail:
  - "A5 C-06 (2026-10-20): README + a third-party walkthrough; support.backlog.com API-Settings article listed as a dead end"
  - "arm0-claude-run1-g2 / run2-g2 / run3-g2 (2026-10-20): support.nulab.com / support.backlog.com returned 403 to the fetcher in every run; the screen path came from the search snippet and a third-party page; developer.nulab.com/docs/backlog/auth/ reached once (header name, permission inheritance)"
  - "Dead ends seen: community.nulab.com thread (301 to a contact page), a column page describing a UI that does not exist in Backlog (not adopted)"
retests: []
---

# BACKLOG_API_KEY is required (nulab/backlog-mcp-server) — where is the Backlog API key issued, and does it need a space administrator?

## 症状

- backlog-mcp-server needs `BACKLOG_API_KEY` and `BACKLOG_DOMAIN`, but the README gives only the variable names. The issuing screen is in the Nulab help center, which the agent's fetcher cannot read (HTTP 403).
- README は環境変数名だけ。発行手順は公式ヘルプセンターにあるが、エージェントの WebFetch では 403 で届かない。

## 該当条件

backlog-mcp-server の README が環境変数名しか書かず、API キーの発行画面と権限が分からないとき。

## 最初の確認

Backlog 右上の自分のアイコン → 個人設定 → 左メニュー「API」が出るか。

## 解決手順

- Backlog にログイン → 右上のプロフィールアイコン → 「個人設定」（Personal Settings） → 左メニュー「API」。スペース設定ではない。
- 「メモ」に用途（例: backlog-mcp-server）を入れて「登録」（英語 UI では Submit）。
- 「登録されたAPIキー」の一覧に出たキーを `BACKLOG_API_KEY` に、スペースのドメイン（xxx.backlog.com / xxx.backlog.jp）を `BACKLOG_DOMAIN` に入れる。
- 一般ユーザーでも発行できる。管理者権限は不要。キーに個別のスコープや有効期限はなく、発行したユーザーの権限（ロール）と制限（閲覧のみ等）をそのまま引き継ぐ。
- 管理者に頼むのは、操作したいプロジェクトへの参加や権限変更が必要な場合だけ。
- REST を直接叩く場合はヘッダ `Backlog-API-Key` またはクエリ `apiKey`（developer.nulab.com）。

## 成功の確認

backlog-mcp-server が起動し、自分が参加しているプロジェクトの一覧が返る。

## 根拠

- https://github.com/nulab/backlog-mcp-server (official README; variable names)
- https://developer.nulab.com/docs/backlog/auth/ (official developer docs; header / query parameter, access decided by the user's permission)
- https://support.nulab.com/hc/en-us/articles/8783772200217 and https://support.backlog.com/hc/en-us/articles/115015420567-API-Settings (official help; the screen path appears in the search snippet, but the page body returned 403 to the fetcher in every route record)
- https://codenote.net/ja/posts/backlog-api-key-for-ai-agents/ (third-party walkthrough with the Japanese UI labels)
- 確認日: none. The screen path has not been independently verified by KanseiLINK on a test space; "確認できない" for the exact current labels.
- 環境: any MCP client running backlog-mcp-server over stdio.

## 解決しなかった場合

- 「API」メニューが出ない、またはキーで何も取れないなら、スペース管理者が API 利用を制限していないか、自分が対象プロジェクトに参加しているかを確認する。管理者側の制限画面の名前は公式ヘルプが読めず確認できない。
- human_step_required: yes

## 調査の軌跡

- A5 C-06 (2026-10-20): README + a third-party walkthrough; support.backlog.com API-Settings article listed as a dead end.
- arm0-claude-run1-g2 / run2-g2 / run3-g2 (2026-10-20): the official ヘルプセンター (support.nulab.com / support.backlog.com) returned 403 to the fetcher in every run; the screen path came from the search snippet and a third-party page; developer.nulab.com/docs/backlog/auth/ reached once.
- Dead ends seen: community.nulab.com thread (301 to a contact page), a column page describing a UI that does not exist in Backlog (not adopted).

## 追試

(none yet)

## この記録の状態

status: `extracted_from_issue` — extracted from official pages, their search snippets and route records; no lived observation on a test space yet. It does not affect any grade. No rates, no rankings.
