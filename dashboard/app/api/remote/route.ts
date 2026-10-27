export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getTunnelInfo, startTunnel, stopTunnel} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

export async function GET() {
  if (isWebMode()) {
    return queueIntent("remote.status", {});
  }
  const info = getTunnelInfo();
  return NextResponse.json(info);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {action?: "start" | "stop"};
  if (isWebMode()) {
    return queueIntent("remote.tunnel", {action: body.action ?? "start"});
  }
  if (body.action === "stop") {
    stopTunnel();
    return NextResponse.json(getTunnelInfo());
  }

  // start or refresh tunnel
  const res = await startTunnel();
  return NextResponse.json({
    ...getTunnelInfo(),
    startupResult: res,
  });
}
