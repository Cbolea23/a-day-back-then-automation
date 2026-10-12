#!/usr/bin/env node
/**
 * Auto-Schedule Daemon
 *
 * Periodically runs the batch schedulers every 90 seconds to automatically
 * pick up and schedule newly rendered vault videos to Facebook Reels and
 * YouTube Shorts:
 *   - scripts/schedule-all.mjs        (35 foundational shorts, one-shot but
 *                                      idempotent: skips already-scheduled)
 *   - scripts/schedule-expansion.mjs  (92 expansion shorts)
 * Both scripts skip videos already scheduled/published and videos not yet
 * rendered, so re-running is safe.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCHEDULERS = ["scripts/schedule-all.mjs", "scripts/schedule-expansion.mjs"];

console.log("Starting Auto-Schedule Daemon (monitoring every 90 seconds)...");

async function loop() {
  while (true) {
    console.log(`\n[${new Date().toLocaleTimeString()}] Checking vault for newly rendered videos to schedule...`);
    for (const script of SCHEDULERS) {
      spawnSync(
        process.execPath,
        [path.join("scripts", path.basename(script))],
        { cwd: root, stdio: "inherit" }
      );
    }
    await new Promise((r) => setTimeout(r, 90000));
  }
}

loop().catch(console.error);
