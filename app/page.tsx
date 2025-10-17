"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="hero">
      <img src="/logo.svg" alt="Life Morale Logo" />
      <div>
        <h1>Project Life Morale Plus</h1>
        <p>
          Life Morale is a reflection of your overall sense of well-being —
          balancing happiness, peace, purpose, and satisfaction across all
          aspects of your daily life. This interactive index helps you measure
          your current state and find ways to raise it.
        </p>
        <button className="btn primary" onClick={() => router.push("/survey")}>
          Start Life Morale Survey →
        </button>
      </div>
    </div>
  );
}
