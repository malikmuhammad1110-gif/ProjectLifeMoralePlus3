// app/api/score/route.ts
import { NextRequest, NextResponse } from "next/server";
import { scoreLMI } from "../../../lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { answers, timeMap, ELI, config? }
    const result = scoreLMI(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}

// (Optional) quick health check
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/score" });
}
