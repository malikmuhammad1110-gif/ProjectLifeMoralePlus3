"use client";

import { useMemo, useState } from "react";
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

const SLIDES: Slide[] = [
  {
    category: "Overall Morale",
    icon: "🌿",
    title: "Your Life Morale Reflection",
    mood: "Clarity",
    message:
      "PLM+ is not judging your life. It is revealing how your emotional climate, responsibilities, recovery, and direction are interacting beneath the surface.",
    actions: [
      "Notice which areas stabilize you emotionally.",
      "Identify the category carrying the most pressure.",
      "Focus on one realistic adjustment at a time.",
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
      "Relationships can become either emotional anchors or emotional leakage points depending on how much unresolved pressure they carry into the rest of your week.",
    actions: [
      "Protect emotionally safe connections.",
      "Reduce repetitive emotional conflict.",
      "Notice which interactions restore your nervous system.",
    ],
    gradient:
      "linear-gradient(135deg,#064e3b,#047857,#34d399,#d1fae5)",
  },

  {
    category: "Financial Pressure",
    icon: "💵",
    title: "Money & Mental Bandwidth",
    mood: "Pressure",
    message:
      "Financial instability quietly consumes attention, patience, recovery, and emotional flexibility long before it affects material comfort.",
    actions: [
      "Target one financial pressure point first.",
      "Reduce hidden emotional spending.",
      "Build predictability before luxury.",
    ],
    gradient:
      "linear-gradient(135deg,#14532d,#15803d,#4ade80,#dcfce7)",
  },

  {
    category: "Body & Energy",
    icon: "🏋🏽",
    title: "Physical Capacity & Recovery",
    mood: "Strength",
    message:
      "Your body influences how much emotional weight your mind can realistically carry. Recovery changes perception more than most people realize.",
    actions: [
      "Prioritize sleep before optimization.",
      "Use movement to regulate stress.",
      "Aim for consistency, not punishment.",
    ],
    gradient:
      "linear-gradient(135deg,#042f2e,#0f766e,#14b8a6,#ccfbf1)",
  },

  {
    category: "Stress & Recovery",
    icon: "〰️",
    title: "Recovery Reserves",
    mood: "Restoration",
    message:
      "When recovery drops too low, life begins to feel heavier than it objectively is. Exhaustion distorts emotional interpretation.",
    actions: [
      "Protect at least one calm period daily.",
      "Reduce overstimulation before sleep.",
      "Treat recovery as maintenance, not reward.",
    ],
    gradient:
      "linear-gradient(135deg,#0f172a,#164e63,#0f766e,#99f6e4)",
  },

  {
    category: "Purpose",
    icon: "🧭",
    title: "Direction & Meaning",
    mood: "Identity",
    message:
      "Purpose creates endurance, but purpose alone cannot sustainably compensate for exhaustion, imbalance, or emotional overload forever.",
    actions: [
      "Reconnect effort to long-term identity.",
      "Clarify what you are building toward.",
      "Make sure ambition is supported structurally.",
    ],
    gradient:
      "linear-gradient(135deg,#134e4a,#0d9488,#2dd4bf,#fef3c7)",
  },

  {
    category: "Next Move",
    icon: "⚡",
    title: "Highest ROI Next Step",
    mood: "Momentum",
    message:
      "The goal is not to repair your entire life instantly. The goal is to identify the smallest realistic shift that improves multiple systems simultaneously.",
    actions: [
      "Choose one category to improve this week.",
      "Reduce one repeating source of emotional drag.",
      "Retake PLM+ later and compare patterns.",
    ],
    gradient:
      "linear-gradient(135deg,#022c22,#047857,#10b981,#fef9c3)",
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
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,.22), transparent 28%), radial-gradient(circle at 80% 10%, rgba(255,255,255,.14), transparent 30%), radial-gradient(circle at 50% 90%, rgba(255,255,255,.08), transparent 32%)",
          }}
        />

        {/* Huge icon */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: 10,
            fontSize: 260,
            opacity: 0.12,
            filter: "blur(.4px)",
          }}
        >
          {slide.icon}
        </div>

        {/* Top */}
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
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.14)",
                  border: "1px solid rgba(255,255,255,.16)",
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
                  border: "1px solid rgba(255,255,255,.16)",
                  fontWeight: 800,
                }}
              >
                {index + 1}/{SLIDES.length}
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
                border: "1px solid rgba(255,255,255,.16)",
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

        {/* Action cards */}
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
                border: "1px solid rgba(255,255,255,.16)",
                backdropFilter: "blur(14px)",
                fontSize: 17,
                lineHeight: 1.5,
                fontWeight: 700,
              }}
            >
              <span style={{ opacity: 0.7, marginRight: 8 }}>
                0{i + 1}
              </span>
              {action}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
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
              setIndex((i) => Math.max(0, i - 1));
            }
          }}
        >
          {index === 0 ? "Back to Results" : "Previous"}
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          {SLIDES.map((_, i) => (
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

        {index < SLIDES.length - 1 ? (
          <button
            className="btn primary"
            onClick={() =>
              setIndex((i) => Math.min(SLIDES.length - 1, i + 1))
            }
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn primary"
            onClick={() => (window.location.href = "/survey")}
          >
            Retake PLM+
          </button>
        )}
      </section>
    </main>
  );
}
