"use client";

import { useEffect, useMemo, useState } from "react";
import LogoPLM from "@/components/LogoPLM";

type Slide = {
  category: string;
  icon: string;
  title: string;
  message: string;
  actions: string[];
  mood: string;
  gradient: string;
};

function getStateOfLife(score: number, eli: number = 5) {
  if (score >= 7.8) {
    return {
      title: "Aligned Growth",
      mood: "Alignment",
      icon: "🌿",
      message:
        "Your current systems appear relatively aligned. Momentum, recovery, and meaning are reinforcing each other more than competing.",
    };
  }

  if (score >= 6.8 && eli <= 4) {
    return {
      title: "High Pressure / High Meaning",
      mood: "Endurance",
      icon: "⚡",
      message:
        "You appear to be carrying meaningful responsibility under pressure. Direction is helping sustain you through stress.",
    };
  }

  if (score >= 6.0) {
    return {
      title: "Stable Momentum",
      mood: "Stability",
      icon: "🧭",
      message:
        "Your foundation appears relatively stable, though some systems may still require refinement and better recovery balance.",
    };
  }

  if (score >= 5.0 && eli <= 4) {
    return {
      title: "Purpose-Driven Pressure",
      mood: "Pressure",
      icon: "💭",
      message:
        "Purpose and obligation may currently be compensating for emotional fatigue or overload.",
    };
  }

  if (score >= 4.5) {
    return {
      title: "Emotional Drag",
      mood: "Weight",
      icon: "〰️",
      message:
        "Certain unresolved pressures or emotional leaks may be reducing your morale more than you consciously realize.",
    };
  }

  if (score >= 3.5) {
    return {
      title: "Rebuilding Phase",
      mood: "Recovery",
      icon: "🛠️",
      message:
        "Your current season may involve recalibration, emotional rebuilding, or restructuring multiple parts of life at once.",
    };
  }

  return {
    title: "Recovery Deficit",
    mood: "Restoration",
    icon: "🌙",
    message:
      "Your system appears heavily strained. Restoration and stabilization may currently matter more than optimization.",
  };
}

const SLIDES: Slide[] = [
  {
    category: "Life Systems",
    icon: "🌿",
    title: "Your Life Systems Are Interacting",
    mood: "Clarity",
    message:
      "PLM+ measures how emotional load, relationships, work pressure, recovery, purpose, and daily responsibilities interact beneath the surface of your life.",
    actions: [
      "Identify which systems stabilize you emotionally.",
      "Notice where emotional pressure spills into other areas.",
      "Focus on improving one high-impact system first.",
    ],
    gradient:
      "linear-gradient(135deg,#022c22,#065f46,#10b981,#a7f3d0)",
  },

  {
    category: "Relationships",
    icon: "💚",
    title: "Connection & Emotional Carryover",
    mood: "Attachment",
    message:
      "Relationships often influence work, stress, sleep, motivation, and emotional resilience more than people consciously realize.",
    actions: [
      "Protect emotionally safe relationships.",
      "Reduce repetitive emotional conflict.",
      "Notice who restores versus drains your nervous system.",
    ],
    gradient:
      "linear-gradient(135deg,#064e3b,#047857,#34d399,#d1fae5)",
  },

  {
    category: "Work Pressure",
    icon: "💵",
    title: "Pressure, Responsibility & Stability",
    mood: "Pressure",
    message:
      "Financial and work pressure consume mental bandwidth long before they visibly affect external success or material comfort.",
    actions: [
      "Reduce one recurring pressure point.",
      "Improve predictability before chasing luxury.",
      "Build systems that protect emotional recovery.",
    ],
    gradient:
      "linear-gradient(135deg,#14532d,#15803d,#4ade80,#dcfce7)",
  },

  {
    category: "Recovery",
    icon: "🛌",
    title: "Recovery Shapes Perception",
    mood: "Restoration",
    message:
      "When recovery drops too low, even manageable problems begin to feel emotionally overwhelming. Exhaustion distorts interpretation.",
    actions: [
      "Prioritize sleep consistency.",
      "Protect at least one calm period daily.",
      "Reduce overstimulation before sleep.",
    ],
    gradient:
      "linear-gradient(135deg,#0f172a,#164e63,#0f766e,#99f6e4)",
  },

  {
    category: "Purpose",
    icon: "🧭",
    title: "Direction Creates Endurance",
    mood: "Meaning",
    message:
      "Purpose increases resilience, but purpose alone cannot sustainably compensate for emotional overload or burnout forever.",
    actions: [
      "Reconnect effort to identity.",
      "Clarify what you are building toward.",
      "Support ambition structurally, not emotionally alone.",
    ],
    gradient:
      "linear-gradient(135deg,#134e4a,#0d9488,#2dd4bf,#fef3c7)",
  },

  {
    category: "Life Density",
    icon: "⚡",
    title: "Some Systems Overlap",
    mood: "Systems Thinking",
    message:
      "One hour of life can affect multiple systems simultaneously. Work can influence relationships. Relationships can influence recovery. PLM+ models those overlaps.",
    actions: [
      "Reduce unnecessary emotional friction.",
      "Notice where stress leaks across systems.",
      "Focus on changes that improve multiple areas at once.",
    ],
    gradient:
      "linear-gradient(135deg,#022c22,#047857,#10b981,#fef9c3)",
  },

  {
    category: "Next Move",
    icon: "🚀",
    title: "Small Adjustments Compound",
    mood: "Momentum",
    message:
      "You do not need to rebuild your entire life immediately. Small structural improvements across recovery, relationships, pressure, and purpose compound over time.",
    actions: [
      "Choose one realistic improvement this week.",
      "Reduce one recurring emotional drain.",
      "Retake PLM+ later and compare system shifts.",
    ],
    gradient:
      "linear-gradient(135deg,#052e2b,#0f766e,#14b8a6,#ccfbf1)",
  },
];

