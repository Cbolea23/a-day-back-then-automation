import {NextResponse} from "next/server";
import {listIntents} from "@/lib/intents";
import {deployMode} from "@/lib/mode";

/**
 * Read-only view of the intents outbox (see lib/intents.ts).
 * In web mode this is how the bridge / machine side discovers queued work;
 * in local mode it simply shows anything recorded during web-mode tests.
 */
export async function GET(req: Request) {
  const limitParam = Number(new URL(req.url).searchParams.get("limit") ?? 50);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;
  const intents = listIntents(limit);
  return NextResponse.json({mode: deployMode(), count: intents.length, intents});
}
