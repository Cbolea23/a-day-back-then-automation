export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getJob, startPublishJob} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

const PLATFORMS = ["youtube", "facebook", "tiktok", "instagram"] as const;
type Platform = (typeof PLATFORMS)[number];

/**
 * Publish via the real upload scripts (upload-youtube.mjs etc.).
 * Each platform needs its own auth (tokens / Playwright session) —
 * the scripts report a clear error when auth is missing.
 */
export async function POST(req: Request) {
  const {slug, platforms} = (await req.json()) as {
    slug?: string;
    platforms?: Platform[];
  };
  if (isWebMode()) {
    return queueIntent("publish.start", {slug: slug ?? null, platforms: platforms ?? []});
  }
  if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
  const wanted = (platforms ?? []).filter((p): p is Platform =>
    (PLATFORMS as readonly string[]).includes(p),
  );
  if (!wanted.length) {
    return NextResponse.json({error: "no valid platforms selected"}, {status: 400});
  }
  const jobs = wanted.map((p) => startPublishJob(slug, p));
  return NextResponse.json({jobs: jobs.map((j) => ({id: j.id, platform: wanted[jobs.indexOf(j)]}))});
}

/** Poll a publish job. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({error: "id required"}, {status: 400});
  const job = getJob(id);
  if (!job) return NextResponse.json({error: "job not found"}, {status: 404});
  return NextResponse.json({job});
}
