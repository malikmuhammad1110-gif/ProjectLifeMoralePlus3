"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Dim = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";
type TimeRow = { category: string; hours: number; ri: number };

const QUESTIONS_LEN = 24;
const Q2DIM: Dim[] = [
  "Fulfillment","Fulfillment","Fulfillment","Fulfillment","Fulfillment",
  "Connection","Connection","Connection","Connection","Connection",
  "Autonomy","Autonomy","Autonomy","Autonomy","Autonomy",
  "Vitality","Vitality","Vitality","Vitality","Vitality",
  "Peace","Peace","Peace","Peace",
];

const LOW_MSG: Record<Dim, string> = {
  Fulfillment: "Pick one small weekly goal aligned with your values—personally meaningful, not just productive.",
  Connection:  "Do one intentional reach-out this week (call, coffee, or gratitude text).",
  Autonomy:    "Reduce decision fatigue: prep simple routines and protect one boundary.",
  Vitality:    "Anchor a steady sleep window, short daily walks, and keep water nearby.",
  Peace:       "Add a 3–5 minute reset (breathing, journaling, quiet pause) between tasks.",
};
const HIGH_MSG: Record<Dim, string> = {
  Fulfillment: "Keep one weekly practice that grows you—learning, creating, or serving.",
  Connection:  "Fuel your bonds with a tiny weekly ritual and quick appreciation messages.",
  Autonomy:    "Maintain boundaries and simple systems so your freedom stays stable.",
  Vitality:    "Protect sleep, hydration, sunlight, and light movement—they compound.",
  Peace:       "Protect quiet time and margins—your calm steadies everything else.",
};

