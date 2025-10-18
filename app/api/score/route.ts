import { NextResponse } from "next/server";

/**
 * Simple, robust scorer:
 * - rawLMS: average of 24 answers (1–10)
 * - time effect: sum(hours * ((ri-5)/5)) / 168 * ri.globalMultiplier
 * - cross-lift (optional): (avgTop5 - avgBottom5) * 0.1
 * - ELI: tailwind/drag factor (center=5), multiplier ~ ±10% at extremes
 * - final clamped to calibration.max (default 8.75)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const answers: Array<{ score?: number }> = Array.isArray(body.answers) ? body.answers : [];
    const timeMap: Array<{ category: string; hours: number; ri: number }> =
      Array.isArray(body.timeMap) ? body.timeMap : [];

    const cfg = body?.config || {};
    const cal = cfg?.calibration || { k: 1.936428228, max: 8.75 };
    const riCfg = cfg?.ri || { globalMultiplier: 1 };
    const cross = cfg?.crossLift || { enabled: true, alpha: 20 };
    const eliCfg = cfg?.eliModel || { center: 5, min: 1, max: 10, allowPositive: true };

    const ELI: number = typeof body?.ELI === "number" ? body.ELI : 5;

    // --- rawLMS ---
    const scores = answers
      .map((a) => (typeof a?.score === "number" ? a.score : null))
      .filter((x): x is number => typeof x === "number" && isFinite(x));
    const rawLMS = scores.length ? scores.reduce((s, n) => s + n, 0) / scores.length : 0;

    // --- RI time effect ---
    const totalHours = timeMap.reduce((s, r) => s + (Number(r.hours) || 0), 0);
    const safeHours = totalHours > 0 ? totalHours : 168;
    const riEffect =
      timeMap.reduce((s, r) => {
        const hrs = Math.max(0, Number(r.hours) || 0);
        const ri = Math.max(1, Math.min(10, Number(r.ri) || 5));
        // normalize RI around 5 in [-1..+1]
        const norm = (ri - 5) / 5;
        return s + hrs * norm;
      }, 0) /
      safeHours *
      (Number(riCfg.globalMultiplier) || 1); // small additive effect

    // --- Cross-lift: high areas buoy low areas slightly ---
    let crossLift = 0;
    if (cross?.enabled && scores.length >= 10) {
      const sorted = [...scores].sort((a, b) => a - b);
      const k = 5; // top/bottom 5
      const lowAvg = sorted.slice(0, k).reduce((s, n) => s + n, 0) / k;
      const highAvg = sorted.slice(-k).reduce((s, n) => s + n, 0) / k;
      crossLift = (highAvg - lowAvg) * 0.1; // gentle lift
    }

    // --- ELI tailwind/drag multiplier (~±10% at extremes) ---
    const eliCenter = Number(eliCfg.center) || 5;
    const eliSpan = Math.max(1, (Number(eliCfg.max) || 10) - (Number(eliCfg.min) || 1));
    const eliNorm = (ELI - eliCenter) / eliSpan; // ~[-0.44..+0.44]
    const eliMult = 1 + eliNorm * 0.25; // cap ~±11%

    // --- Combine ---
    // Start from raw, add RI and cross-lift, then apply ELI multiplier,
    // then calibrate to realistic ceiling max (0..cal.max).
    let combined = rawLMS + riEffect + crossLift;
    combined = combined * eliMult;

    // Scale 0..10 space into 0..cal.max
    const MAX = Math.max(6, Math.min(10, Number(cal.max) || 8.75));
    const finalLMI = Math.max(0, Math.min(MAX, combined));

    // Find top drainers/uplifters by question index
    const indexed = answers
      .map((a, i) => ({ index: i, score: typeof a?.score === "number" ? a.score : 0 }))
      .filter((x) => isFinite(x.score));
    const topDrainers = [...indexed].sort((a, b) => a.score - b.score).slice(0, 3);
    const topUplifters = [...indexed].sort((a, b) => b.score - a.score).slice(0, 3);

    return NextResponse.json({
      finalLMI,
      rawLMS,
      riAdjusted: rawLMS + riEffect,
      topDrainers,
      topUplifters,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Bad request" }, { status: 400 });
  }
}
