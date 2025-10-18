"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

/** ------- Small UI helpers ------- */
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function parseDecimal(input: string) {
  // Allow digits + a single dot, ignore others
  const clean = input.replace(/[^0-9.]/g, "");
  // If multiple dots, keep the first
  const parts = clean.split(".");
  const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : clean;
  const n = parseFloat(normalized);
  return isNaN(n) ? NaN : n;
}

/** Small inline Info tooltip */
function InfoTip({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        aria-label={`Info: ${title}`}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="pill"
        style={{
          padding: "2px 6px",
          lineHeight: 1,
          marginLeft: 6,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 12,
        }}
      >
        i
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={title}
          className="card"
          style={{
            position: "absolute",
            zIndex: 20,
            top: "125%",
            left: 0,
            minWidth: 260,
            maxWidth: 320,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
            padding: 12,
          }}
        >
          <div className="label" style={{ marginBottom: 6 }}>{title}</div>
          <div className="muted" style={{ fontSize: 13 }}>{children}</div>
        </div>
      )}
    </span>
  );
}

/** ------- Types & Data ------- */
type Answer = { score?: number };
type TimeRow = { category: string; hours: number; ri: number };

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

const DEFAULT_TIME: TimeRow[] = [
  { category: "Sleep", hours: 49, ri: 5 },
  { category: "Work", hours: 0, ri: 5 },
  { category: "Commute", hours: 0, ri: 5 },
  { category: "Relationships", hours: 0, ri: 5 },
  { category: "Leisure", hours: 0, ri: 5 },
  { category: "Health", hours: 0, ri: 5 },
  { category: "Chores", hours: 0, ri: 5 },
  { category: "Growth", hours: 0, ri: 5 },
  { category: "Other", hours: 0, ri: 5 },
];

