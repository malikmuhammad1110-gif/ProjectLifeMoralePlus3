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

const LIFE_SYSTEMS = [
  {
    category: "Sleep",
    question: "How much sleep and recovery do you usually get weekly?",
    options: [
      { label: "Severely sleep deprived", detail: "Under 35 hrs", hours: 30 },
      { label: "Below ideal", detail: "35–49 hrs", hours: 42 },
      { label: "Healthy range", detail: "49–63 hrs", hours: 56 },
      { label: "High recovery", detail: "63–80 hrs", hours: 70 },
    ],
  },
  {
    category: "Work",
    question: "How much of your week revolves around work responsibilities?",
    options: [
      { label: "Minimal work demand", detail: "0–15 hrs", hours: 8 },
      { label: "Part-time rhythm", detail: "15–30 hrs", hours: 22 },
      { label: "Full-time rhythm", detail: "30–45 hrs", hours: 40 },
      { label: "Heavy workload", detail: "45–65+ hrs", hours: 55 },
    ],
  },
  {
    category: "Relationships",
    question: "How much meaningful time do you spend socially or relationally?",
    options: [
      { label: "Nearly isolated", detail: "0–5 hrs", hours: 3 },
      { label: "Limited connection", detail: "5–15 hrs", hours: 10 },
      { label: "Consistent connection", detail: "15–35 hrs", hours: 25 },
      { label: "Deeply socially engaged", detail: "35+ hrs", hours: 45 },
    ],
  },
  {
    category: "Commute",
    question: "How much time does travel or commuting consume weekly?",
    options: [
      { label: "Minimal travel burden", detail: "0–5 hrs", hours: 3 },
      { label: "Moderate commuting", detail: "5–15 hrs", hours: 10 },
      { label: "Heavy commuting", detail: "15–30 hrs", hours: 22 },
      { label: "Travel dominates routine", detail: "30+ hrs", hours: 35 },
    ],
  },
  {
    category: "Leisure",
    question: "How much time do you spend on relaxation, hobbies, or enjoyment?",
    options: [
      { label: "Almost none", detail: "0–5 hrs", hours: 3 },
      { label: "Limited leisure", detail: "5–15 hrs", hours: 10 },
      { label: "Balanced leisure", detail: "15–30 hrs", hours: 22 },
      { label: "Leisure is a major part of life", detail: "30+ hrs", hours: 38 },
    ],
  },
  {
    category: "Health",
    question: "How much time goes toward fitness, health, movement, or self-care?",
    options: [
      { label: "Very little", detail: "0–3 hrs", hours: 2 },
      { label: "Light effort", detail: "3–7 hrs", hours: 5 },
      { label: "Consistent routine", detail: "7–12 hrs", hours: 9 },
      { label: "Health is a major focus", detail: "12+ hrs", hours: 15 },
    ],
  },
  {
    category: "Chores",
    question: "How much time do responsibilities like errands, cleaning, or admin take?",
    options: [
      { label: "Very low", detail: "0–3 hrs", hours: 2 },
      { label: "Manageable", detail: "3–8 hrs", hours: 6 },
      { label: "Heavy", detail: "8–15 hrs", hours: 12 },
      { label: "Constant maintenance", detail: "15+ hrs", hours: 20 },
    ],
  },
  {
    category: "Growth",
    question: "How much time do you spend learning, building, creating, or improving?",
    options: [
      { label: "Almost none", detail: "0–3 hrs", hours: 2 },
      { label: "Light growth", detail: "3–8 hrs", hours: 6 },
      { label: "Consistent growth", detail: "8–15 hrs", hours: 12 },
      { label: "Major growth season", detail: "15+ hrs", hours: 22 },
    ],
  },
  {
    category: "Other",
    question: "How much time goes into things not captured above?",
    options: [
      { label: "Almost none", detail: "0–5 hrs", hours: 3 },
      { label: "Some overflow", detail: "5–15 hrs", hours: 10 },
      { label: "Noticeable amount", detail: "15–30 hrs", hours: 22 },
      { label: "Major uncategorized time", detail: "30+ hrs", hours: 35 },
    ],
  },
];

const DEFAULT_TIME: TimeRow[] = LIFE_SYSTEMS.map((system) => ({
  category: system.category,
  hours: system.options[1].hours,
  ri: 5,
}));

