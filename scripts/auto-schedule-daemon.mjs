#!/usr/bin/env node
/**
 * Auto-Schedule & Live Dispatch Daemon
 *
 * Periodically monitors and dispatches:
 *   - scripts/instagram-live-dispatcher.mjs (Triggers scheduled Instagram Reels at exact go-time)
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCHEDULERS = [
  "scripts/instagram-live-dispatcher.mjs"
];

console.log("Starting Auto-Schedule & Live Dispatch Daemon (monitoring every 60 seconds)...");

async function loop() {
  while (true) {
    for (const script of SCHEDULERS) {
      try {
        spawnSync(
          process.execPath,
          [path.join("scripts", path.basename(script))],
          { cwd: root, stdio: "inherit" }
        );
      } catch (e) {
        console.error(`Error running ${script}:`, e.message);
      }
    }
    await new Promise((r) => setTimeout(r, 60000));
  }
}

loop().catch(console.error);
