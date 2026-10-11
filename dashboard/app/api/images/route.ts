import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot, startProcessImagesJob} from "@/lib/pipeline";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({error: "slug parameter is required"}, {status: 400});
  }

  const root = pipelineRoot();

  // 1. Check images in public/images/<slug>/ or public/images/long/<slug>/
  let imgDir = path.join(root, "public", "images", slug);
  let isLong = false;
  if (!fs.existsSync(imgDir)) {
    const longDir = path.join(root, "public", "images", "long", slug);
    if (fs.existsSync(longDir)) {
      imgDir = longDir;
      isLong = true;
    }
  }

  const images: {name: string; url: string; sizeKB: number}[] = [];
  if (fs.existsSync(imgDir)) {
    try {
      const files = fs.readdirSync(imgDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
      for (const f of files) {
        const full = path.join(imgDir, f);
        const stat = fs.statSync(full);
        images.push({
          name: f,
          url: isLong ? `/images/long/${slug}/${f}` : `/images/${slug}/${f}`,
          sizeKB: Math.round(stat.size / 1024),
        });
      }
    } catch {}
  }

  // 2. Check prompt text
  let promptText = "";
  const promptsTxtPath = path.join(root, "scripts-out", `${slug}.prompts.txt`);
  if (fs.existsSync(promptsTxtPath)) {
    promptText = fs.readFileSync(promptsTxtPath, "utf8");
  } else {
    // Check all-expansion-prompts.json
    const allPromptsPath = path.join(root, "scripts-out", "all-expansion-prompts.json");
    if (fs.existsSync(allPromptsPath)) {
      try {
        const allPrompts = JSON.parse(fs.readFileSync(allPromptsPath, "utf8"));
        const match = allPrompts.find((p: any) => p.slug === slug);
        if (match && match.prompts) {
          promptText = match.prompts
            .map((p: any, i: number) => `${i + 1}. ${p.prompt}`)
            .join("\n\n");
        }
      } catch {}
    }
  }

  // If still empty and longform, check long-out/<slug>.json or topics-long.json
  if (!promptText) {
    const longScriptPath = path.join(root, "long-out", `${slug}.json`);
    if (fs.existsSync(longScriptPath)) {
      try {
        const script = JSON.parse(fs.readFileSync(longScriptPath, "utf8"));
        promptText = (script.scenes ?? [])
          .filter((s: any) => s.imagePrompt)
          .map((s: any, i: number) => `Scene ${i + 1} (${s.speaker || "Narrator"}): ${s.imagePrompt}`)
          .join("\n\n");
      } catch {}
    }
  }

  return NextResponse.json({
    slug,
    isLong,
    imagesCount: images.length,
    images,
    promptText,
  });
}

/** Trigger image processing & re-render */
export async function POST(req: Request) {
  const {slug} = (await req.json().catch(() => ({}))) as {slug?: string};
  const job = startProcessImagesJob(slug);
  return NextResponse.json({job});
}
