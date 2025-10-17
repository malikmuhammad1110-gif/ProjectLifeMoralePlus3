"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/** 24-question mapping → 5 dimensions */
type Dim = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";
const Q2DIM: Dim[] = [
  // 1–5 Fulfillment
  "Fulfillment","Fulfillment","Fulfillment","Fulfillment","Fulfillment",
  // 6–10 Connection
  "Connection","Connection","Connection","Connection","Connection",
  // 11–15 Autonomy
  "Autonomy","Autonomy","Autonomy","Autonomy","Autonomy",
  // 16–20 Vitality
  "Vitality","Vitality","Vitality","Vitality","Vitality",
  // 21–24 Peace
  "Peace","Peace","Peace","Peace",
];

const QUESTIONS = [
  "Life direction / sense of trajectory",
  "Alignment with personal values",
  "Sense of purpose / meaning",
  "Personal growth / learning",
  "Pride in overcoming challenges",
  "Emotional connection to close people",
  "Support from family / friends",
  "Romantic / intimate fulfillment",
  "Contribution / helping others",
  "Authentic self-expression",
  "Control over time / schedule",
  "Work meaning / responsibility quality",
  "Manageable workload / routine",
  "Freedom to choose / autonomy",
  "Financial security",
  "Physical health & energy",
  "Rest & sleep quality",
  "Nutrition & self-care",
  "Motivation to care for body",
  "Comfort / confidence in own skin",
  "Stress / anxiety management",
  "Emotional balance / calm",
  "Hopefulness about the future",
  "Inner peace / contentment",
];

/** Feedback templates per dimension */
const LOW_MSG: Record<Dim,string> = {
  Fulfillment:
    "You may be feeling low direction or meaning. Choose one small weekly goal aligned to your values—something personally meaningful, not just productive.",
  Connection:
    "Disconnection or tension can weigh heavily. Do one intentional reach-out this week—a call, coffee, or gratitude text—to rebuild warmth.",
  Autonomy:
    "If work/finances feel tight, reduce decision fatigue. Simplify routines, prep ahead, and protect one boundary to regain control.",
  Vitality:
    "Energy and rest might need care. Aim for a steady sleep window, short daily walks, and simple nourishing meals to lift your baseline.",
  Peace:
    "Stress can dim everything. Add a 3–5 minute reset ritual (deep breathing, journaling, or quiet pause) between tasks to settle your system.",
};

const HIGH_MSG: Record<Dim,string> = {
  Fulfillment:
    "Your sense of meaning is a major anchor. Keep one weekly practice that grows you—learning, creating, or serving—in the calendar.",
  Connection:
    "Strong bonds are fueling you. Keep showing appreciation and scheduling time together—consistency keeps this protective.",
  Autonomy:
    "Your self-direction is working. Maintain clear boundaries and simple systems so your freedom stays stable, not fragile.",
  Vitality:
    "Your energy habits are paying off. Protect sleep, hydration, sunlight, and light movement—they compound your morale.",
  Peace:
    "Your calm presence steadies everything else. Keep protecting quiet time and mental margins so this stays sustainable.",
};

/** Gauge band + color */
function band(score: number) {
  if (score >= 7.5) return { label: "High", color: "#16a34a" };          // green
  if (score >= 6.0) return { label: "Solid", color: "#0ea5e9" };         // blue
  if (score >= 4.5) return { label: "Needs attention", color: "#f59e0b" };// amber
  return { label: "Low", color: "#ef4444" };                              // red
}

