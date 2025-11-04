---
title: "WSL + Claude Code で Figma MCP Server を使用する"
date: "2025-10-26"
lastModified: "2025-10-26"
---
# 概要
WSL 環境上で Claude Code と Figma MCP Server を接続する際に、ドキュメントに従っても接続できなかった。この現象への対処法を説明する。
# 対処法
**`.wslconfig` ファイルに `networkingMode = mirrored` を追記する**
# 経緯
Figma MCP Server を使用する機会があったため、[公式のガイド](https://help.figma.com/hc/ja/articles/32132100833559-Dev-Mode-MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%88%A9%E7%94%A8%E3%82%AC%E3%82%A4%E3%83%89)に従い設定したが、
```bash
$ claude mcp list
Checking MCP server health...
figma-mcp: http://127.0.0.1:3845/sse (SSE) - ✗ Failed to connect
```
このように接続できなかった。

サーバーの稼働状況を調査すべく、WSLとPowerShellでポートの使用状況を調査した。
- WSL
```bash
$ lsof -i :3845

```
- PowerShell
```powershell
> Get-Process -Id 5572

Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
   1080      73   122020     112452      19.50   5572   1 Figma
```

MCPサーバーは Windows上では稼働しているが、WSLから接続できていないように見受けられた。

調査したところ、[有用そうなページ](https://forum.figma.com/report-a-problem-6/mcp-server-claude-code-and-wsl-42517)を発見。
このページに従って `.wslconfig` ファイルに `networkingMode = mirrored` を追記したところ解決した。

# 解説