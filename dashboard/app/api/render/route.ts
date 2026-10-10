import {NextResponse} from "next/server";
import {getJob, listJobs, startRenderJob} from "@/lib/pipeline";

/** List render jobs (newest first). */
export async function GET() {
  return NextResponse.json({jobs: listJobs().filter((j) => j.kind === "render")});
}

/** Start a real render: `node scripts/render.mjs <slug>`. Returns a job id to poll. */
export async function POST(req: Request) {
  const {slug} = (await req.json()) as {slug?: string};
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  const running = listJobs().find(
    (j) => j.kind === "render" && j.slug === slug && (j.status === "running" || j.status === "queued"),
  );
  if (running) {
    return NextResponse.json({job: running, deduped: true});
  }
  const job = startRenderJob(slug);
  return NextResponse.json({job});
}
