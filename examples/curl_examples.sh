#!/usr/bin/env bash
# SocialToAI.app REST API cURL examples
# Set your key first: export SOCIALTOAI_API_KEY="stai_live_..."
set -euo pipefail

BASE="https://socialtoai.app"

# 1. Free: inspect all 242+ live capabilities & prices (no API key needed)
curl -s "$BASE/v1/capabilities" | head -c 500
echo ""

# 2. Search Xiaohongshu (RedNote) notes
curl -s -X POST "$BASE/v1/search" \
  -H "Authorization: Bearer $SOCIALTOAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"platform":"xiaohongshu","query":"coffee machine","limit":20}'

# 3. Extract YouTube or Bilibili transcript
curl -s -X POST "$BASE/v1/detail" \
  -H "Authorization: Bearer $SOCIALTOAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"platform":"youtube","id":"dQw4w9WgXcQ","include":"transcript"}'

# 4. Extract watermark-free Douyin media URLs
curl -s -X POST "$BASE/v1/call/douyin.media" \
  -H "Authorization: Bearer $SOCIALTOAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"id":"7345678901234567890"}'
