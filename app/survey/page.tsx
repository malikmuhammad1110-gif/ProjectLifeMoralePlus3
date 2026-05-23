"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

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

const SECTIONS = [
  {
    title: "Internal State",
    subtitle: "Direction, meaning, growth, and personal alignment.",
    start: 0,
    end: 5,
  },
  {
    title: "Relationships & Connection",
    subtitle: "Connection, support, intimacy, contribution, and expression.",
    start: 5,
    end: 10,
  },
  {
    title: "Work, Control & Stability",
    subtitle: "Schedule control, work quality, autonomy, routine, and finances.",
    start: 10,
    end: 15,
  },
  {
    title: "Body & Recovery",
    subtitle: "Health, sleep, nutrition, body care, and physical confidence.",
    start: 15,
    end: 20,
  },
  {
    title: "Emotional Climate",
    subtitle: "Stress, calm, hopefulness, and inner peace.",
    start: 20,
    end: 24,
  },
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

  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from({ length: 24 }, () => ({ score: 0 }))
  );
  const [timeMap, setTimeMap] = useState<TimeRow[]>(DEFAULT_TIME);
  const [ELI, setELI] = useState<number>(1);
  const [crossLift, setCrossLift] = useState<boolean>(true);
  const [riMult, setRiMult] = useState<number>(1);
  const [calMax, setCalMax] = useState<number>(8.75);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSection = SECTIONS[section];
  const currentQuestions = QUESTIONS.slice(currentSection.start, currentSection.end);

  const totalHours = useMemo(
    () => timeMap.reduce((a, b) => a + (Number(b.hours) || 0), 0),
    [timeMap]
  );

  const remaining = 168 - totalHours;
  const answered = answers.filter(
    (a) => typeof a.score === "number" && a.score > 0
  ).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const setScore = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { score: v };
    setAnswers(next);
  };

  const setTime = (i: number, field: "hours" | "ri", v: number) => {
    const next = [...timeMap];
    next[i] = { ...next[i], [field]: v };
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
      localStorage.setItem("LMI_INPUT", JSON.stringify({ ELI }));

      router.push("/results");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  const hoursText =
    remaining === 0
      ? "✅ 168/168 — Ready"
      : remaining > 0
      ? `Allocate ${remaining} more`
      : `Over by ${-remaining}`;

  return (
    <div className="main grid" style={{ gap: 20 }}>
      {/* Header */}
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoPLM size={40} />
          <h1 style={{ margin: 0 }}>Life Morale Survey</h1>
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
      <div className="card" style={{ background: "var(--panelTint)" }}>
        <div className="label">
          Rubric
          <span className="info">
            <span className="dot">i</span>
            <span className="tip">
              <b>LMI</b> — Life Morale Index, your final composite score.
              <br />
              <b>RI</b> — Residual Influence: how each activity’s mood lingers
              after doing it.
              <br />
              <b>ELI</b> — Emotional Load Index: your week’s general emotional
              climate.
            </span>
          </span>
        </div>

        <p className="muted" style={{ marginTop: 6 }}>
          PLM+ is not here to judge your life. It is here to help you see where
          your energy is going, what is draining you, and what may realistically
          improve your morale.
        </p>

        <p className="muted" style={{ marginTop: 6, fontWeight: 700 }}>
          Answer honestly, not ideally.
        </p>
      </div>

      <div className="grid cols-2">
        {/* Questions */}
        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <div className="label">
              Section {section + 1} of {SECTIONS.length}
            </div>
            <h3 style={{ marginBottom: 4 }}>{currentSection.title}</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              {currentSection.subtitle}
            </p>
          </div>

          {currentQuestions.map((q, localIndex) => {
            const globalIndex = currentSection.start + localIndex;
            const val = answers[globalIndex].score ?? 0;

            return (
              <div
                key={globalIndex}
                style={{
                  margin: "16px 0 10px",
                  paddingBottom: 8,
                  borderBottom: "1px dashed var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {globalIndex + 1}. {q}
                  </div>
                  <div className="pill">Score: {val}</div>
                </div>

                <input
                  className="slider"
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={val}
                  onChange={(e) => setScore(globalIndex, Number(e.target.value))}
                />
              </div>
            );
          })}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn ghost"
              disabled={section === 0}
              onClick={() => setSection((s) => Math.max(0, s - 1))}
            >
              Back
            </button>

            {section < SECTIONS.length - 1 ? (
              <button
                className="btn primary"
                onClick={() =>
                  setSection((s) => Math.min(SECTIONS.length - 1, s + 1))
                }
              >
                Next Section
              </button>
            ) : (
              <button
                className="btn primary"
                onClick={() =>
                  document
                    .getElementById("time-map")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Continue to Time Map
              </button>
            )}
          </div>
        </div>

        {/* Time Map + Model */}
        <div className="card" id="time-map">
          <h3>168-hour time map</h3>
          <p className="muted" style={{ marginTop: 4 }}>
            Hours per week + RI. Use 5 as neutral.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {timeMap.map((row, i) => (
              <div key={row.category} className="row">
                <div>
                  <b>{row.category}</b>
                  {row.category !== "Sleep" && (
                    <span className="badge">awake</span>
                  )}
                </div>

                <div>
                  <input
                    className="input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="number"
                    min={0}
                    value={row.hours}
                    onChange={(e) =>
                      setTime(i, "hours", Number(e.target.value || 0))
                    }
                  />
                  <div className="muted" style={{ fontSize: 12 }}>
                    hrs
                  </div>
                </div>

                <div>
                  <input
                    className="input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="number"
                    min={1}
                    max={10}
                    value={row.ri}
                    onChange={(e) =>
                      setTime(i, "ri", Number(e.target.value || 5))
                    }
                  />
                  <div className="muted" style={{ fontSize: 12 }}>
                    RI
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              fontWeight: 700,
              color:
                remaining === 0
                  ? "var(--teal)"
                  : remaining > 0
                  ? "var(--amber)"
                  : "var(--rose)",
            }}
          >
            {hoursText}
          </div>

          {/* Model section */}
          <div className="card" style={{ marginTop: 14, background: "#f5fbff" }}>
            <div className="label">
              Model parameters
              <span className="info">
                <span className="dot">i</span>
                <span className="tip">
                  <b>ELI</b> adjusts your total morale ceiling.
                  <br />
                  <b>RI multiplier</b> influences how much energy carries across
                  your week.
                  <br />
                  <b>Cross-lift</b> lets strong areas uplift weaker ones.
                </span>
              </span>
            </div>

            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <label>
                ELI 1–10
                <input
                  className="input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="number"
                  min={1}
                  max={10}
                  value={ELI}
                  onChange={(e) => setELI(Number(e.target.value || 1))}
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

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={crossLift}
                  onChange={(e) => setCrossLift(e.target.checked)}
                />
                Cross-lift active
              </label>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
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
            <div
              className="card"
              style={{
                marginTop: 12,
                background: "#fff6f7",
                borderColor: "#ffd3da",
              }}
            >
              <b style={{ color: "var(--rose)" }}>Error:</b> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
