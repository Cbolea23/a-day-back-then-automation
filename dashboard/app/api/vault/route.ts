import {NextResponse} from "next/server";
import {execFile} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

function probe(file: string): Promise<{duration: number; size: number}> {
  return new Promise((resolve) => {
    execFile(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration,size",
        "-of",
        "json",
        file,
      ],
      (err, stdout) => {
        if (err) return resolve({duration: 0, size: 0});
        try {
          const f = JSON.parse(stdout).format;
          resolve({
            duration: parseFloat(f.duration ?? "0"),
            size: parseInt(f.size ?? "0", 10),
          });
        } catch {
          resolve({duration: 0, size: 0});
        }
      },
    );
  });
}

/** Real vault: every rendered mp4 in out/, with duration/size/mtime. */
export async function GET() {
  const outDir = path.join(pipelineRoot(), "out");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".mp4"))
      .sort();
  } catch {
    return NextResponse.json({videos: [], error: "out/ not found"});
  }
  const videos = await Promise.all(
    files.map(async (f) => {
      const full = path.join(outDir, f);
      const stat = fs.statSync(full);
      const {duration, size} = await probe(full);
      const slug = f.replace(/\.mp4$/, "");
      const mm = Math.floor(duration / 60);
      const ss = Math.round(duration % 60)
        .toString()
        .padStart(2, "0");
      return {
        slug,
        title: slug.replace(/-/g, " "),
        duration: `${mm}:${ss}`,
        durationSec: Math.round(duration),
        sizeMB: Math.round((size / 1048576) * 10) / 10,
        dateAdded: stat.mtime.toISOString().slice(0, 10),
        type: duration > 120 ? "Long" : "Short",
      };
    }),
  );
  return NextResponse.json({videos});
}
