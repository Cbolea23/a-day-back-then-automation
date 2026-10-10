import {NextResponse} from "next/server";
import {getGeminiKey, runScript} from "@/lib/pipeline";

/**
 * Generate a script via the real pipeline:
 * `node scripts/make-script.mjs --only <slug>`.
 * Uses GEMINI_API_KEY from the server env, or the key saved via settings.
 */
export async function POST(req: Request) {
  const {slug, force} = (await req.json()) as {slug?: string; force?: boolean};
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  const geminiKey = getGeminiKey();
  if (!geminiKey) {
    return NextResponse.json(
      {error: "No Gemini API key. Add one in Settings → API Keys, or set GEMINI_API_KEY on the server."},
      {status: 428},
    );
  }
  const args = ["--only", slug];
  if (force) args.push("--force");
  const {code, stdout, stderr} = await runScript("make-script.mjs", args, {
    env: {GEMINI_API_KEY: geminiKey},
  });
  if (code !== 0) {
    return NextResponse.json(
      {error: "make-script.mjs failed", stdout: stdout.slice(-2000), stderr: stderr.slice(-2000)},
      {status: 500},
    );
  }
  // Return the generated script text for display.
  let scriptText = "";
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const {pipelineRoot} = await import("@/lib/pipeline");
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
