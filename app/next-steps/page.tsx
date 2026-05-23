"use client";

import { useMemo, useState } from "react";
import LogoPLM from "@/components/LogoPLM";

type Slide = {
  category: string;
  icon: string;
  title: string;
  message: string;
  actions: string[];
  gradient: string;
};

const SLIDES: Slide[] = [
  {
    category: "Overall Morale",
    icon: "🌿",
    title: "Your Life Morale Reflection",
    message:
      "PLM+ is not judging your life. It is showing where your energy, pressure, meaning, and recovery are interacting.",
    actions: [
      "Notice your strongest support system.",
      "Identify the category creating the most drag.",
      "Choose one realistic change, not five.",
    ],
    gradient: "linear-gradient(135deg,#064e3b,#059669,#a7f3d0)",
  },
  {
    category: "Relationships",
    icon: "💚",
    title: "Connection & Emotional Weight",
    message:
      "Relationships can be a source of strength, but they can also carry emotional residue into the rest of your week.",
    actions: [
      "Protect time for the people who refill you.",
      "Reduce repeated conflict where possible.",
      "Be honest about which connections drain you.",
    ],
    gradient: "linear-gradient(135deg,#065f46,#10b981,#d1fae5)",
  },
  {
    category: "Financial Pressure",
    icon: "💵",
    title: "Money & Mental Bandwidth",
    message:
      "Financial pressure does not only affect your wallet. It can quietly consume focus, patience, sleep, and emotional flexibility.",
    actions: [
      "Pick one bill, debt, or expense to attack first.",
      "Create a weekly cash-flow check-in.",
      "Separate survival spending from status spending.",
    ],
    gradient: "linear-gradient(135deg,#14532d,#22c55e,#dcfce7)",
  },
  {
    category: "Health & Energy",
    icon: "🏋🏽",
    title: "Body, Confidence & Physical Fuel",
    message:
      "Your physical condition affects how much pressure your mind can carry. Better energy usually creates better emotional range.",
    actions: [
      "Prioritize protein, hydration, and sleep basics.",
      "Choose consistency over punishment workouts.",
      "Track energy, not just weight.",
    ],
    gradient: "linear-gradient(135deg,#064e3b,#14b8a6,#ccfbf1)",
  },
  {
    category: "Recovery",
    icon: "〰️",
    title: "Sleep, Stress & Recovery Reserves",
    message:
      "When recovery is low, life can feel heavier than it objectively is. Your system needs restoration, not just motivation.",
    actions: [
      "Set one fixed wind-down routine.",
      "Reduce late-night stimulation when possible.",
      "Treat rest as maintenance, not laziness.",
    ],
    gradient: "linear-gradient(135deg,#0f172a,#0f766e,#99f6e4)",
  },
  {
    category: "Purpose",
    icon: "🧭",
    title: "Direction & Meaning",
    message:
      "Purpose can help you endure hard seasons, but it should not become the only thing compensating for exhaustion.",
    actions: [
      "Clarify what you are building toward.",
      "Connect daily effort to long-term identity.",
      "Make sure ambition is supported by recovery.",
    ],
    gradient: "linear-gradient(135deg,#134e4a,#0d9488,#fef3c7)",
  },
  {
    category: "Next Move",
    icon: "⚡",
    title: "Highest ROI Next Step",
    message:
      "The goal is not to fix your whole life at once. The goal is to find the smallest realistic change that improves multiple areas.",
    actions: [
      "Choose one category to improve this week.",
      "Choose one habit to reduce emotional drag.",
      "Retake PLM+ after 7 days and compare.",
    ],
    gradient: "linear-gradient(135deg,#052e2b,#059669,#fef9c3)",
  },
];

export default function NextStepsPage() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const progress = useMemo(
    () => Math.round(((index + 1) / SLIDES.length) * 100),
    [index]
  );

  return (
    <div className="main grid" style={{ gap: 20 }}>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoPLM size={40} />
          <h1 style={{ margin: 0 }}>Next Steps For You</h1>
        </div>

        <div className="card" style={{ minWidth: 180 }}>
          <div className="label">Reflection Progress</div>
          <div className="progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {index + 1} of {SLIDES.length}
          </div>
        </div>
      </div>

      <section
        className="card"
        style={{
          minHeight: 520,
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          background: slide.gradient,
          display: "grid",
          alignItems: "end",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.28), transparent 28%), radial-gradient(circle at 80% 10%, rgba(255,255,255,.16), transparent 30%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -20,
            top: 30,
            fontSize: 180,
            opacity: 0.18,
            filter: "blur(.2px)",
          }}
        >
          {slide.icon}
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.18)",
              border: "1px solid rgba(255,255,255,.25)",
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            {slide.category}
          </div>

          <h2 style={{ fontSize: 42, lineHeight: 1.05, margin: "0 0 14px" }}>
            {slide.title}
          </h2>

          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.95 }}>
            {slide.message}
          </p>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 10,
            }}
          >
            {slide.actions.map((action, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,.16)",
                  border: "1px solid rgba(255,255,255,.22)",
                  backdropFilter: "blur(10px)",
                  fontWeight: 700,
                }}
              >
                {i + 1}. {action}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
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
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Back
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === index ? 28 : 10,
                height: 10,
                borderRadius: 999,
                border: "none",
                background: i === index ? "var(--primaryA)" : "var(--border)",
                cursor: "pointer",
                transition: ".2s ease",
              }}
            />
          ))}
        </div>

        {index < SLIDES.length - 1 ? (
          <button
            className="btn primary"
            onClick={() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1))}
          >
            Next Slide
          </button>
        ) : (
          <button
            className="btn primary"
            onClick={() => (window.location.href = "/survey")}
          >
            Retake PLM+
          </button>
        )}
      </div>
    </div>
  );
}
