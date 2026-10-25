import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
};

/**
 * Streams images and audio files from `<pipelineRoot>/public/...` safely to the Studio UI.
 */
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const rel = searchParams.get("path") || "";
  if (!rel || rel.includes("..")) {
    return NextResponse.json({error: "Invalid asset path"}, {status: 400});
  }

  const rootPublic = path.resolve(pipelineRoot(), "public");
  const target = path.resolve(rootPublic, rel.replace(/^\/+/, ""));
  if (!target.startsWith(rootPublic) || !fs.existsSync(target)) {
    return NextResponse.json({error: "Asset not found"}, {status: 404});
  }

  const ext = path.extname(target).toLowerCase();
  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const bytes = fs.readFileSync(target);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
