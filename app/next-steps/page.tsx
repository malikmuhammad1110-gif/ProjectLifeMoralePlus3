"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Dim = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";
type TimeRow = { category: string; hours: number; ri: number };

const Q2DIM: Dim[] = [
  // Fulfillment 1–5
  "Fulfillment","Fulfillment","Fulfillment","Fulfillment","Fulfillment",
  // Connection 6–10
  "Connection","Connection","Connection","Connection","Connection",
  // Autonomy 11–15
  "Autonomy","Autonomy","Autonomy","Autonomy","Autonomy",
  // Vitality 16–20
  "Vitality","Vitality","Vitality","Vitality","Vitality",
  // Peace 21–24
  "Peace","Peace","Peace","Peace",
];

const LOW_MSG: Record<Dim, string> = {
  Fulfillment: "Pick one small weekly goal aligned with your values—personally meaningful, not just productive.",
  Connection:  "Do one intentional reach-out this week (call, coffee, or gratitude text) to rebuild warmth.",
  Autonomy:    "Reduce decision fatigue: prep simple routines and protect one boundary to regain control.",
  Vitality:    "Anchor a steady sleep window, add short daily walks, and keep water nearby.",
  Peace:       "Add a 3–5 minute reset (breathing, journaling, or quiet pause) between tasks.",
};

const HIGH_MSG: Record<Dim, string> = {
  Fulfillment: "Keep one weekly practice that grows you—learning, creating, or serving.",
  Connection:  "Fuel your bonds with a tiny weekly ritual and quick appreciation messages.",
  Autonomy:    "Maintain boundaries and simple systems so your freedom stays stable.",
  Vitality:    "Protect sleep, hydration, sunlight, and light movement—they compound.",
  Peace:       "Protect quiet time and margins—your calm steadies everything else.",
};

function dominantDim(items: Array<{ index: number }> | undefined, fallback: Dim): Dim | null {
  if (!Array.isArray(items) || !items.length) return null;
  const counts: Record<Dim, number> = { Fulfillment:0, Connection:0, Autonomy:0, Vitality:0, Peace:0 };
  for (const it of items) {
    const idx = typeof it.index === "number" ? it.index : -1;
    if (idx >= 0 && idx < Q2DIM.length) counts[Q2DIM[idx]]++;
  }
  let best: Dim = fallback, bestN = -1;
  (Object.keys(counts) as Dim[]).forEach(d => { if (counts[d] > bestN) { bestN = counts[d]; best = d; }});
  return bestN > 0 ? best : null;
}

