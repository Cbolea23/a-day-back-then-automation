import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

export type TopicItem = {
  slug: string;
  title: string;
  format?: string;
  angle?: string;
  category: "original-short" | "expansion-short" | "longform";
  targetMinutes?: number;
  imagesReady: number;
  imagesTarget: number;
  imageStatus: "complete" | "partial" | "waiting";
  hasPrompt: boolean;
  hasScript: boolean;
  hasVoice: boolean;
  hasVideo: boolean;
};

function countImages(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  try {
    return fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f)).length;
  } catch {
    return 0;
  }
}

export async function GET() {
  const root = pipelineRoot();
  const allTopics: TopicItem[] = [];

  // 1. Original shorts
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(root, "newtopics.json"), "utf8"));
    const list = Array.isArray(raw) ? raw : raw.topics ?? [];
    for (const t of list) {
      const slug = t.slug;
      const imgDir = path.join(root, "public", "images", slug);
      const ready = countImages(imgDir);
      const target = 6;
      const hasPrompt =
        fs.existsSync(path.join(root, "scripts-out", `${slug}.prompts.txt`)) ||
        fs.existsSync(path.join(root, "image-prompts", `${slug}.txt`));
      const hasScript = fs.existsSync(path.join(root, "scripts-out", `${slug}.json`));
      const hasVoice = fs.existsSync(path.join(root, "public", "audio", slug));
      const hasVideo =
        fs.existsSync(path.join(root, "out", `${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "1 - Published", `${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`));

      allTopics.push({
        slug,
        title: t.title,
        format: t.format ?? "gross-facts",
        angle: t.angle,
        category: "original-short",
        imagesReady: ready,
        imagesTarget: target,
        imageStatus: ready >= target ? "complete" : ready > 0 ? "partial" : "waiting",
        hasPrompt,
        hasScript,
        hasVoice,
        hasVideo,
      });
    }
  } catch {}

  // 2. Expansion shorts (92 topics from scripts/expansion-topics.json)
  try {
    let expPath = path.join(root, "scripts", "expansion-topics.json");
    if (!fs.existsSync(expPath)) expPath = path.join(root, "topics-expansion.json");
    if (fs.existsSync(expPath)) {
      const raw = JSON.parse(fs.readFileSync(expPath, "utf8"));
      let list: any[] = [];
      if (raw.civilizations && Array.isArray(raw.civilizations)) {
        list = raw.civilizations.flatMap((c: any) => c.newTopics ?? []);
      } else if (Array.isArray(raw)) {
        list = raw;
      } else if (raw.topics) {
        list = raw.topics;
      }
      for (const t of list) {
        const slug = t.slug;
        if (!slug || allTopics.some((x) => x.slug === slug)) continue;

      const imgDir = path.join(root, "public", "images", slug);
      const ready = countImages(imgDir);
      const target = 6;
      const hasPrompt =
        fs.existsSync(path.join(root, "scripts-out", `${slug}.prompts.txt`)) ||
        fs.existsSync(path.join(root, "image-prompts", `${slug}.txt`)) ||
        Boolean(t.scenes?.some((s: any) => s.imagePrompt));
      const hasScript = fs.existsSync(path.join(root, "scripts-out", `${slug}.json`));
      const hasVoice = fs.existsSync(path.join(root, "public", "audio", slug));
      const hasVideo =
        fs.existsSync(path.join(root, "out", `${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "1 - Published", `${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`));

      allTopics.push({
        slug,
        title: t.title,
        format: t.format ?? "expansion-facts",
        angle: t.angle,
        category: "expansion-short",
        imagesReady: ready,
        imagesTarget: target,
        imageStatus: ready >= target ? "complete" : ready > 0 ? "partial" : "waiting",
        hasPrompt,
        hasScript,
        hasVoice,
        hasVideo,
      });
    }
  }
} catch {}

  // 3. Longform topics
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(root, "topics-long.json"), "utf8"));
    const list = Array.isArray(raw) ? raw : raw.topics ?? [];
    for (const t of list) {
      const slug = t.slug;
      const imgDir = path.join(root, "public", "images", "long", slug);
      const ready = countImages(imgDir);
      const target = Math.max(10, (t.targetMinutes || 10) * 2);
      const hasPrompt = true;
      const hasScript = fs.existsSync(path.join(root, "long-out", `${slug}.json`));
      const hasVoice = fs.existsSync(path.join(root, "public", "audio", "long", slug));
      const hasVideo =
        fs.existsSync(path.join(root, "out", `long-${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "Longform", "1 - Published", `long-${slug}.mp4`)) ||
        fs.existsSync(path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${slug}.mp4`));

      allTopics.push({
        slug,
        title: t.title,
        format: t.format ?? "longform-documentary",
        angle: t.angle,
        category: "longform",
        targetMinutes: t.targetMinutes ?? 10,
        imagesReady: ready,
        imagesTarget: target,
        imageStatus: ready >= target ? "complete" : ready > 0 ? "partial" : "waiting",
        hasPrompt,
        hasScript,
        hasVoice,
        hasVideo,
      });
    }
  } catch {}

  const stats = {
    total: allTopics.length,
    shorts: allTopics.filter((t) => t.category !== "longform").length,
    longform: allTopics.filter((t) => t.category === "longform").length,
    imagesComplete: allTopics.filter((t) => t.imageStatus === "complete").length,
    imagesPartial: allTopics.filter((t) => t.imageStatus === "partial").length,
    imagesWaiting: allTopics.filter((t) => t.imageStatus === "waiting").length,
    videosRendered: allTopics.filter((t) => t.hasVideo).length,
  };

  return NextResponse.json({topics: allTopics, stats});
}

/** Append a new topic to newtopics.json */
export async function POST(req: Request) {
  const {title, format, angle} = (await req.json()) as {
    title?: string;
    format?: string;
    angle?: string;
  };
  if (!title?.trim()) {
    return NextResponse.json({error: "title is required"}, {status: 400});
  }
  const root = pipelineRoot();
  const p = path.join(root, "newtopics.json");
  const text = fs.readFileSync(p, "utf8");
  const raw = JSON.parse(text);
  const list = Array.isArray(raw) ? raw : raw.topics ?? [];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (list.some((t: any) => t.slug === slug)) {
    return NextResponse.json({error: "topic slug already exists", slug}, {status: 409});
  }
  const entry = {slug, title: title.trim(), format: format ?? "gross-facts", angle: angle ?? ""};
  list.unshift(entry);
  const full = Array.isArray(raw) ? list : {...raw, topics: list};
  fs.writeFileSync(p, JSON.stringify(full, null, 2) + "\n");
  return NextResponse.json({ok: true, slug});
}
