/**
 * Heartbeat feed published by the pipeline machine:
 * https://bolealabs.site/status.json
 *   {"dashboard": "up"|"down", "stream": "live"|"down", "updated_at": "<ISO>"}
 *
 * Fetched server-side with a short timeout and a 60s in-memory cache.
 * Returns null on any failure — callers must degrade gracefully.
 */
export type Heartbeat = {
  dashboard?: string;
  stream?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export const HEARTBEAT_URL =
  process.env.HEARTBEAT_URL || "https://bolealabs.site/status.json";

let cache: {at: number; value: Heartbeat | null} | null = null;
const TTL_MS = 60 * 1000;

export async function getHeartbeat(): Promise<Heartbeat | null> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.value;
  let value: Heartbeat | null = null;
  try {
    const res = await fetch(HEARTBEAT_URL, {
      signal: AbortSignal.timeout(5000),
      headers: {accept: "application/json"},
    });
    if (res.ok) value = (await res.json()) as Heartbeat;
  } catch {
    value = null;
  }
  cache = {at: now, value};
  return value;
}