export default function NextStepsPage() {
  const router = useRouter();

  const [result, setResult] = useState<any | null>(null);
  const [input, setInput] = useState<{ answers?: any[]; timeMap?: TimeRow[]; ELI?: number } | null>(null);

  const [tips, setTips] = useState<{ low?: string; high?: string; flags?: Array<{title:string; bullets:string[]}>; exp?: string[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Load from localStorage safely
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const r = localStorage.getItem("LMI_RESULT");
      const i = localStorage.getItem("LMI_INPUT"); // may be null if older run
      setResult(r ? JSON.parse(r) : null);
      setInput(i ? JSON.parse(i) : null);
    } catch (e: any) {
      setErr(e?.message || "Failed to read saved data.");
    }
  }, []);

  // Minimal guards
  const hasResult = result && typeof result.finalLMI === "number";
  const final = hasResult ? Number(result.finalLMI) : 0;

  function safeDominantDim(list: Array<{ index: number }> | undefined, fallback: Dim): Dim | null {
    if (!Array.isArray(list) || list.length === 0) return null;
    const counts: Record<Dim, number> = { Fulfillment:0, Connection:0, Autonomy:0, Vitality:0, Peace:0 };
    for (const it of list) {
      const idx = typeof it?.index === "number" ? it.index : -1;
      if (idx >= 0 && idx < QUESTIONS_LEN) {
        const d = Q2DIM[idx];
        counts[d] = (counts[d] ?? 0) + 1;
      }
    }
    let best: Dim = fallback; let bestN = -1;
    (Object.keys(counts) as Dim[]).forEach((d) => {
      if (counts[d] > bestN) { bestN = counts[d]; best = d; }
    });
    return bestN > 0 ? best : null;
  }

  function generateTips() {
    setErr(null);
    setTips(null);
    try {
      // 1) Low/high from top 3s
      const lowDim  = safeDominantDim(result?.topDrainers, "Peace");
      const highDim = safeDominantDim(result?.topUplifters, "Fulfillment");

      // 2) Time-map opportunities (only if we have input.timeMap)
      const tm: TimeRow[] = Array.isArray(input?.timeMap) ? (input?.timeMap as TimeRow[]) : [];
      const by = (name: string) => tm.find((r) => r?.category === name);
      const work    = by("Work");
      const commute = by("Commute");
      const sleep   = by("Sleep");
      const health  = by("Health");
      const rel     = by("Relationships");
      const leisure = by("Leisure");

      const flags: Array<{ title: string; bullets: string[] }> = [];

      if (work && Number(work.hours) >= 35 && Number(work.ri ?? 5) <= 4) {
        flags.push({
          title: "Work strain pattern",
          bullets: [
            "Time-box one hard task early; end with a quick win.",
            "Prep tomorrow’s top 3 the day before.",
            "Protect one boundary this week (e.g., response window).",
          ],
        });
      }
      if (commute && Number(commute.hours) >= 7 && Number(commute.ri ?? 5) <= 4) {
        flags.push({
          title: "Commute drag",
          bullets: [
            "Leave 10–15 minutes earlier to reduce stress spikes.",
            "Queue a podcast/playlist you genuinely enjoy.",
            "Batch errands around the route once a week.",
          ],
        });
      }
      if (sleep && Number(sleep.hours) < 49) {
        flags.push({
          title: "Sleep under target (49h/week)",
          bullets: [
            "Anchor bed/wake within ~60 minutes daily.",
            "Reduce late caffeine; dim screens 60–90 mins before bed.",
            "Park thoughts on paper before sleep.",
          ],
        });
      }
      if (health && Number(health.hours) < 2) {
        flags.push({
          title: "Low Health investment",
          bullets: [
            "10–20 minute walks most days; light stretch breaks.",
            "Keep water visible; add one protein/fruit/veg serving.",
            "Attach movement to an existing habit (after coffee/commute).",
          ],
        });
      }
      if (rel && Number(rel.hours) < 5 && Number(rel.ri ?? 5) < 5) {
        flags.push({
          title: "Thin Connection time",
          bullets: [
            "Schedule a tiny weekly ritual with one person you value.",
            "Send 1 appreciation text today (under 60 seconds).",
            "Put one call/coffee in the calendar this week.",
          ],
        });
      }
      if (leisure && Number(leisure.hours) < 4) {
        flags.push({
          title: "Low Leisure margin",
          bullets: [
            "Block a 30–45 minute ‘guilt-free’ slot this week.",
            "Pick 1 activity that actually restores you (not scrolling).",
            "Keep it repeatable; same time, same day.",
          ],
        });
      }

      const exp: string[] = [
        lowDim ? `Lift ${lowDim}: one tiny daily action.` : "Pick one low area: tiny daily action.",
        highDim ? `Protect ${highDim}: schedule it once this week.` : "Protect one high area: schedule it once.",
        "Retake the survey in 7 days and compare your LMI.",
      ];

      setTips({
        low:  lowDim ? LOW_MSG[lowDim]   : undefined,
        high: highDim ? HIGH_MSG[highDim]: undefined,
        flags,
        exp,
      });
    } catch (e: any) {
      setErr(e?.message || "Failed to generate tips.");
    }
  }

  if (!hasResult) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="muted">Take the survey so we can tailor a plan.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
          <button className="btn ghost" onClick={() => router.push("/results")}>Back to results</button>
        </div>
        {err && <div style={{ marginTop: 12, color:"#b91c1c" }}>Error: {err}</div>}
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ background:"linear-gradient(135deg,#eaf2ff,#effdf9)" }}>
        <h1 style={{ marginTop: 0 }}>Next Steps for You</h1>
        <div className="kpi">
          <div className="pill"><b>Current LMI:</b> {Number(final).toFixed(2)} / 8.75</div>
          {typeof input?.ELI === "number" && <div className="pill"><b>ELI:</b> {input.ELI}</div>}
        </div>
        <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          Click the button below to generate person-specific recommendations from your answers and time map.
        </p>
        <div style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={generateTips}>Generate tips</button>
        </div>
        {err && <div className="card" style={{ marginTop: 12, background:"#fff6f7", borderColor:"#ffd3da" }}>
          <b style={{ color:"var(--rose)" }}>Error:</b> {err}
        </div>}
      </div>

      {!tips && (
        <div className="card">
          <div className="label">(Optional) What we loaded</div>
          <details>
            <summary>Show raw saved data</summary>
            <pre style={{ overflowX:"auto" }}>{JSON.stringify({ result, input }, null, 2)}</pre>
          </details>
          {!input?.timeMap && (
            <p className="muted" style={{ marginTop: 10 }}>
              Tip: if your time map is empty here, re-take the survey (it now saves <code>LMI_INPUT</code>).
            </p>
          )}
        </div>
      )}

      {tips && (
        <>
          <div className="grid cols-2">
            <div className="card">
              <div className="label">Focus area (low)</div>
              {tips.low ? <p>{tips.low}</p> : <p className="muted">No clear low pattern.</p>}
            </div>
            <div className="card">
              <div className="label">Keep fueling (high)</div>
              {tips.high ? <p>{tips.high}</p> : <p className="muted">No clear high pattern.</p>}
            </div>
          </div>

          <div className="card">
            <div className="label">Time Map opportunities</div>
            {tips.flags && tips.flags.length ? (
              <div style={{ display:"grid", gap:10 }}>
                {tips.flags.map((f, i) => (
                  <div key={i} className="card" style={{ borderStyle:"dashed" }}>
                    <b>{f.title}</b>
                    <ul className="muted" style={{ marginTop: 6 }}>
                      {f.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No obvious opportunities detected.</p>
            )}
          </div>

          <div className="card">
            <div className="label">1-week experiment</div>
            <ol>{tips.exp?.map((line, i) => <li key={i}>{line}</li>)}</ol>
            <div style={{ marginTop: 10, display:"flex", gap:10, flexWrap:"wrap" }}>
              <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
              <button className="btn ghost" onClick={() => router.push("/results")}>Back to results</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