export default function SurveyPage() {
  const router = useRouter();

  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from({ length: 24 }, () => ({ score: 0 }))
  );

  const [timeMap, setTimeMap] = useState<TimeRow[]>(DEFAULT_TIME);
  const [lifeSelections, setLifeSelections] = useState(
    LIFE_SYSTEMS.map(() => 1)
  );

  const [ELI, setELI] = useState<number>(5);
  const [crossLift] = useState(true);
  const [riMult] = useState(1);
  const [calMax] = useState(8.75);

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

  const estimatedPressure =
    totalHours <= 168
      ? "Within normal weekly range"
      : "High overlap / heavy life density";

  const setScore = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { score: v };
    setAnswers(next);
  };

  const setRI = (i: number, v: number) => {
    const next = [...timeMap];
    next[i] = { ...next[i], ri: v };
    setTimeMap(next);
  };

  const selectLifeSystem = (systemIndex: number, optionIndex: number) => {
    const nextSelections = [...lifeSelections];
    nextSelections[systemIndex] = optionIndex;
    setLifeSelections(nextSelections);

    const system = LIFE_SYSTEMS[systemIndex];
    const option = system.options[optionIndex];

    const nextTimeMap = [...timeMap];
    nextTimeMap[systemIndex] = {
      ...nextTimeMap[systemIndex],
      hours: option.hours,
    };

    setTimeMap(nextTimeMap);
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
      localStorage.setItem(
        "LMI_INPUT",
        JSON.stringify({
          ELI,
          lifeSystems: timeMap,
          estimatedTotalHours: totalHours,
        })
      );

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
            <div key={globalIndex} className="card" style={{ padding: "26px 22px" }}>
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

                <div className="pill" style={{ fontSize: 16, padding: "10px 14px" }}>
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
                onChange={(e) => setScore(globalIndex, Number(e.target.value))}
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
                  i === section ? "var(--primaryA)" : "rgba(15,118,110,.18)",
                transition: ".2s ease",
              }}
            />
          ))}
        </div>

        {section < SECTIONS.length - 1 ? (
          <button
            className="btn primary"
            onClick={() => setSection((s) => Math.min(SECTIONS.length - 1, s + 1))}
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn primary"
            onClick={() =>
              document.getElementById("life-system-map")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Continue to Life System Map →
          </button>
        )}
      </section>

      <section id="life-system-map" className="card" style={{ padding: "36px 24px" }}>
        <div className="label">Life System Mapping</div>

        <h2 style={{ marginTop: 10 }}>
          How does your week actually feel structured?
        </h2>

        <p className="muted" style={{ maxWidth: 760 }}>
          Instead of manually calculating 168 hours, PLM+ estimates your life
          structure through guided ranges. Some systems overlap, and that is
          part of the model.
        </p>

        <div className="kpi" style={{ marginTop: 18 }}>
          <div className="pill">
            <b>Estimated density:</b> {totalHours} hrs
          </div>
          <div className="pill">
            <b>Signal:</b> {estimatedPressure}
          </div>
        </div>

        <div style={{ display: "grid", gap: 24, marginTop: 30 }}>
          {LIFE_SYSTEMS.map((system, systemIndex) => (
            <div key={system.category} className="card" style={{ padding: "24px 20px" }}>
              <div className="label">{system.category}</div>

              <h3 style={{ marginTop: 10, fontSize: 26 }}>{system.question}</h3>

              <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
                {system.options.map((option, optionIndex) => {
                  const active = lifeSelections[systemIndex] === optionIndex;

                  return (
                    <button
                      key={option.label}
                      onClick={() => selectLifeSystem(systemIndex, optionIndex)}
                      style={{
                        textAlign: "left",
                        padding: "18px 18px",
                        borderRadius: 22,
                        border: active
                          ? "2px solid var(--primaryA)"
                          : "1px solid var(--border)",
                        background: active ? "rgba(16,185,129,.08)" : "white",
                        cursor: "pointer",
                        transition: ".2s ease",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        {option.label}
                      </div>

                      <div className="muted" style={{ marginTop: 4 }}>
                        {option.detail}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 24 }}>
                <div className="label">Residual Influence</div>

                <p className="muted" style={{ marginTop: 6 }}>
                  How much does this area emotionally carry into the rest of your life?
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginTop: 12,
                  }}
                >
                  <input
                    className="slider"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={timeMap[systemIndex].ri}
                    onChange={(e) => setRI(systemIndex, Number(e.target.value))}
                  />

                  <div className="pill">{timeMap[systemIndex].ri}/10 RI</div>
                </div>
              </div>
            </div>
          ))}
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
          PLM+ will analyze your answers, emotional load, and life system map
          to generate your personalized morale report.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <button
            className="btn"
            style={{
              background: "white",
              color: "var(--primaryA)",
              fontWeight: 800,
            }}
            disabled={loading}
            onClick={calculate}
          >
            {loading ? "Calculating..." : "Generate My Life Morale →"}
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
