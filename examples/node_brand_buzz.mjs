// Multi-platform Brand Buzz + 24-hour free handle readback via SocialToAI.app
import crypto from 'node:crypto';

const API_KEY = process.env.SOCIALTOAI_API_KEY;
if (!API_KEY) throw new Error('Set SOCIALTOAI_API_KEY first.');

const BASE = 'https://socialtoai.app';

async function main() {
  const res = await fetch(`${BASE}/v1/tools/brand_buzz`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      brand: 'Notion',
      platforms: ['reddit', 'x', 'xiaohongshu'],
      scale: 'small',
      confirm: true,
    }),
  });
  const data = await res.json();
  console.log('Status:', res.status, 'Credits:', data.credits, 'Handle:', data.handle);

  if (data.handle) {
    // Free replay within 24 hours (supports ?offset=0&limit=10 slicing)
    const replay = await fetch(`${BASE}/v1/results/${data.handle}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    console.log('Replay HTTP:', replay.status);
  }
}

main();
