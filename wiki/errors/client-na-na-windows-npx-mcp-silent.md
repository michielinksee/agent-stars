---
error_key: client-na-na-windows-npx-mcp-silent
error_text: "Windows: Claude Desktop MCP server configured with npx does not start — tools not shown and no mcp-server-<name>.log in the logs folder"
service_id: mcp-runtime
component: Claude Desktop on Windows; claude_desktop_config.json; npx (Node.js)
environments: [Claude Desktop]
transport: stdio
organ_stopped: 接続
symptom_class: other
applies_when: Windows の Claude Desktop で npx 起動の MCP サーバーを設定したのに、ツールが出ず %APPDATA%\Claude\logs に該当サーバーのログが一つも無いとき
first_check: %APPDATA%\Claude\claude_desktop_config.json の JSON が壊れていないか（末尾カンマ・コメント）
what_was_true: 該当サーバーのログが無い＝プロセスが spawn されていない。原因は設定ファイル側: (1) JSON が不正だと全サーバーが無言で未読込 (2) ウィンドウを閉じても再読込されない (3) GUI はシェルの PATH を継承せず npx.cmd はバッチなので直接 spawn できない (4) %APPDATA% などの環境変数は展開されない。
how_resolved: |
  - 設定ファイルの場所と JSON の妥当性を確認（jq . 等）。"mcpServers" の下に書く。
  - command を "cmd"、args を ["/c", "npx", "-y", "<package>"] にする。または npx.cmd / node.exe の絶対パスを command に書く。-y が無いとインストール確認で止まる。
  - 引数・.env・パスは絶対パスで書く（環境変数は展開されない）。環境変数は "env" キーで渡す。
  - タスクトレイのアイコンから Exit して完全に終了し、再起動する。
  - 起動段階に進めば mcp.log と mcp-server-<name>.log が出るので、以後はそこに出る実エラーを読む。
  - 切り分け: 同じコマンドをターミナルで手動実行して起動するか確認。
success_check: %APPDATA%\Claude\logs\mcp-server-<name>.log が生成され、入力欄のツール一覧にそのサーバーのツールが出る
if_not_resolved: node を fnm / volta / nvm-windows の shim で入れているなら node 本体の絶対パスを command に書く（未観測）
human_step_required: "yes: 設定ファイルの修正と Claude Desktop の完全再起動"
status: unverified
sources:
  - https://modelcontextprotocol.io/docs/tools/debugging
  - https://hjarni.com/mcp-fix/claude-desktop-mcp-tools-not-showing
  - https://www.rapidevelopers.com/md/mcp-tutorial/how-to-fix-mcp-server-not-found-error
  - https://composio.dev/blog/claude-mcp-failed-to-connect
source_count: 4
last_verified:
search_terms_seen:
  - "Claude Desktop Windows MCP npx ツールが表示されない ログが無い"
  - "Claude Desktop Windows npx MCP server not starting no log file cmd /c \"C:\\Program Files\\nodejs\" Developer settings"
  - "Claude Desktop Windows MCP npx サーバー ツールが表示されない ログが無い"
  - "modelcontextprotocol.io debugging Claude Desktop logs mcp-server log Windows %APPDATA%\\Claude\\logs"
  - "claude_desktop_config.json Windows \"cmd\" \"/c\" \"npx\" MCP server not starting"
  - "Claude Desktop Windows MCP npx サーバー ツールが表示されない ログが出ない"
  - "Claude Desktop Windows MCP npx \"cmd\" \"/c\" ENOENT claude_desktop_config.json logs mcp-server log"
  - "Claude Desktop Windows npx MCP サーバー 起動しない ログ 出ない"
  - "modelcontextprotocol debugging Claude Desktop Windows npx cmd /c logs mcp-server log"
trail:
  - "A6 T-04 (2026-10-20): official debugging page + two blogs; solved"
  - "arm0-claude-run1-g3 / run2-g3 / run3-g3 (2026-10-20): the first search reached the same blog each time (config path, JSON validity, npx -y, tray exit, log path); the cmd /c wrapper and the no-log case needed a second or third search"
  - "Dead ends seen: per-server README pages on glama (too generic), a member-only article"
