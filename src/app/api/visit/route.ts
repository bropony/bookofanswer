import { NextRequest, NextResponse } from "next/server";
import { recordVisit, getVisitorLogs } from "@/lib/visitor-log";

// GET /api/visit — retrieve recent visitor logs
export async function GET() {
  const logs = getVisitorLogs();
  return NextResponse.json({ total: logs.length, logs });
}

// POST /api/visit — record a new visit
export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  const ua = req.headers.get("user-agent") || "unknown";

  const entry = await recordVisit(ip, ua);
  return NextResponse.json({ ok: true, entry });
}
