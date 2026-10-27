export const runtime = 'edge';
import {NextResponse} from "next/server";
import {execFile} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {getGeminiKey, pipelineRoot} from "@/lib/pipeline";
import {deployMode, isWebMode} from "@/lib/mode";
import {getHeartbeat, HEARTBEAT_URL} from "@/lib/heartbeat";

// Status must always be computed per-request (live probes locally, live
// heartbeat on the web) — never prerendered.
export const dynamic = "force-dynamic";

function exists(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(process.platform === "win32" ? "where" : "which", [cmd], (err) =>
      resolve(!err),
    );
  });
}

/** Honest pipeline health: what the dashboard can actually do on this machine. */
export async function GET() {
  const heartbeat = await getHeartbeat();
  if (isWebMode()) {
    // On the web there is no local machine to probe — the heartbeat feed
    // published by the pipeline box is the source of truth.
    return NextResponse.json({
      mode: deployMode(),
      heartbeat,
      heartbeatSource: HEARTBEAT_URL,
    });
  }
  const root = pipelineRoot();
  const [node, ffmpeg, remotion] = await Promise.all([
    exists("node"),
    exists("ffmpeg"),
    (async () => {
      try {
        await fs.promises.access(path.join(root, "node_modules", "remotion"));
        return true;
      } catch {
        return false;
      }
    })(),
  ]);
  const scriptsOut = fs.existsSync(path.join(root, "scripts-out"));
  return NextResponse.json({
    mode: deployMode(),
    heartbeat,
    heartbeatSource: HEARTBEAT_URL,
    pipelineRoot: root,
    node,
    ffmpeg,
    remotionInstalled: remotion,
    scriptsOut,
    geminiKey: Boolean(getGeminiKey()),
    // Upload auth presence (best-effort file checks; scripts verify for real)
    youtubeAuth: fs.existsSync(path.join(root, "youtube-tokens.json")),
    facebookAuth: fs.existsSync(path.join(root, "facebook-tokens.json")),
    tiktokSession: fs.existsSync(path.join(root, ".tiktok-session")),
  });
}
