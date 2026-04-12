import { NextRequest, NextResponse } from "next/server";
import { recordVisit, getVisitorLogs } from "@/lib/visitor-log";

// GET /api/visit?date=YYYY-MM-DD — retrieve visitor logs for a given date (defaults to today)
export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date"); // e.g. "2026-04-12"
  const date = dateParam ? new Date(dateParam + "T00:00:00Z") : new Date();
  const logs = await getVisitorLogs(date);
  return NextResponse.json({ date: dateParam ?? "today", total: logs.length, logs });
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
