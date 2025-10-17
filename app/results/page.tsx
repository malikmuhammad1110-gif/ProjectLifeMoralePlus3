"use client";

import { useEffect, useState } from "react";
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
        <button className="btn primary" onClick={() => router.push("/survey")}>
          Start survey
        </button>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ background: "linear-gradient(135deg,#eaf2ff,#effdf9)" }}>
        <h1 style={{ marginTop: 0 }}>Your Life Morale</h1>
        <div className="kpi">
          <div className="pill"><b>Raw LMS:</b> {result.rawLMS?.toFixed(2)}</div>
          <div className="pill"><b>RI-adjusted:</b> {result.riAdjusted?.toFixed(2)}</div>
          <div className="pill"><b>Final LMI:</b> {result.finalLMI?.toFixed(2)}</div>
        </div>
        <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          With small changes here and there, this score can improve. Focus on one low area to lift, and keep fueling one high area you love.
        </p>
      </div>

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
