"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

// Banding + colors for the gauge label
function band(score: number) {
  if (score >= 7.5) return { label: "High", color: "#16a34a" };        // green
  if (score >= 6.0) return { label: "Solid", color: "#0ea5e9" };       // blue
  if (score >= 4.5) return { label: "Needs attention", color: "#f59e0b" }; // amber
  return { label: "Low", color: "#ef4444" };                            // red
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("LMI_RESULT") : null;
    setResult(raw ? JSON.parse(raw) : null);
  }, []);

  const final = result?.finalLMI as number | undefined;
  const raw = result?.rawLMS as number | undefined;
  const riAdj = result?.riAdjusted as number | undefined;

  // Gauge math (0 → 8.75)
  const MAX = 8.75;
  const pct = useMemo(() => {
    if (typeof final !== "number") return 0;
    const clamped = Math.max(0, Math.min(final, MAX));
    return Math.round((clamped / MAX) * 100);
  }, [final]);

  const b = useMemo(() => band(final ?? 0), [final]);

  if (!result) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="muted">Take the survey to see your Life Morale.</p>
        <button className="btn primary" onClick={() => router.push("/survey")}>
          Start survey
        </button>
      </div>
    );
  }

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

      {/* Gauge Card */}
      <div className="card">
        <div className="label">Gauge</div>
        <div style={{ marginTop: 4 }}>
          {/* Track */}
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
            {/* Fill */}
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                transition: "width .35s ease",
                background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 35%, #3b82f6 70%, #16a34a 100%)",
              }}
            />
          </div>

          {/* Ticks + label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 6,
            }}
          >
            <span>0</span>
            <span>2.2</span>
            <span>4.4</span>
            <span>6.6</span>
            <span>8.75</span>
          </div>

          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="pill"
              style={{
                borderColor: "transparent",
                background: "#fff",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <b>Final LMI:</b> {final?.toFixed(2)} ({pct}% of max)
            </div>
            <div className="pill" style={{ color: b.color }}>
              {b.label}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3s */}
      <div className="grid cols-2">
        <div className="card">
          <div className="label">Top Drainers</div>
          {result.topDrainers?.length ? (
            <ol>
              {result.topDrainers.map((d: any) => (
                <li key={d.index}>
                  Q{d.index + 1}: {QUESTIONS[d.index]} — <b>{d.score}</b>
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
                  Q{d.index + 1}: {QUESTIONS[d.index]} — <b>{d.score}</b>
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
