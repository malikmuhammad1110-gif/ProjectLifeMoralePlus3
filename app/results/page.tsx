"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

type Item = {
  index: number;
  score: number;
  note?: string;
};

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

function getStateOfLife(score: number, eli: number = 5) {
  if (score >= 7.8) {
    return {
      title: "Aligned Growth",
      color: "var(--teal)",
      description:
        "Your current systems appear relatively aligned. Momentum, recovery, and meaning are reinforcing each other more than competing.",
    };
  }

  if (score >= 6.8 && eli <= 4) {
    return {
      title: "High Pressure / High Meaning",
      color: "var(--primaryA)",
      description:
        "You appear to be carrying meaningful responsibility under pressure. Direction is helping sustain you through stress.",
    };
  }

  if (score >= 6.0) {
    return {
      title: "Stable Momentum",
      color: "var(--primaryA)",
      description:
        "Your foundation appears relatively stable, though some systems may still require refinement and better recovery balance.",
    };
  }

  if (score >= 5.0 && eli <= 4) {
    return {
      title: "Purpose-Driven Pressure",
      color: "var(--amber)",
      description:
        "Purpose and obligation may currently be compensating for emotional fatigue or overload.",
    };
  }

  if (score >= 4.5) {
    return {
      title: "Emotional Drag",
      color: "var(--amber)",
      description:
        "Certain unresolved pressures or emotional leaks may be reducing your morale more than you consciously realize.",
    };
  }

  if (score >= 3.5) {
    return {
      title: "Rebuilding Phase",
      color: "var(--rose)",
      description:
        "Your current season may involve recalibration, emotional rebuilding, or restructuring multiple parts of life at once.",
    };
  }

  return {
    title: "Recovery Deficit",
    color: "var(--rose)",
    description:
      "Your system appears heavily strained. Restoration and stabilization may currently matter more than optimization.",
  };
}

export default function ResultsPage() {
  const router = useRouter();

  const [result, setResult] = useState<any | null>(null);
  const [input, setInput] = useState<any | null>(null);

  useEffect(() => {
    const rawR = localStorage.getItem("LMI_RESULT");
    const rawI = localStorage.getItem("LMI_INPUT");

    if (rawR) setResult(JSON.parse(rawR));
    if (rawI) setInput(JSON.parse(rawI));
  }, []);

  const final =
    typeof result?.finalLMI === "number"
      ? result.finalLMI
      : 0;

  const raw =
    typeof result?.rawLMS === "number"
      ? result.rawLMS
      : 0;

  const riAdjusted =
    typeof result?.riAdjusted === "number"
      ? result.riAdjusted
      : 0;

  const state = getStateOfLife(
    final,
    input?.ELI ?? 5
  );

  const pct = useMemo(() => {
    return Math.round((final / 8.75) * 100);
  }, [final]);

  if (!result) {
    return (
      <main className="main center">
        <div className="card center">
          <LogoPLM size={56} />

          <h1>No PLM+ Report Yet</h1>

          <p className="muted">
            Complete the reflection to generate your
            Life Morale report.
          </p>

          <button
            className="btn primary"
            onClick={() => router.push("/survey")}
          >
            Start Reflection →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main grid" style={{ gap: 24 }}>
      <section
        className="card"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "42px 30px",
          background:
            "radial-gradient(circle at top left, rgba(52,211,153,.32), transparent 30%), linear-gradient(135deg,#fafff8,#ecfdf5)",
        }}
      >
        <LogoPLM size={56} />

        <div
          className="pill"
          style={{
            marginTop: 22,
            width: "fit-content",
          }}
        >
          Your Life Morale Report
        </div>

        <h1
          style={{
            fontSize: "clamp(48px,8vw,88px)",
            lineHeight: 0.95,
            margin: "22px 0 14px",
          }}
        >
          {final.toFixed(2)}
        </h1>

        <p
          className="muted"
          style={{
            fontSize: 20,
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          This score reflects how your emotional load,
          recovery, purpose, relationships, pressure,
          and daily life systems are currently interacting.
        </p>

        <div style={{ marginTop: 26 }}>
          <div className="progress" style={{ height: 16 }}>
            <div style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="kpi" style={{ marginTop: 24 }}>
          <div className="pill">
            Final LMI: {final.toFixed(2)}
          </div>

          <div className="pill">
            Raw LMS: {raw.toFixed(2)}
          </div>

          <div className="pill">
            RI Adjusted: {riAdjusted.toFixed(2)}
          </div>

          {input?.estimatedTotalHours && (
            <div className="pill">
              Life Density:{" "}
              {input.estimatedTotalHours} hrs
            </div>
          )}

          {input?.ELI && (
            <div className="pill">
              ELI: {input.ELI}
            </div>
          )}
        </div>
      </section>

      <section
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,118,110,.96), rgba(52,211,153,.92))",
          color: "white",
          padding: "40px 30px",
        }}
      >
        <div
          className="label"
          style={{
            color: "rgba(255,255,255,.72)",
          }}
        >
          Current State of Life
        </div>

        <h2
          style={{
            fontSize: "clamp(36px,6vw,72px)",
            marginBottom: 12,
            color: "white",
          }}
        >
          {state.title}
        </h2>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.75,
            maxWidth: 760,
            opacity: 0.92,
          }}
        >
          {state.description}
        </p>
      </section>

      <section className="grid cols-2">
        <div className="card">
          <div className="label">Top Drainers</div>

          <h2>Where morale may be leaking</h2>

          <div className="grid" style={{ gap: 12 }}>
            {result?.topDrainers?.map(
              (item: Item, i: number) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    background: "#fff8f4",
                  }}
                >
                  <div
                    className="pill"
                    style={{
                      width: "fit-content",
                    }}
                  >
                    Score {item.score}/10
                  </div>

                  <h3>
                    {QUESTIONS[item.index]}
                  </h3>

                  <p className="muted">
                    {item.note ||
                      "This area may currently be creating emotional drag."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="card">
          <div className="label">Top Uplifters</div>

          <h2>What is helping sustain you</h2>

          <div className="grid" style={{ gap: 12 }}>
            {result?.topUplifters?.map(
              (item: Item, i: number) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    background: "#f0fff8",
                  }}
                >
                  <div
                    className="pill"
                    style={{
                      width: "fit-content",
                    }}
                  >
                    Score {item.score}/10
                  </div>

                  <h3>
                    {QUESTIONS[item.index]}
                  </h3>

                  <p className="muted">
                    {item.note ||
                      "This area is currently supporting your morale."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="card center">
        <h2
          style={{
            fontSize: "clamp(32px,5vw,54px)",
            marginTop: 0,
          }}
        >
          Your score is only the beginning.
        </h2>

        <p
          className="muted"
          style={{
            maxWidth: 720,
            margin: "0 auto 24px",
            lineHeight: 1.7,
            fontSize: 18,
          }}
        >
          PLM+ is designed to help reveal the hidden
          interaction between emotional load, recovery,
          purpose, time, pressure, and life structure.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            className="btn primary"
            onClick={() =>
              router.push("/next-steps")
            }
          >
            View My Next Steps →
          </button>

          <button
            className="btn ghost"
            onClick={() =>
              router.push("/survey")
            }
          >
            Retake Reflection
          </button>
        </div>
      </section>
    </main>
  );
}
