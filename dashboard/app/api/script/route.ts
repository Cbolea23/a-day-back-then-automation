export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getGeminiKey, getStoredKeys, pipelineRoot, runScript} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

/**
 * Generate a script via the real pipeline:
 * `node scripts/make-script.mjs --only <slug>`.
 * Uses the FreeLLMAPI + Multi-Provider Pool (or GEMINI_API_KEY).
 */
export async function POST(req: Request) {
  const {slug, force} = (await req.json()) as {slug?: string; force?: boolean};
  if (isWebMode()) {
    return queueIntent("script.generate", {slug: slug ?? null, force: Boolean(force)});
  }
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  const stored = getStoredKeys();
  const geminiKey = getGeminiKey();

  const args = ["--only", slug];
  if (force) args.push("--force");
  const {code, stdout, stderr} = await runScript("make-script.mjs", args, {
    env: {
      ...stored,
      ...(geminiKey ? {GEMINI_API_KEY: geminiKey} : {}),
    },
  });
  if (code !== 0) {
    return NextResponse.json(
      {error: "make-script.mjs failed", stdout: stdout.slice(-2000), stderr: stderr.slice(-2000)},
      {status: 500},
    );
  }
  let scriptText = "";
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const raw = JSON.parse(
      fs.readFileSync(path.join(pipelineRoot(), "scripts-out", `${slug}.json`), "utf8"),
    );
    scriptText = (raw.scenes ?? [])
      .map((s: {text: string}, i: number) => `[Scene ${i + 1}]\n${s.text}`)
      .join("\n\n");
  } catch {
    /* display is best-effort */
  }
  return NextResponse.json({ok: true, slug, scriptText, log: stdout.slice(-2000)});
}
