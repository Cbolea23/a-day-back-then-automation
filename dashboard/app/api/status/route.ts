import {NextResponse} from "next/server";
import {execFile} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

function exists(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(process.platform === "win32" ? "where" : "which", [cmd], (err) =>
      resolve(!err),
    );
  });
}

/** Honest pipeline health: what the dashboard can actually do on this machine. */
export async function GET() {
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
    pipelineRoot: root,
    node,
    ffmpeg,
    remotionInstalled: remotion,
    scriptsOut,
    geminiKey: Boolean(process.env.GEMINI_API_KEY),
    // Upload auth presence (best-effort file checks; scripts verify for real)
    youtubeAuth: fs.existsSync(path.join(root, "youtube-tokens.json")),
    facebookAuth: fs.existsSync(path.join(root, "facebook-tokens.json")),
    tiktokSession: fs.existsSync(path.join(root, ".tiktok-session")),
  });
}
