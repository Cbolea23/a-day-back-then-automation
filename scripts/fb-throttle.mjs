/**
 * Facebook API throttle guard (shared by schedulers + upload-facebook.mjs).
 *
 * Facebook error 368 ("We limit how often you can post...") is a temporary
 * anti-spam block. Hammering the API while blocked extends it, so:
 *  - upload-facebook.mjs exits with THROTTLE_EXIT_CODE (42) on a 368.
 *  - schedulers pause FB_UPLOAD_GAP_MS between uploads, stop the run on a
 *    42, and write a cooldown file so later runs (incl. the 90s daemon)
 *    skip Facebook until the block has had time to lift.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const THROTTLE_FILE = path.join(root, ".fb-throttle-until");
export const THROTTLE_EXIT_CODE = 42;
export const FB_UPLOAD_GAP_MS = 3 * 60 * 1000; // 3 min between FB API uploads
export const YT_UPLOAD_GAP_MS = 60 * 1000; // 1 min between YouTube uploads
export const THROTTLE_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6h cooldown after a 368

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Returns the cooldown expiry timestamp, or 0 when Facebook is not throttled. */
export function fbThrottleUntil() {
  try {
    if (!fs.existsSync(THROTTLE_FILE)) return 0;
    const until = Number(fs.readFileSync(THROTTLE_FILE, "utf8"));
    return Number.isFinite(until) && until > Date.now() ? until : 0;
  } catch {
    return 0;
  }
}

export function markFbThrottled() {
  fs.writeFileSync(THROTTLE_FILE, String(Date.now() + THROTTLE_COOLDOWN_MS));
}

export function clearFbThrottle() {
  try {
    fs.unlinkSync(THROTTLE_FILE);
  } catch { /* not present */ }
}

export function isThrottleError(err) {
  return /"code":\s*368/.test(String((err && err.message) || err || ""));
}
