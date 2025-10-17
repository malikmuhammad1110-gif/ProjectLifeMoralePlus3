"use client";

import { useMemo, useState } from "react";

type Answer = { score?: number; scenarioScore?: number; note?: string };
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
  { category: "Sleep",         hours: 49, ri: 5 },
  { category: "Work",          hours: 0,  ri: 5 },
  { category: "Commute",       hours: 0,  ri: 5 },
  { category: "Relationships", hours: 0,  ri: 5 },
  { category: "Leisure",       hours: 0,  ri: 5 },
  { category: "Gym",           hours: 0,  ri: 5 },
  { category: "Chores",        hours: 0,  ri: 5 },
  { category: "Growth",        hours: 0,  ri: 5 },
  { category: "Other",         hours: 0,  ri: 5 },
];

export default function SurveyPage() {
  // ---- MODEL INPUT STATE ----
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from({ length: 24 }, () => ({}))
  );
  const [timeMap, setTimeMap] = useState<TimeRow[]>(DEFAULT_TIME);
  const [ELI, setELI] = useState<number>(1); // default baseline 1
  const [crossLift, setCrossLift] = useState<boolean>(true);
  const [riMult, setRiMult] = useState<number>(1);
  const [calMax, setCalMax] = useState<number>(8.75);

  // ---- DERIVEDS ----
  const totalHours = useMemo(
    () => timeMap.reduce((a, b) => a + (Number(b.hours) || 0), 0),
    [timeMap]
  );
  const remaining = 168 - totalHours;

  const surveyCompletion = useMemo(() => {
    const answered = answers.filter(a => typeof a.score === "number").length;
    return Math.round((answered / QUESTIONS.length) * 100);
  }, [answers]);

  // ---- MUTATORS ----
  const setScore = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { ...next[i], score: v };
    setAnswers(next);
  };
  const setScenario = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { ...next[i], scenarioScore: v };
    setAnswers(next);
  };
  const setNote = (i: number, v: string) => {
    const next = [...answers];
    next[i] = { ...next[i], note: v };
    setAnswers(next);
  };
  const setTime = (i: number, field: "hours" | "ri", v: number) => {
    const next = [...timeMap];
    next[i] = { ...next[i], [field]: v } as any;
    setTimeMap(next);
  };

  // ---- SUBMIT / CALCULATE ----
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function calculate() {
    setLoading(true);
    setError(null);
    setOut(null);
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
      setOut(data);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
      // Scroll to results
      setTimeout(() => {
        const el = document.getElementById("results");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  // ---- UI HELPERS ----
  const hoursStatus =
    remaining === 0
      ? { text: "✅ All set (168/168)", color: "#0a8a0a" }
      : remaining > 0
      ? { text: `Allocate ${remaining} more hours`, color: "#b36700" }
      : { text: `Over by ${-remaining} hours`, color: "#a30000" };

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Header / Progress */}
      <div className="card">
        <div className="label">Progress</div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          Survey completion: {surveyCompletion}%
        </div>
        <div
          style={{
            height: 10,
            background: "#eef2ff",
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: `${surveyCompletion}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,var(--primary), var(--accent))",
              transition: "width .25s ease",
            }}
          />
        </div>
      </div>

      {/* Survey + Time Map */}
      <div className="grid cols-2">
        {/* Survey */}
        <div className="card">
          <div className="label">24 Questions (1–10)</div>
          <p className="footer-note" style={{ marginTop: 6 }}>
            Slide for your <b>current</b> score and your <b>scenario</b> score (if you made changes).
          </p>

          {QUESTIONS.map((q, i) => {
            const curr = answers[i].score ?? 5;
            const scen = answers[i].scenarioScore ?? curr;
            return (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 600 }}>
                    {i + 1}. {q}
                  </div>
                  <div className="badge">Current: {curr}</div>
                  <div className="badge">Scenario: {scen}</div>
                </div>

                <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                  <label>
                    <div className="footer-note">Current (1–10)</div>
                    <input
                      className="slider"
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={curr}
                      onChange={(e) => setScore(i, Number(e.target.value))}
                    />
                  </label>

                  <label>
                    <div className="footer-note">Scenario (1–10)</div>
                    <input
                      className="slider"
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={scen}
                      onChange={(e) => setScenario(i, Number(e.target.value))}
                    />
                  </label>

                  <input
                    className="input"
                    placeholder="(Optional) Note: what influenced your answer?"
                    value={answers[i].note ?? ""}
                    onChange={(e) => setNote(i, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Map + Config */}
        <div className="card">
          <div className="label">168-Hour Time Map & Residual Influence (RI)</div>
          <p className="footer-note">
            Enter weekly hours per category. RI is 1–10 (5 = neutral). Higher positive RI gently lifts morale; low RI can reduce it.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {timeMap.map((row, i) => (
              <div
                key={row.category}
                className="row"
                style={{ gridTemplateColumns: "1fr 110px 110px" }}
              >
                <div>
                  <b>{row.category}</b>{" "}
                  {row.category !== "Sleep" && <span className="badge">awake</span>}
                </div>
                <div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={row.hours}
                    onChange={(e) =>
                      setTime(i, "hours", Number(e.target.value || 0))
                    }
                  />
                  <div className="footer-note">hrs / week</div>
                </div>
                <div>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={10}
                    value={row.ri}
                    onChange={(e) =>
                      setTime(i, "ri", Number(e.target.value || 5))
                    }
                  />
                  <div className="footer-note">RI (1–10)</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              fontWeight: 600,
              color: hoursStatus.color,
            }}
          >
            {hoursStatus.text}
          </div>

          <div
            className="card"
            style={{ marginTop: 12, background: "#f8fbff" }}
          >
            <div className="label">Model Settings</div>
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <label>
                <div className="footer-note">ELI (1–10)</div>
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={ELI}
                  onChange={(e) => setELI(Number(e.target.value || 1))}
                />
              </label>
              <label>
                <div className="footer-note">Calibration Max (10 → …)</div>
                <input
                  className="input"
                  type="number"
                  step={0.05}
                  value={calMax}
                  onChange={(e) => setCalMax(Number(e.target.value))}
                />
              </label>
              <label>
                <div className="footer-note">RI Global Multiplier</div>
                <input
                  className="input"
                  type="number"
                  step={0.1}
                  value={riMult}
                  onChange={(e) => setRiMult(Number(e.target.value))}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={crossLift}
                  onChange={(e) => setCrossLift(e.target.checked)}
                />
                Enable Cross-Lift (let strong areas lift Work)
              </label>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              className="btn primary"
              onClick={calculate}
              disabled={loading || remaining !== 0}
              title={remaining !== 0 ? "Please allocate exactly 168 hours" : ""}
            >
              {loading ? "Calculating…" : "Calculate LMI"}
            </button>
            <span className="footer-note">
              {remaining !== 0
                ? "Allocate all 168 hours to enable calculation."
                : "Ready to calculate."}
            </span>
          </div>
          {error && (
            <div
              className="card"
              style={{
                marginTop: 10,
                borderColor: "#ffdddd",
                background: "#fff7f7",
              }}
            >
              <div style={{ color: "#992222", fontWeight: 600 }}>
                Error: {error}
              </div>
              <div className="footer-note">
                If this persists, screenshot and share the message with your dev partner.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div id="results">
        {out && (
          <div className="grid" style={{ gap: 18 }}>
            <div className="card" style={{ background: "linear-gradient(135deg,#eaf3ff,#effdf9)" }}>
              <div className="label">Your Results</div>
              <div className="kpi">
                <div className="pill">
                  <b>Raw LMS:</b> {out.rawLMS?.toFixed(2)}
                </div>
                <div className="pill">
                  <b>RI-adjusted:</b> {out.riAdjusted?.toFixed(2)}
                </div>
                <div className="pill">
                  <b>Final LMI:</b> {out.finalLMI?.toFixed(2)}
                </div>
              </div>
              <div className="kpi" style={{ marginTop: 8 }}>
                <div className="pill">
                  <b>Scenario (Final):</b> {out.finalLMI_scn?.toFixed(2)}
                </div>
              </div>
              <p className="footer-note">
                Scores are calibrated so 10 maps to {out?.calibrated?.current ? "≈ 8.75" : "a realistic ceiling"}.
                ELI sets the ceiling; RI gently lifts or lowers based on your weekly context.
              </p>
            </div>

            <div className="grid cols-2">
              <div className="card">
                <div className="label">Top Drainers</div>
                {out.topDrainers?.length ? (
                  <ol>
                    {out.topDrainers.map((d: any) => (
                      <li key={d.index}>
                        Q{d.index + 1}: {QUESTIONS[d.index]} — <b>{d.score}</b>
                        {d.note ? <span> · <i>{d.note}</i></span> : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="footer-note">No items yet.</p>
                )}
              </div>

              <div className="card">
                <div className="label">Top Uplifters</div>
                {out.topUplifters?.length ? (
                  <ol>
                    {out.topUplifters.map((d: any) => (
                      <li key={d.index}>
                        Q{d.index + 1}: {QUESTIONS[d.index]} — <b>{d.score}</b>
                        {d.note ? <span> · <i>{d.note}</i></span> : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="footer-note">No items yet.</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="label">What to focus on</div>
              <ul>
                <li>
                  Pick <b>one low-scoring area</b> to improve first. Make a concrete, tiny, daily action.
                </li>
                <li>
                  Protect <b>one high-scoring area</b> (your uplifter). Schedule it; don’t leave it to chance.
                </li>
                <li>
                  Re-run this in a week and note the change in your Final LMI.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