retests: []
---

# Windows: Claude Desktop MCP server configured with npx does not start — tools not shown and no mcp-server-<name>.log in the logs folder

## 症状

- Windows の Claude Desktop で、npx で起動する MCP サーバーを設定したが、ツールが出てこない。`%APPDATA%\Claude\logs` に該当サーバーのログ（`mcp-server-<name>.log`）が一つも無い。
- No per-server log means the process was never spawned: the problem is on the config/launch side, not inside the server.

## 該当条件

Windows の Claude Desktop で npx 起動の MCP サーバーを設定したのに、ツールが出ず `%APPDATA%\Claude\logs` に該当サーバーのログが一つも無いとき。

## 最初の確認

`%APPDATA%\Claude\claude_desktop_config.json` の JSON が壊れていないか（末尾カンマ・コメント・括弧の不整合）。壊れていると UI に警告なしで全サーバーが未読込になる。

## 解決手順

1. 設定ファイルの場所: Windows で読まれるのは `%APPDATA%\Claude\claude_desktop_config.json`（設定 → Developer → Edit Config で開くファイル）。`"mcpServers"` の下に書く。
2. JSON の妥当性を `jq .` 等で検証。
3. GUI はシェルの PATH を継承しない。`npx.cmd` はバッチなので直接 spawn できない。`"command": "cmd", "args": ["/c", "npx", "-y", "<package>"]` の形にするか、`npx.cmd` / `node.exe` の絶対パスを command に書く。`-y` が無いとインストール確認で止まりツールが登録されない。
4. `%APPDATA%` などの環境変数は展開されない。引数・.env・作業パスは絶対パスで書き、環境変数は `"env"` キーで渡す。
5. ウィンドウを閉じるだけでは再読込されない。タスクトレイのアイコンを右クリック → Exit で完全に終了してから起動する。
6. 起動段階に進めば `mcp.log`（接続レベル）と `mcp-server-<name>.log`（サーバーの stderr）が出る。以後はそこに出る実エラー（`spawn npx ENOENT` 等）を読む。
7. 切り分け: 同じコマンドをターミナルで手動実行し、JSON-RPC の初期化待ちで止まる（正常）かエラーで落ちるかを見る。

## 成功の確認

`%APPDATA%\Claude\logs\mcp-server-<name>.log` が生成され、入力欄のツール一覧にそのサーバーのツールが出る。

## 根拠

- https://modelcontextprotocol.io/docs/tools/debugging (official; Windows log path, full quit, absolute paths, env key)
- https://hjarni.com/mcp-fix/claude-desktop-mcp-tools-not-showing (third-party; config path, JSON validity, npx -y, tray exit)
- https://www.rapidevelopers.com/md/mcp-tutorial/how-to-fix-mcp-server-not-found-error (third-party; cmd /c wrapper, PATH not inherited, absolute paths)
- https://composio.dev/blog/claude-mcp-failed-to-connect (third-party; log tail, PATH, run-manually test)
- 確認日: none (no lived observation by KanseiLINK on this PC). The official debugging page is macOS-first; the Windows-specific points come from third-party pages. 環境: Claude Desktop on Windows, stdio.

## 解決しなかった場合

- node を fnm / volta / nvm-windows の shim で入れている場合: GUI から shim が見えず npx が解決できない可能性がある。node 本体の絶対パスを command に書いて試す。この点は未観測・確認できない（観測した版と日付が付いたら「追試」へ）。
- human_step_required: yes

## 調査の軌跡

- A6 T-04 (2026-10-20): official debugging page + two blogs; solved.
- arm0-claude-run1-g3 / run2-g3 / run3-g3 (2026-10-20): the first search reached the same blog each time (config path, JSON validity, npx -y, tray exit, log path); the `cmd /c` wrapper and the no-log case needed a second or third search.
- Dead ends seen: per-server README pages on glama (too generic), a member-only article.

## 追試

(none yet)

## この記録の状態

status: `unverified` — extracted from the official debugging page and third-party pages via route records; not reproduced by KanseiLINK. It does not affect any grade. No rates, no rankings.
