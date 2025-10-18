"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

/** Types saved by Survey/Results */
type StoredAnswer = { score: number | null };
type StoredTimeRow = { category: string; hours: number; ri: number };
type LmiInput = { answers?: StoredAnswer[]; timeMap?: StoredTimeRow[]; ELI?: number };
type LmiResult = {
  finalLMI?: number;
  rawLMS?: number;
  riAdjusted?: number;
  topDrainers?: Array<{ index: number; score: number; note?: string }>;
  topUplifters?: Array<{ index: number; score: number; note?: string }>;
};

/** Match the 24 survey questions (indexes 0..23) */
const QUESTIONS = [
  "Life direction / sense of trajectory",            // 0  - Growth/Meaning
  "Alignment with personal values",                  // 1  - Growth/Meaning
  "Sense of purpose / meaning",                      // 2  - Growth/Meaning
  "Personal growth / learning",                      // 3  - Growth/Meaning
  "Pride in overcoming challenges",                  // 4  - Growth/Meaning

  "Emotional connection to close people",            // 5  - Relationships
  "Support from family / friends",                   // 6  - Relationships
  "Romantic / intimate fulfillment",                 // 7  - Relationships

  "Contribution / helping others",                   // 8  - Community/Meaning
  "Authentic self-expression",                       // 9  - Identity/Values

  "Control over time / schedule",                    // 10 - Time & Autonomy
  "Work meaning / responsibility quality",           // 11 - Work
  "Manageable workload / routine",                   // 12 - Work
  "Freedom to choose / autonomy",                    // 13 - Time & Autonomy
  "Financial security",                              // 14 - Money

  "Physical health & energy",                        // 15 - Health
  "Rest & sleep quality",                            // 16 - Sleep
  "Nutrition & self-care",                           // 17 - Health
  "Motivation to care for body",                     // 18 - Health
  "Comfort / confidence in own skin",                // 19 - Health/Body image

  "Stress / anxiety management",                     // 20 - Emotional Regulation
  "Emotional balance / calm",                        // 21 - Emotional Regulation
  "Hopefulness about the future",                    // 22 - Mindset/Hope
  "Inner peace / contentment",                       // 23 - Mindset/Peace
];

/** Category tags for each question index (keep short, UI-friendly) */
function categoryForQuestion(idx: number): string {
  if ([0,1,2,3,4].includes(idx)) return "Growth & Meaning";
  if ([5,6,7].includes(idx))     return "Relationships";
  if ([8].includes(idx))         return "Community";
  if ([9].includes(idx))         return "Identity";
  if ([10,13].includes(idx))     return "Time & Autonomy";
  if ([11,12].includes(idx))     return "Work";
  if ([14].includes(idx))        return "Money";
  if ([16].includes(idx))        return "Sleep";
  if ([15,17,18,19].includes(idx)) return "Health";
  if ([20,21].includes(idx))     return "Stress";
  if ([22].includes(idx))        return "Hope";
  if ([23].includes(idx))        return "Peace";
  return "Other";
}

/** Low/High guidance per category */
const LOW_TIPS: Record<string, string[]> = {
  "Growth & Meaning": [
    "Schedule one 30-minute block this week for learning or a personal project.",
    "Name your next tiny milestone; keep it 7 days or less.",
  ],
  Relationships: [
    "Send one genuine check-in text or voice note today.",
    "Book a 30-minute coffee/walk with someone who fills your cup.",
  ],
  Community: [
    "Do one small act of service (hold a door, share a resource, tip a bit extra).",
  ],
  Identity: [
    "Wear or do one thing each day that feels ‘like you’ (music, outfit, journaling).",
  ],
  "Time & Autonomy": [
    "Protect a 45-minute focus block; silence notifications.",
    "Batch small tasks (email/errands) into one window to free your brain.",
  ],
  Work: [
    "Clarify today’s ‘one thing’ that would make work feel meaningful.",
    "Negotiate one small boundary (response time, meeting length).",
  ],
  Money: [
    "List your top 3 non-negotiables; cut 1 low-joy expense for 7 days.",
    "Auto-move a tiny amount to savings the day income arrives.",
  ],
  Health: [
    "Add a 10-minute walk or 10 bodyweight reps after you wake up.",
    "Drink water before coffee; protein with first meal.",
  ],
  Sleep: [
    "Aim for a consistent wind-down time; screens off 30 minutes earlier.",
    "Dark, cool, quiet: fix one of these tonight (eye mask, fan, white noise).",
  ],
  Stress: [
    "2 minutes of box breathing: 4-4-4-4 before a stressful task.",
    "Name your top worry on paper; write one controllable action.",
  ],
  Hope: [
    "Write a 3-line ‘future postcard’ to yourself for 90 days out.",
  ],
  Peace: [
    "Micro-pause: 60 seconds with phone away after meals or before commute.",
  ],
  Other: [
    "Pick one tiny lever you can move this week; keep it repeatable.",
  ],
};

