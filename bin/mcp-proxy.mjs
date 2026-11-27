#!/usr/bin/env node
/**
 * Thin zero-dependency stdio -> Streamable HTTP bridge for https://socialtoai.app/mcp
 * Usage: SOCIALTOAI_API_KEY=stai_live_... node bin/mcp-proxy.mjs
 *
 * Without SOCIALTOAI_API_KEY the bridge still answers initialize / tools/list from the bundled
 * tools-schema.json (so registries can introspect it), and returns a JSON-RPC error for tools/call.
 */
import fs from 'node:fs';
import readline from 'node:readline';

const ENDPOINT = process.env.SOCIALTOAI_MCP_URL || 'https://socialtoai.app/mcp';
const API_KEY = process.env.SOCIALTOAI_API_KEY || '';
const VERSION = '1.2.0';
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];
const TOOLS = JSON.parse(fs.readFileSync(new URL('./tools-schema.json', import.meta.url), 'utf8'));
const KEY_HELP = 'Set SOCIALTOAI_API_KEY (get one at https://socialtoai.app/console/keys/) or connect your client directly to https://socialtoai.app/mcp.';

if (!API_KEY) process.stderr.write(`[socialtoai-app-mcp] No API key: introspection only. ${KEY_HELP}\n`);

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const ok = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message, data) => send({ jsonrpc: '2.0', id, error: { code, message, ...(data ? { data } : {}) } });

function offline(msg) {
  switch (msg.method) {
    case 'initialize': {
      const proposed = msg.params?.protocolVersion;
      return ok(msg.id, {
        protocolVersion: VERSIONS.includes(proposed) ? proposed : VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'socialtoai-app', version: VERSION },
        instructions: KEY_HELP,
      });
    }
    case 'ping': return ok(msg.id, {});
    case 'tools/list': return ok(msg.id, { tools: TOOLS });
    case 'tools/call': return fail(msg.id, -32001, 'Unauthorized: missing SOCIALTOAI_API_KEY', { help: KEY_HELP });
    default: return fail(msg.id, -32601, 'Method not found');
  }
}

async function forward(msg, raw) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'MCP-Protocol-Version': '2025-11-25',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: raw,
  });
  if (res.status === 202 || res.status === 204) return;
  const text = (await res.text()).trim();
  if (msg.id === undefined) return; // notification: never write a response
  let body = null;
  try { body = JSON.parse(text); } catch {}
  if (body && body.jsonrpc === '2.0' && ('result' in body || 'error' in body)) return send(body);
  // Upstream answered with a non-JSON-RPC body (e.g. 401/429 JSON): wrap it so the client stays in protocol.
  const code = res.status === 401 || res.status === 403 ? -32001 : -32000;
  return fail(msg.id, code, `Upstream HTTP ${res.status}${body?.error ? `: ${body.error}` : ''}`, body ?? { body: text.slice(0, 500) });
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

async function handle(line) {
  const raw = line.trim();
  if (!raw) return;
  let msg;
  try { msg = JSON.parse(raw); } catch { return fail(null, -32700, 'Parse error'); }
  if (!msg || typeof msg.method !== 'string') return msg?.id !== undefined ? fail(msg.id, -32600, 'Invalid request') : undefined;
  if (!API_KEY) return msg.id === undefined ? undefined : offline(msg);
  try {
    await forward(msg, raw);
  } catch (err) {
    if (msg.id !== undefined) fail(msg.id, -32000, `Upstream MCP connection failed: ${err?.message || 'network_error'}`);
  }
}

// Process messages strictly in order so responses keep request order (initialize first).
let queue = Promise.resolve();
rl.on('line', (line) => { queue = queue.then(() => handle(line)); });
