"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";
import { buildNextSteps, Result } from "@/lib/prompts";

export default function NextStepsPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("LMI_RESULT");
      if (raw) setResult(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const data = result ? buildNextSteps(result) : null;

  return (
    <div className="main grid" style={{ gap: 18 }}>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoPLM size={40} />
          <h1 style={{ margin: 0 }}>Next Steps for You</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => router.push("/results")}>
            Back to results
          </button>
          <button className="btn ghost" onClick={() => router.push("/")}>
            Home
          </button>
        </div>
      </div>

      {!result && (
        <div className="card">
          <div className="label">No data</div>
          <p className="muted">Run the survey first so I can tailor this page to you.</p>
          <button className="btn primary" onClick={() => router.push("/survey")}>
            Start survey
          </button>
        </div>
      )}

      {result && data && (
        <>
          {/* Baseline */}
          <div className="card" style={{ background: "var(--panelTint)" }}>
            <div className="label">Your baseline</div>
            <div className="kpi" style={{ marginTop: 6 }}>
              <div className="pill">
                <b>LMI:</b> {result.finalLMI?.toFixed?.(2)}
              </div>
              <div className="pill">
                <b>RI-adj:</b> {result.riAdjusted?.toFixed?.(2)}
              </div>
              <div className="pill">
                <b>Raw LMS:</b> {result.rawLMS?.toFixed?.(2)}
              </div>
            </div>
            <p className="muted" style={{ marginTop: 6 }}>
              We’ll protect what lifts you and nudge what drains you — one small win at a time.
            </p>
          </div>

          {/* Low themes */}
          <div className="card">
            <div className="label">Lower-scoring themes</div>
            {!data.lowCards.length ? (
              <p className="muted">No strong drainers detected. Beautiful — keep momentum.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {data.lowCards.map((c) => (
                  <div key={`low-${c.key}`} className="card" style={{ background: "#fff" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <b className="label-strong">{c.title}</b>
                    </div>
                    <ul style={{ margin: "6px 0 0 18px" }}>
                      {c.actions.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* High themes */}
          <div className="card">
            <div className="label">Higher-scoring strengths</div>
            {!data.highCards.length ? (
              <p className="muted">No clear strengths stood out — that’s okay. We’ll build some.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {data.highCards.map((c) => (
                  <div key={`high-${c.key}`} className="card" style={{ background: "#fff" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <b className="label-strong">{c.title}</b>
                    </div>
                    <ul style={{ margin: "6px 0 0 18px" }}>
                      {c.actions.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className="card">
            <div className="label">Higher-self reminders</div>
            <ul style={{ margin: "8px 0 0 18px" }}>
              {data.quotes.map((q, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <i>{q}</i>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing nudge */}
          <div className="card">
            <div className="label">This week</div>
            <ul style={{ margin: "8px 0" }}>
              <li>
                Pick <b>one</b> tiny action from the low theme that resonated.
              </li>
              <li>
                Book it in your calendar. A win on the calendar becomes a win in your day.
              </li>
              <li>
                Protect <b>one</b> strength with a recurring time block.
              </li>
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <button className="btn" onClick={() => router.push("/results")}>
                Back to results
              </button>
              <button className="btn primary" onClick={() => router.push("/survey")}>
                Retake survey
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
