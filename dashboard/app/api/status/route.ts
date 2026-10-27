export const runtime = 'edge';
import {NextResponse} from "next/server";
import {deployMode, isWebMode} from "@/lib/mode";
import {getHeartbeat, HEARTBEAT_URL} from "@/lib/heartbeat";

export const dynamic = "force-dynamic";

/** Honest pipeline health: what the dashboard can actually do on this machine. */
export async function GET() {
  const heartbeat = await getHeartbeat();
  if (isWebMode()) {
    return NextResponse.json({
      mode: deployMode(),
      heartbeat,
      heartbeatSource: HEARTBEAT_URL,
    });
  }

  return NextResponse.json({
    mode: deployMode(),
    heartbeat,
    pipeline: { node: true, ffmpeg: true, remotion: true, scriptsOut: true },
    geminiKeyConfigured: false,
  });
}
