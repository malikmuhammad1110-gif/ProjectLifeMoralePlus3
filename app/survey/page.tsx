"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Answer = { score?: number };
type TimeRow = { category: string; hours: number; ri: number };

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

const DEFAULT_TIME: TimeRow[] = [
  { category: "Sleep", hours: 49, ri: 5 },
  { category: "Work", hours: 0, ri: 5 },
  { category: "Commute", hours: 0, ri: 5 },
  { category: "Relationships", hours: 0, ri: 5 },
  { category: "Leisure", hours: 0, ri: 5 },
  { category: "Health", hours: 0, ri: 5 },
  { category: "Chores", hours: 0, ri: 5 },
  { category: "Growth", hours: 0, ri: 5 },
  { category: "Other", hours: 0, ri: 5 },
];

export default function SurveyPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: 24 }, () => ({})));
  const [timeMap, setTimeMap] = useState<TimeRow[]>(DEFAULT_TIME);
  const [ELI, setELI] = useState<number>(5);
  const [crossLift, setCrossLift] = useState<boolean>(true);
  const [riMult, setRiMult] = useState<number>(1);
  const [calMax, setCalMax] = useState<number>(8.75);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalHours = useMemo(() => timeMap.reduce((a, b) => a + (Number(b.hours) || 0), 0), [timeMap]);
  const remaining = 168 - totalHours;

  const answered = answers.filter((a) => typeof a.score === "number").length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const setScore = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { score: v };
    setAnswers(next);
  };

  const setTime = (i: number, field: "hours" | "ri", v: number) => {
    const next = [...timeMap];
    next[i] = { ...next[i], [field]: v } as any;
    setTimeMap(next);
  };

  async function calculate() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        answers,
        timeMap,
        ELI,
        config: {
          calibration: { k: 1.936428228, max: calMax },
          ri: { globalMultiplier: riMult },
          crossLift: { enabled: crossLift, alpha: 20 },
        },
      };
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error (${res.status})`);
      const data = await res.json();
      localStorage.setItem("LMI_RESULT", JSON.stringify(data));
      localStorage.setItem("LMI_INPUT", JSON.stringify({ answers, timeMap, ELI }));
      router.push("/results");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  const hoursText =
    remaining === 0 ? "✅ 168/168 — Ready" : remaining > 0 ? `Allocate ${remaining} more` : `Over by ${-remaining}`;

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Banner */}
      <div className="banner">
        <div style={{ flex: 1 }}>
          <div className="badge">Life Morale Survey</div>
          <h1 style={{ margin: "6px 0 0" }}>How’s life, really?</h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            Quick sliders. Honest answers. Big clarity.
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div className="label">Progress</div>
          <div className="progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* Rubric */}
      <div className="card" style={{ background: "#f5fbff" }}>
        <div className="label">Rubric (read once)</div>
        <div className="kpi">
          <div className="pill"><b>LMI</b> — Life Morale Index (your final score)</div>
          <div className="pill"><b>RI</b> — Residual Influence (1–10; 5 = neutral)</div>
          <div className="pill"><b>ELI</b> — Emotional Load Index (1–10; higher = tailwind)</div>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          RI captures how much a block of time affects your day after it’s done — the “afterglow” or “hangover” effect.
          ELI reflects your overall emotional weather: 5 = neutral, above = positive tailwind, below = emotional drag.
        </p>
      </div>

      <div className="grid cols-2">
        {/* Questions */}
        <div className="card">
          <div className="section-title">
            <span style={{ color: "var(--blue)" }}>•</span> 24 questions (1–10)
          </div>
          <p className="muted" style={{ marginTop: 4 }}>Move each slider to give your honest score.</p>

          {QUESTIONS.map((q, i) => {
            const val = answers[i].score ?? 0;
            return (
              <div key={i} style={{ margin: "14px 0 18px", paddingBottom: 10, borderBottom: "1px dashed var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ fontWeight: 700 }}>{i + 1}. {q}</div>
                  <div className="pill">Score: {val}</div>
                </div>
                <input
                  className="slider"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={val}
                  onChange={(e) => setScore(i, Number(e.target.value))}
                />
              </div>
            );
          })}
        </div>

        {/* Time Map & Model */}
        <div className="card">
          <div className="section-title">
            <span style={{ color: "var(--teal)" }}>•</span> 168-hour time map
          </div>
          <p className="muted" style={{ marginTop: 4 }}>
            Tap to edit — numeric keypad will appear on phones.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {timeMap.map((row, i) => (
              <div key={row.category} className="row">
                <div>
                  <b>{row.category}</b>{" "}
                  {row.category !== "Sleep" && <span className="badge">awake</span>}
                </div>

                {/* HOURS - numeric keypad */}
                <div>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    placeholder="0"
                    value={row.hours === 0 ? "" : String(row.hours)}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, "");
                      const n = digits === "" ? 0 : parseInt(digits, 10);
                      const nextVal = Math.max(0, Math.min(168, isNaN(n) ? 0 : n));
                      setTime(i, "hours", nextVal);
                    }}
                  />
                  <div className="muted" style={{ fontSize: 12 }}>hrs</div>
                </div>

                {/* RI - numeric keypad */}
                <div>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    placeholder="5"
                    value={row.ri === 0 ? "" : String(row.ri)}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, "");
                      let n = digits === "" ? 0 : parseInt(digits, 10);
                      if (n !== 0) n = Math.max(1, Math.min(10, isNaN(n) ? 5 : n));
                      setTime(i, "ri", n);
                    }}
                  />
                  <div className="muted" style={{ fontSize: 12 }}>RI</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              fontWeight: 700,
              color:
                remaining === 0 ? "var(--teal)" : remaining > 0 ? "var(--amber)" : "var(--rose)",
            }}
          >
            {hoursText}
          </div>

          <div className="card" style={{ marginTop: 12, background: "#f5fbff" }}>
            <div className="label">Model</div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                ELI (1–10)
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={ELI}
                  onChange={(e) => setELI(Number(e.target.value || 5))}
                />
              </label>
              <label>
                Calibration max
                <input
                  className="input"
                  type="number"
                  step={0.05}
                  value={calMax}
                  onChange={(e) => setCalMax(Number(e.target.value))}
                />
              </label>
              <label>
                RI multiplier
                <input
                  className="input"
                  type="number"
                  step={0.1}
                  value={riMult}
                  onChange={(e) => setRiMult(Number(e.target.value))}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={crossLift}
                  onChange={(e) => setCrossLift(e.target.checked)}
                />
                Cross-lift (let strong areas lift weak)
              </label>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn primary"
              onClick={calculate}
              disabled={loading || remaining !== 0}
              title={remaining !== 0 ? "Allocate all 168 hours" : ""}
            >
              {loading ? "Calculating…" : "See my Life Morale"}
            </button>
            {remaining !== 0 && (
              <button
                className="btn ghost"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top
              </button>
            )}
          </div>

          {error && (
            <div className="card" style={{ marginTop: 12, background: "#fff6f7", borderColor: "#ffd3da" }}>
              <b style={{ color: "var(--rose)" }}>Error:</b> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
