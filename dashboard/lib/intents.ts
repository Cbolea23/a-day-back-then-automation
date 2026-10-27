import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Intents outbox — the web-mode replacement for local execution.
 *
 * When DEPLOY_MODE=web, an API route that would have executed a pipeline
 * action instead records an intent here and answers HTTP 202:
 *
 *   {status: "queued", mode: "web", intent: {id, type, payload, queued_via, createdAt}}
 *
 * Storage: append-only JSONL at <dataDir>/intents.jsonl when the filesystem
 * is writable (local dev / VPS), with an in-memory fallback + mirror for
 * ephemeral hosts (Cloudflare Workers isolates). The Discord bridge / machine
 * side polls GET /api/intents and executes what it finds — the dashboard
 * itself never runs anything in web mode.
 */
export type Intent = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  queued_via: "bridge";
  createdAt: string;
};

const memory: Intent[] = [];
const MAX_MEMORY = 200;
const MAX_LIST = 100;

function dataDir(): string {
  return process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
}

function intentsFile(): string {
  return path.join(dataDir(), "intents.jsonl");
}

export function recordIntent(type: string, payload: Record<string, unknown>): Intent {
  const intent: Intent = {
    id: `intent-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    type,
    payload: payload ?? {},
    queued_via: "bridge",
    createdAt: new Date().toISOString(),
  };
  memory.unshift(intent);
  if (memory.length > MAX_MEMORY) memory.length = MAX_MEMORY;
  try {
    fs.mkdirSync(dataDir(), {recursive: true});
    fs.appendFileSync(intentsFile(), JSON.stringify(intent) + "\n");
  } catch {
    /* ephemeral filesystem — in-memory copy above is the fallback */
  }
  return intent;
}

export function listIntents(limit = MAX_LIST): Intent[] {
  const byId = new Map<string, Intent>();
  try {
    const raw = fs.readFileSync(intentsFile(), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed) as Intent;
        if (parsed && parsed.id) byId.set(parsed.id, parsed);
      } catch {
        /* skip corrupt lines */
      }
    }
  } catch {
    /* no outbox file yet */
  }
  for (const intent of memory) byId.set(intent.id, intent);
  return [...byId.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/** Record an intent and answer with the standard web-mode 202 response. */
export function queueIntent(type: string, payload: Record<string, unknown>): NextResponse {
  const intent = recordIntent(type, payload);
  return NextResponse.json(
    {status: "queued", mode: "web", intent},
    {status: 202},
  );
}
