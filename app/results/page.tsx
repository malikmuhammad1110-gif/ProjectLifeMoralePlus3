"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);
  const [input, setInput] = useState<{ ELI?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawR = localStorage.getItem("LMI_RESULT");
      const rawI = localStorage.getItem("LMI_INPUT");
      if (rawR) setResult(JSON.parse(rawR));
      if (rawI) {
        const parsed = JSON.parse(rawI);
        setInput({ ELI: typeof parsed?.ELI === "number" ? parsed.ELI : undefined });
      }
    } catch (e: any) {
      setError(e?.message || "Could not read saved result.");
    }
  }, []);

  function loadDemo() {
    const demo = {
      finalLMI: 6.95,
      rawLMS: 7.10,
      riAdjusted: 7.10,
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

  function band(score: number) {
    if (score >= 7.5) return { label: "High", color: "var(--green)" };
    if (score >= 6.0) return { label: "Solid", color: "var(--primaryA)" };
    if (score >= 4.5) return { label: "Needs attention", color: "var(--amber)" };
    return { label: "Low", color: "var(--rose)" };
  }

  const MAX = 8.75;
  const final = typeof result?.finalLMI === "number" ? result.finalLMI : 0;
  const raw = typeof result?.rawLMS === "number" ? result.rawLMS : 0;
  const riAdj = typeof result?.riAdjusted === "number" ? result.riAdjusted : 0;
  const pct = useMemo(() => Math.round((Math.max(0, Math.min(final, MAX)) / MAX) * 100), [final]);
  const b = useMemo(() => band(final), [final]);

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

  return (
    <div className="grid" style={{ gap: 18 }}>
      {!result && (
        <div className="card">
          <h2>No results yet</h2>
          <p className="muted">Take the survey to see your Life Morale.</p>
          {error && <p style={{ color: "var(--rose)" }}>Error: {error}</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
            <button className="btn" onClick={loadDemo}>Load demo result</button>
          </div>
        </div>
      )}

      {result && (
        <>
          <div className="card" style={{ background: "linear-gradient(135deg,#E9F9F3,#F0FFFA)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LogoPLM size={32} />
                <h1 style={{ margin: 0 }}>Your Life Morale</h1>
              </div>
              <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
            </div>

            <div className="kpi" style={{ marginTop: 10 }}>
              <div className="pill"><b>Raw LMS:</b> {raw.toFixed(2)}</div>
              <div className="pill"><b>RI-adjusted:</b> {riAdj.toFixed(2)}</div>
              <div className="pill"><b>Final LMI:</b> {final.toFixed(2)} / {MAX}</div>
              <div className="pill" style={{ color: b.color }}><b>Status:</b> {b.label}</div>
              {typeof input?.ELI === "number" && (
                <div className="pill">
                  <b>ELI:</b> {input.ELI}
                  <span className="muted" style={{ marginLeft: 6 }}>
                    {input.ELI === 5 ? "neutral" : input.ELI > 5 ? "tailwind" : "drag"}
                  </span>
                </div>
              )}
            </div>

            <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
              Small shifts, big lift: pick one low area to nudge this week and keep fueling one high area you love.
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
                  background: "linear-gradient(90deg,#EAF6F2 0%, #DCF9F2 100%)",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, var(--primaryA) 0%, var(--primaryB) 100%)",
                    transition: "width .35s ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                <span>0</span><span>2.2</span><span>4.4</span><span>6.6</span><span>8.75</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="pill" style={{ borderColor: "transparent", background: "#fff" }}>
                  <b>Final LMI:</b> {final.toFixed(2)} ({pct}% of max)
                </div>
                <div className="pill" style={{ color: b.color }}>{b.label}</div>
              </div>
            </div>
          </div>

          {/* Top 3s */}
          <div className="grid cols-2">
            <div className="card">
              <div className="label">Top Drainers</div>
              {Array.isArray(result.topDrainers) && result.topDrainers.length ? (
                <ol style={{ marginTop: 6 }}>
                  {result.topDrainers.map((d: any, i: number) => {
                    const idx = typeof d.index === "number" ? d.index : -1;
                    const label = idx >= 0 && idx < QUESTIONS.length ? QUESTIONS[idx] : `Q${idx + 1}`;
                    return (
                      <li key={`dr-${i}`}>
                        Q{idx + 1}: {label} — <b>{d.score}</b>
                        {d.note ? <span> · <i>{d.note}</i></span> : null}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="muted">No items.</p>
              )}
            </div>

            <div className="card">
              <div className="label">Top Uplifters</div>
              {Array.isArray(result.topUplifters) && result.topUplifters.length ? (
                <ol style={{ marginTop: 6 }}>
                  {result.topUplifters.map((d: any, i: number) => {
                    const idx = typeof d.index === "number" ? d.index : -1;
                    const label = idx >= 0 && idx < QUESTIONS.length ? QUESTIONS[idx] : `Q${idx + 1}`;
                    return (
                      <li key={`up-${i}`}>
                        Q{idx + 1}: {label} — <b>{d.score}</b>
                        {d.note ? <span> · <i>{d.note}</i></span> : null}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="muted">No items.</p>
              )}
            </div>
          </div>

          {/* Quick refresher */}
          <div className="card" style={{ background: "#F8FFFD" }}>
            <div className="label">RI & ELI (fast)</div>
            <ul style={{ marginTop: 6 }}>
              <li><b>RI</b> — Residual Influence: how much something carries over into the rest of your day (drain or lift).</li>
              <li><b>ELI</b> — Emotional Load Index: the overall “emotional weather.” <b>5 = neutral</b>; below = drag, above = tailwind.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="label">Next steps</div>
            <ul style={{ margin: "8px 0" }}>
              <li>Pick <b>one</b> low area → tiny daily action.</li>
              <li>Protect <b>one</b> high area → schedule it.</li>
              <li>Re-run in 7 days and compare your LMI.</li>
            </ul>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={() => router.push("/next-steps")}>
                Next Steps for you →
              </button>
              <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
              <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
