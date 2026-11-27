---
name: socialtoai-app
description: >-
  Query live public social media data, comments, creator profiles, ad libraries,
  watermark-free media, and video transcripts across 18 global and Chinese
  platforms via SocialToAI.app MCP (https://socialtoai.app/mcp).
---

# SocialToAI.app Social Data Skill

Use the `socialtoai-app` MCP server (`https://socialtoai.app/mcp`) whenever the user asks to research, monitor, or extract public content from Xiaohongshu (RedNote), Douyin, TikTok, Instagram, X (Twitter), Reddit, YouTube, Bilibili, Weibo, Zhihu, Kuaishou, WeChat Articles, WeChat Channels, Facebook, Pinterest, LinkedIn, Threads, Telegram, Meta Ad Library, or Google Ads Transparency.

## Workflow
1. **Discover first (free)**: Call `find` or `capabilities` when unsure which `platform` / `action` / `op` matches the request or how many credits it costs.
2. **Respect cost safety**: Always generate a fresh UUID for `idempotency_key` on paid calls; reuse the same `idempotency_key` only when retrying the exact same request. For multi-call composite tools (`brand_buzz`, `comment_insights`, `account_watch`, `find_creators`, `creator_card`, `batch_stats`, `viral_finder`), quote first (`confirm: false`) if the user has not approved the budget.
3. **Use specialized tools when appropriate**:
   - Video speech-to-text transcripts: use `detail` with `include: "transcript"` (YouTube/TikTok/Instagram/X/Reddit/LinkedIn) or `call` with `op: "<platform>.transcript"` (Bilibili/Xiaohongshu/Kuaishou/Weibo/WeChat Channels).
   - Bulk links (up to 2,000 URLs): use `batch_stats`, then poll with the returned `handle` (free 24-hour readback).
   - Daily/weekly monitoring: use `watch` (`action: "preview"` -> user approval -> `action: "confirm"`).
4. **Always cite source links**: Include the public post/account URLs returned by the API so the user can verify every claim.
