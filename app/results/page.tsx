"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

type Item = { index: number; score: number; note?: string };

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);
  const [input, setInput] = useState<{ ELI?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // load saved result + inputs
  useEffect(() => {
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

  // demo for empty state
  function loadDemo() {
    const demo = {
      finalLMI: 6.32,
      rawLMS: 6.7,
      riAdjusted: 6.6,
      topDrainers: [
        { index: 21, score: 3, note: "Emotional swings" },
        { index: 16, score: 4, note: "Sleep inconsistent" },
        { index: 15, score: 4, note: "Energy dips" },
      ],
      topUplifters: [
        { index: 0, score: 9, note: "Clear direction" },
        { index: 1, score: 9, note: "Values aligned" },
        { index: 3, score: 8, note: "Growth routines" },
      ],
    };
    localStorage.setItem("LMI_RESULT", JSON.stringify(demo));
    localStorage.setItem("LMI_INPUT", JSON.stringify({ ELI: 6 }));
    setResult(demo);
    setInput({ ELI: 6 });
  }

  // helpers
  function band(score: number) {
    if (score >= 7.5) return { label: "High", color: "var(--teal)" };
    if (score >= 6.0) return { label: "Solid", color: "var(--primaryA)" };
    if (score >= 4.5) return { label: "Needs attention", color: "var(--amber)" };
    return { label: "Low", color: "var(--rose)" };
  }

  const MAX = 8.75;
  const final = typeof result?.finalLMI === "number" ? result.finalLMI : 0;
  const raw = typeof result?.rawLMS === "number" ? result.rawLMS : 0;
  const riAdj = typeof result?.riAdjusted === "number" ? result.riAdjusted : 0;
  const pct = useMemo(() => Math.round((Math.max(0, Math.min(final, MAX)) / MAX) * 100)), [final];
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
    <div className="main grid" style={{ gap: 18 }}>
      {/* empty state */}
      {!result && (
        <div className="card">
          <div className="label">No results yet</div>
          <h2 style={{ marginTop: 6 }}>See your Life Morale</h2>
          <p className="muted">Take the survey to calculate your Life Morale Index (LMI).</p>
          {error && <p style={{ color: "var(--rose)" }}>Error: {error}</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
            <button className="btn" onClick={loadDemo}>Load demo</button>
          </div>
        </div>
      )}

      {/* results */}
      {result && (
        <>
          {/* Header card */}
          <div className="card" style={{ background: "linear-gradient(135deg,#eaf6f2,#f0fffa)" }}>
            <div className="header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoPLM size={40} />
                <h1 style={{ margin: 0 }}>Your Life Morale</h1>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn" onClick={() => router.push("/survey")}>Retake</button>
                <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
              </div>
            </div>

            <div className="kpi" style={{ marginTop: 6 }}>
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

            <p className="muted" style={{ marginTop: 8 }}>
              Small shifts, big lift: pick one low area to nudge this week and keep fueling one high area you love.
            </p>
          </div>

          {/* Gauge */}
          <div className="card">
            <div className="label">Gauge</div>
            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  height: 14,
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  background:
                    "linear-gradient(90deg,#fee2e2 0%,#fde68a 33%,#bfdbfe 66%,#dcfce7 100%)",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg,var(--primaryA),var(--primaryB))",
                    transition: "width .35s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 6,
                }}
              >
                <span>0</span><span>2.2</span><span>4.4</span><span>6.6</span><span>8.75</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div className="pill" style={{ borderColor: "transparent", background: "#fff" }}>
                  <b>Final LMI:</b> {final.toFixed(2)} ({pct}% of max)
                </div>
                <div className="pill" style={{ color: b.color }}>{b.label}</div>
              </div>
            </div>
          </div>

          {/* top 3s */}
          <div className="grid cols-2">
            <div className="card">
              <div className="label">Top Drainers</div>
              {Array.isArray(result.topDrainers) && result.topDrainers.length ? (
                <ol style={{ marginTop: 6 }}>
                  {result.topDrainers.map((d: Item, i: number) => {
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
                  {result.topUplifters.map((d: Item, i: number) => {
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

          {/* quick refresher */}
          <div className="card" style={{ background: "var(--panelTint)" }}>
            <div className="label">RI & ELI (quick refresher)</div>
            <ul style={{ marginTop: 6 }}>
              <li><b>RI</b> — Residual Influence: how much an area carries over into the rest of your day (drain or lift).</li>
              <li><b>ELI</b> — Emotional Load Index: your overall “emotional weather.” <b>5 = neutral</b>; below = drag, above = tailwind.</li>
            </ul>
          </div>

          {/* actions */}
          <div className="card">
            <div className="label">Next steps</div>
            <ul style={{ margin: "8px 0" }}>
              <li>Pick <b>one</b> low area → tiny daily action.</li>
              <li>Protect <b>one</b> high area → schedule it.</li>
              <li>Re-run in 7 days and compare your LMI.</li>
            </ul>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={() => router.push("/next-steps")}>Next Steps for you →</button>
              <button className="btn" onClick={() => router.push("/survey")}>Retake survey</button>
              <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
