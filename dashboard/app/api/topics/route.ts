import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";

const TOPICS_FILE = "newtopics.json";

type Topic = {slug: string; title: string; format?: string; angle?: string};

/** Real topics from newtopics.json. */
export async function GET() {
  const p = path.join(pipelineRoot(), TOPICS_FILE);
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const list: Topic[] = Array.isArray(raw) ? raw : raw.topics ?? [];
    return NextResponse.json({topics: list});
  } catch (e) {
    return NextResponse.json(
      {topics: [], error: `could not read ${TOPICS_FILE}`},
      {status: 500},
    );
  }
}

/** Append a topic to newtopics.json. */
export async function POST(req: Request) {
  const {title, format, angle} = (await req.json()) as {
    title?: string;
    format?: string;
    angle?: string;
  };
  if (!title?.trim()) {
    return NextResponse.json({error: "title is required"}, {status: 400});
  }
  const p = path.join(pipelineRoot(), TOPICS_FILE);
  const text = fs.readFileSync(p, "utf8");
  const raw = JSON.parse(text);
  const list: Topic[] = Array.isArray(raw) ? raw : raw.topics ?? [];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (list.some((t) => t.slug === slug)) {
    return NextResponse.json({error: "topic slug already exists", slug}, {status: 409});
  }
  const entry: Topic = {slug, title: title.trim(), format: format ?? "gross-facts", angle: angle ?? ""};
  // Preserve the file's existing style: one compact JSON object per line.
  const line = `    ${JSON.stringify(entry).replace(/":/g, '": ').replace(/","/g, '", "')},`;
  const out = text.replace(/"topics":\s*\[\s*\n/, (m) => `${m}${line}\n`);
  if (out === text) {
    // Fallback for unexpected shapes: full rewrite.
    list.unshift(entry);
    const full = Array.isArray(raw) ? list : {...raw, topics: list};
    fs.writeFileSync(p, JSON.stringify(full, null, 2) + "\n");
  } else {
    fs.writeFileSync(p, out);
  }
  return NextResponse.json({ok: true, slug});
}
