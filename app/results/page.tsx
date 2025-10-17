"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function badgeFor(score: number) {
  if (score >= 7.5) return { label: "High", color: "linear-gradient(135deg,#b2ecff,#d7ffe8)" };
  if (score >= 6.0) return { label: "Solid", color: "linear-gradient(135deg,#e9f4ff,#f1fff9)" };
  if (score >= 4.5) return { label: "Needs Attention", color: "linear-gradient(135deg,#fff6e5,#fffdf2)" };
  return { label: "Low", color: "linear-gradient(135deg,#ffe5e5,#fff2f2)" };
}

export default function ResultsPage() {
  const router = useRouter();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("lifeMoraleScore") : null;
    setScore(raw ? Number(raw) : null);
  }, []);

  if (score === null || Number.isNaN(score)) {
    return (
      <div className="card">
        <h2>No results yet</h2>
        <p className="footer-note">Take the survey to see your Life Morale score.</p>
        <button className="btn primary" onClick={() => router.push("/survey")}>Start Survey</button>
      </div>
    );
  }

  const band = badgeFor(score);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ background: band.color }}>
        <h1 style={{ marginTop: 0 }}>Your Life Morale</h1>
        <div className="kpi">
          <div className="pill"><b>Score:</b> {score.toFixed(2)} / 8.75</div>
          <div className="pill"><b>Status:</b> {band.label}</div>
        </div>
        <p className="footer-note">
          Your score is scaled so that typical “10s” map to a realistic ceiling of 8.75.
        </p>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="label">What this means</div>
          <p>
            This number reflects your current balance of purpose, relationships, autonomy,
            vitality, and peace. It’s a snapshot — not a verdict. Small, targeted changes
            tend to move it more than trying to fix everything at once.
          </p>
        </div>
        <div className="card">
          <div className="label">Quick next steps</div>
          <ul>
            <li>Pick <b>one</b> daily habit that lifts your energy (walk, stretch, water, sunlight).</li>
            <li>Reduce <b>one</b> recurring stressor (prep, automate, delegate, or say no).</li>
            <li>Do <b>one</b> connection touchpoint today (call, text, gratitude note).</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="label">Run it again</div>
        <p>Re-take the survey after a week or when something changes to see how choices impact your morale.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => router.push("/survey")}>Retake Survey</button>
          <button className="btn" onClick={() => router.push("/")}>Back Home</button>
        </div>
      </div>
    </div>
  );
}
