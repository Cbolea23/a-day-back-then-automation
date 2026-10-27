export const runtime = 'edge';
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

function findVideoFile(slug: string): string | null {
  const root = pipelineRoot();
  const searchCandidates = [
    path.join(root, `${slug}.mp4`),
    path.join(root, "out", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "out", "Longform", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", "Longform", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "long-out", `${slug}.mp4`),
    path.join(root, `sample-${slug}.mp4`),
  ];

  for (const c of searchCandidates) {
    if (fs.existsSync(c)) return c;
  }

  // Recursive search in out/ if not in standard candidate list
  const searchDir = (dir: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const found = searchDir(full);
        if (found) return found;
      } else if (e.isFile() && e.name.toLowerCase() === `${slug.toLowerCase()}.mp4`) {
        return full;
      }
    }
    return null;
  };

  return searchDir(path.join(root, "out"));
}

/** Stream video with HTTP Range support for seamless seeking and phone streaming */
export async function GET(
  req: Request,
  {params}: {params: {slug: string}},
) {
  const decodedSlug = decodeURIComponent(params.slug);
  if (isWebMode()) {
    return queueIntent("video.stream", {slug: decodedSlug});
  }
  const file = findVideoFile(decodedSlug);

  if (!file || !fs.existsSync(file)) {
    return new Response("Video file not found", {status: 404});
  }

  const stat = fs.statSync(file);
  const range = req.headers.get("range");

  if (range) {
    const m = range.match(/bytes=(\d+)-(\d*)/);
    const start = m ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
    const stream = fs.createReadStream(file, {start, end});
    return new Response(stream as unknown as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
      },
    });
  }

  const stream = fs.createReadStream(file);
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
    },
  });
}
