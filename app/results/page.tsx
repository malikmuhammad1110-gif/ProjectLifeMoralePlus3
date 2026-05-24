"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

type Item = { index: number; score: number; note?: string };

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
  const [input, setInput] = useState<{
    ELI?: number;
    estimatedTotalHours?: number;
  } | null>(null);

  useEffect(() => {
    const rawR = localStorage.getItem("LMI_RESULT");
    const rawI = localStorage.getItem("LMI_INPUT");

    if (rawR) setResult(JSON.parse(rawR));
    if (rawI) setInput(JSON.parse(rawI));
  }, []);

  const MAX = 8.75;

  const final =
    typeof result?.finalLMI === "number" ? result.finalLMI : 0;

  const raw =
    typeof result?.rawLMS === "number" ? result.rawLMS : 0;

  const riAdj =
    typeof result?.riAdjusted === "number"
      ? result.riAdjusted
      : 0;

  const pct = useMemo(() => {
    return Math.round(
      (Math.max(0, Math.min(final, MAX)) / MAX) * 100
    );
  }, [final]);

  function getStateOfLife(score: number, eli: number = 5) {
    if (score >= 7.8) {
      return {
        title: "Aligned Growth",
        color: "var(--teal)",
        description:
          "Your current systems appear relatively aligned. Momentum, recovery, and meaning are supporting each other more than they are competing.",
      };
    }

    if (score >= 6.8 && eli <= 4) {
      return {
        title: "High Pressure / High Meaning",
        color: "var(--primaryA)",
        description:
          "Your life may currently carry significant pressure, but your sense of meaning and direction appears to be sustaining you through it.",
      };
    }

    if (score >= 6.0) {
      return {
        title: "Stable Momentum",
        color: "var(--primaryA)",
        description:
          "Your foundation appears relatively stable, though certain systems may still require refinement or better recovery balance.",
      };
    }

    if (score >= 5.0 && eli <= 4) {
      return {
        title: "Purpose-Driven Pressure",
        color: "var(--amber)",
        description:
          "You may currently be relying on purpose and responsibility to compensate for stress, fatigue, or emotional overload.",
      };
    }

    if (score >= 4.5) {
      return {
        title: "Emotional Drag",
        color: "var(--amber)",
        description:
          "Certain unresolved pressures or energy leaks may be reducing your overall morale more than you consciously realize.",
      };
    }

    if (score >= 3.5) {
      return {
        title: "Rebuilding Phase",
        color: "var(--rose)",
        description:
          "Your current season may involve recovery, recalibration, or restructuring multiple parts of life simultaneously.",
      };
    }

    return {
      title: "Recovery Deficit",
      color: "var(--rose)",
      description:
        "Your system appears heavily strained. The next priority is likely restoration, stabilization, and reducing morale leakage.",
    };
  }

  const stateOfLife = getStateOfLife(final, input?.ELI ?? 5);

  if (!result) {
    return (
      <main className="main grid" style={{ gap: 20 }}>
        <section
          className="card center"
          style={{ padding: "56px 24px" }}
        >
          <LogoPLM size={54} />

          <h1>No results yet</h1>

          <p className="muted">
            Take the PLM+ reflection to generate your
            Life Morale report.
          </p>

          <button
            className="btn primary"
            onClick={() => router.push("/survey")}
          >
            Start Reflection →
          </button>
        </section>
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
          padding: "42px 28px",
          background:
            "radial-gradient(circle at top left, rgba(52,211,153,.34), transparent 34%), linear-gradient(135deg,#fafff8,#ecfdf5)",
        }}
      >
        <LogoPLM size={52} />

        <div
          className="pill"
          style={{ marginTop: 22, width: "fit-content" }}
        >
          Your Life Intelligence Report
        </div>

        <h1
          style={{
            fontSize: "clamp(44px,8vw,84px)",
            lineHeight: 0.95,
            margin: "22px 0 10px",
          }}
        >
          Your Life Morale is {final.toFixed(2)}
        </h1>

        <p
          className="muted"
          style={{
            fontSize: 19,
            lineHeight: 1.65,
            maxWidth: 720,
          }}
        >
          This score reflects how your life systems,
          emotional load, recovery, purpose,
          relationships, and daily pressures are
          currently interacting.
        </p>

        <div
          className="card"
          style={{
            marginTop: 26,
            background:
              "linear-gradient(135deg, rgba(255,255,255,.82), rgba(240,255,248,.92))",
            border:
              "1px solid rgba(52,211,153,.18)",
          }}
        >
          <div className="label">
            Current State of Life
          </div>

          <h2
            style={{
              marginTop: 10,
              marginBottom: 10,
              color: stateOfLife.color,
              fontSize: "clamp(30px,5vw,54px)",
            }}
          >
            {stateOfLife.title}
          </h2>

          <p
            className="muted"
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 760,
              marginBottom: 0,
            }}
          >
            {stateOfLife.description}
          </p>
        </div>

        <div style={{ marginTop: 26 }}>
          <div className="progress" style={{ height: 16 }}>
            <div style={{ width: `${pct}%` }} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            <span>Low</span>
            <span>Building</span>
            <span>Stable</span>
            <span>High</span>
          </div>
        </div>

        <div className="kpi" style={{ marginTop: 24 }}>
          <div className="pill">
            <b>Final LMI:</b> {final.toFixed(2)} / {MAX}
          </div>

          <div className="pill">
            <b>Raw LMS:</b> {raw.toFixed(2)}
          </div>

          <div className="pill">
            <b>RI Adjusted:</b> {riAdj.toFixed(2)}
          </div>

          {typeof input?.estimatedTotalHours === "number" && (
            <div className="pill">
              <b>Life Density:</b> {input.estimatedTotalHours} hrs
            </div>
          )}

          <div
            className="pill"
            style={{ color: stateOfLife.color }}
          >
            <b>{stateOfLife.title}</b>
          </div>

          {typeof input?.ELI === "number" && (
            <div className="pill">
              <b>ELI:</b> {input.ELI}
            </div>
          )}
        </div>
      </section>

      <section className="grid cols-2">
        <div className="card">
          <div className="label">Top Drainers</div>

          <h2>Where your morale is leaking</h2>

          {Array.isArray(result.topDrainers) &&
          result.topDrainers.length ? (
            <div className="grid" style={{ gap: 12 }}>
              {result.topDrainers.map(
                (d: Item, i: number) => {
                  const label =
                    QUESTIONS[d.index] ??
                    `Question ${d.index + 1}`;

                  return (
                    <div
                      key={i}
                      className="card"
                      style={{ background: "#fff8f4" }}
                    >
                      <div
                        className="pill"
                        style={{ width: "fit-content" }}
                      >
                        Score {d.score}/10
                      </div>

                      <h3 style={{ marginBottom: 6 }}>
                        {label}
                      </h3>

                      <p
                        className="muted"
                        style={{ margin: 0 }}
                      >
                        {d.note ||
                          "This area may be creating emotional drag."}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="muted">
              No major drainers detected.
            </p>
          )}
        </div>

        <div className="card">
          <div className="label">Top Uplifters</div>

          <h2>What is carrying you forward</h2>

          {Array.isArray(result.topUplifters) &&
          result.topUplifters.length ? (
            <div className="grid" style={{ gap: 12 }}>
              {result.topUplifters.map(
                (d: Item, i: number) => {
                  const label =
                    QUESTIONS[d.index] ??
                    `Question ${d.index + 1}`;

                  return (
                    <div
                      key={i}
                      className="card"
                      style={{ background: "#f0fff8" }}
                    >
                      <div
                        className="pill"
                        style={{ width: "fit-content" }}
                      >
                        Score {d.score}/10
                      </div>

                      <h3 style={{ marginBottom: 6 }}>
                        {label}
                      </h3>

                      <p
                        className="muted"
                        style={{ margin: 0 }}
                      >
                        {d.note ||
                          "This area is currently supporting your morale."}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="muted">
              No major uplifters detected.
            </p>
          )}
        </div>
      </section>

      <section
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,118,110,.96), rgba(52,211,153,.92))",
          color: "white",
          padding: "42px 28px",
        }}
      >
        <div
          className="label"
          style={{ color: "rgba(255,255,255,.75)" }}
        >
          Interpretation
        </div>

        <h2
          style={{
            fontSize: "clamp(32px,5vw,56px)",
            marginBottom: 12,
          }}
        >
          Your score is only the beginning.
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            maxWidth: 760,
            opacity: 0.92,
          }}
        >
          The next step is understanding how your
          life systems interact — where your morale
          is supported, where emotional pressure
          spills over, and which small adjustments
          may create the highest overall return.
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
              fontWeight: 900,
            }}
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

          <button
            className="btn ghost"
            onClick={() => router.push("/")}
          >
            Home
          </button>
        </div>
      </section>
    </main>
  );
}