export default function NextStepsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);
  const [input, setInput] = useState<{ answers?: any[]; timeMap?: TimeRow[]; ELI?: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const r = localStorage.getItem("LMI_RESULT");
      const i = localStorage.getItem("LMI_INPUT"); // set in survey page
      if (r) setResult(JSON.parse(r));
      if (i) setInput(JSON.parse(i));
    } catch {
      setResult(null);
      setInput(null);
    }
  }, []);

  if (!result) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="muted">Take the survey first so we can tailor a plan.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
          <button className="btn ghost" onClick={() => router.push("/results")}>Back to results</button>
        </div>
      </div>
    );
  }

  const final = typeof result.finalLMI === "number" ? result.finalLMI : 0;

  const lowDim  = useMemo<Dim | null>(() => dominantDim(result.topDrainers, "Peace"), [result.topDrainers]);
  const highDim = useMemo<Dim | null>(() => dominantDim(result.topUplifters, "Fulfillment"), [result.topUplifters]);

  // ---- Time-map checks (optional; uses LMI_INPUT if present) ----
  const tm = input?.timeMap ?? [];
  const by = (name: string) => tm.find((r) => r.category === name);
  const work      = by("Work");
  const commute   = by("Commute");
  const sleep     = by("Sleep");
  const health    = by("Health");
  const rel       = by("Relationships");
  const leisure   = by("Leisure");

  const flags: Array<{ title: string; bullets: string[] }> = [];
  if (work && work.hours >= 35 && (work.ri ?? 5) <= 4) {
    flags.push({
      title: "Work strain pattern",
      bullets: [
        "Time-box one hard task early; end with a quick win.",
        "Clarify tomorrow’s top 3 the day before.",
        "Protect one boundary this week (e.g., response window).",
      ],
    });
  }
  if (commute && commute.hours >= 7 && (commute.ri ?? 5) <= 4) {
    flags.push({
      title: "Commute drag",
      bullets: [
        "Leave 10–15 minutes earlier to reduce stress spikes.",
        "Queue a podcast/playlist you genuinely enjoy.",
        "Batch errands around the route once a week.",
      ],
    });
  }
  if (sleep && sleep.hours < 49) {
    flags.push({
      title: "Sleep under target (49h/week)",
      bullets: [
        "Anchor bed/wake within ~60 minutes daily.",
        "Reduce late caffeine; dim screens 60–90 mins before bed.",
        "Keep a notepad to park thoughts before sleep.",
      ],
    });
  }
  if (health && health.hours < 2) {
    flags.push({
      title: "Low Health investment",
      bullets: [
        "10–20 minute walks most days; light stretch breaks.",
        "Keep water visible; add one protein/fruit/veg serving.",
        "Attach movement to an existing habit (after coffee/commute).",
      ],
    });
  }
  if (rel && rel.hours < 5 && (rel.ri ?? 5) < 5) {
    flags.push({
      title: "Thin Connection time",
      bullets: [
        "Schedule a tiny weekly ritual with one person you value.",
        "Send 1 appreciation text today (under 60 seconds).",
        "Put one call/coffee in the calendar this week.",
      ],
    });
  }
  if (leisure && leisure.hours < 4) {
    flags.push({
      title: "Low Leisure margin",
      bullets: [
        "Block a 30–45 minute ‘guilt-free’ slot this week.",
        "Pick 1 activity that actually restores you (not scrolling).",
        "Keep it repeatable; same time, same day.",
      ],
    });
  }

  // ---- 1-week experiment ----
  const experiment: string[] = [
    lowDim ? `Lift ${lowDim}: one tiny daily action.` : "Pick one low area: one tiny daily action.",
    highDim ? `Protect ${highDim}: schedule it once this week.` : "Protect one high area: schedule it once this week.",
    "Retake the survey in 7 days and compare your LMI.",
  ];

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Header */}
      <div className="card" style={{ background: "linear-gradient(135deg,#eaf2ff,#effdf9)" }}>
        <h1 style={{ marginTop: 0 }}>Next Steps for You</h1>
        <div className="kpi">
          <div className="pill"><b>Current LMI:</b> {final.toFixed(2)} / 8.75</div>
          {typeof input?.ELI === "number" && <div className="pill"><b>ELI:</b> {input.ELI}</div>}
        </div>
        <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          Based on your answers and time map, here’s a short, realistic action plan to nudge your Life Morale upward.
        </p>
      </div>

      {/* Focus cards */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Focus area (low)</div>
          {lowDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{lowDim}</h2>
              <p>{LOW_MSG[lowDim]}</p>
            </>
          ) : <p className="muted">No clear low pattern detected.</p>}
        </div>

        <div className="card">
          <div className="label">Keep fueling (high)</div>
          {highDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{highDim}</h2>
              <p>{HIGH_MSG[highDim]}</p>
            </>
          ) : <p className="muted">No clear high pattern detected.</p>}
        </div>
      </div>

      {/* Time map opportunities */}
      <div className="card">
        <div className="label">Time Map opportunities</div>
        {tm.length ? (
          flags.length ? (
            <div style={{ display:"grid", gap:10 }}>
              {flags.map((f, i) => (
                <div key={i} className="card" style={{ borderStyle:"dashed" }}>
                  <b>{f.title}</b>
                  <ul className="muted" style={{ marginTop: 6 }}>
                    {f.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No obvious opportunities detected. Nice balance—protect what’s working.</p>
          )
        ) : (
          <p className="muted">No time map found for this run. Re-take the survey so we can tailor time-based tips.</p>
        )}
      </div>

      {/* 1-week experiment */}
      <div className="card">
        <div className="label">1-week experiment</div>
        <ol>
          {experiment.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
        <div style={{ marginTop: 10, display:"flex", gap:10, flexWrap:"wrap" }}>
          <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
          <button className="btn ghost" onClick={() => router.push("/results")}>Back to results</button>
        </div>
      </div>
    </div>
  );
}