export default function NextStepsPage() {
  const [index, setIndex] = useState(0);
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

  const dynamicState = getStateOfLife(
    final,
    input?.ELI ?? 5
  );

  const dynamicSlides = [...SLIDES];

  dynamicSlides[0] = {
    ...dynamicSlides[0],
    title: dynamicState.title,
    mood: dynamicState.mood,
    icon: dynamicState.icon,
    message: dynamicState.message,
  };

  const slide = dynamicSlides[index];

  const progress = useMemo(
    () =>
      Math.round(
        ((index + 1) / dynamicSlides.length) * 100
      ),
    [index, dynamicSlides.length]
  );

  return (
    <main className="main grid" style={{ gap: 24 }}>
      <section
        className="card"
        style={{
          minHeight: 760,
          position: "relative",
          overflow: "hidden",
          background: slide.gradient,
          color: "white",
          padding: "42px 34px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,.22), transparent 28%), radial-gradient(circle at 80% 10%, rgba(255,255,255,.14), transparent 30%), radial-gradient(circle at 50% 90%, rgba(255,255,255,.08), transparent 32%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -10,
            top: 10,
            fontSize: 260,
            opacity: 0.12,
          }}
        >
          {slide.icon}
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <LogoPLM size={46} />

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.14)",
                  fontWeight: 800,
                }}
              >
                {slide.mood}
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.14)",
                  fontWeight: 800,
                }}
              >
                {index + 1}/{dynamicSlides.length}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <div
              style={{
                display: "inline-flex",
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,.14)",
                marginBottom: 20,
                fontWeight: 800,
              }}
            >
              {slide.category}
            </div>

            <h1
              style={{
                fontSize: "clamp(46px,7vw,90px)",
                lineHeight: 0.95,
                margin: "0 0 22px",
                maxWidth: 900,
              }}
            >
              {slide.title}
            </h1>

            <p
              style={{
                fontSize: 22,
                lineHeight: 1.7,
                maxWidth: 760,
                opacity: 0.94,
              }}
            >
              {slide.message}
            </p>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gap: 14,
            marginTop: 30,
          }}
        >
          {slide.actions.map((action, i) => (
            <div
              key={i}
              style={{
                padding: "18px 18px",
                borderRadius: 22,
                background: "rgba(255,255,255,.12)",
                backdropFilter: "blur(14px)",
                fontSize: 17,
                lineHeight: 1.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  opacity: 0.7,
                  marginRight: 8,
                }}
              >
                0{i + 1}
              </span>

              {action}
            </div>
          ))}
        </div>
      </section>

      <section
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn ghost"
          onClick={() => {
            if (index === 0) {
              window.location.href = "/results";
            } else {
              setIndex((i) =>
                Math.max(0, i - 1)
              );
            }
          }}
        >
          {index === 0
            ? "Back to Results"
            : "Previous"}
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          {dynamicSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? 36 : 10,
                height: 10,
                borderRadius: 999,
                border: "none",
                background:
                  i === index
                    ? "var(--primaryA)"
                    : "rgba(15,118,110,.18)",
                transition: ".25s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {index < dynamicSlides.length - 1 ? (
          <button
            className="btn primary"
            onClick={() =>
              setIndex((i) =>
                Math.min(
                  dynamicSlides.length - 1,
                  i + 1
                )
              )
            }
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn primary"
            onClick={() =>
              (window.location.href = "/survey")
            }
          >
            Retake PLM+
          </button>
        )}
      </section>
    </main>
  );
}
