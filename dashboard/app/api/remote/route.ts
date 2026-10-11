import {NextResponse} from "next/server";
import {getTunnelInfo, startTunnel, stopTunnel} from "@/lib/pipeline";

export async function GET() {
  const info = getTunnelInfo();
  return NextResponse.json(info);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {action?: "start" | "stop"};
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
