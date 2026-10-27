export const runtime = 'edge';
import {NextResponse} from "next/server";
import {listJobs, startRenderJob, startLongRenderJob, startProcessImagesJob} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

/** List all render/pipeline jobs (newest first). */
export async function GET() {
  const jobs = listJobs().filter((j) =>
    ["render", "render-long", "process-images", "npc-test"].includes(j.kind),
  );
  return NextResponse.json({jobs});
}

/** Start a render or processing job. */
export async function POST(req: Request) {
  const {slug, kind} = (await req.json().catch(() => ({}))) as {
    slug?: string;
    kind?: "short" | "long" | "images" | "npc-test";
  };

  if (isWebMode()) {
    return queueIntent("render.start", {slug: slug ?? null, kind: kind ?? "short"});
  }

  if (!slug && kind !== "images") {
    return NextResponse.json({error: "slug is required"}, {status: 400});
  }

  const targetSlug = slug || "all-ready";
  const running = listJobs().find(
    (j) =>
      j.slug === targetSlug &&
      (j.status === "running" || j.status === "queued"),
  );
  if (running) {
    return NextResponse.json({job: running, deduped: true});
  }

  let job;
  if (kind === "long") {
    job = startLongRenderJob(targetSlug);
  } else if (kind === "images") {
    job = startProcessImagesJob(slug);
  } else {
    job = startRenderJob(targetSlug);
  }

  return NextResponse.json({job});
}
