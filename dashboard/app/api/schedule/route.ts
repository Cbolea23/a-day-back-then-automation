export const runtime = 'edge';
import { NextResponse } from "next/server";
import { kwentongPinoySchedule, aDayBackThenSchedule } from "@/lib/schedule-data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channel = (url.searchParams.get("channel") || "kwentong-pinoy").toLowerCase();

  let items: any[] = [];
  let channelName = "Kwentong Pinoy: Lore & History";
  let channelHandle = "@kwentongpinoylore";
  let platformSplit = {
    youtube: "Antigravity (Active)",
    facebook: "Antigravity (Active)",
    instagram: "Muse (Catch-up / Active)",
    tiktok: "Dormant (App approval pending)"
  };

  if (channel === "adaybackthen" || channel === "a-day-back-then") {
    items = aDayBackThenSchedule;
    channelName = "A Day Back Then";
    channelHandle = "@ADayBackThenOfficial";
  } else if (channel === "genesis-to-glory" || channel === "bible-chronicles") {
    items = [];
    channelName = "Genesis to Glory";
    channelHandle = "@genesistogloryofficial";
  } else {
    items = kwentongPinoySchedule;
  }

  // Calculate buffer and run-out date
  let runOutDate: string | null = null;
  let remainingDays = 0;
  if (items.length > 0) {
    const lastItem = items[items.length - 1];
    runOutDate = lastItem.date;
    const now = new Date();
    const last = new Date(lastItem.date);
    remainingDays = Math.max(0, Math.ceil((last.getTime() - now.getTime()) / (1000 * 3600 * 24)));
  }

  const response = {
    channel,
    channelName,
    channelHandle,
    platformSplit,
    summary: {
      totalArmedItems: items.length,
      youtubeArmed: items.filter(i => i.youtube?.videoId).length,
      facebookArmed: items.filter(i => i.facebook?.videoId).length,
      runOutDate,
      daysOfBufferRemaining: remainingDays,
      status: remainingDays > 3 ? "HEALTHY" : remainingDays > 0 ? "REORDER_SOON" : "EXHAUSTED"
    },
    items
  };

  return NextResponse.json(response);
}
