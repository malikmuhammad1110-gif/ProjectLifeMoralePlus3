"use client";

import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

const FLOATING_CARDS = [
  { icon: "🧠", label: "Emotional Load", value: "ELI" },
  { icon: "🌿", label: "Life Morale", value: "LMI" },
  { icon: "〰️", label: "Residual Influence", value: "RI" },
  { icon: "🛌", label: "Recovery", value: "Sleep" },
  { icon: "🧭", label: "Direction", value: "Purpose" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="main grid" style={{ gap: 28 }}>
      <section
        className="card"
        style={{
          minHeight: 620,
          position: "relative",
          overflow: "hidden",
          display: "grid",
          alignItems: "center",
          padding: "56px 28px",
          background:
            "radial-gradient(circle at 20% 10%, rgba(52,211,153,.35), transparent 28%), radial-gradient(circle at 85% 20%, rgba(14,165,233,.18), transparent 32%), linear-gradient(135deg,#fafff8,#ecfdf5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -40,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(15,118,110,.12)",
            filter: "blur(8px)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
          <LogoPLM size={58} />

          <div
            className="pill"
            style={{
              marginTop: 26,
              background: "rgba(255,255,255,.72)",
              width: "fit-content",
            }}
          >
            Calm intelligence for real life
          </div>

          <h1
            style={{
              fontSize: "clamp(46px, 8vw, 86px)",
              lineHeight: 0.95,
              margin: "22px 0 18px",
              maxWidth: 820,
            }}
          >
            Understand the systems shaping your life.
          </h1>

          <p
            className="muted"
            style={{
              fontSize: 20,
              lineHeight: 1.65,
              maxWidth: 660,
            }}
          >
            PLM+ analyzes how time, stress, purpose, recovery, emotion, and
            daily responsibilities interact to shape your overall life morale.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 28,
            }}
          >
            <button className="btn primary" onClick={() => router.push("/survey")}>
              Start Reflection →
            </button>
            <button className="btn ghost" onClick={() => router.push("/next-steps")}>
              Preview Next Steps
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 32,
            bottom: 32,
            display: "grid",
            gap: 12,
            width: 260,
            opacity: 0.95,
          }}
        >
          {FLOATING_CARDS.map((item, i) => (
            <div
              key={item.label}
              className="card"
              style={{
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transform: `translateX(${i % 2 === 0 ? 0 : -26}px)`,
                background: "rgba(255,255,255,.68)",
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 900 }}>{item.value}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid cols-2">
        <div className="card">
          <div className="label">What PLM+ measures</div>
          <h2>Your life is not one number.</h2>
          <p className="muted">
            Your morale is shaped by the way your responsibilities, relationships,
            recovery, body, money, and purpose affect each other.
          </p>
        </div>

        <div className="card">
          <div className="label">Why it feels different</div>
          <h2>It reads patterns, not perfection.</h2>
          <p className="muted">
            PLM+ is designed to show emotional carryover, hidden pressure, and
            the areas that quietly lift or drain your week.
          </p>
        </div>
      </section>

      <section
        className="card"
        style={{
          padding: "34px 24px",
          background:
            "linear-gradient(135deg, rgba(15,118,110,.96), rgba(52,211,153,.92))",
          color: "white",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
          <div className="label" style={{ color: "rgba(255,255,255,.75)" }}>
            The PLM+ Method
          </div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", marginBottom: 10 }}>
            Time × Emotion × Residual Influence
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.92 }}>
            LMI measures your Life Morale Index. RI shows how experiences linger
            after they happen. ELI captures the emotional weather of your current
            season.
          </p>
        </div>
      </section>

      <section className="card center" style={{ padding: "44px 22px" }}>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 52px)", marginTop: 0 }}>
          Get a clearer read on yourself.
        </h2>
        <p className="muted" style={{ maxWidth: 620, margin: "0 auto 22px" }}>
          Take the reflection, see your Life Morale score, then move through a
          guided next-steps deck built around your current life systems.
        </p>
        <button className="btn primary" onClick={() => router.push("/survey")}>
          Begin PLM+ →
        </button>
      </section>

      <div className="center" style={{ fontSize: 13, color: "var(--muted)" }}>
        © {new Date().getFullYear()} PLM+ — Project Life Morale
      </div>
    </main>
  );
}
