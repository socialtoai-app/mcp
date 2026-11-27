# SocialToAI.app MCP Server & API

[![Website](https://img.shields.io/badge/Website-socialtoai.app-111111?style=flat-square)](https://socialtoai.app/)
[![MCP Endpoint](https://img.shields.io/badge/MCP-Streamable%20HTTP-2563eb?style=flat-square)](https://socialtoai.app/mcp/)
[![Capabilities](https://img.shields.io/badge/Live%20Endpoints-242%2B-16a34a?style=flat-square)](https://socialtoai.app/v1/capabilities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

[English](./README.md) · [简体中文](./README.zh-CN.md)

**One MCP server & REST API for 18 global + Chinese social media platforms and 2 ad libraries.**
Let ChatGPT, Claude, Claude Code, Cursor, Windsurf, Cline, Codex, Dify, Coze, n8n, OpenClaw, and your scripts read live public posts, comments, profiles, trending feeds, watermark-free media, and video transcripts — **pay per call, failed calls cost 0**.

- **100 Free Credits on Sign-up** — email OTP or Google sign-in at [socialtoai.app/sign-in/](https://socialtoai.app/sign-in/), no credit card required, credits never expire.
- **Alipay & International Card** — prepaid USD credit packs via Waffo Checkout (no overseas credit card required).
- **242+ Live Endpoints** — inspect real-time availability and credit costs free without a key at [`GET https://socialtoai.app/v1/capabilities`](https://socialtoai.app/v1/capabilities).

---

## Supported Platforms (18 Platforms + 2 Ad Libraries)

| Region | Platforms | Capabilities |
|---|---|---|
| **Global** | TikTok, Instagram, X (Twitter), Reddit, YouTube, Facebook, Pinterest, LinkedIn, Threads, Telegram | Search, trending, post detail, comments & replies, user profiles, user posts, watermark-free media, native/Whisper video transcripts |
| **China** | Xiaohongshu (RedNote), Douyin, Bilibili, Weibo, Zhihu, Kuaishou, WeChat Official Accounts, WeChat Channels | Notes/videos search, comments & replies, PGY & Xingtu KOL analytics, Douyin Index, hot boards, media extraction & transcripts |
| **Ad Libraries** | Meta Ad Library, Google Ads Transparency, TikTok Creative Center, LinkedIn Ad Library | Ad search, advertiser search, ad creative detail & ad video transcript |

---

## Quick Setup (Streamable HTTP MCP)

**Remote MCP URL:** `https://socialtoai.app/mcp`

### Option A — OAuth 2.0 (ChatGPT, Claude, Clients with MCP OAuth)
Add `https://socialtoai.app/mcp` as a remote MCP server. The server exposes full OAuth 2.0 discovery (`/.well-known/oauth-authorization-server`), dynamic client registration (`/oauth/register`), and 1-hour access tokens with automatic `refresh_token` rotation.

### Option B — API Key (Cursor, Windsurf, Cline, Claude Code, Codex, OpenClaw, Cherry Studio)
1. Sign in at [socialtoai.app/sign-in/](https://socialtoai.app/sign-in/) to claim **100 free credits**.
2. Create an API key (`stai_live_...`) in [Console → API Keys](https://socialtoai.app/console/keys/).
3. Paste into your client's MCP configuration:

```json
{
  "mcpServers": {
    "socialtoai-app": {
      "url": "https://socialtoai.app/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SOCIALTOAI_API_KEY"
      }
    }
  }
}
```

### Option C — Local `stdio` Bridge (for stdio-only MCP clients)
If your client only supports local `stdio` MCP servers, run the zero-dependency thin bridge included in this repo (forwards JSON-RPC directly to `https://socialtoai.app/mcp`):

```json
{
  "mcpServers": {
    "socialtoai-app": {
      "command": "node",
      "args": ["/path/to/mcp/bin/mcp-proxy.mjs"],
      "env": {
        "SOCIALTOAI_API_KEY": "stai_live_YOUR_KEY"
      }
    }
  }
}
```

Client-specific guides:
[ChatGPT](https://socialtoai.app/connect/chatgpt/) · [Claude](https://socialtoai.app/connect/claude/) · [Claude Code](https://socialtoai.app/connect/claude-code/) · [Cursor](https://socialtoai.app/connect/cursor/) · [Windsurf](https://socialtoai.app/connect/windsurf/) · [Cline](https://socialtoai.app/connect/cline/) · [Codex](https://socialtoai.app/connect/codex/) · [Dify](https://socialtoai.app/connect/dify/) · [Coze](https://socialtoai.app/connect/coze/) · [n8n](https://socialtoai.app/connect/n8n/) · [OpenClaw](https://socialtoai.app/connect/openclaw/) · [Cherry Studio](https://socialtoai.app/connect/cherry-studio/)

---

## Included MCP Tools (19 Tools)

### Core Data Tools
- `search` — Search public posts or accounts (`type="user"`) across platforms
- `trending` — Live platform hot boards (X, Douyin, Xiaohongshu, Reddit, Weibo, Bilibili, Zhihu, Kuaishou)
- `detail` — Single post/video detail + optional `include="transcript"`
- `comments` — Public comments & nested replies (`reply_of`) with cursor pagination
- `user_profile` / `user_posts` — Account profiles and published posts/videos
- `find` / `call` — Discover and invoke 100+ platform-specific ops (PGY, Xingtu, Ad Libraries, Media Download, Transcripts)
- `capabilities` / `account` — Free capability lookup and credit balance check

### 7 Multi-Tier Research & Automation Tools
| Tool | What It Does | Tiers |
|---|---|---|
| `brand_buzz` | Cross-platform brand sentiment, top posts & comment sampling | `small` / `medium` / `large` |
| `comment_insights` | Comment theme clustering, questions, complaints & quotes | `200` / `1,000` / `3,000` comments |
| `account_watch` | Compare recent posts vs account baseline + breakout comments | `small` / `medium` (~60) / `large` |
| `find_creators` | Discover niche creators with profile & post enrichment | `20` / `50` / `100` candidates |
| `creator_card` | Cross-platform creator dossier (auto-discovers from 1 URL) | `small` / `medium` (incl. KOL data) |
| `batch_stats` | Async wave stats for up to 2,000 post/account links + CSV export | Background waves (50/wave) |
| `viral_finder` | Find posts outperforming their author's usual median | `small` / `medium` / `large` |
| `watch` / `watch_news` | Daily/weekly scheduled watches with RSS, Feishu/WeCom/Slack push & alerts | Timezone & budget-capped |

---

## REST API Quickstart

```bash
curl -X POST "https://socialtoai.app/v1/search" \
  -H "Authorization: Bearer $SOCIALTOAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"platform":"xiaohongshu","query":"coffee machine","limit":20}'
```

More runnable examples live in [`./examples/`](./examples/):
- [`examples/curl_examples.sh`](./examples/curl_examples.sh) — Search, transcripts, media download, and batch stats
- [`examples/python_xiaohongshu_comments.py`](./examples/python_xiaohongshu_comments.py) — Analyze comments with quotes in Python
- [`examples/node_brand_buzz.mjs`](./examples/node_brand_buzz.mjs) — Multi-platform brand buzz & 24-hour handle readback in Node.js

---

## Agent Skills

Install reusable research workflows from [`./skills/`](./skills/) into Claude Code, Cursor, Codex, or OpenClaw:
- [`skills/socialtoai-app/SKILL.md`](./skills/socialtoai-app/SKILL.md) — General 18-platform SocialToAI.app MCP usage guide
- [`skills/xiaohongshu-comment-drivers/SKILL.md`](./skills/xiaohongshu-comment-drivers/SKILL.md) — Extract buying drivers & complaints from Xiaohongshu comments
- [`skills/xiaohongshu-competitor-notes/SKILL.md`](./skills/xiaohongshu-competitor-notes/SKILL.md) — Audit competitor Xiaohongshu content performance
- [`skills/douyin-comment-pain-points/SKILL.md`](./skills/douyin-comment-pain-points/SKILL.md) — Mine product pain points from Douyin video comments

---

## Pricing (Prepaid Credits, No Subscription)

| Pack | Credits | Effective Price (2-credit call) |
|---|---:|---:|
| **Free Sign-up** | **100** | Free, no card |
| **$10** | **3,000** | $0.0067 / call |
| **$50** | **20,000** | $0.0050 / call |
| **$200** | **100,000** | $0.0040 / call |

- Credits never expire · Custom top-up amounts from $10 to $2,000 · **Alipay & Card** supported via Waffo.
- Failed calls are never charged. Free 24-hour result replay via `GET /v1/results/{handle}`.

---

## Links & Live Metadata
- Website: https://socialtoai.app/
- Live Capabilities JSON (no key): https://socialtoai.app/v1/capabilities
- Live System Status (no key): https://socialtoai.app/v1/status
- LLM Documentation: https://socialtoai.app/llms.txt · https://socialtoai.app/llms-full.txt
- MCP Server Card: https://socialtoai.app/.well-known/mcp/server.json
- Support: `support@socialtoai.app`

## License
MIT — see [LICENSE](./LICENSE).
