# SocialToAI.app MCP 服务与 18 平台社媒数据 API

[![官网](https://img.shields.io/badge/官网-socialtoai.app-111111?style=flat-square)](https://socialtoai.app/zh/)
[![MCP 地址](https://img.shields.io/badge/MCP-Streamable%20HTTP-2563eb?style=flat-square)](https://socialtoai.app/zh/mcp/)
[![在线能力](https://img.shields.io/badge/实时可用接口-242%2B-16a34a?style=flat-square)](https://socialtoai.app/v1/capabilities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

[English](./README.md) · [简体中文](./README.zh-CN.md)

**一个 MCP 地址 + 统一 REST API，打通国内外 18 个社媒平台与 2 大广告库。**
让 ChatGPT、Claude、Claude Code、Cursor、Antigravity、Windsurf、Cline、Codex、Dify、扣子（Coze）、n8n、OpenClaw 与你的程序直接读取小红书、抖音、B 站、微博、知乎、快手、公众号、视频号、TikTok、Instagram、X、Reddit、YouTube、Facebook、Pinterest 等平台的公开帖子、评论、账号数据、无水印媒体和视频逐字稿——**按次计费，调用失败不扣费**。

- **注册即送 100 免费积分**：在 [socialtoai.app/zh/sign-in/](https://socialtoai.app/zh/sign-in/) 用邮箱验证码或 Google 登录即可领取，免绑卡，积分永久有效。
- **支持支付宝与银行卡**：Waffo 托管收银，**无需海外信用卡**，无月费订阅。
- **242+ 实时可用接口**：免 Key 直接查看最新状态与定价 [`GET https://socialtoai.app/v1/capabilities`](https://socialtoai.app/v1/capabilities)。

---

## 支持平台（18 个社媒平台 + 2 大广告库）

- **国内平台（8 个）**：小红书（含蒲公英达人/关键词/视频转文字）、抖音（含星图/巨量算数/热榜/无水印媒体/音乐）、B 站（含原声字幕与转文字）、微博、知乎、快手、微信公众号、微信视频号
- **海外平台（10 个）**：TikTok（含 Shop 商品与广告库）、Instagram、X（Twitter）、Reddit、YouTube（含字幕）、Facebook、Pinterest、LinkedIn（含广告库）、Threads、Telegram
- **广告库（2 个）**：Meta 广告库、Google 广告透明度中心

---

## 30 秒快速接入 MCP

**远程 MCP 地址（Streamable HTTP）：** `https://socialtoai.app/mcp`

### 方式一：API Key 配置（Cursor / Antigravity / Windsurf / Cline / Claude Code / Codex / OpenClaw / Cherry Studio）
1. 登录 [socialtoai.app/zh/sign-in/](https://socialtoai.app/zh/sign-in/) 领取 **100 免费积分**；
2. 在控制台 [API Keys](https://socialtoai.app/console/keys/) 创建一把 `stai_live_...` 密钥；
3. 粘贴到客户端 MCP 配置文件（Google Antigravity 的 `~/.gemini/config/mcp_config.json` 中请将 `"url"` 写为 `"serverUrl"`）：

```json
{
  "mcpServers": {
    "socialtoai-app": {
      "url": "https://socialtoai.app/mcp",
      "headers": {
        "Authorization": "Bearer 你的_SOCIALTOAI_API_KEY"
      }
    }
  }
}
```

### 方式二：OAuth 2.0 一键登录（ChatGPT / Claude 等支持 MCP OAuth 的客户端）
直接添加远程 MCP 地址 `https://socialtoai.app/mcp`，客户端会自动发现 OAuth 端点并弹出授权页，支持 1 小时令牌与 `refresh_token` 自动续期。

### 方式三：本地 `stdio` 桥接（适配仅支持本地 stdio 的旧客户端）
仓库内置零依赖薄转发脚本 [`bin/mcp-proxy.mjs`](./bin/mcp-proxy.mjs)，仅将本地标准输入输出转发至 `https://socialtoai.app/mcp`：

```json
{
  "mcpServers": {
    "socialtoai-app": {
      "command": "node",
      "args": ["/你的路径/mcp/bin/mcp-proxy.mjs"],
      "env": {
        "SOCIALTOAI_API_KEY": "stai_live_你的密钥"
      }
    }
  }
}
```

各客户端详细接入教程：
[ChatGPT](https://socialtoai.app/zh/connect/chatgpt/) · [Claude](https://socialtoai.app/zh/connect/claude/) · [Cursor](https://socialtoai.app/zh/connect/cursor/) · [Antigravity](https://socialtoai.app/zh/connect/antigravity/) · [Windsurf](https://socialtoai.app/zh/connect/windsurf/) · [Cline](https://socialtoai.app/zh/connect/cline/) · [Codex](https://socialtoai.app/zh/connect/codex/) · [Dify](https://socialtoai.app/zh/connect/dify/) · [扣子 Coze](https://socialtoai.app/zh/connect/coze/) · [n8n](https://socialtoai.app/zh/connect/n8n/) · [OpenClaw](https://socialtoai.app/zh/connect/openclaw/) · [Cherry Studio](https://socialtoai.app/zh/connect/cherry-studio/)

---

## 7 大多档组合研究工具 & 自动化

- `brand_buzz`：跨平台品牌口碑分析（支持 `small / medium / large` 多页与评论抽样）
- `comment_insights`：评论区痛点与购买意向分析（支持 `200 / 1,000 / 3,000` 条三档）
- `account_watch`：账号爆款动态监控（最高 60 条作品 + 起量作品评论）
- `find_creators`：按细分赛道找达人（`20 / 50 / 100` 三档补资料与近期作品）
- `creator_card`：跨平台达人档案（支持传入单个主页链接自动发现其他平台账号）
- `batch_stats`：最多 2,000 条帖子/账号链接异步批量查数与 CSV 导出
- `viral_finder`：按关键词挖掘显著跑赢作者均值基线的爆款内容
- `watch` / `watch_news`：每日/每周定时监控、RSS/JSON 订阅源、飞书/企业微信/Slack 群推送

---

## 调用示例与 Agent Skills

- **脚本示例（[`./examples/`](./examples/)）**：包含 [cURL](./examples/curl_examples.sh)、[Python 小红书评论分析](./examples/python_xiaohongshu_comments.py) 与 [Node.js 品牌口碑监控](./examples/node_brand_buzz.mjs)。
- **Agent Skills（[`./skills/`](./skills/)）**：内含小红书评论洞察、小红书竞品笔记审计、抖音评论痛点挖掘与通用 SocialToAI.app Skill，可直接导入 Claude Code / Cursor / Codex / OpenClaw。

---

## 计费标准（预充积分，永久有效）

| 档位 | 积分 | 常规单次（2 积分）折算 |
|---|---:|---:|
| **注册免费送** | **100** | 免费试用，免绑卡 |
| **$10** | **3,000** | 约 ¥0.048 / 次 |
| **$50** | **20,000** | 约 ¥0.036 / 次 |
| **$200** | **100,000** | 约 ¥0.029 / 次 |

- 支持 **支付宝 / 银行卡**（自定义金额 $10～$2,000），失败调用 0 扣费，24 小时内凭句柄免费回读结果。
- 在线 Playground 试用：https://socialtoai.app/console/playground/ · 联系支持：`support@socialtoai.app`
