export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getAnalytics} from "@/lib/analytics";
import {deployMode} from "@/lib/mode";

/**
 * Real channel analytics (see lib/analytics.ts).
 * Configured purely via ENV: YT_TOKENS_JSON for YouTube, META_PAGE_TOKEN
 * (+ optional META_PAGE_ID / META_IG_USER_ID) for Meta. When nothing is
 * configured this returns a clean {configured: {youtube: false, meta: false}}
 * state — never an error page. Results are cached in memory for 10 minutes;
 * pass ?refresh=1 to bypass the cache.
 */
export async function GET(req: Request) {
  const refresh = new URL(req.url).searchParams.get("refresh") === "1";
  const analytics = await getAnalytics(refresh);
  return NextResponse.json({mode: deployMode(), ...analytics});
}
