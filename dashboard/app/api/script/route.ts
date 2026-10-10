import {NextResponse} from "next/server";
import {runScript} from "@/lib/pipeline";

/**
 * Generate a script via the real pipeline:
 * `node scripts/make-script.mjs --only <slug>`.
 * Needs GEMINI_API_KEY in the dashboard server's environment.
 */
export async function POST(req: Request) {
  const {slug, force} = (await req.json()) as {slug?: string; force?: boolean};
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {error: "GEMINI_API_KEY is not set in the dashboard server environment"},
      {status: 428},
    );
  }
  const args = ["--only", slug];
  if (force) args.push("--force");
  const {code, stdout, stderr} = await runScript("make-script.mjs", args);
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