const HIGH_TIPS: Record<string, string[]> = {
  "Growth & Meaning": [
    "Book your next milestone now to keep momentum.",
    "Share your learning with someone; teaching deepens meaning.",
  ],
  Relationships: [
    "Put a recurring ‘quality time’ calendar block (even 30 mins).",
    "Send a sincere appreciation note; name something specific.",
  ],
  Community: [
    "Return to the same group or cause; consistency compounds.",
  ],
  Identity: [
    "Protect a personal ritual (music, journaling) even on busy days.",
  ],
  "Time & Autonomy": [
    "Keep the focus block sacred; batch interruptions after it.",
  ],
  Work: [
    "Ask for one responsibility that aligns with your strengths.",
  ],
  Money: [
    "Automate a weekly review; celebrate one positive micro-trend.",
  ],
  Health: [
    "Lock in a minimum version (10-minute ‘even on bad days’ plan).",
  ],
  Sleep: [
    "Protect your 90-minute wind-down window on weeknights.",
  ],
  Stress: [
    "Share your process with a friend; accountability sustains calm habits.",
  ],
  Hope: [
    "Track 1 ‘evidence of progress’ per day in a notes app.",
  ],
  Peace: [
    "Create a 5-minute ‘reset ritual’ between contexts (work → home).",
  ],
  Other: [
    "Name what’s working and why; copy-paste it to another area.",
  ],
};

