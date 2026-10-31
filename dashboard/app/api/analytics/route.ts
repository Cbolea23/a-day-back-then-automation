export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getAnalytics} from "@/lib/analytics";
import {deployMode} from "@/lib/mode";

/**
 * Multi-channel analytics route.
 * Pass ?channel=kwentong-pinoy (default), adaybackthen, or genesis-to-glory.
 * Pass ?refresh=1 to bypass memory cache.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const channel = url.searchParams.get("channel") || "kwentong-pinoy";
  const refresh = url.searchParams.get("refresh") === "1";
  const analytics = await getAnalytics(channel, refresh);
  return NextResponse.json({mode: deployMode(), ...analytics});
}
