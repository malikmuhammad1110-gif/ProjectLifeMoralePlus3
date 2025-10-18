"use client";

import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

export default function Home() {
  const router = useRouter();

  return (
    <main className="grid" style={{ gap: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* Brand Header */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #E9F9F3, #F0FFFA)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "24px 28px",
        }}
      >
        <LogoPLM size={52} wordmark />
        <button
          className="btn primary"
          onClick={() => router.push("/survey")}
        >
          Start Life Morale Survey →
        </button>
      </div>

      {/* Welcome Section */}
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Welcome to PLM+</h1>
        <p className="muted" style={{ marginBottom: 12 }}>
          PLM+ (Project Life Morale) helps you visualize your quality of life — not as a single number,
          but as a living system of time, emotion, and balance.
        </p>
        <ul style={{ marginTop: 0, marginBottom: 10 }}>
          <li>🧭 Discover how your time and mindset shape your week.</li>
          <li>⚖️ Identify what drains or uplifts your energy.</li>
          <li>📈 Track your progress and make subtle, sustainable improvements.</li>
        </ul>
        <p className="muted" style={{ marginTop: 10 }}>
          No fluff. No therapy jargon. Just a realistic reflection of your life morale — built from your own data.
        </p>
        <button
          className="btn"
          style={{ marginTop: 16 }}
          onClick={() => router.push("/survey")}
        >
          Take the Survey
        </button>
      </div>

      {/* How It Works Section */}
      <div className="card">
        <div className="label">How it works</div>
        <p>
          The Life Morale Index (LMI) combines your responses to 24 key life areas and a simple
          168-hour time map. Your answers are weighted by two forces:
        </p>
        <ul style={{ marginTop: 6 }}>
          <li><b>RI (Residual Influence)</b> — how much each part of life spills into the rest of your day.</li>
          <li><b>ELI (Emotional Load Index)</b> — your current emotional “weather” that lifts or lowers your overall ceiling.</li>
        </ul>
        <p style={{ marginTop: 6 }}>
          Your final LMI is scaled on a realistic range of 0–8.75 (since no life is a perfect 10),
          and turns into your personalized snapshot of balance, growth, and morale.
        </p>
      </div>

      {/* CTA Section */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, var(--primaryA), var(--primaryB))",
          color: "white",
          textAlign: "center",
          padding: "36px 20px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Start Your Life Morale Check</h2>
        <p style={{ opacity: 0.9 }}>
          It only takes 5–7 minutes to complete — and you’ll get a full breakdown of your
          personal morale score, top uplifters, and drainers.
        </p>
        <button
          className="btn"
          style={{
            background: "white",
            color: "var(--primaryA)",
            marginTop: 12,
            fontWeight: 700,
          }}
          onClick={() => router.push("/survey")}
        >
          Begin →
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "var(--muted)" }}>
        © {new Date().getFullYear()} PLM+ — Project Life Morale
      </div>
    </main>
  );
}
