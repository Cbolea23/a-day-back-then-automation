#!/usr/bin/env node
/**
 * Auto-Schedule Daemon
 * 
 * Periodically runs `scripts/schedule-expansion.mjs` every 90 seconds
 * to automatically pick up and schedule newly rendered vault videos to
 * Facebook Reels and YouTube Shorts.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("Starting Auto-Schedule Daemon (monitoring every 90 seconds)...");

async function loop() {
  while (true) {
    console.log(`\n[${new Date().toLocaleTimeString()}] Checking vault for newly rendered videos to schedule...`);
    spawnSync(
      process.execPath,
      [path.join("scripts", "schedule-expansion.mjs")],
      { cwd: root, stdio: "inherit" }
    );
    await new Promise((r) => setTimeout(r, 90000));
  }
}

loop().catch(console.error);