/** Utility: clamp and safe number parsing */
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function NextStepsPage() {
  const router = useRouter();
  const [result, setResult] = useState<LmiResult | null>(null);
  const [input, setInput] = useState<LmiInput | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawR = localStorage.getItem("LMI_RESULT");
      const rawI = localStorage.getItem("LMI_INPUT");
      if (rawR) setResult(JSON.parse(rawR));
      if (rawI) setInput(JSON.parse(rawI));
    } catch {
      // ignore
    }
  }, []);

  const answers = input?.answers || [];
  const timeMap = input?.timeMap || [];
  const ELI = typeof input?.ELI === "number" ? input?.ELI : 5;

  /** Derive low/high by category from answers */
  const byCategory = useMemo(() => {
    const acc: Record<string, { lows: number; highs: number; avg: number; count: number }> = {};
    answers.forEach((a, idx) => {
      const cat = categoryForQuestion(idx);
      if (!acc[cat]) acc[cat] = { lows: 0, highs: 0, avg: 0, count: 0 };
      const v = typeof a?.score === "number" ? a.score : null;
      if (v !== null) {
        acc[cat].count += 1;
        acc[cat].avg += v;
        if (v <= 4) acc[cat].lows += 1;
        if (v >= 8) acc[cat].highs += 1;
      }
    });
    Object.keys(acc).forEach((k) => {
      const o = acc[k];
      o.avg = o.count ? +(o.avg / o.count).toFixed(2) : 0;
    });
    return acc;
  }, [answers]);

  /** Rank focus areas (lows first) and strengths (highs first) */
  const focusAreas = useMemo(() => {
    return Object.entries(byCategory)
      .sort((a, b) => {
        const [ , A ] = a; const [ , B ] = b;
        if (A.lows !== B.lows) return B.lows - A.lows;           // more lows first
        return (A.avg || 0) - (B.avg || 0);                       // lower avg next
      })
      .slice(0, 3);
  }, [byCategory]);

  const strengths = useMemo(() => {
    return Object.entries(byCategory)
      .sort((a, b) => {
        const [ , A ] = a; const [ , B ] = b;
        if (A.highs !== B.highs) return B.highs - A.highs;        // more highs first
        return (B.avg || 0) - (A.avg || 0);                       // higher avg next
      })
      .slice(0, 3);
  }, [byCategory]);

  /** Time map helpers */
  const totalHours = timeMap.reduce((s, r) => s + (Number(r.hours) || 0), 0);
  const commute = timeMap.find(t => t.category.toLowerCase().includes("commute"));
  const work = timeMap.find(t => t.category.toLowerCase().includes("work"));
  const sleep = timeMap.find(t => t.category.toLowerCase().includes("sleep"));

  /** Quick win suggestions derived from time map */
  const quickWins: string[] = useMemo(() => {
    const wins: string[] = [];
    if (sleep && sleep.hours < 45) wins.push("Add +30 minutes to sleep on 3 nights this week.");
    if (commute && commute.hours >= 5 && commute.ri <= 4) wins.push("Upgrade your commute: favorite playlist/podcast, or leave 10 minutes earlier.");
    if (work && work.ri <= 4) wins.push("Ask for one small scope tweak at work to reduce friction.");
    if (!wins.length) wins.push("Pick one 10-minute habit and do it daily for 7 days.");
    return wins.slice(0, 3);
  }, [sleep, commute, work]);

  /** Personalized category tips */
  function tipsForCategory(name: string, type: "low" | "high"): string[] {
    const bank = type === "low" ? LOW_TIPS : HIGH_TIPS;
    return bank[name] || bank["Other"];
    }

  /** ELI tag */
  const eliTag = ELI === 5 ? "neutral" : ELI > 5 ? "tailwind" : "drag";

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Header */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg,#E9F9F3,#F0FFFA)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoPLM size={36} />
          <h1 style={{ margin: 0 }}>Next Steps for You</h1>
        </div>
        <div className="pill">
          ELI: <b style={{ marginLeft: 6 }}>{clamp(ELI,1,10)}</b>
          <span className="muted" style={{ marginLeft: 8 }}>
            {eliTag}
          </span>
        </div>
      </div>

      {/* No data state */}
      {!result && (
        <div className="card">
          <div className="label">No data yet</div>
          <p className="muted">Take the survey to get your personalized guidance.</p>
          <button className="btn primary" onClick={() => router.push("/survey")}>Go to survey →</button>
        </div>
      )}

      {/* Personalized Guidance */}
      {result && (
        <>
          {/* Focus Areas */}
          <div className="card">
            <div className="label">Focus first (your top drainers by category)</div>
            {focusAreas.length ? (
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 12 }}>
                {focusAreas.map(([name, stats]) => (
                  <div key={name} className="card" style={{ background: "#FCFFFE" }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{name}</div>
                    <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                      Avg: {stats.avg} · Low signals: {stats.lows}
                    </div>
                    <ul style={{ margin: 0 }}>
                      {tipsForCategory(name, "low").map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No clear low areas detected — nice balance.</p>
            )}
          </div>

          {/* Keep Fueling */}
          <div className="card">
            <div className="label">Keep fueling (your top uplifters by category)</div>
            {strengths.length ? (
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 12 }}>
                {strengths.map(([name, stats]) => (
                  <div key={name} className="card" style={{ background: "#F6FFFC" }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{name}</div>
                    <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                      Avg: {stats.avg} · High signals: {stats.highs}
                    </div>
                    <ul style={{ margin: 0 }}>
                      {tipsForCategory(name, "high").map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">We’ll spotlight strengths after your next run.</p>
            )}
          </div>

          {/* Quick Wins from Time Map */}
          <div className="card">
            <div className="label">Quick wins (from your 168-hour map)</div>
            <ul style={{ marginTop: 6 }}>
              {quickWins.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
            <p className="muted" style={{ marginTop: 8 }}>
              Small shifts compound. One tweak per week is enough to lift your morale curve.
            </p>
          </div>

          {/* 7-Day Plan */}
          <div className="card" style={{ background: "linear-gradient(135deg,#EAF6F2,#DCF9F2)" }}>
            <div className="label">Your 7-day plan</div>
            <ol style={{ marginTop: 6 }}>
              <li><b>Choose one focus area</b> from above and pick <i>one tiny habit</i> you can repeat daily.</li>
              <li><b>Protect one strength</b> with a small scheduled block (30–45 mins).</li>
              <li><b>Re-run the survey in 7 days</b> and compare your LMI.</li>
            </ol>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => router.push("/results")}>Back to Results</button>
              <button className="btn primary" onClick={() => router.push("/survey")}>Retake Survey →</button>
              <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