/** Tally helper for dominant dimension from top-3 lists */
function dominantDim(items: {index:number}[] | undefined, fallback: Dim = "Peace"): Dim | null {
  if (!items?.length) return null;
  const counts: Record<Dim, number> = { Fulfillment:0, Connection:0, Autonomy:0, Vitality:0, Peace:0 };
  for (const it of items) {
    const d = Q2DIM[it.index];
    counts[d] = (counts[d] ?? 0) + 1;
  }
  // find max
  let best: Dim = fallback, bestN = -1;
  (Object.keys(counts) as Dim[]).forEach(d => {
    if (counts[d] > bestN) { bestN = counts[d]; best = d; }
  });
  return bestN > 0 ? best : null;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("LMI_RESULT") : null;
    setResult(raw ? JSON.parse(raw) : null);
  }, []);

  if (!result) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="muted">Take the survey to see your Life Morale.</p>
        <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
      </div>
    );
  }

  const final = result?.finalLMI as number | undefined;
  const raw   = result?.rawLMS as number | undefined;
  const riAdj = result?.riAdjusted as number | undefined;

  // Dominant categories from top-3s
  const lowDim  = useMemo(() => dominantDim(result.topDrainers, "Peace"), [result]);
  const highDim = useMemo(() => dominantDim(result.topUplifters, "Fulfillment"), [result]);

  // Gauge math (0 → 8.75)
  const MAX = 8.75;
  const pct = useMemo(() => {
    if (typeof final !== "number") return 0;
    const clamped = Math.max(0, Math.min(final, MAX));
    return Math.round((clamped / MAX) * 100);
  }, [final]);

  const b = useMemo(() => band(final ?? 0), [final]);

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Header KPIs */}
      <div className="card" style={{ background: "linear-gradient(135deg,#eaf2ff,#effdf9)" }}>
        <h1 style={{ marginTop: 0 }}>Your Life Morale</h1>
        <div className="kpi">
          <div className="pill"><b>Raw LMS:</b> {raw?.toFixed(2)}</div>
          <div className="pill"><b>RI-adjusted:</b> {riAdj?.toFixed(2)}</div>
          <div className="pill"><b>Final LMI:</b> {final?.toFixed(2)} / {MAX}</div>
          <div className="pill" style={{ color: b.color }}><b>Status:</b> {b.label}</div>
        </div>
        <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          With small changes here and there, this score can improve. Focus on one low area to lift, and keep fueling one high area you love.
        </p>
      </div>

      {/* Gauge */}
      <div className="card">
        <div className="label">Gauge</div>
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              height: 16,
              borderRadius: 999,
              border: "1px solid var(--border)",
              overflow: "hidden",
              background:
                "linear-gradient(90deg, #fee2e2 0%, #fde68a 33%, #bfdbfe 66%, #dcfce7 100%)",
              boxShadow: "inset 0 1px 3px rgba(15,23,42,.06)",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                transition: "width .35s ease",
                background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 35%, #3b82f6 70%, #16a34a 100%)",
              }}
            />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginTop:6 }}>
            <span>0</span><span>2.2</span><span>4.4</span><span>6.6</span><span>8.75</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <div className="pill" style={{ borderColor: "transparent", background: "#fff" }}>
              <b>Final LMI:</b> {final?.toFixed(2)} ({pct}% of max)
            </div>
            <div className="pill" style={{ color: b.color }}>{b.label}</div>
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Focus area (low)</div>
          {lowDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{lowDim}</h2>
              <p>{LOW_MSG[lowDim]}</p>
              {/* Contextual nudge based on common pain-points */}
              {lowDim === "Autonomy" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Commute heavy? Try leaving 10–15 mins earlier, podcasts/music you enjoy, or batching errands.</li>
                  <li>Workload tense? Time-box one hard task and finish one easy win early.</li>
                </ul>
              )}
              {lowDim === "Vitality" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Anchor sleep/wake within a 60-minute window.</li>
                  <li>10–20 minute walk or stretch most days; sip water each hour.</li>
                </ul>
              )}
              {lowDim === "Peace" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Micro-reset: 3 slow breaths before transitions.</li>
                  <li>Write down 1 concern → next smallest step.</li>
                </ul>
              )}
            </>
          ) : (
            <p className="muted">No clear low pattern detected.</p>
          )}
        </div>

        <div className="card">
          <div className="label">Keep fueling (high)</div>
          {highDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{highDim}</h2>
              <p>{HIGH_MSG[highDim]}</p>
              {highDim === "Connection" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Schedule a small weekly ritual with a favorite person.</li>
                  <li>Send one quick appreciation message today.</li>
                </ul>
              )}
              {highDim === "Vitality" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Protect your sleep and hydration streaks.</li>
                  <li>Keep movement simple and consistent.</li>
                </ul>
              )}
            </>
          ) : (
            <p className="muted">No clear high pattern detected.</p>
          )}
        </div>
      </div>

      {/* Top 3s (kept for transparency) */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Top Drainers</div>
          {result.topDrainers?.length ? (
            <ol>
              {result.topDrainers.map((d: any) => (
                <li key={d.index}>
                  Q{d.index + 1} ({Q2DIM[d.index]}): {QUESTIONS[d.index]} — <b>{d.score}</b>
                  {d.note ? <span> · <i>{d.note}</i></span> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No items yet.</p>
          )}
        </div>

        <div className="card">
          <div className="label">Top Uplifters</div>
          {result.topUplifters?.length ? (
            <ol>
              {result.topUplifters.map((d: any) => (
                <li key={d.index}>
                  Q{d.index + 1} ({Q2DIM[d.index]}): {QUESTIONS[d.index]} — <b>{d.score}</b>
                  {d.note ? <span> · <i>{d.note}</i></span> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No items yet.</p>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="card">
        <div className="label">Next steps</div>
        <ul style={{ margin: "8px 0" }}>
          <li>Pick <b>one</b> low area → make a tiny daily action.</li>
          <li>Protect <b>one</b> high area → schedule it.</li>
          <li>Consider light movement (walks, stretching) to support Health and energy.</li>
          <li>Re-run in 7 days and compare your LMI.</li>
        </ul>
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
          <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
        </div>
      </div>
    </div>
  );
}
