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
    subtitle: "Direction, meaning, identity, and alignment.",
    icon: "🧭",
    start: 0,
    end: 5,
    gradient: "linear-gradient(135deg,#064e3b,#10b981)",
  },
  {
    title: "Relationships & Connection",
    subtitle: "Support, intimacy, connection, and emotional closeness.",
    icon: "💚",
    start: 5,
    end: 10,
    gradient: "linear-gradient(135deg,#065f46,#34d399)",
  },
  {
    title: "Work & Stability",
    subtitle: "Control, routine, finances, and pressure.",
    icon: "💵",
    start: 10,
    end: 15,
    gradient: "linear-gradient(135deg,#14532d,#22c55e)",
  },
  {
    title: "Body & Recovery",
    subtitle: "Health, sleep, energy, and physical sustainability.",
    icon: "🏋🏽",
    start: 15,
    end: 20,
    gradient: "linear-gradient(135deg,#134e4a,#14b8a6)",
  },
  {
    title: "Emotional Climate",
    subtitle: "Stress, calmness, emotional stability, and peace.",
    icon: "〰️",
    start: 20,
    end: 24,
    gradient: "linear-gradient(135deg,#0f172a,#0f766e)",
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

  const [ELI, setELI] = useState<number>(5);
  const [crossLift, setCrossLift] = useState(true);
  const [riMult, setRiMult] = useState(1);
  const [calMax, setCalMax] = useState(8.75);

  const [loading, setLoading] = useState(false);

  const currentSection = SECTIONS[section];

  const currentQuestions = QUESTIONS.slice(
    currentSection.start,
    currentSection.end
  );

  const answered = answers.filter(
    (a) => typeof a.score === "number" && a.score > 0
  ).length;

  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const totalHours = useMemo(
    () => timeMap.reduce((a, b) => a + Number(b.hours || 0), 0),
    [timeMap]
  );

  const remaining = 168 - totalHours;

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

      const data = await res.json();

      localStorage.setItem("LMI_RESULT", JSON.stringify(data));
      localStorage.setItem("LMI_INPUT", JSON.stringify({ ELI }));

      router.push("/results");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main grid" style={{ gap: 24 }}>
      <section
        className="card"
        style={{
          minHeight: 300,
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(52,211,153,.35), transparent 34%), linear-gradient(135deg,#fafff8,#ecfdf5)",
          padding: "40px 28px",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <LogoPLM size={54} />

          <div className="pill" style={{ marginTop: 22 }}>
            Guided Life Reflection
          </div>

          <h1
            style={{
              fontSize: "clamp(42px,7vw,76px)",
              lineHeight: 0.96,
              margin: "20px 0",
              maxWidth: 760,
            }}
          >
            Reflect on the systems shaping your life.
          </h1>

          <p
            className="muted"
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 720,
            }}
          >
            PLM+ measures how purpose, pressure, recovery, emotional climate,
            relationships, and time interact to shape your overall morale.
          </p>

          <div style={{ marginTop: 24, maxWidth: 420 }}>
            <div className="label">Overall Progress</div>

            <div className="progress" style={{ marginTop: 8 }}>
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="muted" style={{ marginTop: 8 }}>
              {progress}% complete
            </div>
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          background: currentSection.gradient,
          color: "white",
          overflow: "hidden",
          position: "relative",
          padding: "34px 28px",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -10,
            fontSize: 180,
            opacity: 0.15,
          }}
        >
          {currentSection.icon}
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.16)",
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            Section {section + 1} of {SECTIONS.length}
          </div>

          <h2
            style={{
              fontSize: "clamp(34px,5vw,56px)",
              margin: "0 0 10px",
            }}
          >
            {currentSection.title}
          </h2>

          <p style={{ fontSize: 18, opacity: 0.92 }}>
            {currentSection.subtitle}
          </p>
        </div>
      </section>

      <section className="grid" style={{ gap: 18 }}>
        {currentQuestions.map((q, localIndex) => {
          const globalIndex = currentSection.start + localIndex;

          const val = answers[globalIndex].score ?? 0;

          return (
            <div
              key={globalIndex}
              className="card"
              style={{
                padding: "26px 22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    maxWidth: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {q}
                </div>

                <div
                  className="pill"
                  style={{
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                >
                  {val}/10
                </div>
              </div>

              <input
                className="slider"
                type="range"
                min={0}
                max={10}
                step={1}
                value={val}
                onChange={(e) =>
                  setScore(globalIndex, Number(e.target.value))
                }
              />
            </div>
          );
        })}
      </section>

      <section
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          className="btn ghost"
          disabled={section === 0}
          onClick={() => setSection((s) => Math.max(0, s - 1))}
        >
          Back
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === section ? 30 : 10,
                height: 10,
                borderRadius: 999,
                background:
                  i === section
                    ? "var(--primaryA)"
                    : "rgba(15,118,110,.18)",
                transition: ".2s ease",
              }}
            />
          ))}
        </div>

        {section < SECTIONS.length - 1 ? (
          <button
            className="btn primary"
            onClick={() =>
              setSection((s) => Math.min(SECTIONS.length - 1, s + 1))
            }
          >
            Continue →
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
            Continue to Time Map →
          </button>
        )}
      </section>

      <section
        id="time-map"
        className="card"
        style={{
          padding: "34px 24px",
        }}
      >
        <div className="label">168-Hour Time Map</div>

        <h2 style={{ marginTop: 10 }}>
          Where is your life energy actually going?
        </h2>

        <p className="muted" style={{ maxWidth: 720 }}>
          Allocate your weekly hours and assign each category a Residual
          Influence score from 1–10.
        </p>

        <div style={{ display: "grid", gap: 14, marginTop: 26 }}>
          {timeMap.map((row, i) => (
            <div key={row.category} className="card">
              <div className="row">
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>
                    {row.category}
                  </div>

                  {row.category !== "Sleep" && (
                    <span className="badge">awake hours</span>
                  )}
                </div>

                <div>
                  <input
                    className="input"
                    type="number"
                    value={row.hours}
                    min={0}
                    onChange={(e) =>
                      setTime(i, "hours", Number(e.target.value || 0))
                    }
                  />

                  <div className="muted" style={{ fontSize: 12 }}>
                    hours
                  </div>
                </div>

                <div>
                  <input
                    className="input"
                    type="number"
                    value={row.ri}
                    min={1}
                    max={10}
                    onChange={(e) =>
                      setTime(i, "ri", Number(e.target.value || 5))
                    }
                  />

                  <div className="muted" style={{ fontSize: 12 }}>
                    RI
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 18,
            fontWeight: 800,
            color:
              remaining === 0
                ? "var(--teal)"
                : remaining > 0
                ? "var(--amber)"
                : "var(--rose)",
          }}
        >
          {remaining === 0
            ? "168/168 hours allocated"
            : remaining > 0
            ? `${remaining} hours remaining`
            : `${-remaining} hours over`}
        </div>
      </section>

      <section
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,118,110,.95), rgba(52,211,153,.92))",
          color: "white",
          padding: "38px 28px",
        }}
      >
        <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
          Final Reflection
        </div>

        <h2
          style={{
            fontSize: "clamp(32px,5vw,56px)",
            marginBottom: 14,
          }}
        >
          Ready to calculate your Life Morale?
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 720,
            opacity: 0.92,
          }}
        >
          PLM+ will analyze your answers, emotional load, and time allocation
          to generate your personalized morale report.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <button
            className="btn"
            style={{
              background: "white",
              color: "var(--primaryA)",
              fontWeight: 800,
            }}
            disabled={loading || remaining !== 0}
            onClick={calculate}
          >
            {loading
              ? "Calculating..."
              : "Generate My Life Morale →"}
          </button>

          <button
            className="btn ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </button>
        </div>
      </section>
    </main>
  );
}
