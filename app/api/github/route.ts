import { NextResponse } from "next/server";
import { getGithubStats } from "@/lib/server/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getGithubStats();
  if (!stats) {
    return NextResponse.json(
      { error: "GitHub stats are unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(stats);
}
