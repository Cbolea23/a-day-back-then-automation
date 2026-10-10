import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

/** Stream a rendered mp4 from out/ (with range support for seeking). */
export async function GET(
  req: Request,
  {params}: {params: {slug: string}},
) {
  const file = path.join(pipelineRoot(), "out", `${params.slug}.mp4`);
  if (!params.slug || params.slug.includes("..") || !fs.existsSync(file)) {
    return new Response("not found", {status: 404});
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