/** ------- Page ------- */
export default function SurveyPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: 24 }, () => ({})));
  const [timeMap, setTimeMap] = useState<TimeRow[]>(DEFAULT_TIME);

  // ELI with positive possibility (5 = neutral; <5 drag; >5 lift)
  const [ELI, setELI] = useState<number>(5);
  const [crossLift, setCrossLift] = useState<boolean>(true);
  const [riMult, setRiMult] = useState<number>(1);
  const [calMax, setCalMax] = useState<number>(8.75);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalHours = useMemo(() => timeMap.reduce((a, b) => a + (Number(b.hours) || 0), 0), [timeMap]);
  const remaining = 168 - totalHours;

  const answered = answers.filter((a) => typeof a.score === "number").length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const setScore = (i: number, v: number) => {
    const next = [...answers];
    next[i] = { score: v };
    setAnswers(next);
  };

  const setTime = (i: number, field: "hours" | "ri", v: number) => {
    const next = [...timeMap];
    next[i] = { ...next[i], [field]: v } as any;
    setTimeMap(next);
  };

  async function calculate() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        answers,
        timeMap,
        ELI,
        config: {
          calibration: { k: 1.936428228, max: calMax },
          ri: { globalMultiplier: riMult },
          crossLift: { enabled: crossLift, alpha: 20 },
          eliModel: { center: 5, min: 1, max: 10, allowPositive: true },
        },
      };
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error (${res.status})`);
      const data = await res.json();
      localStorage.setItem("LMI_RESULT", JSON.stringify(data));
      localStorage.setItem("LMI_INPUT", JSON.stringify({ answers, timeMap, ELI }));
      router.push("/results");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  const hoursText =
    remaining === 0 ? "✅ 168/168 — Ready" : remaining > 0 ? `Allocate ${remaining} more` : `Over by ${-remaining}`;

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Banner */}
      <div className="banner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoPLM size={36} wordmark />
          <div>
            <div className="badge">Life Morale Survey</div>
            <h1 style={{ margin: "6px 0 0" }}>How’s life, really?</h1>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Quick sliders. Honest answers. Big clarity.
            </p>
          </div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div className="label">Progress</div>
          <div className="progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* Rubric with InfoTips */}
      <div className="card" style={{ background: "#f5fbff" }}>
        <div className="label">Rubric</div>
        <div className="kpi" style={{ marginBottom: 8 }}>
          <div className="pill">
            <b>LMI</b> — Life Morale Index
            <InfoTip title="LMI — Life Morale Index">
              Your overall well-being snapshot. It balances how your time, habits, and mindset match what actually fulfills you.
              It’s not a judgment—just clarity you can act on.
            </InfoTip>
          </div>
          <div className="pill">
            <b>RI</b> — Residual Influence
            <InfoTip title="RI — Residual Influence">
              How much something <i>bleeds into the rest of your day</i>. If a block of time drains or energizes you beyond the moment,
              that carry-over effect is RI. E.g., “Work was rough, but the gym lifted my mood” (positive RI).
            </InfoTip>
          </div>
          <div className="pill">
            <b>ELI</b> — Emotional Load Index
            <InfoTip title="ELI — Emotional Load Index">
              Your current emotional “weather.” We use 1–10 where <b>5 = neutral</b>. Below 5 adds a drag; above 5 creates a tailwind.
              E.g., “Got a promotion—traffic can’t touch my mood” (ELI &gt; 5).
            </InfoTip>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          Sliders start blank—move each to set your score. Time map uses hours per week and RI (1–10; 5 = neutral).
        </p>
      </div>

      <div className="grid cols-2">
        {/* Questions */}
        <div className="card">
          <div className="section-title">
            <span style={{ color: "var(--blue)" }}>•</span> 24 questions (1–10)
          </div>
          <p className="muted" style={{ marginTop: 4 }}>Move each slider to give your honest score.</p>

          {QUESTIONS.map((q, i) => {
            const val = answers[i].score ?? 0;
            return (
              <div key={i} style={{ margin: "14px 0 18px", paddingBottom: 10, borderBottom: "1px dashed var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ fontWeight: 700 }}>{i + 1}. {q}</div>
                  <div className="pill">Score: {val}</div>
                </div>
                <input
                  className="slider"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={val}
                  onChange={(e) => setScore(i, Number(e.target.value))}
                />
              </div>
            );
          })}
        </div>

        {/* Time Map & Model */}
        <div className="card">
          <div className="section-title">
            <span style={{ color: "var(--teal)" }}>•</span> 168-hour time map
          </div>
          <p className="muted" style={{ marginTop: 4 }}>
            Tap to edit — numeric keypad will appear on phones.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {timeMap.map((row, i) => (
              <div key={row.category} className="row">
                <div>
                  <b>{row.category}</b>{" "}
                  {row.category !== "Sleep" && <span className="badge">awake</span>}
                </div>

                {/* HOURS - numeric keypad (integers 0..168) */}
                <div>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    placeholder="0"
                    value={row.hours === 0 ? "" : String(row.hours)}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, "");
                      const n = digits === "" ? 0 : parseInt(digits, 10);
                      const nextVal = clamp(isNaN(n) ? 0 : n, 0, 168);
                      setTime(i, "hours", nextVal);
                    }}
                  />
                  <div className="muted" style={{ fontSize: 12 }}>hrs</div>
                </div>

                {/* RI - numeric keypad (1..10, blank allowed) */}
                <div>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    placeholder="5"
                    value={row.ri === 0 ? "" : String(row.ri)}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, "");
                      let n = digits === "" ? 0 : parseInt(digits, 10);
                      if (n !== 0) n = clamp(isNaN(n) ? 5 : n, 1, 10);
                      setTime(i, "ri", n);
                    }}
                  />
                  <div className="muted" style={{ fontSize: 12 }}>RI</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              fontWeight: 700,
              color:
                remaining === 0 ? "var(--teal)" : remaining > 0 ? "var(--amber)" : "var(--rose)",
            }}
          >
            {hoursText}
          </div>

          {/* Model (ELI / Calibration / RI Multiplier) — numeric keypad too */}
          <div className="card" style={{ marginTop: 12, background: "#f5fbff" }}>
            <div className="label">Model</div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                ELI (1–10) — 5 = neutral, &lt;5 drag, &gt;5 lift
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="5"
                  value={String(ELI)}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D+/g, "");
                    const n = digits === "" ? 5 : parseInt(digits, 10);
                    setELI(clamp(isNaN(n) ? 5 : n, 1, 10));
                  }}
                />
              </label>

              <label>
                Calibration max (10 → …)
                <input
                  className="input"
                  type="text"
                  inputMode="decimal"
                  placeholder="8.75"
                  value={String(calMax)}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => {
                    const n = parseDecimal(e.target.value);
                    const safe = isNaN(n) ? 8.75 : n;
                    setCalMax(clamp(safe, 6, 10)); // keep in a sensible range
                  }}
                />
              </label>

              <label>
                RI multiplier
                <input
                  className="input"
                  type="text"
                  inputMode="decimal"
                  placeholder="1"
                  value={String(riMult)}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => {
                    const n = parseDecimal(e.target.value);
                    const safe = isNaN(n) ? 1 : n;
                    setRiMult(clamp(safe, 0.1, 3)); // guardrails
                  }}
                />
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={crossLift}
                  onChange={(e) => setCrossLift(e.target.checked)}
                />
                Cross-lift (let strong areas lift weak)
              </label>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn primary"
              onClick={calculate}
              disabled={loading || remaining !== 0}
              title={remaining !== 0 ? "Allocate all 168 hours" : ""}
            >
              {loading ? "Calculating…" : "See my Life Morale"}
            </button>
            {remaining !== 0 && (
              <button
                className="btn ghost"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top
              </button>
            )}
          </div>

          {error && (
            <div className="card" style={{ marginTop: 12, background: "#fff6f7", borderColor: "#ffd3da" }}>
              <b style={{ color: "var(--rose)" }}>Error:</b> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
