import {NextResponse} from "next/server";
import {runScript} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

/**
 * Generate voiceover via the real pipeline:
 * `node scripts/make-voice.mjs <slug> [--force]`.
 * Uses edge-tts (free) or Gemini TTS depending on VOICE_PROVIDER.
 */
export async function POST(req: Request) {
  const {slug, force} = (await req.json()) as {slug?: string; force?: boolean};
  if (isWebMode()) {
    return queueIntent("voice.generate", {slug: slug ?? null, force: Boolean(force)});
  }
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  const args = [slug];
  if (force) args.push("--force");
  const {code, stdout, stderr} = await runScript("make-voice.mjs", args);
  if (code !== 0) {
    return NextResponse.json(
      {error: "make-voice.mjs failed", stdout: stdout.slice(-2000), stderr: stderr.slice(-2000)},
      {status: 500},
    );
  }
  return NextResponse.json({ok: true, slug, log: stdout.slice(-2000)});
}
