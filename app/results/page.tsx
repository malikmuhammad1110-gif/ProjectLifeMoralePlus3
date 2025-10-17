"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// ---------- Types & constants ----------
type Dim = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";

const Q2DIM: Dim[] = [
  "Fulfillment","Fulfillment","Fulfillment","Fulfillment","Fulfillment",
  "Connection","Connection","Connection","Connection","Connection",
  "Autonomy","Autonomy","Autonomy","Autonomy","Autonomy",
  "Vitality","Vitality","Vitality","Vitality","Vitality",
  "Peace","Peace","Peace","Peace",
];

const QUESTIONS: string[] = [
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

const LOW_MSG: Record<Dim, string> = {
  Fulfillment:
    "Pick one small weekly goal aligned with your values—personally meaningful, not just productive.",
  Connection:
    "Do one intentional reach-out this week (call, coffee, or gratitude text) to rebuild warmth.",
  Autonomy:
    "Reduce decision fatigue: prep simple routines and protect one boundary to regain control.",
  Vitality:
    "Anchor a steady sleep window, add short daily walks, and keep water nearby.",
  Peace:
    "Add a 3–5 minute reset (breathing, journaling, or quiet pause) between tasks.",
};

const HIGH_MSG: Record<Dim, string> = {
  Fulfillment:
    "Keep one weekly practice that grows you—learning, creating, or serving.",
  Connection:
    "Fuel your bonds with a tiny weekly ritual and quick appreciation messages.",
  Autonomy:
    "Maintain boundaries and simple systems so your freedom stays stable.",
  Vitality:
    "Protect sleep, hydration, sunlight, and light movement—they compound.",
  Peace:
    "Protect quiet time and margins—your calm steadies everything else.",
};

function band(score: number) {
  if (score >= 7.5) return { label: "High", color: "#16a34a" };
  if (score >= 6.0) return { label: "Solid", color: "#0ea5e9" };
  if (score >= 4.5) return { label: "Needs attention", color: "#f59e0b" };
  return { label: "Low", color: "#ef4444" };
}

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

// ---------- Page ----------
export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);

  // Load saved result
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("LMI_RESULT");
      if (raw) setResult(JSON.parse(raw));
    } catch { setResult(null); }
  }, []);

  // Demo loader (lets you see the UI even if survey wasn't run)
  function loadDemo() {
    const demo = {
      finalLMI: 6.9,
      rawLMS: 7.1,
      riAdjusted: 7.1,
      topDrainers: [
        { index: 19, score: 1, note: "Body confidence low" },
        { index: 15, score: 2, note: "Energy dips" },
        { index: 16, score: 2, note: "Sleep inconsistent" },
      ],
      topUplifters: [
        { index: 0, score: 10, note: "Strong direction" },
        { index: 1, score: 9, note: "Aligned with values" },
        { index: 2, score: 9, note: "Sense of meaning" },
      ],
    };
    localStorage.setItem("LMI_RESULT", JSON.stringify(demo));
    setResult(demo);
  }

  if (!result) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="muted">Take the survey to see your Life Morale.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
          <button className="btn" onClick={loadDemo}>Load demo result</button>
        </div>
      </div>
    );
  }

  const MAX = 8.75;
  const final = typeof result.finalLMI === "number" ? result.finalLMI : 0;
  const raw = typeof result.rawLMS === "number" ? result.rawLMS : 0;
  const riAdj = typeof result.riAdjusted === "number" ? result.riAdjusted : 0;
  const pct = Math.round((Math.max(0, Math.min(final, MAX)) / MAX) * 100);
  const b = band(final);

  const lowDim = useMemo<Dim | null>(() => dominantDim(result.topDrainers, "Peace"), [result.topDrainers]);
  const highDim = useMemo<Dim | null>(() => dominantDim(result.topUplifters, "Fulfillment"), [result.topUplifters]);

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* KPIs */}
      <div className="card" style={{ background: "linear-gradient(135deg,#eaf2ff,#effdf9)" }}>
        <h1 style={{ marginTop: 0 }}>Your Life Morale</h1>
        <div className="kpi">
          <div className="pill"><b>Raw LMS:</b> {raw.toFixed(2)}</div>
          <div className="pill"><b>RI-adjusted:</b> {riAdj.toFixed(2)}</div>
          <div className="pill"><b>Final LMI:</b> {final.toFixed(2)} / {MAX}</div>
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
          <div style={{
            height: 16, borderRadius: 999, border: "1px solid var(--border)",
            overflow: "hidden",
            background: "linear-gradient(90deg,#fee2e2 0%,#fde68a 33%,#bfdbfe 66%,#dcfce7 100%)",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: "linear-gradient(90deg,#ef4444 0%,#f59e0b 35%,#3b82f6 70%,#16a34a 100%)",
              transition: "width .35s ease",
            }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginTop:6 }}>
            <span>0</span><span>2.2</span><span>4.4</span><span>6.6</span><span>8.75</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <div className="pill" style={{ borderColor: "transparent", background: "#fff" }}>
              <b>Final LMI:</b> {final.toFixed(2)} ({pct}% of max)
            </div>
            <div className="pill" style={{ color: b.color }}>{b.label}</div>
          </div>
        </div>
      </div>

      {/* Personalized insights */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Focus area (low)</div>
          {lowDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{lowDim}</h2>
              <p>{LOW_MSG[lowDim]}</p>
              {lowDim === "Autonomy" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Commute heavy? Leave 10–15 mins earlier, use a favorite playlist/podcast, or batch errands.</li>
                  <li>Workload tense? Time-box one hard task and finish one quick win early.</li>
                </ul>
              )}
              {lowDim === "Vitality" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Keep sleep/wake within ~60 minutes daily.</li>
                  <li>10–20 minute walk or stretch most days; keep water nearby.</li>
                </ul>
              )}
            </>
          ) : <p className="muted">No clear low pattern detected.</p>}
        </div>

        <div className="card">
          <div className="label">Keep fueling (high)</div>
          {highDim ? (
            <>
              <h2 style={{ marginTop: 0 }}>{highDim}</h2>
              <p>{HIGH_MSG[highDim]}</p>
              {highDim === "Connection" && (
                <ul className="muted" style={{ marginTop: 8 }}>
                  <li>Schedule a tiny weekly ritual with a favorite person.</li>
                  <li>Send a quick appreciation message today.</li>
                </ul>
              )}
            </>
          ) : <p className="muted">No clear high pattern detected.</p>}
        </div>
      </div>

      {/* Top 3s */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Top Drainers</div>
          {Array.isArray(result.topDrainers) && result.topDrainers.length ? (
            <ol>
              {result.topDrainers.map((d: any, i: number) => {
                const idx = typeof d.index === "number" ? d.index : -1;
                const label = idx >= 0 && idx < QUESTIONS.length ? QUESTIONS[idx] : `Q${idx + 1}`;
                const dim = idx >= 0 && idx < Q2DIM.length ? Q2DIM[idx] : "Fulfillment";
                return <li key={`dr-${i}`}>Q{idx + 1} ({dim}): {label} — <b>{d.score}</b>{d.note ? <span> · <i>{d.note}</i></span> : null}</li>;
              })}
            </ol>
          ) : <p className="muted">No items yet.</p>}
        </div>

        <div className="card">
          <div className="label">Top Uplifters</div>
          {Array.isArray(result.topUplifters) && result.topUplifters.length ? (
            <ol>
              {result.topUplifters.map((d: any, i: number) => {
                const idx = typeof d.index === "number" ? d.index : -1;
                const label = idx >= 0 && idx < QUESTIONS.length ? QUESTIONS[idx] : `Q${idx + 1}`;
                const dim = idx >= 0 && idx < Q2DIM.length ? Q2DIM[idx] : "Fulfillment";
                return <li key={`up-${i}`}>Q{idx + 1} ({dim}): {label} — <b>{d.score}</b>{d.note ? <span> · <i>{d.note}</i></span> : null}</li>;
              })}
            </ol>
          ) : <p className="muted">No items yet.</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="label">Next steps</div>
        <ul style={{ margin: "8px 0" }}>
          <li>Pick <b>one</b> low area → tiny daily action.</li>
          <li>Protect <b>one</b> high area → schedule it.</li>
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
