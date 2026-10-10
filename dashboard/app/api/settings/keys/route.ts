import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";

function dataDir(): string {
  return process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
}

function keysFile(): string {
  return path.join(dataDir(), "keys.json");
}

function readStored(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(keysFile(), "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

/** Key status only — values are never sent to the browser. */
export async function GET() {
  const stored = readStored();
  return NextResponse.json({
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY || stored.GEMINI_API_KEY),
    geminiKeySource: process.env.GEMINI_API_KEY
      ? "env"
      : stored.GEMINI_API_KEY
        ? "stored"
        : null,
  });
}

/** Save keys server-side (file mode 600, gitignored, never committed). */
export async function POST(req: Request) {
  const body = (await req.json()) as {geminiKey?: string};
  const dir = dataDir();
  fs.mkdirSync(dir, {recursive: true});
  const stored = readStored();
  if (typeof body.geminiKey === "string") {
    if (body.geminiKey.trim()) {
      stored.GEMINI_API_KEY = body.geminiKey.trim();
    } else {
      delete stored.GEMINI_API_KEY;
    }
  }
  fs.writeFileSync(keysFile(), JSON.stringify(stored), {mode: 0o600});
  try {
    fs.chmodSync(keysFile(), 0o600);
  } catch {
    /* best-effort */
  }
  return NextResponse.json({
    ok: true,
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY || stored.GEMINI_API_KEY),
  });
}

/** Clear the stored (non-env) keys. */
export async function DELETE() {
  const stored = readStored();
  delete stored.GEMINI_API_KEY;
  fs.mkdirSync(dataDir(), {recursive: true});
  fs.writeFileSync(keysFile(), JSON.stringify(stored), {mode: 0o600});
  return NextResponse.json({ok: true, geminiKeySet: Boolean(process.env.GEMINI_API_KEY)});
}
