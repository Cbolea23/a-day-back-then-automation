export const runtime = 'edge';
import {NextResponse} from "next/server";
import {getJob} from "@/lib/pipeline";

/** Poll a single job's live status/progress/log. */
export async function GET(
  _req: Request,
  {params}: {params: {id: string}},
) {
  const job = getJob(params.id);
  if (!job) return NextResponse.json({error: "job not found"}, {status: 404});
  return NextResponse.json({job});
}
