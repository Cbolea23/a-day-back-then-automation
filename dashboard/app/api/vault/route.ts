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
        if (err) {
          try {
            const stat = fs.statSync(file);
            return resolve({duration: 60, size: stat.size});
          } catch {
            return resolve({duration: 0, size: 0});
          }
        }
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

function findMp4Files(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMp4Files(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp4")) {
      results.push(full);
    }
  }
  return results;
}

export async function GET() {
  const root = pipelineRoot();
  const outDir = path.join(root, "out");

  // Collect mp4s from out/ recursively
  const outFiles = findMp4Files(outDir);

  // Also collect root sample*.mp4 files
  const rootFiles: string[] = [];
  try {
    const rf = fs
      .readdirSync(root)
      .filter((f) => f.startsWith("sample-") && f.endsWith(".mp4"))
      .map((f) => path.join(root, f));
    rootFiles.push(...rf);
  } catch {}

  const allFiles = [...rootFiles, ...outFiles];

  const videos = await Promise.all(
    allFiles.map(async (fullPath) => {
      const rel = path.relative(root, fullPath).replace(/\\/g, "/");
      const stat = fs.statSync(fullPath);
      const {duration, size} = await probe(fullPath);
      const filename = path.basename(fullPath);
      const slug = filename.replace(/\.mp4$/i, "");
      const mm = Math.floor(duration / 60);
      const ss = Math.round(duration % 60)
        .toString()
        .padStart(2, "0");

      let type = "Short";
      let aspectRatio = "9:16";

      if (slug.includes("dialogue") || slug.includes("sample-gladiator")) {
        type = "Dialogue Test";
        aspectRatio = duration > 10 ? "16:9" : "9:16";
      } else if (rel.toLowerCase().includes("longform") || slug.startsWith("long-") || duration > 180) {
        type = "Longform";
        aspectRatio = "16:9";
      } else if (rel.includes("1 - Published")) {
        type = "Published Short";
      } else if (rel.includes("2 - Unpublished Vault")) {
        type = "Vault Short";
      }

      return {
        slug,
        title: slug.replace(/^(long-|sample-)/, "").replace(/-/g, " "),
        duration: `${mm}:${ss}`,
        durationSec: Math.round(duration),
        sizeMB: Math.round((size / 1048576) * 10) / 10,
        dateAdded: stat.mtime.toISOString().slice(0, 10),
        type,
        aspectRatio,
        relPath: rel,
      };
    }),
  );

  // Sort newest first
  videos.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

  return NextResponse.json({videos});
}
