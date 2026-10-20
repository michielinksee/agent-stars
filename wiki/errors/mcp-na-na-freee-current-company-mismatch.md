---
error_key: mcp-na-na-freee-current-company-mismatch
error_text: "freee_api_get error: company_id differs from the current company — use freee_set_current_company"
service_id: freee
component: freee-mcp (official) tool freee_api_get / freee_set_current_company
environments: [Claude Code]
transport: stdio
organ_stopped: 接続
symptom_class: wrong_target
applies_when: freee_api_get に、freee-mcp が保持する「現在の事業所」と違う company_id を渡したとき
first_check: freee_list_companies で、使いたい事業所の API の id（8 digits）と現在の事業所を見比べる
what_was_true: freee-mcp は「現在の事業所」を設定ファイルに永続化し、それと違う事業所への呼び出しを通さない。事業所の識別子は二つある（API の id は 8 digits・事業所番号は 10 digits）。freee_list_companies の出力は整形テキストで JSON ではない（formatted text, not JSON）。
how_resolved: |
  - Call freee_set_current_company first, using the API id (8 digits, not the 10-digit 事業所番号).
  - Do the work with freee_api_get.
  - Then switch back to the original company (元の事業所に戻す).
success_check: 切り替え後の freee_api_get が目的の事業所のデータを返す
if_not_resolved: 切り替えたのに 403 なら rest-403-forbiddenError-freee-invoices。id を 10 桁で渡していないか
human_step_required: "no"
status: lived
sources:
  - https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-001
  - https://kansei-link.com/insights/agent-field-notes.json
  - https://github.com/freee/freee-mcp
source_count: 3
last_verified: 2026-10-01
search_terms_seen:
  - "freee-mcp freee_set_current_company company_id"
  - "freee-mcp freee_set_current_company company_id 複数事業所 切り替え"
  - "freee-mcp freee_set_current_company company_id 複数事業所"
trail:
  - "A6 T-02 (2026-10-20): one search with the tool name → freee-mcp README; solved the switch but not the switch-back"
  - "arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): README reached each time; the exact argument name of freee_set_current_company was not confirmed on any page; 'switch back' was missing from all three answers; the 8/10-digit distinction appeared once, from prior knowledge"
  - "Dead ends seen: glama README mirror with no body, agentskills.so unreachable, directory pages that only re-post the README (one used an older tool name freee_set_company)"
retests: []
---

# freee_api_get error: company_id differs from the current company — use freee_set_current_company

The message pattern is "contains `freee_set_current_company`". freee-mcp (official), tool `freee_api_get`.

## 症状

- Passing a `company_id` that differs from the current company to `freee_api_get` is rejected with an error telling you to switch with `freee_set_current_company`.
- 現在の事業所と違う company_id を渡すと拒否され、freee_set_current_company で切り替えるよう返される。Observed 2026-09-24 through 2026-10-01, reproduced in daily observation.

## 該当条件

freee_api_get に、freee-mcp が保持する「現在の事業所」と違う company_id を渡したとき。

## 最初の確認

`freee_list_companies` で、使いたい事業所の API の id（8 digits）と現在の事業所を見比べる。The output is formatted text, not JSON; read the id out of the text.

## 解決手順

- Call `freee_set_current_company` first, using the API `id` (8 digits), not the 10-digit 事業所番号.
- Do the work with `freee_api_get`.
- Then switch back to the original company.
- 日本語: 先に freee_set_current_company で切り替え（API の id を使う）、終わったら元の事業所に戻す。

## 成功の確認

切り替え後の `freee_api_get` が目的の事業所のデータを返す。

## 根拠

- 出所: AWT-001 (lived, observer human:synapse-arrows, observed 2026-09-24〜2026-10-01, published 2026-10-07) — https://kansei-link.com/insights/agent-field-notes-2026-10.html#AWT-001 ; machine-readable https://kansei-link.com/insights/agent-field-notes.json
- freee-mcp (official): https://github.com/freee/freee-mcp
- 確認日: 2026-10-01（最終観測）/ 2026-10-07（公開）
- 環境: Claude Code, transport stdio

## 解決しなかった場合

- 切り替えたのに 403 なら [rest-403-forbiddenError-freee-invoices](rest-403-forbiddenError-freee-invoices.md)（アプリ権限）。
- id を 10 digits（事業所番号）で渡していないかを確認。
- human_step_required: no

## 調査の軌跡

- A6 T-02 (2026-10-20): one search with the tool name → freee-mcp README; solved the switch but not the switch-back.
- arm0-claude-run1-g1 / run2-g1 / run3-g1 (2026-10-20): README reached each time; the exact argument name of `freee_set_current_company` was not confirmed on any page; "switch back" was missing from all three answers; the 8/10-digit distinction appeared once, from prior knowledge.
- Dead ends seen: glama README mirror with no body, agentskills.so unreachable, directory pages that only re-post the README (one used an older tool name `freee_set_company`).

## 追試

(none yet)

## この記録の状態

status: `lived` — one observer's record from real work. It is not `verified` and does not affect any grade. No rates, no rankings.
